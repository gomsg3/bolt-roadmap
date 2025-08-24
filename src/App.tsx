import React, { useState } from 'react';
import { Map, Users, Calendar, Plus, ChevronDown } from 'lucide-react';
import { useRoadmapData } from './hooks/useRoadmapData';
import { RoadmapSelector } from './components/RoadmapSelector';
import { TimelineView } from './components/TimelineView';
import { SummaryView } from './components/SummaryView';
import { ProjectInfo } from './components/ProjectInfo';
import { FeatureModal } from './components/FeatureModal';
import { RoadmapControls } from './components/RoadmapControls';
import { ThemeModal } from './components/ThemeModal';
import { RoadmapHeader } from './components/RoadmapHeader';
import { Feature, Theme } from './types';

type Tab = 'roadmap' | 'project' | 'summary';

function App() {
  const {
    data,
    currentRoadmap,
    updateProjectInfo,
    createRoadmap,
    setCurrentRoadmap,
    addFeature,
    updateFeature,
    deleteFeature,
    addTheme,
    updateTheme,
    deleteTheme,
    updateRoadmap
  } = useRoadmapData();

  const [activeTab, setActiveTab] = useState<Tab>('roadmap');
  const [currentYear, setCurrentYear] = useState(2025);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showCreateRoadmapForm, setShowCreateRoadmapForm] = useState(false);
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
  const [newRoadmapName, setNewRoadmapName] = useState('');
  const [newRoadmapDescription, setNewRoadmapDescription] = useState('');

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = (featureData: Omit<Feature, 'id'> | Feature) => {
    if ('id' in featureData) {
      updateFeature(featureData.id, featureData);
    } else {
      addFeature(featureData);
    }
    setEditingFeature(null);
  };

  const handleCloseFeatureModal = () => {
    setIsFeatureModalOpen(false);
    setEditingFeature(null);
  };

  const handleSaveTheme = (themeData: Omit<Theme, 'id'> | Theme) => {
    if ('id' in themeData) {
      updateTheme(themeData.id, themeData);
    } else {
      addTheme(themeData);
    }
  };

  const handleCloseThemeModal = () => {
    setIsThemeModalOpen(false);
  };

  const handleCreateRoadmap = () => {
    if (newRoadmapName.trim()) {
      createRoadmap({
        name: newRoadmapName.trim(),
        description: newRoadmapDescription.trim(),
        features: [],
        themes: []
      });
      setNewRoadmapName('');
      setNewRoadmapDescription('');
      setShowCreateRoadmapForm(false);
    }
  };

  const handleCancelCreateRoadmap = () => {
    setNewRoadmapName('');
    setNewRoadmapDescription('');
    setShowCreateRoadmapForm(false);
  };
  const handleExport = () => {
    window.print();
  };

  const tabs = [
    { id: 'roadmap' as Tab, label: 'Roadmap View', icon: Map },
    { id: 'project' as Tab, label: 'Team Info', icon: Users },
    { id: 'summary' as Tab, label: 'Summary', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-12 max-w-8xl">
        {/* App Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Roadmap Pro</h1>
          <p className="text-slate-600">Strategic product planning and feature prioritization</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          {currentRoadmap ? (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                {/* Roadmap Switcher Dropdown */}
                {data.roadmaps.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowRoadmapDropdown(!showRoadmapDropdown)}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all duration-200 min-w-64"
                    >
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-slate-800">{currentRoadmap.name}</div>
                        {currentRoadmap.description && (
                          <div className="text-sm text-slate-500 truncate">{currentRoadmap.description}</div>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showRoadmapDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showRoadmapDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-64 overflow-y-auto">
                        <div className="p-2">
                          {data.roadmaps
                            .sort((a, b) => parseInt(b.id) - parseInt(a.id)) // Sort by latest first
                            .map((roadmap) => (
                            <button
                              key={roadmap.id}
                              onClick={() => {
                                setCurrentRoadmap(roadmap.id);
                                setShowRoadmapDropdown(false);
                              }}
                              className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                                roadmap.id === currentRoadmap.id
                                  ? 'bg-slate-50 border border-slate-200'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="font-medium text-slate-800">{roadmap.name}</div>
                              {roadmap.description && (
                                <div className="text-sm text-slate-500 mt-1">{roadmap.description}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Single Roadmap Display */}
                {data.roadmaps.length === 1 && (
                  <RoadmapHeader 
                    roadmap={currentRoadmap}
                    onUpdateName={(name) => updateRoadmap(currentRoadmap.id, { name })}
                  />
                )}
              </div>
              
              <button
                onClick={() => setShowCreateRoadmapForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                New Roadmap
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Map className="h-6 w-6 text-slate-600" />
              </div>
              <h1 className="text-3xl font-semibold text-slate-800">
                Product Roadmap
              </h1>
            </div>
          )}
        </div>

        {/* Create Roadmap Form */}
        {showCreateRoadmapForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4">Create New Roadmap</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roadmap Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter roadmap name"
                  value={newRoadmapName}
                  onChange={(e) => setNewRoadmapName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the roadmap"
                  value={newRoadmapDescription}
                  onChange={(e) => setNewRoadmapDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateRoadmap}
                  disabled={!newRoadmapName.trim()}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Roadmap
                </button>
                <button
                  onClick={handleCancelCreateRoadmap}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-50 p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'roadmap' && currentRoadmap && (
          <div>
            {/* Close dropdown when clicking outside */}
            {showRoadmapDropdown && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowRoadmapDropdown(false)}
              />
            )}
            <RoadmapControls
              currentYear={currentYear}
              onYearChange={setCurrentYear}
              onExport={handleExport}
            />
            <TimelineView
              features={currentRoadmap.features}
              themes={currentRoadmap.themes}
              year={currentYear}
              onUpdateFeature={updateFeature}
              onDeleteFeature={deleteFeature}
              onEditFeature={handleEditFeature}
              onAddFeature={() => setIsFeatureModalOpen(true)}
              onAddTheme={() => setIsThemeModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'project' && (
          <ProjectInfo
            projectInfo={data.projectInfo}
            onUpdate={updateProjectInfo}
          />
        )}

        {activeTab === 'summary' && currentRoadmap && (
          <SummaryView
            roadmap={currentRoadmap}
            year={currentYear}
          />
        )}

        {!currentRoadmap && (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <Map className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <p className="text-xl font-medium mb-2">No roadmap available</p>
              <p className="text-gray-400 mb-8">Create your first roadmap to get started</p>
              <button
                onClick={() => setShowCreateRoadmapForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium mx-auto"
              >
                <Plus className="h-5 w-5" />
                Create New Roadmap
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Modal */}
      <FeatureModal
        feature={editingFeature}
        themes={currentRoadmap?.themes || []}
        isOpen={isFeatureModalOpen}
        onClose={handleCloseFeatureModal}
        onSave={handleSaveFeature}
      />

      {/* Theme Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={handleCloseThemeModal}
        onSave={handleSaveTheme}
      />
    </div>
  );
}

export default App;