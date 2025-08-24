import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Roadmap } from '../types';

interface RoadmapHeaderProps {
  roadmap: Roadmap;
  onUpdateName: (name: string) => void;
}

export function RoadmapHeader({ roadmap, onUpdateName }: RoadmapHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(roadmap.name);

  const handleSave = () => {
    if (editName.trim() && editName.trim() !== roadmap.name) {
      onUpdateName(editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(roadmap.name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      {isEditing ? (
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="text-3xl font-semibold text-slate-800 bg-transparent border-b-2 border-slate-300 focus:border-slate-600 focus:outline-none flex-1"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
          >
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 group">
          <h1 className="text-3xl font-semibold text-slate-800">
            {roadmap.name}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}