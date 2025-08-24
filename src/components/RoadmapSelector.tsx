import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Roadmap } from '../types';

interface RoadmapSelectorProps {
  roadmaps: Roadmap[];
  currentRoadmapId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: (roadmap: Omit<Roadmap, 'id'>) => void;
}

export function RoadmapSelector({ roadmaps, currentRoadmapId, onSelect, onCreateNew }: RoadmapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoadmapName, setNewRoadmapName] = useState('');
  const [newRoadmapDescription, setNewRoadmapDescription] = useState('');

  const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);

  const handleCreate = () => {
    if (newRoadmapName.trim()) {
      onCreateNew({
        name: newRoadmapName.trim(),
        description: newRoadmapDescription.trim(),
        features: [],
        themes: []
      });
      setNewRoadmapName('');
      setNewRoadmapDescription('');
      setShowCreateForm(false);
      setIsOpen(false);
    }
  };

  if (showCreateForm) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">Create New Roadmap</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Roadmap name"
            value={newRoadmapName}
            onChange={(e) => setNewRoadmapName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newRoadmapDescription}
            onChange={(e) => setNewRoadmapDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewRoadmapName('');
                setNewRoadmapDescription('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-all duration-200"
      >
        <div>
          <h2 className="font-semibold text-lg text-slate-800 mb-1">
            {currentRoadmap?.name || 'Select Roadmap'}
          </h2>
          {currentRoadmap?.description && (
            <p className="text-slate-500 text-sm">{currentRoadmap.description}</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
          <div className="p-3">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                onClick={() => {
                  onSelect(roadmap.id);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
                  roadmap.id === currentRoadmapId
                    ? 'bg-slate-50 text-slate-800'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="font-medium text-slate-800">{roadmap.name}</div>
                {roadmap.description && (
                  <div className="text-sm text-slate-500 mt-1">{roadmap.description}</div>
                )}
              </div>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-md transition-all duration-200 font-medium"
              >
                <Plus className="h-4 w-4" />
                Create New Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}