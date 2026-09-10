import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pencil,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Grid,
  Sparkles,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';

export type ToolType = 'pen' | 'highlighter' | 'rect' | 'circle' | 'line' | 'arrow' | 'text' | 'eraser' | 'laser';

interface DrawAction {
  tool: ToolType;
  color: string;
  size: number;
  points: { x: number; y: number }[];
  text?: string;
  fontSize?: number;
}

interface InteractiveWhiteboardProps {
  roomName?: string;
  teacherName?: string;
  isTeacher?: boolean;
  onExport?: (dataUrl: string) => void;
  className?: string;
}

const COLOR_PALETTE = [
  '#0f172a', // Slate Black
  '#059669', // Emerald Green
  '#2563eb', // Royal Blue
  '#dc2626', // Crimson Red
  '#d97706', // Amber Gold
  '#7c3aed', // Purple
  '#ffffff', // White
];

const STROKE_SIZES = [2, 4, 8, 14];

export const getFontSizeForSize = (size: number): number => {
  if (size <= 2) return 16;
  if (size <= 4) return 22;
  if (size <= 8) return 32;
  return 48;
};

export const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({
  roomName = 'Classroom Whiteboard',
  teacherName = 'Ustadh / Instructor',
  isTeacher = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#059669');
  const [currentSize, setCurrentSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const [remoteCursors, setRemoteCursors] = useState<{ id: string; name: string; x: number; y: number; color: string }[]>([
    { id: '1', name: teacherName, x: 220, y: 180, color: '#059669' }
  ]);

  // Focus text input when opened
  useEffect(() => {
    if (textInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textInput]);

  // Redraw full canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid if active
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.75;
      const gridSize = 28;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Render Actions History
    const allActions = currentAction ? [...actions, currentAction] : actions;

    for (const act of allActions) {
      if (act.points.length === 0) continue;
      ctx.save();
      ctx.strokeStyle = act.color;
      ctx.fillStyle = act.color;
      ctx.lineWidth = act.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (act.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = act.size * 2.5;
      } else if (act.tool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = act.size * 3;
      } else {
        ctx.globalAlpha = 1.0;
      }

      if (act.tool === 'pen' || act.tool === 'highlighter' || act.tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(act.points[0].x, act.points[0].y);
        for (let i = 1; i < act.points.length; i++) {
          ctx.lineTo(act.points[i].x, act.points[i].y);
        }
        ctx.stroke();
      } else if (act.tool === 'rect' && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        ctx.beginPath();
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (act.tool === 'circle' && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (act.tool === 'line' && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (act.tool === 'arrow' && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        const headlen = 14;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (act.tool === 'text' && act.text) {
        const fontSize = act.fontSize || getFontSizeForSize(act.size);
        ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        ctx.textBaseline = 'top';
        const lines = act.text.split('\n');
        const lineHeight = fontSize * 1.3;
        lines.forEach((line, idx) => {
          ctx.fillText(line, act.points[0].x, act.points[0].y + idx * lineHeight);
        });
      }

      ctx.restore();
    }
  }, [actions, currentAction, showGrid]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = Math.max(rect.height, 480);
        redrawCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  const commitCurrentText = useCallback(() => {
    if (textInput && textInput.value.trim()) {
      const newAction: DrawAction = {
        tool: 'text',
        color: currentColor,
        size: currentSize,
        fontSize: getFontSizeForSize(currentSize),
        points: [{ x: textInput.x, y: textInput.y }],
        text: textInput.value,
      };
      setActions((prev) => [...prev, newAction]);
      setUndoneActions([]);
    }
    setTextInput(null);
  }, [textInput, currentColor, currentSize]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (currentTool === 'laser') {
      setIsLaserActive(true);
      setLaserPos(coords);
      return;
    }

    if (currentTool === 'text') {
      if (textInput) {
        commitCurrentText();
      }
      setTextInput({
        x: coords.x,
        y: coords.y,
        value: '',
      });
      return;
    }

    // If typing was open and clicked canvas with another tool, commit it
    if (textInput) {
      commitCurrentText();
    }

    setIsDrawing(true);
    setCurrentAction({
      tool: currentTool,
      color: currentColor,
      size: currentSize,
      points: [coords],
    });
    setUndoneActions([]);
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (currentTool === 'laser' && isLaserActive) {
      setLaserPos(coords);
      return;
    }

    if (!isDrawing || !currentAction) return;

    setCurrentAction((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, coords],
      };
    });
  };

  const handleEndDraw = () => {
    if (currentTool === 'laser') {
      setIsLaserActive(false);
      setLaserPos(null);
      return;
    }

    if (isDrawing && currentAction) {
      setActions((prev) => [...prev, currentAction]);
      setCurrentAction(null);
      setIsDrawing(false);
    }
  };

  const handleUndo = () => {
    if (textInput) commitCurrentText();
    if (actions.length === 0) return;
    const last = actions[actions.length - 1];
    setActions((prev) => prev.slice(0, prev.length - 1));
    setUndoneActions((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (textInput) commitCurrentText();
    if (undoneActions.length === 0) return;
    const next = undoneActions[undoneActions.length - 1];
    setUndoneActions((prev) => prev.slice(0, prev.length - 1));
    setActions((prev) => [...prev, next]);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire whiteboard canvas?')) {
      setTextInput(null);
      setActions([]);
      setUndoneActions([]);
    }
  };

  const handleExportImage = () => {
    if (textInput) commitCurrentText();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `whiteboard-${roomName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden ${className}`}>
      {/* Top Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        {/* Left: Tool Selection */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('pen'); }}
            title="Pen / Marker"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'pen' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('highlighter'); }}
            title="Highlighter"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'highlighter' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('rect'); }}
            title="Rectangle"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'rect' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('circle'); }}
            title="Circle"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'circle' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('arrow'); }}
            title="Arrow"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'arrow' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('text'); }}
            title="Text Tool (Click canvas to type)"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'text' ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('laser'); }}
            title="Laser Pointer"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'laser' ? 'bg-red-600 text-white shadow-sm animate-pulse' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-red-400" />
          </button>
          <button
            onClick={() => { if (textInput) commitCurrentText(); setCurrentTool('eraser'); }}
            title="Eraser"
            className={`p-2 rounded-lg transition-all ${
              currentTool === 'eraser' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: Color Palette & Size */}
        <div className="flex items-center gap-3">
          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-1.5 rounded-xl border border-slate-700">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  currentColor === color ? 'scale-125 ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900' : 'hover:scale-110 opacity-85'
                }`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 px-2 py-1.5 rounded-xl border border-slate-700">
            {STROKE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setCurrentSize(size)}
                className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                  currentSize === size ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title={`Size: ${size}px`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: Math.max(3, size), height: Math.max(3, size) }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions (Undo, Redo, Grid, Clear, Export) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={actions.length === 0}
            title="Undo"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={undoneActions.length === 0}
            title="Redo"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid Lines"
            className={`p-2 rounded-lg transition-all ${
              showGrid ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            title="Clear Board"
            className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportImage}
            title="Download PNG"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Stage */}
      <div className="relative w-full flex-1 bg-white cursor-crosshair overflow-hidden min-h-[440px]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDraw}
          onMouseMove={handleMoveDraw}
          onMouseUp={handleEndDraw}
          onMouseLeave={handleEndDraw}
          onTouchStart={handleStartDraw}
          onTouchMove={handleMoveDraw}
          onTouchEnd={handleEndDraw}
          className="w-full h-full block touch-none"
        />

        {/* Laser Pointer Glow Effect */}
        {isLaserActive && laserPos && (
          <div
            className="absolute pointer-events-none w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/80 shadow-[0_0_20px_6px_rgba(239,68,68,0.9)] animate-ping"
            style={{ left: laserPos.x, top: laserPos.y }}
          />
        )}

        {/* Inline Text Input Overlay */}
        {textInput && (
          <div
            className="absolute z-30 flex flex-col items-start"
            style={{
              left: Math.max(10, Math.min(textInput.x, (canvasRef.current?.width || 600) - 260)),
              top: Math.max(10, Math.min(textInput.y, (canvasRef.current?.height || 400) - 100)),
            }}
          >
            <div className="relative bg-white/95 rounded-xl border-2 border-emerald-500 shadow-2xl p-2 min-w-[240px] max-w-[400px] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
              <textarea
                ref={textInputRef}
                value={textInput.value}
                onChange={(e) => setTextInput((prev) => (prev ? { ...prev, value: e.target.value } : null))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    commitCurrentText();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setTextInput(null);
                  }
                }}
                placeholder="Type here (Enter to save, Shift+Enter for new line)..."
                rows={Math.max(2, textInput.value.split('\n').length)}
                className="w-full bg-transparent border-0 resize-none outline-none font-semibold leading-relaxed"
                style={{
                  color: currentColor,
                  fontSize: `${getFontSizeForSize(currentSize)}px`,
                }}
              />
              <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="text-[10px] text-slate-400">Press Enter to place</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTextInput(null)}
                    className="px-2 py-0.5 rounded text-slate-500 hover:bg-slate-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={commitCurrentText}
                    className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Remote Teacher/Student Cursor */}
        {remoteCursors.map((cursor) => (
          <div
            key={cursor.id}
            className="absolute pointer-events-none transition-all duration-300 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 z-20"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md animate-pulse"
              style={{ backgroundColor: cursor.color }}
            />
            <span
              className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name} (Live)
            </span>
          </div>
        ))}

        {/* Live Watermark / Classroom Header */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white flex items-center gap-2 border border-slate-700 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{roomName}</span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-300">Live Multi-User Canvas</span>
        </div>
      </div>
    </div>
  );
};
