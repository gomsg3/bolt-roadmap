import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface ThemeModalProps {
  theme?: Theme;
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Omit<Theme, 'id'> | Theme) => void;
}

const THEME_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function ThemeModal({ theme, isOpen, onClose, onSave }: ThemeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);

  useEffect(() => {
    if (theme) {
      setName(theme.name);
      setDescription(theme.description || '');
      setSelectedColor(theme.color);
    } else {
      setName('');
      setDescription('');
      setSelectedColor(THEME_COLORS[0]);
    }
  }, [theme, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;

    const themeData = {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor
    };

    if (theme) {
      onSave({ ...themeData, id: theme.id });
    } else {
      onSave(themeData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {theme ? 'Edit Theme' : 'Add New Theme'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter theme name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              rows={3}
              placeholder="Brief description of the theme"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {theme ? 'Update' : 'Create'} Theme
          </button>
        </div>
      </div>
    </div>
  );
}