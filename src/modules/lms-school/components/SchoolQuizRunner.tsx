import React, { useState, useEffect } from 'react';
import { SchoolAssessment, QuizQuestion } from '../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { Button, Badge, Card } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface SchoolQuizRunnerProps {
  assessment: SchoolAssessment;
  onComplete?: (scorePercent: number, passed: boolean) => void;
  onClose?: () => void;
}

export const SchoolQuizRunner: React.FC<SchoolQuizRunnerProps> = ({
  assessment,
  onComplete,
  onClose,
}) => {
  const { success, error } = useToast();
  const questions = assessment.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scorePercent, setScorePercent] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    (assessment.timeLimitMinutes || 15) * 60
  );

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeftSeconds]);

  const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    const calculatedPercent = Math.round((correctCount / questions.length) * 100);
    const passed = calculatedPercent >= assessment.passingScorePercent;

    setScorePercent(calculatedPercent);
    setIsSubmitted(true);

    if (passed) {
      success('Assessment Passed! 🎓', `You scored ${calculatedPercent}% (Passing requirement: ${assessment.passingScorePercent}%).`);
    } else {
      error('Assessment Failed', `You scored ${calculatedPercent}%. You can review the explanations and try again.`);
    }

    if (onComplete) {
      onComplete(calculatedPercent, passed);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScorePercent(0);
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds((assessment.timeLimitMinutes || 15) * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPassed = scorePercent >= assessment.passingScorePercent;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Exam & Knowledge Assessment
            </span>
            <span className="text-xs text-slate-400">Passing: {assessment.passingScorePercent}%</span>
          </div>
          <h2 className="text-base font-extrabold text-white mt-1">{assessment.title}</h2>
        </div>

        {!isSubmitted && assessment.timeLimitMinutes && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className={timeLeftSeconds < 120 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}>
              {formatTime(timeLeftSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!isSubmitted ? (
        <div className="p-6 space-y-6">
          {/* Question Index Dots Navigator */}
          <div className="flex items-center gap-2 flex-wrap pb-4 border-b border-slate-100">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {questions.length} ({currentQuestion.points} pts)
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-bold shadow-xs'
                          : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation & Submit Bottom Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Question
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
              >
                Submit Exam For Grading <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Explanation View */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3 p-6 rounded-3xl bg-slate-50 border border-slate-200">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
                isPassed
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-rose-500 text-white shadow-rose-500/30'
              }`}
            >
              {isPassed ? <Award className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                {isPassed ? 'Assessment Completed Successfully!' : 'Passing Score Not Met'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You achieved a score of <strong className="text-slate-900 font-extrabold text-base">{scorePercent}%</strong> (Passing requirement: {assessment.passingScorePercent}%)
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleRetake} className="text-xs font-bold">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake Exam
              </Button>
              {onClose && (
                <Button variant="primary" size="sm" onClick={onClose} className="bg-slate-900 text-white text-xs font-bold">
                  Continue to Next Module →
                </Button>
              )}
            </div>
          </div>

          {/* Question Explanations List */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Question Review & Explanations
            </h4>

            {questions.map((q, idx) => {
              const selectedIdx = answers[q.id];
              const isCorrect = selectedIdx === q.correctAnswerIndex;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                      : 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Your answer: <span className="font-bold text-slate-800">{q.options[selectedIdx] || 'Unanswered'}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                          Correct answer: {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                      {q.explanation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-white/80 border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
