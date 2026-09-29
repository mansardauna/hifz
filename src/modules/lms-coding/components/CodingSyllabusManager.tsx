import React, { useState } from 'react';
import { CodingTrack, CodingModule, CodingChallenge, TestCase } from '../types';
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  Code2,
  BookOpen,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  X,
  Play,
  FileCode,
} from 'lucide-react';
import { Button, Input, Modal, Badge, Card } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface CodingSyllabusManagerProps {
  tracks: CodingTrack[];
  onSaveTracks: (tracks: CodingTrack[]) => void;
  onPreviewChallenge?: (challenge: CodingChallenge) => void;
}

export const CodingSyllabusManager: React.FC<CodingSyllabusManagerProps> = ({
  tracks,
  onSaveTracks,
  onPreviewChallenge,
}) => {
  const { success, error } = useToast();
  const [trackList, setTrackList] = useState<CodingTrack[]>(tracks);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(tracks[0]?.modules[0]?.id || '');

  // Challenge Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Partial<CodingChallenge>>({});
  const [isNewChallenge, setIsNewChallenge] = useState(false);

  const activeTrack = trackList.find((t) => t.id === selectedTrackId) || trackList[0];
  const activeModule = activeTrack?.modules.find((m) => m.id === selectedModuleId) || activeTrack?.modules[0];

  const handleOpenAddChallenge = () => {
    setEditingChallenge({
      id: `chal-${Date.now()}`,
      title: 'New Coding Challenge',
      difficulty: 'beginner',
      language: 'javascript',
      order: (activeModule?.challenges.length || 0) + 1,
      instructions: `### Objective\nWrite a function that solves the problem.\n\n\`\`\`javascript\n// Example usage\n\`\`\``,
      starterCode: `function solution() {\n  // Write code here\n}`,
      solutionCode: `function solution() {\n  return true;\n}`,
      hints: ['Remember to return a value.'],
      testCases: [
        {
          id: `tc-1`,
          description: 'solution should return true',
          testCode: 'solution() === true',
        },
      ],
    });
    setIsNewChallenge(true);
    setIsModalOpen(true);
  };

  const handleOpenEditChallenge = (challenge: CodingChallenge) => {
    setEditingChallenge(JSON.parse(JSON.stringify(challenge)));
    setIsNewChallenge(false);
    setIsModalOpen(true);
  };

  const handleSaveChallenge = () => {
    if (!editingChallenge.title || !editingChallenge.starterCode) {
      error('Validation Error', 'Title and Starter Code are required.');
      return;
    }

    const updatedTracks = trackList.map((track) => {
      if (track.id !== activeTrack.id) return track;
      return {
        ...track,
        modules: track.modules.map((mod) => {
          if (mod.id !== activeModule.id) return mod;
          let updatedChallenges: CodingChallenge[];
          if (isNewChallenge) {
            updatedChallenges = [...mod.challenges, editingChallenge as CodingChallenge];
          } else {
            updatedChallenges = mod.challenges.map((c) =>
              c.id === editingChallenge.id ? (editingChallenge as CodingChallenge) : c
            );
          }
          return { ...mod, challenges: updatedChallenges };
        }),
      };
    });

    setTrackList(updatedTracks);
    onSaveTracks(updatedTracks);
    setIsModalOpen(false);
    success('Challenge Saved! 🚀', `Successfully updated "${editingChallenge.title}".`);
  };

  const handleDeleteChallenge = (challengeId: string) => {
    const updatedTracks = trackList.map((track) => {
      if (track.id !== activeTrack.id) return track;
      return {
        ...track,
        modules: track.modules.map((mod) => {
          if (mod.id !== activeModule.id) return mod;
          return {
            ...mod,
            challenges: mod.challenges.filter((c) => c.id !== challengeId),
          };
        }),
      };
    });

    setTrackList(updatedTracks);
    onSaveTracks(updatedTracks);
    success('Challenge Removed', 'Deleted coding lesson from syllabus.');
  };

  const handleAddTestCase = () => {
    const currentTests = editingChallenge.testCases || [];
    setEditingChallenge({
      ...editingChallenge,
      testCases: [
        ...currentTests,
        {
          id: `tc-${Date.now()}`,
          description: 'New assertion check',
          testCode: 'true === true',
        },
      ],
    });
  };

  const handleRemoveTestCase = (index: number) => {
    const currentTests = [...(editingChallenge.testCases || [])];
    currentTests.splice(index, 1);
    setEditingChallenge({ ...editingChallenge, testCases: currentTests });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeTrack?.icon || '💻'}</span>
            <h2 className="text-xl font-black text-slate-900">Coding Track & Syllabus Studio</h2>
          </div>
          <p className="text-xs text-slate-500">
            Design FreeCodeCamp-style coding curricula with auto-graded unit tests and interactive challenges.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAddChallenge}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Coding Challenge
        </Button>
      </div>

      {/* Track & Module Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Track</label>
          <select
            value={selectedTrackId}
            onChange={(e) => {
              setSelectedTrackId(e.target.value);
              const track = trackList.find((t) => t.id === e.target.value);
              if (track?.modules[0]) setSelectedModuleId(track.modules[0].id);
            }}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
          >
            {trackList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Module</label>
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
          >
            {activeTrack?.modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenges Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {activeModule?.challenges.length || 0} Coding Challenges in Syllabus
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeModule?.challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{challenge.title}</h4>
                    <Badge variant={challenge.difficulty === 'beginner' ? 'success' : 'warning'} size="sm">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {challenge.testCases.length} automated test assertions • Language: {challenge.language}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onPreviewChallenge && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewChallenge(challenge)}
                    className="text-xs font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Preview IDE
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditChallenge(challenge)}
                  className="text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteChallenge(challenge.id)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {(!activeModule?.challenges || activeModule.challenges.length === 0) && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <FileCode className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No coding challenges added to this module yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Challenge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNewChallenge ? 'Create New Coding Challenge' : 'Edit Coding Challenge'}
        size="lg"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto p-1 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Challenge Title</label>
              <Input
                value={editingChallenge.title || ''}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                placeholder="e.g. 1. Sum Two Numbers"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
              <select
                value={editingChallenge.difficulty || 'beginner'}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, difficulty: e.target.value as any })}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Instructions (Markdown / Theory)</label>
            <textarea
              rows={4}
              value={editingChallenge.instructions || ''}
              onChange={(e) => setEditingChallenge({ ...editingChallenge, instructions: e.target.value })}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-500"
              placeholder="Explain the objective and criteria..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Starter Code (Student Boilerplate)</label>
              <textarea
                rows={5}
                value={editingChallenge.starterCode || ''}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, starterCode: e.target.value })}
                className="w-full text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl p-3 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reference Solution Code</label>
              <textarea
                rows={5}
                value={editingChallenge.solutionCode || ''}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, solutionCode: e.target.value })}
                className="w-full text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          {/* Automated Test Suite Assertions */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated Unit Test Assertions</span>
              </label>
              <Button variant="outline" size="sm" onClick={handleAddTestCase} className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Assertion
              </Button>
            </div>

            <div className="space-y-2">
              {editingChallenge.testCases?.map((tc, index) => (
                <div key={tc.id || index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={tc.description}
                      onChange={(e) => {
                        const updated = [...(editingChallenge.testCases || [])];
                        updated[index].description = e.target.value;
                        setEditingChallenge({ ...editingChallenge, testCases: updated });
                      }}
                      placeholder="Test description e.g. sumTwoNumbers(5, 10) === 15"
                      className="text-xs"
                    />
                    <button
                      onClick={() => handleRemoveTestCase(index)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <Input
                      value={tc.testCode}
                      onChange={(e) => {
                        const updated = [...(editingChallenge.testCases || [])];
                        updated[index].testCode = e.target.value;
                        setEditingChallenge({ ...editingChallenge, testCases: updated });
                      }}
                      placeholder="JS expression e.g. sumTwoNumbers(5, 10) === 15"
                      className="text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChallenge} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              <Save className="w-4 h-4 mr-1.5" /> Save Challenge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
