import React, { useState } from 'react';
import {
  X,
  Layers,
  ListTodo,
  Award,
  Plus,
  Trash2,
  Check,
  Save,
  RotateCcw,
  Sliders,
  MessageSquare
} from 'lucide-react';
import { Button, Badge } from '../ui';
import {
  ClassroomCustomizationConfig,
  BreakoutPodConfig,
  AgendaMilestoneConfig,
  RubricCriteriaConfig,
  ForumChannelConfig
} from '../../services/classroomCustomizationService';

interface ClassroomConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'pods' | 'agenda' | 'rubric' | 'channels';
  config: ClassroomCustomizationConfig;
  onSave: (newConfig: ClassroomCustomizationConfig) => void;
  onResetDefaults?: () => void;
}

export const ClassroomConfigModal: React.FC<ClassroomConfigModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'pods',
  config,
  onSave,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'pods' | 'agenda' | 'rubric' | 'channels'>(initialTab);
  const [formConfig, setFormConfig] = useState<ClassroomCustomizationConfig>(() => JSON.parse(JSON.stringify(config)));

  // Topic input state per pod
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});

  // New channel state
  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');

  if (!isOpen) return null;

  const handleAddTopic = (podIndex: number) => {
    const key = `pod-${podIndex}`;
    const topicText = (newTopicInputs[key] || '').trim();
    if (!topicText) return;

    setFormConfig((prev) => {
      const updatedPods = [...prev.pods];
      const pod = { ...updatedPods[podIndex] };
      pod.targetTopics = [...(pod.targetTopics || []), topicText];
      updatedPods[podIndex] = pod;
      return { ...prev, pods: updatedPods };
    });

    setNewTopicInputs((prev) => ({ ...prev, [key]: '' }));
  };

  const handleRemoveTopic = (podIndex: number, topicIndex: number) => {
    setFormConfig((prev) => {
      const updatedPods = [...prev.pods];
      const pod = { ...updatedPods[podIndex] };
      pod.targetTopics = pod.targetTopics.filter((_, i) => i !== topicIndex);
      updatedPods[podIndex] = pod;
      return { ...prev, pods: updatedPods };
    });
  };

  const handleAddMilestone = (tier: string = 'beginner') => {
    const newMs: AgendaMilestoneConfig = {
      id: `ms-${Date.now()}`,
      tier,
      title: 'New Curriculum Objective',
      targetMinutes: 20,
      done: false
    };
    setFormConfig((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMs]
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setFormConfig((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id)
    }));
  };

  const handleAddCriteria = () => {
    const newCrit: RubricCriteriaConfig = {
      id: `crit-${Date.now()}`,
      name: 'Evaluation Criterion Name',
      desc: 'Description of expected student performance and rubric standard',
      maxScore: 5
    };
    setFormConfig((prev) => ({
      ...prev,
      rubricCriteria: [...prev.rubricCriteria, newCrit]
    }));
  };

  const handleRemoveCriteria = (id: string) => {
    setFormConfig((prev) => ({
      ...prev,
      rubricCriteria: prev.rubricCriteria.filter((c) => c.id !== id)
    }));
  };

  const handleAddChannel = () => {
    const trimmed = newChanName.trim();
    if (!trimmed) return;
    const newId = trimmed.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
    const newChan: ForumChannelConfig = {
      id: newId,
      label: trimmed,
      description: newChanDesc.trim() || undefined,
      icon: 'MessageSquare'
    };
    setFormConfig((prev) => ({
      ...prev,
      forumChannels: [...(prev.forumChannels || []), newChan]
    }));
    setNewChanName('');
    setNewChanDesc('');
  };

  const handleRemoveChannel = (id: string) => {
    if (id === 'all') return;
    setFormConfig((prev) => ({
      ...prev,
      forumChannels: (prev.forumChannels || []).filter((c) => c.id !== id)
    }));
  };

  const handleSave = () => {
    onSave(formConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Classroom & Curriculum Settings</h3>
              <p className="text-xs text-slate-500">Configure pod levels, progression agenda milestones, grading rubrics, and discussion channels.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pods')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'pods'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Breakout Pods ({formConfig.pods.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'agenda'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Curriculum Agenda ({formConfig.milestones.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rubric')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'rubric'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Grading Rubric ({formConfig.rubricCriteria.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'channels'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion Channels ({formConfig.forumChannels?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: BREAKOUT PODS */}
          {activeTab === 'pods' && (
            <div className="space-y-5">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breakout Pods Header Title</label>
                  <input
                    type="text"
                    value={formConfig.breakoutPodsTitle}
                    onChange={(e) => setFormConfig({ ...formConfig, breakoutPodsTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    placeholder="e.g. Level-Based Study Pods"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pods Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={formConfig.breakoutPodsSubtitle}
                    onChange={(e) => setFormConfig({ ...formConfig, breakoutPodsSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
                    placeholder="Short description displayed to students..."
                  />
                </div>
              </div>

              {/* Individual Pod Editors */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Level Pod Tiers</h4>
                {formConfig.pods.map((pod, idx) => {
                  const key = `pod-${idx}`;
                  return (
                    <div key={pod.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="text-[10px] font-semibold capitalize font-mono">
                          Tier: {pod.tier.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-semibold">Pod #{idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pod Title / Label</label>
                          <input
                            type="text"
                            value={pod.label}
                            onChange={(e) => {
                              const updated = [...formConfig.pods];
                              updated[idx] = { ...pod, label: e.target.value };
                              setFormConfig({ ...formConfig, pods: updated });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pod Sublabel / Focus Description</label>
                          <input
                            type="text"
                            value={pod.sublabel}
                            onChange={(e) => {
                              const updated = [...formConfig.pods];
                              updated[idx] = { ...pod, sublabel: e.target.value };
                              setFormConfig({ ...formConfig, pods: updated });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      {/* Focus Topics */}
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <label className="block text-[11px] font-semibold text-slate-600">Focus Topics & Discussion Prompts</label>
                        <div className="flex flex-wrap gap-1.5">
                          {pod.targetTopics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[11px] font-medium"
                            >
                              <span>{topic}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(idx, tIdx)}
                                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newTopicInputs[key] || ''}
                            onChange={(e) => setNewTopicInputs({ ...newTopicInputs, [key]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTopic(idx);
                              }
                            }}
                            placeholder="Add focus topic bullet point..."
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddTopic(idx)}
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                            className="text-xs shrink-0"
                          >
                            Add Topic
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-5">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda Header Title</label>
                  <input
                    type="text"
                    value={formConfig.agendaTitle}
                    onChange={(e) => setFormConfig({ ...formConfig, agendaTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                    placeholder="e.g. Curriculum Milestones & Progression"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda Subtitle / Objective</label>
                  <textarea
                    rows={2}
                    value={formConfig.agendaSubtitle}
                    onChange={(e) => setFormConfig({ ...formConfig, agendaSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-amber-600"
                    placeholder="Milestones are organized by level tier..."
                  />
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Cohort Milestones ({formConfig.milestones.length})</h4>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddMilestone('beginner')}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold"
                    >
                      + Add Level 1
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddMilestone('intermediate')}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold"
                    >
                      + Add Level 2
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddMilestone('advanced')}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold"
                    >
                      + Add Level 3
                    </Button>
                  </div>
                </div>

                {formConfig.milestones.map((ms, idx) => (
                  <div key={ms.id || idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between shadow-xs">
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={ms.tier}
                        onChange={(e) => {
                          const updated = [...formConfig.milestones];
                          updated[idx] = { ...ms, tier: e.target.value };
                          setFormConfig({ ...formConfig, milestones: updated });
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none"
                      >
                        <option value="beginner">Level 1 (Beginner)</option>
                        <option value="intermediate">Level 2 (Intermediate)</option>
                        <option value="advanced">Level 3 (Advanced)</option>
                      </select>

                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ms.done}
                          onChange={(e) => {
                            const updated = [...formConfig.milestones];
                            updated[idx] = { ...ms, done: e.target.checked };
                            setFormConfig({ ...formConfig, milestones: updated });
                          }}
                          className="rounded text-amber-600 focus:ring-0"
                        />
                        <span>Completed</span>
                      </label>
                    </div>

                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => {
                          const updated = [...formConfig.milestones];
                          updated[idx] = { ...ms, title: e.target.value };
                          setFormConfig({ ...formConfig, milestones: updated });
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                        placeholder="Milestone title..."
                      />

                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          value={ms.targetMinutes || 20}
                          onChange={(e) => {
                            const updated = [...formConfig.milestones];
                            updated[idx] = { ...ms, targetMinutes: parseInt(e.target.value) || 20 };
                            setFormConfig({ ...formConfig, milestones: updated });
                          }}
                          className="w-14 px-2 py-1.5 border border-slate-200 rounded-xl text-xs text-center font-mono text-slate-800 focus:outline-none"
                          min={5}
                          max={180}
                        />
                        <span className="text-[10px] text-slate-400">mins</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(ms.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVALUATION & GRADING RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-5">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rubric Header Title</label>
                  <input
                    type="text"
                    value={formConfig.rubricTitle}
                    onChange={(e) => setFormConfig({ ...formConfig, rubricTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="e.g. Student Competency & Evaluation Rubric"
                  />
                </div>
              </div>

              {/* Rubric Criteria List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Evaluation Criteria ({formConfig.rubricCriteria.length})</h4>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCriteria}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold"
                  >
                    Add Criterion
                  </Button>
                </div>

                {formConfig.rubricCriteria.map((crit, idx) => (
                  <div key={crit.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={crit.name}
                        onChange={(e) => {
                          const updated = [...formConfig.rubricCriteria];
                          updated[idx] = { ...crit, name: e.target.value };
                          setFormConfig({ ...formConfig, rubricCriteria: updated });
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                        placeholder="Criterion Name (e.g. Practical Execution & Technique)"
                      />

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-semibold text-slate-500">Max:</span>
                        <input
                          type="number"
                          value={crit.maxScore || 5}
                          onChange={(e) => {
                            const updated = [...formConfig.rubricCriteria];
                            updated[idx] = { ...crit, maxScore: parseInt(e.target.value) || 5 };
                            setFormConfig({ ...formConfig, rubricCriteria: updated });
                          }}
                          className="w-12 px-2 py-1 border border-slate-200 rounded-xl text-xs text-center font-semibold text-emerald-800 bg-emerald-50 focus:outline-none"
                          min={1}
                          max={100}
                        />
                        <span className="text-[10px] text-slate-400">pts</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCriteria(crit.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={crit.desc}
                        onChange={(e) => {
                          const updated = [...formConfig.rubricCriteria];
                          updated[idx] = { ...crit, desc: e.target.value };
                          setFormConfig({ ...formConfig, rubricCriteria: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-emerald-600"
                        placeholder="Description of expected performance standards..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISCUSSION CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-5">
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold capitalize text-slate-500 tracking-wider">
                      Community Discussion Channels ({formConfig.forumChannels?.length || 0})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Customize, create, or remove community discussion channels for students and instructors.
                    </p>
                  </div>
                </div>

                {/* Inline Add Channel */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="New Channel Name..."
                    value={newChanName}
                    onChange={(e) => setNewChanName(e.target.value)}
                    className="w-full sm:w-56 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Channel guidance / description..."
                    value={newChanDesc}
                    onChange={(e) => setNewChanDesc(e.target.value)}
                    className="w-full flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddChannel}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold shrink-0 text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    Add Channel
                  </Button>
                </div>
              </div>

              {/* Channels List */}
              <div className="space-y-3">
                {(formConfig.forumChannels || []).map((chan, idx) => (
                  <div
                    key={chan.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-semibold text-slate-600 shrink-0">
                        #{chan.id}
                      </span>

                      <input
                        type="text"
                        value={chan.label}
                        onChange={(e) => {
                          const updated = [...(formConfig.forumChannels || [])];
                          updated[idx] = { ...chan, label: e.target.value };
                          setFormConfig({ ...formConfig, forumChannels: updated });
                        }}
                        className="w-48 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                        placeholder="Channel Label"
                      />

                      <input
                        type="text"
                        value={chan.description || ''}
                        onChange={(e) => {
                          const updated = [...(formConfig.forumChannels || [])];
                          updated[idx] = { ...chan, description: e.target.value };
                          setFormConfig({ ...formConfig, forumChannels: updated });
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-blue-600"
                        placeholder="Channel Description / Purpose"
                      />
                    </div>

                    {chan.id !== 'all' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChannel(chan.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer shrink-0 transition-colors"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            {onResetDefaults && (
              <button
                type="button"
                onClick={onResetDefaults}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
