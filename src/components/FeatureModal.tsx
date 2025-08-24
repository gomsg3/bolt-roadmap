import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Feature, Theme } from '../types';
import { MONTHS, getQuarterFromMonth } from '../utils/dateUtils';

interface FeatureModalProps {
  feature?: Feature;
  themes: Theme[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: Omit<Feature, 'id'> | Feature) => void;
}

export function FeatureModal({ feature, themes, isOpen, onClose, onSave }: FeatureModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [year, setYear] = useState(2025);
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(1);
  const [themeId, setThemeId] = useState<string>('');

  useEffect(() => {
    if (feature) {
      setName(feature.name);
      setDescription(feature.description || '');
      setNotes(feature.notes || '');
      setYear(feature.year);
      setStartMonth(feature.startMonth);
      setEndMonth(feature.endMonth);
      setThemeId(feature.themeId || '');
    } else {
      setName('');
      setDescription('');
      setNotes('');
      setYear(2025);
      setStartMonth(1);
      setEndMonth(1);
      setThemeId('');
    }
  }, [feature, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;

    const quarter = getQuarterFromMonth(startMonth);
    
    const featureData = {
      name: name.trim(),
      description: description.trim(),
      notes: notes.trim(),
      year,
      quarter,
      startMonth,
      endMonth: Math.max(startMonth, endMonth),
      themeId: themeId || undefined
    };

    if (feature) {
      onSave({ ...featureData, id: feature.id });
    } else {
      onSave(featureData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {feature ? 'Edit Feature' : 'Add New Feature'}
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
              Feature Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter feature name"
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
              placeholder="Brief description of the feature"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              rows={3}
              placeholder="Additional notes or requirements"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">No theme</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Month
              </label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Month
              </label>
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
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
            {feature ? 'Update' : 'Create'} Feature
          </button>
        </div>
      </div>
    </div>
  );
}