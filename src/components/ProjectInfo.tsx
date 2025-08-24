import React, { useState } from 'react';
import { Save, Edit2 } from 'lucide-react';
import { ProjectInfo as ProjectInfoType } from '../types';

interface ProjectInfoProps {
  projectInfo: ProjectInfoType;
  onUpdate: (info: Partial<ProjectInfoType>) => void;
}

export function ProjectInfo({ projectInfo, onUpdate }: ProjectInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(projectInfo);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(projectInfo);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
             className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Project Name
            </h4>
            <p className="text-lg font-medium text-gray-900">{projectInfo.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Description
            </h4>
            <p className="text-gray-700 leading-relaxed">{projectInfo.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Team
            </h4>
            <p className="text-gray-700">{projectInfo.team}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Last Updated
            </h4>
            <p className="text-gray-700">{projectInfo.lastUpdated}</p>
          </div>
        </div>
      )}
    </div>
  );
}