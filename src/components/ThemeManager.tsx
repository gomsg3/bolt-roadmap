import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Palette } from 'lucide-react';
import { Theme } from '../types';

interface ThemeManagerProps {
  themes: Theme[];
  onAddTheme: (theme: Omit<Theme, 'id'>) => void;
  onUpdateTheme: (id: string, updates: Partial<Theme>) => void;
  onDeleteTheme: (id: string) => void;
}

const THEME_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function ThemeManager({ themes, onAddTheme, onUpdateTheme, onDeleteTheme }: ThemeManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);

  const handleCreate = () => {
    if (name.trim()) {
      onAddTheme({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor
      });
      resetForm();
    }
  };

  const handleUpdate = () => {
    if (editingTheme && name.trim()) {
      onUpdateTheme(editingTheme.id, {
        name: name.trim(),
        description: description.trim(),
        color: selectedColor
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedColor(THEME_COLORS[0]);
    setShowCreateForm(false);
    setEditingTheme(null);
  };

  const startEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setName(theme.name);
    setDescription(theme.description || '');
    setSelectedColor(theme.color);
    setShowCreateForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Themes</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          className="flex items-center gap-2 px-3 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Theme
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">
            {editingTheme ? 'Edit Theme' : 'Create New Theme'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Theme name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              rows={2}
            />
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
            <div className="flex gap-2">
              <button
                onClick={editingTheme ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
              >
                {editingTheme ? 'Update' : 'Create'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: theme.color }}
              />
              <div>
                <div className="font-medium text-gray-900">{theme.name}</div>
                {theme.description && (
                  <div className="text-sm text-gray-600">{theme.description}</div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => startEdit(theme)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteTheme(theme.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        {themes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No themes created yet</p>
            <p className="text-sm">Themes help organize and categorize your features</p>
          </div>
        )}
      </div>
    </div>
  );
}