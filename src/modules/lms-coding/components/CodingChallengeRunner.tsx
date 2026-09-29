import React, { useState, useEffect, useRef } from 'react';
import { CodingChallenge, TestResult } from '../types';
import {
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Code2,
  BookOpen,
  Award,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface CodingChallengeRunnerProps {
  challenge: CodingChallenge;
  onComplete?: (challengeId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const CodingChallengeRunner: React.FC<CodingChallengeRunnerProps> = ({
  challenge,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  const { success, error, info } = useToast();
  const [code, setCode] = useState<string>(challenge.starterCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [allPassed, setAllPassed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Sync code whenever challenge changes
  useEffect(() => {
    setCode(challenge.starterCode);
    setLogs([]);
    setTestResults([]);
    setAllPassed(false);
    setShowHintIndex(-1);
  }, [challenge]);

  // Keyboard shortcut: Ctrl + Enter to run code and test suite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runTests();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, challenge]);

  // Execute Code and evaluate Automated Unit Test Assertions
  const runTests = () => {
    setIsRunning(true);
    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args: any[]) => {
        capturedLogs.push(`[ERROR] ${args.join(' ')}`);
      },
      warn: (...args: any[]) => {
        capturedLogs.push(`[WARN] ${args.join(' ')}`);
      },
    };

    try {
      // Evaluate user code in safe sandbox scope
      const evaluateFn = new Function('console', `${code}\nreturn { ${getExportedSymbols(code)} };`);
      const exportsObj = evaluateFn(customConsole);

      const results: TestResult[] = challenge.testCases.map((tc) => {
        try {
          // Build test execution sandbox
          const testRunnerFn = new Function('console', ...Object.keys(exportsObj), `
            ${code}
            return Boolean(${tc.testCode});
          `);
          const passed = Boolean(testRunnerFn(customConsole, ...Object.values(exportsObj)));
          return {
            testId: tc.id,
            description: tc.description,
            passed,
          };
        } catch (err: any) {
          return {
            testId: tc.id,
            description: tc.description,
            passed: false,
            error: err.message || 'Assertion Error',
          };
        }
      });

      setLogs(capturedLogs);
      setTestResults(results);

      const everyTestPassed = results.length > 0 && results.every((r) => r.passed);
      setAllPassed(everyTestPassed);

      if (everyTestPassed) {
        success('Challenge Completed! 🎉', 'All unit test cases passed with flying colors!');
        if (onComplete) onComplete(challenge.id);
      } else {
        error('Tests Failed', 'Some test cases did not pass. Check the assertions panel.');
      }
    } catch (err: any) {
      capturedLogs.push(`Syntax / Runtime Error: ${err.message}`);
      setLogs(capturedLogs);
      setTestResults(
        challenge.testCases.map((tc) => ({
          testId: tc.id,
          description: tc.description,
          passed: false,
          error: err.message,
        }))
      );
      setAllPassed(false);
      error('Code Execution Error', err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(challenge.starterCode);
    setLogs([]);
    setTestResults([]);
    setAllPassed(false);
    info('Code Reset', 'Restored starter boilerplate.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to extract function names declared in user code
  const getExportedSymbols = (source: string): string => {
    const fnRegex = /function\s+([a-zA-Z0-9_$]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = fnRegex.exec(source)) !== null) {
      matches.push(`${match[1]}: typeof ${match[1]} !== 'undefined' ? ${match[1]} : undefined`);
    }
    return matches.join(', ');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">{challenge.title}</span>
              <Badge variant={challenge.difficulty === 'beginner' ? 'success' : challenge.difficulty === 'intermediate' ? 'warning' : 'error'} size="sm">
                {challenge.difficulty}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Language: {challenge.language}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasPrevious && (
            <Button variant="outline" size="sm" onClick={onPrevious} className="text-slate-300 border-slate-700 hover:bg-slate-800">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
            </Button>
          )}
          {hasNext && (
            <Button variant="outline" size="sm" onClick={onNext} className="text-slate-300 border-slate-700 hover:bg-slate-800">
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={runTests}
            disabled={isRunning}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {isRunning ? 'Running Tests...' : 'Run Tests (Ctrl+Enter)'}
          </Button>
        </div>
      </div>

      {/* 3-Pane FreeCodeCamp / W3Schools Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* Pane 1: Instructions & Problem Description (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full bg-slate-900/90 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Instructions & Objectives</span>
          </div>

          <div className="prose prose-invert prose-sm text-slate-300 text-xs leading-relaxed space-y-3 font-sans">
            <div
              className="space-y-2 whitespace-pre-wrap font-sans"
              dangerouslySetInnerHTML={{
                __html: challenge.instructions
                  .replace(/### (.*)/g, '<h3 class="text-sm font-black text-white mt-2 mb-1">$1</h3>')
                  .replace(/#### (.*)/g, '<h4 class="text-xs font-bold text-slate-200 mt-2 mb-1">$1</h4>')
                  .replace(/```javascript([\s\S]*?)```/g, '<pre class="bg-slate-950 p-3 rounded-xl text-[11px] font-mono border border-slate-800 text-emerald-300 my-2">$1</pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">$1</code>'),
              }}
            />
          </div>

          {/* Progressive Hints Accordion */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need a Hint?</span>
              </div>
              <div className="space-y-1.5">
                {challenge.hints.map((hint, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs">
                    {showHintIndex >= idx ? (
                      <p className="text-slate-300">{hint}</p>
                    ) : (
                      <button
                        onClick={() => setShowHintIndex(idx)}
                        className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Zap className="w-3 h-3" /> Unlock Hint #{idx + 1}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pane 2: Code Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-slate-950">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              solution.{challenge.language === 'javascript' ? 'js' : challenge.language}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleResetCode}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative font-mono text-xs">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-emerald-400 focus:outline-none resize-none font-mono leading-relaxed selection:bg-blue-600/40"
              placeholder="// Write your solution code here..."
            />
          </div>
        </div>

        {/* Pane 3: Test Assertions & Console Output (3 cols) */}
        <div className="lg:col-span-3 flex flex-col h-full bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {/* Test Suites List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Automated Tests</span>
              {testResults.length > 0 && (
                <span className={allPassed ? 'text-emerald-400 font-black' : 'text-amber-400'}>
                  {testResults.filter((t) => t.passed).length} / {testResults.length} Passed
                </span>
              )}
            </div>

            {testResults.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Click "Run Tests" to evaluate your solution against the test suite.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result) => (
                  <div
                    key={result.testId}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                      result.passed
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">{result.description}</p>
                      {result.error && <p className="text-[10px] text-rose-400 mt-1 font-mono">{result.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Success Next Step Banner */}
            {allPassed && hasNext && (
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white space-y-2 shadow-lg animate-fade-in">
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Great Job! Next Challenge Ready</span>
                </div>
                <Button variant="outline" size="sm" onClick={onNext} className="w-full bg-white text-emerald-800 hover:bg-slate-100 font-bold justify-center border-0 text-xs">
                  Proceed to Next Challenge →
                </Button>
              </div>
            )}
          </div>

          {/* Mini Terminal / Console Output */}
          <div className="h-36 bg-slate-950 p-3 flex flex-col overflow-hidden shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Console Output</span>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-0.5">
              {logs.length === 0 ? (
                <span className="text-slate-600 italic">No output printed yet. Use console.log() to debug.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    &gt; {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
