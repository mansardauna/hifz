/**
 * Sandboxed In-Browser Code Execution Utility
 *
 * Runs untrusted JavaScript code inside an isolated, origin-null iframe
 * with sandbox="allow-scripts" (strictly omitting "allow-same-origin").
 *
 * Security guarantees:
 * - Opaque "null" origin: Cannot access parent window, DOM, localStorage, sessionStorage, or cookies.
 * - Same-Origin Policy enforcement: Cannot make credentialed requests with host session.
 * - Strict timeout protection against infinite loops (while(true)).
 */

export interface SandboxExecutionResult {
  logs: string[];
  success: boolean;
  error?: string;
  testResults?: Array<{
    testId: string;
    description: string;
    passed: boolean;
    error?: string;
  }>;
}

export function runSandboxedCode(
  code: string,
  testCases: Array<{ id: string; description: string; testCode: string }> = [],
  timeoutMs: number = 3000
): Promise<SandboxExecutionResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ logs: [], success: false, error: 'Cannot run code in server environment' });
      return;
    }

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // Strictly isolate: NO allow-same-origin
    iframe.setAttribute('sandbox', 'allow-scripts');

    let isCleanedUp = false;
    let timeoutTimer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      if (timeoutTimer) clearTimeout(timeoutTimer);
      window.removeEventListener('message', handleMessage);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'SANDBOX_READY' && data.runId === runId) {
        // Send execution task once worker is ready
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: 'RUN_TASK',
              runId,
              code,
              testCases,
            },
            '*'
          );
        }
      } else if (data.type === 'SANDBOX_RESULT' && data.runId === runId) {
        cleanup();
        resolve({
          logs: data.logs || [],
          success: Boolean(data.success),
          error: data.error,
          testResults: data.testResults,
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Timeout guard against infinite loops
    timeoutTimer = setTimeout(() => {
      cleanup();
      resolve({
        logs: ['[ERROR] Execution timed out (3000ms limit exceeded). Possible infinite loop.'],
        success: false,
        error: 'Execution timed out',
      });
    }, timeoutMs);

    // Sandbox HTML containing runner
    const sandboxHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
(function() {
  var runId = "${runId}";
  var capturedLogs = [];

  var customConsole = {
    log: function() {
      var args = Array.prototype.slice.call(arguments);
      capturedLogs.push(args.map(function(a) {
        return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
      }).join(' '));
    },
    warn: function() {
      var args = Array.prototype.slice.call(arguments);
      capturedLogs.push('[WARN] ' + args.join(' '));
    },
    error: function() {
      var args = Array.prototype.slice.call(arguments);
      capturedLogs.push('[ERROR] ' + args.join(' '));
    }
  };

  function extractExportedSymbols(src) {
    var match = src.match(/function\\s+([a-zA-Z0-9_$]+)/g);
    if (!match) return '';
    return match.map(function(m) { return m.replace('function ', '').trim(); }).join(', ');
  }

  window.addEventListener('message', function(event) {
    var msg = event.data;
    if (!msg || msg.type !== 'RUN_TASK' || msg.runId !== runId) return;

    try {
      var symbols = extractExportedSymbols(msg.code);
      var wrappedCode = msg.code + (symbols ? '\\nreturn { ' + symbols + ' };' : '\\nreturn {};');
      var evalFn = new Function('console', wrappedCode);
      var exportsObj = evalFn(customConsole) || {};

      var testResults = [];
      if (Array.isArray(msg.testCases) && msg.testCases.length > 0) {
        var paramNames = ['console'].concat(Object.keys(exportsObj));
        var paramValues = [customConsole].concat(Object.values(exportsObj));

        testResults = msg.testCases.map(function(tc) {
          try {
            var runnerFn = new Function(paramNames.join(','), msg.code + '\\nreturn Boolean(' + tc.testCode + ');');
            var passed = Boolean(runnerFn.apply(null, paramValues));
            return {
              testId: tc.id,
              description: tc.description,
              passed: passed
            };
          } catch (testErr) {
            return {
              testId: tc.id,
              description: tc.description,
              passed: false,
              error: testErr.message || 'Assertion Error'
            };
          }
        });
      }

      window.parent.postMessage({
        type: 'SANDBOX_RESULT',
        runId: runId,
        logs: capturedLogs,
        success: testResults.length > 0 ? testResults.every(function(t) { return t.passed; }) : true,
        testResults: testResults
      }, '*');
    } catch (runErr) {
      window.parent.postMessage({
        type: 'SANDBOX_RESULT',
        runId: runId,
        logs: capturedLogs,
        success: false,
        error: runErr.message || 'Runtime Exception'
      }, '*');
    }
  });

  window.parent.postMessage({ type: 'SANDBOX_READY', runId: runId }, '*');
})();
</script>
</body>
</html>`;

    iframe.srcdoc = sandboxHtml;
    document.body.appendChild(iframe);
  });
}
