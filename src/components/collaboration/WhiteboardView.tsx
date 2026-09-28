import React, { useState } from 'react';
import { PenTool, Plus, Download, Sparkles, Move, Square, StickyNote } from 'lucide-react';
import { mockWhiteboardElements } from '../../data/collaborationData';
import { WhiteboardElement } from '../../types';

export const WhiteboardView: React.FC = () => {
  const [elements, setElements] = useState<WhiteboardElement[]>(mockWhiteboardElements);
  const [stickyText, setStickyText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fef08a');

  const colors = [
    { label: 'Yellow', hex: '#fef08a' },
    { label: 'Green', hex: '#bbf7d0' },
    { label: 'Blue', hex: '#bae6fd' },
    { label: 'Pink', hex: '#fbcfe8' },
    { label: 'Orange', hex: '#fed7aa' },
  ];

  const handleAddSticky = () => {
    if (!stickyText.trim()) return;
    const newEl: WhiteboardElement = {
      id: `wb-${Date.now()}`,
      type: 'sticky',
      x: 60 + Math.random() * 300,
      y: 80 + Math.random() * 220,
      content: stickyText,
      color: selectedColor,
      author: 'You',
    };
    setElements([...elements, newEl]);
    setStickyText('');
  };

  const handleDeleteSticky = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleClearCanvas = () => {
    setElements([]);
  };

  const handleResetCanvas = () => {
    setElements(mockWhiteboardElements);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4" />
            Live Infinite Canvas
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Collaborative Whiteboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time sticky notes, architecture mind maps, and live cursor collaboration for sprint planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Color Picker */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c.hex)}
                className={`w-6 h-6 rounded-lg transition-transform cursor-pointer border ${
                  selectedColor === c.hex ? 'scale-110 border-zinc-900 shadow-xs ring-2 ring-zinc-400' : 'border-zinc-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>

          <input
            type="text"
            value={stickyText}
            onChange={(e) => setStickyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSticky()}
            placeholder="Sticky Note Idea..."
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-44"
          />
          <button
            onClick={handleAddSticky}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
          <button
            onClick={handleResetCanvas}
            className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            title="Reset default canvas templates"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="h-[520px] bg-zinc-900 rounded-2xl border border-zinc-800 p-8 relative overflow-hidden shadow-inner">
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-800/80 backdrop-blur p-2 rounded-xl border border-zinc-700 text-xs text-zinc-300">
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span>Infinite Canvas Mode Active • {elements.length} Objects</span>
        </div>

        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 text-xs">
            <StickyNote className="w-8 h-8 mb-2 opacity-50" />
            Canvas is empty. Add a note using the input above or click Reset!
          </div>
        )}

        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute p-4 rounded-xl shadow-lg border border-zinc-700/50 w-52 text-zinc-900 font-medium text-xs hover:scale-105 transition-all group"
            style={{ backgroundColor: el.color, left: `${el.x}px`, top: `${el.y}px` }}
          >
            <div className="flex items-start justify-between gap-1">
              <p className="font-bold text-zinc-900 leading-snug flex-1">{el.content}</p>
              <button
                onClick={() => handleDeleteSticky(el.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-black font-bold text-xs p-0.5 rounded cursor-pointer transition-opacity"
                title="Delete note"
              >
                ×
              </button>
            </div>
            <span className="text-[9px] text-zinc-600 block mt-2 font-mono">— {el.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
