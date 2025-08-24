import React, { useState } from 'react';
import { Plus, Users, Building2, Edit2, Trash2, X } from 'lucide-react';
import { ProjectInfo as ProjectInfoType, TeamMember, Stakeholder } from '../types';

interface ProjectInfoProps {
  projectInfo: ProjectInfoType;
  onUpdate: (info: Partial<ProjectInfoType>) => void;
}

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'>) => void;
  member?: TeamMember;
}

interface StakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  stakeholder?: Stakeholder;
}

function TeamMemberModal({ isOpen, onClose, onSave, member }: TeamMemberModalProps) {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [email, setEmail] = useState(member?.email || '');

  React.useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setEmail(member.email || '');
    } else {
      setName('');
      setRole('');
      setEmail('');
    }
  }, [member, isOpen]);

  const handleSave = () => {
    if (name.trim() && role.trim()) {
      onSave({
        name: name.trim(),
        role: role.trim(),
        email: email.trim() || undefined
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {member ? 'Edit Team Member' : 'Add Team Member'}
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
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email (optional)"
            />
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
            disabled={!name.trim() || !role.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {member ? 'Update' : 'Add'} Member
          </button>
        </div>
      </div>
    </div>
  );
}

function StakeholderModal({ isOpen, onClose, onSave, stakeholder }: StakeholderModalProps) {
  const [name, setName] = useState(stakeholder?.name || '');
  const [role, setRole] = useState(stakeholder?.role || '');
  const [email, setEmail] = useState(stakeholder?.email || '');

  React.useEffect(() => {
    if (stakeholder) {
      setName(stakeholder.name);
      setRole(stakeholder.role);
      setEmail(stakeholder.email || '');
    } else {
      setName('');
      setRole('');
      setEmail('');
    }
  }, [stakeholder, isOpen]);

  const handleSave = () => {
    if (name.trim() && role.trim()) {
      onSave({
        name: name.trim(),
        role: role.trim(),
        email: email.trim() || undefined
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {stakeholder ? 'Edit Stakeholder' : 'Add Stakeholder'}
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
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter role"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email (optional)"
            />
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
            disabled={!name.trim() || !role.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {stakeholder ? 'Update' : 'Add'} Stakeholder
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectInfo({ projectInfo, onUpdate }: ProjectInfoProps) {
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [isStakeholderModalOpen, setIsStakeholderModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | undefined>();
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | undefined>();

  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString()
    };
    
    const updatedMembers = [...(projectInfo.teamMembers || []), newMember];
    onUpdate({ teamMembers: updatedMembers });
  };

  const handleUpdateTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    if (!editingTeamMember) return;
    
    const updatedMembers = (projectInfo.teamMembers || []).map(member =>
      member.id === editingTeamMember.id ? { ...memberData, id: member.id } : member
    );
    onUpdate({ teamMembers: updatedMembers });
    setEditingTeamMember(undefined);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updatedMembers = (projectInfo.teamMembers || []).filter(member => member.id !== id);
    onUpdate({ teamMembers: updatedMembers });
  };

  const handleAddStakeholder = (stakeholderData: Omit<Stakeholder, 'id'>) => {
    const newStakeholder: Stakeholder = {
      ...stakeholderData,
      id: Date.now().toString()
    };
    
    const updatedStakeholders = [...(projectInfo.stakeholders || []), newStakeholder];
    onUpdate({ stakeholders: updatedStakeholders });
  };

  const handleUpdateStakeholder = (stakeholderData: Omit<Stakeholder, 'id'>) => {
    if (!editingStakeholder) return;
    
    const updatedStakeholders = (projectInfo.stakeholders || []).map(stakeholder =>
      stakeholder.id === editingStakeholder.id ? { ...stakeholderData, id: stakeholder.id } : stakeholder
    );
    onUpdate({ stakeholders: updatedStakeholders });
    setEditingStakeholder(undefined);
  };

  const handleDeleteStakeholder = (id: string) => {
    const updatedStakeholders = (projectInfo.stakeholders || []).filter(stakeholder => stakeholder.id !== id);
    onUpdate({ stakeholders: updatedStakeholders });
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsTeamMemberModalOpen(true);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsStakeholderModalOpen(true);
  };

  const handleCloseTeamMemberModal = () => {
    setIsTeamMemberModalOpen(false);
    setEditingTeamMember(undefined);
  };

  const handleCloseStakeholderModal = () => {
    setIsStakeholderModalOpen(false);
    setEditingStakeholder(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Team Information</h2>
          <p className="text-gray-600">Manage your project team members and stakeholders. Add or remove people involved in this roadmap.</p>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <button
            onClick={() => setIsTeamMemberModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </button>
        </div>

        {projectInfo.teamMembers && projectInfo.teamMembers.length > 0 ? (
          <div className="space-y-3">
            {projectInfo.teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                    {member.email && (
                      <div className="text-sm text-gray-500">{member.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTeamMember(member)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeamMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No team members added yet</div>
            <button
              onClick={() => setIsTeamMemberModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first team member
            </button>
          </div>
        )}
      </div>

      {/* Stakeholders Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <Building2 className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Stakeholders</h3>
          </div>
          <button
            onClick={() => setIsStakeholderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Stakeholder
          </button>
        </div>

        {projectInfo.stakeholders && projectInfo.stakeholders.length > 0 ? (
          <div className="space-y-3">
            {projectInfo.stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stakeholder.name}</div>
                    <div className="text-sm text-gray-600">{stakeholder.role}</div>
                    {stakeholder.email && (
                      <div className="text-sm text-gray-500">{stakeholder.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStakeholder(stakeholder)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStakeholder(stakeholder.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No stakeholders added yet</div>
            <button
              onClick={() => setIsStakeholderModalOpen(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Add your first stakeholder
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <TeamMemberModal
        isOpen={isTeamMemberModalOpen}
        onClose={handleCloseTeamMemberModal}
        onSave={editingTeamMember ? handleUpdateTeamMember : handleAddTeamMember}
        member={editingTeamMember}
      />

      <StakeholderModal
        isOpen={isStakeholderModalOpen}
        onClose={handleCloseStakeholderModal}
        onSave={editingStakeholder ? handleUpdateStakeholder : handleAddStakeholder}
        stakeholder={editingStakeholder}
      />
    </div>
  );
}