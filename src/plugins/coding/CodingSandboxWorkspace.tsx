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
  Check
} from 'lucide-react';

interface CodingChallenge {
  id: string;
  title: string;
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
    title: 'Calculate Islamic Daily Prayer Times',
    difficulty: 'Beginner',
    description: 'Write a JavaScript function that calculates the remaining minutes until Maghrib prayer based on solar sunset angle.',
    instructions: [
      'Define a function calculateTimeToMaghrib(currentHour, currentMin, sunsetHour, sunsetMin)',
      'Return total difference in minutes',
      'Format output as string: "X hours and Y minutes remaining"'
    ],
    initialCode: `// Function to calculate time remaining until Maghrib
function calculateTimeToMaghrib(currentHour, currentMin, sunsetHour, sunsetMin) {
  const currentTotal = (currentHour * 60) + currentMin;
  const sunsetTotal = (sunsetHour * 60) + sunsetMin;
  
  const diffMinutes = sunsetTotal - currentTotal;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  return \`\${hours} hours and \${mins} minutes remaining until Maghrib\`;
}

// Test Run
const result = calculateTimeToMaghrib(16, 30, 18, 45);
console.log(result);
`,
    expectedOutput: '2 hours and 15 minutes remaining until Maghrib',
    solutionHint: 'Multiply hours by 60 and calculate the delta difference.'
  },
  {
    id: 'c-2',
    title: 'Tajweed Rule Tokenizer (Regex Engine)',
    difficulty: 'Intermediate',
    description: 'Build a tokenizer function that matches Ghunnah (نّ / مّ) and Madd letters in an Arabic text string.',
    instructions: [
      'Write a function tokenizeArabicText(text)',
      'Identify Shaddah and Tanween tokens',
      'Return an array of classified Tajweed token objects'
    ],
    initialCode: `// Arabic Tajweed Rule Tokenizer
function tokenizeTajweed(arabicString) {
  const tokens = [];
  const words = arabicString.split(' ');

  words.forEach((word) => {
    if (word.includes('ّ')) {
      tokens.push({ word, rule: 'Ghunnah / Shaddah', class: 'text-amber-500 font-bold' });
    } else if (word.includes('~')) {
      tokens.push({ word, rule: 'Madd Lazim', class: 'text-blue-500 font-bold' });
    } else {
      tokens.push({ word, rule: 'Normal', class: 'text-slate-800' });
    }
  });

  return tokens;
}

const sampleAyah = "إِنَّ مَعَ الْعُسْرِ يُسْرًا";
console.log("Tokens Classified:", JSON.stringify(tokenizeTajweed(sampleAyah), null, 2));
`,
    expectedOutput: 'Tokens Classified:',
    solutionHint: 'Use Unicode ranges for Arabic diacritics (\u0651 for Shaddah).'
  },
  {
    id: 'c-3',
    title: 'Responsive Academy Landing Grid (HTML/CSS)',
    difficulty: 'Beginner',
    description: 'Create a responsive 3-column pricing grid using modern CSS Grid and Flexbox.',
    instructions: [
      'Use display: grid with repeat(auto-fit, minmax(280px, 1fr))',
      'Add smooth hover animations and gold badge accents'
    ],
    initialCode: `<!-- Live HTML / CSS Preview Sandbox -->
<div style="font-family: sans-serif; padding: 20px; background: #064e3b; color: white; border-radius: 12px;">
  <h2 style="color: #fbbf24; margin: 0 0 10px 0;">Al-Furqan Academy Pricing</h2>
  <p style="color: #a7f3d0; font-size: 14px;">Select your Quran & Arabic tuition track.</p>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border: 1px solid #10b981;">
      <h3 style="margin: 0; font-size: 16px;">Hifz Track</h3>
      <p style="font-size: 20px; font-weight: bold; color: #fbbf24; margin: 5px 0;">$65/mo</p>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border: 1px solid #10b981;">
      <h3 style="margin: 0; font-size: 16px;">Ijazah Sanad</h3>
      <p style="font-size: 20px; font-weight: bold; color: #fbbf24; margin: 5px 0;">$120/mo</p>
    </div>
  </div>
</div>
`,
    expectedOutput: '',
    solutionHint: 'Wrap inside inline CSS grid containers.'
  }
];

export const CodingSandboxWorkspace: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(SAMPLE_CHALLENGES[0]);
  const [code, setCode] = useState<string>(SAMPLE_CHALLENGES[0].initialCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectChallenge = (ch: CodingChallenge) => {
    setSelectedChallenge(ch);
    setCode(ch.initialCode);
    setConsoleOutput([]);
    setIsSubmitted(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput([]);

    setTimeout(() => {
      try {
        const logs: string[] = [];
        // Capture console.log
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
        };

        // If code is HTML
        if (code.trim().startsWith('<')) {
          logs.push('HTML/CSS Rendered successfully in live Web Sandbox!');
        } else {
          // Execute JS safely
          const runFn = new Function(code);
          runFn();
        }

        console.log = originalLog;
        setConsoleOutput(logs.length > 0 ? logs : ['Execution finished with 0 errors.']);
      } catch (err: any) {
        setConsoleOutput([`Error: ${err.message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 300);
  };

  const handleResetCode = () => {
    setCode(selectedChallenge.initialCode);
    setConsoleOutput([]);
    setIsSubmitted(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitCode = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      alert('Homework Code submitted successfully to your Instructor for review & automated grading!');
    }, 400);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">Coding & Tech LMS Sandbox</h3>
              <span className="bg-blue-900/60 text-blue-300 border border-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {selectedChallenge.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{selectedChallenge.title}</p>
          </div>
        </div>

        {/* Challenge Switcher */}
        <div className="flex items-center gap-2">
          {SAMPLE_CHALLENGES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChallenge.id === ch.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {ch.title.split(' ')[0]} {ch.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-[480px]">
        {/* Left Col: Problem Description (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-slate-950/60 border-r border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> Challenge Prompt
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedChallenge.description}</p>

            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requirements</h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedChallenge.instructions.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-amber-300">💡 Hint:</span> {selectedChallenge.solutionHint}
          </div>
        </div>

        {/* Right Col: Interactive Code Editor + Output (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900">
          {/* Editor Action Bar */}
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>solution.js</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
              </button>
              <button
                onClick={handleSubmitCode}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Code Textarea / Monaco Simulation */}
          <div className="flex-1 p-3 bg-slate-950 font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[220px] bg-transparent text-emerald-300 focus:outline-none resize-none font-mono leading-relaxed selection:bg-blue-600 selection:text-white"
              spellCheck={false}
            />
          </div>

          {/* Terminal Output / HTML Sandbox Preview */}
          <div className="border-t border-slate-800 bg-slate-950/90 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Output & Sandbox Result</span>
            </div>

            {code.trim().startsWith('<') ? (
              <div
                className="p-3 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: code }}
              />
            ) : (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 min-h-[70px] space-y-1">
                {consoleOutput.length > 0 ? (
                  consoleOutput.map((out, idx) => (
                    <div key={idx} className="text-emerald-400">
                      &gt; {out}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 italic">Click &quot;Run Code&quot; to execute and see console output...</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
