import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Terminal,
  Send,
  Sparkles,
  FileCode,
  Layout,
  HelpCircle,
  Copy,
  Check,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CodingChallenge {
  id: string;
  title: string;
  category: 'Algorithms' | 'Frontend React' | 'Backend API' | 'TypeScript';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  initialCode: string;
  expectedOutput?: string;
  solutionHint: string;
}

const SAMPLE_CHALLENGES: CodingChallenge[] = [
  {
    id: 'c-1',
    title: 'Two Sum & Hash Map Lookup (LeetCode Classic)',
    category: 'Algorithms',
    difficulty: 'Beginner',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) linear time.',
    instructions: [
      'Implement twoSum(nums, target) using JavaScript Map',
      'Iterate through the array and store complements in the hash map',
      'Return the [index1, index2] array once found'
    ],
    initialCode: `// Two Sum - O(n) Hash Map Solution
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// Test Cases
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);

console.log("Input Array:", nums);
console.log("Target Sum:", target);
console.log("Indices Found:", result); // Expected [0, 1]
`,
    expectedOutput: 'Indices Found: [ 0, 1 ]',
    solutionHint: 'Calculate complement = target - current, check map.has(complement).'
  },
  {
    id: 'c-2',
    title: 'React 19 Debounced Search Hook & Async Filter',
    category: 'Frontend React',
    difficulty: 'Intermediate',
    description: 'Build a debounced query handler that waits 300ms after user keystrokes before triggering an asynchronous network filter request.',
    instructions: [
      'Write a function createDebounce(fn, delayMs)',
      'Manage clearTimeout and setTimeout execution tokens',
      'Return a wrapped debounced dispatch function'
    ],
    initialCode: `// Custom Debounce Utility for Live Search
function debounce(func, delayMs = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delayMs);
  };
}

// Simulated Search Dispatcher
const mockFetchResults = (query) => {
  console.log(\`[API DISPATCH] Fetching search results for: "\${query}"\`);
};

const debouncedSearch = debounce(mockFetchResults, 300);

console.log("Typing: 're'...");
debouncedSearch('re');
console.log("Typing: 'react'...");
debouncedSearch('react');
console.log("Typing: 'react 19'...");
debouncedSearch('react 19');
`,
    expectedOutput: '[API DISPATCH] Fetching search results for: "react 19"',
    solutionHint: 'Clear previous timeoutId before scheduling new setTimeout.'
  },
  {
    id: 'c-3',
    title: 'API Rate Limiter (Token Bucket Algorithm)',
    category: 'Backend API',
    difficulty: 'Advanced',
    description: 'Implement a Token Bucket Rate Limiter middleware in TypeScript/JavaScript to prevent server overload and protect public API endpoints.',
    instructions: [
      'Create a TokenBucket class with capacity and refillRatePerSecond',
      'Refill tokens based on elapsed timestamps',
      'Return true if allowed (tokens >= 1) and decrement; return 429 Too Many Requests otherwise'
    ],
    initialCode: `// Token Bucket Rate Limiter Class
class TokenBucket {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSec;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + (elapsedSeconds * this.refillRate));
    this.lastRefill = now;
  }

  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return { allowed: true, remainingTokens: Math.floor(this.tokens) };
    }
    return { allowed: false, error: '429 Too Many Requests', retryAfterSec: 1 };
  }
}

// Test Run
const limiter = new TokenBucket(5, 1);
console.log("Request 1:", limiter.consume(1));
console.log("Request 2:", limiter.consume(1));
console.log("Request 3:", limiter.consume(1));
`,
    expectedOutput: 'Request 1: { allowed: true',
    solutionHint: 'Track this.lastRefill timestamp and multiply elapsed seconds by refillRate.'
  },
  {
    id: 'c-4',
    title: 'Modern SaaS Developer Dashboard (HTML / CSS Grid)',
    category: 'Frontend React',
    difficulty: 'Beginner',
    description: 'Create a responsive 3-column developer metric card component using CSS Grid and modern dark theme palette.',
    instructions: [
      'Use display: grid with repeat(auto-fit, minmax(220px, 1fr))',
      'Add clean border outlines, neon green status badges, and hover depth'
    ],
    initialCode: `<!-- Responsive Tech Dashboard Component -->
<div style="font-family: ui-sans-serif, system-ui, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <div>
      <h2 style="font-size: 18px; font-weight: 800; margin: 0; color: #38bdf8;">Production Microservices Cluster</h2>
      <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">Region: us-east-1 • Node v20.12.0</p>
    </div>
    <span style="background: #064e3b; color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #059669;">● 100% Operational</span>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155;">
      <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">API Latency</span>
      <p style="font-size: 24px; font-weight: 800; color: #f8fafc; margin: 8px 0 0 0;">24ms <span style="font-size: 12px; color: #34d399;">↓ 12%</span></p>
    </div>
    <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155;">
      <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Test Pass Rate</span>
      <p style="font-size: 24px; font-weight: 800; color: #38bdf8; margin: 8px 0 0 0;">99.8% <span style="font-size: 12px; color: #94a3b8;">(142 tests)</span></p>
    </div>
  </div>
</div>
`,
    expectedOutput: '',
    solutionHint: 'Use CSS grid auto-fit layout with slate colors (#0f172a / #1e293b).'
  }
];

export interface CodingSandboxWorkspaceProps {
  tenantName?: string;
  onAddToast?: (toast: any) => void;
}

export const CodingSandboxWorkspace: React.FC<CodingSandboxWorkspaceProps> = () => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [code, setCode] = useState<string>(SAMPLE_CHALLENGES[0].initialCode);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ Code Sandbox Engine v4.2.0 initialized.',
    '✓ V8 JavaScript Compiler ready with ES2024 & React 19 support.',
    'Click "Run Code" or press (Ctrl+Enter) to execute your solution in the isolated worker sandbox.'
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState<boolean>(false);

  const currentChallenge = SAMPLE_CHALLENGES[activeChallengeIndex];

  const handleSelectChallenge = (index: number) => {
    setActiveChallengeIndex(index);
    setCode(SAMPLE_CHALLENGES[index].initialCode);
    setTestPassed(null);
    setTerminalLogs([
      `Switched to: ${SAMPLE_CHALLENGES[index].title}`,
      `Category: ${SAMPLE_CHALLENGES[index].category} | Difficulty: ${SAMPLE_CHALLENGES[index].difficulty}`,
      'Ready to execute code.'
    ]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalLogs((prev) => [...prev, `\n> Executing script at ${new Date().toLocaleTimeString()}...`]);

    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push(`⚠️ WARN: ${args.join(' ')}`);
      },
      error: (...args: any[]) => {
        logs.push(`❌ ERROR: ${args.join(' ')}`);
      },
    };

    setTimeout(() => {
      try {
        const runFn = new Function('console', code);
        runFn(customConsole);

        setTerminalLogs((prev) => [...prev, ...logs, '✓ Process exited with code 0.']);
        setTestPassed(true);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, ...logs, `❌ Runtime Exception: ${err.message}`]);
        setTestPassed(false);
      } finally {
        setIsRunning(false);
      }
    }, 250);
  };

  const handleResetCode = () => {
    setCode(currentChallenge.initialCode);
    setTestPassed(null);
    setTerminalLogs(['Code reset to initial state.']);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHtml = code.trim().startsWith('<') || code.includes('<!DOCTYPE') || code.includes('<div');

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[640px] bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl font-mono">
      {/* 1. Left Sidebar: Problem Sets & Instructions */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 font-sans">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-extrabold text-sm text-white">Coding Sandbox Labs</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Interactive
            </span>
          </div>

          <div className="space-y-1.5">
            {SAMPLE_CHALLENGES.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => handleSelectChallenge(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeChallengeIndex === idx
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-semibold">{ch.title}</p>
                  <span className="text-[10px] opacity-75">{ch.category}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                  ch.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-400' :
                  ch.difficulty === 'Intermediate' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                }`}>
                  {ch.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Description & Instructions */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          <div>
            <h4 className="font-bold text-sm text-white mb-1">{currentChallenge.title}</h4>
            <p className="text-slate-400 leading-relaxed">{currentChallenge.description}</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Instructions:</span>
            <ul className="space-y-1.5 text-slate-300">
              {currentChallenge.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Solution Hint</span>
            </div>
            <p className="text-[11px] text-slate-400">{currentChallenge.solutionHint}</p>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          {testPassed === true && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All Test Assertions Passed!</span>
            </div>
          )}
          {testPassed === false && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs font-bold">
              <span>Tests Failed. Check terminal stack trace.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Workspace: Code Editor & Terminal */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Editor Controls Bar */}
        <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-bold text-slate-300">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>solution.js</span>
            </div>

            {isHtml && (
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-bold">
                <button
                  onClick={() => setActiveView('editor')}
                  className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${activeView === 'editor' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${activeView === 'preview' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                >
                  Live UI Preview
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleResetCode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-50 select-none active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex flex-col relative min-h-0">
          {activeView === 'editor' ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 w-full overflow-auto selection:bg-blue-500/30"
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          ) : (
            <div className="flex-1 p-4 bg-slate-900 overflow-auto">
              <iframe
                title="Live UI Output Preview"
                srcDoc={code}
                className="w-full h-full rounded-xl border border-slate-800 bg-white"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>

        {/* Bottom Interactive Terminal */}
        <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col font-mono text-xs">
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-[11px]">Output Terminal & Test Results</span>
            </div>
            <button
              onClick={() => setTerminalLogs([])}
              className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-1 text-slate-300">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.includes('❌') ? 'text-red-400 font-bold' :
                  log.includes('✓') ? 'text-emerald-400 font-bold' :
                  log.includes('⚠️') ? 'text-amber-400' :
                  log.includes('>') ? 'text-blue-400 font-semibold' : 'text-slate-400'
                } leading-relaxed whitespace-pre-wrap`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
