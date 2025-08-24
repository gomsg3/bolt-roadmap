import React, { useState } from 'react';
import { Map, Users, Calendar } from 'lucide-react';
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

  const handleExport = () => {
    window.print();
  };

  const tabs = [
    { id: 'roadmap' as Tab, label: 'Roadmap View', icon: Map },
    { id: 'project' as Tab, label: 'Project Info', icon: Users },
    { id: 'summary' as Tab, label: 'Summary', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-12 max-w-8xl">
        {/* Header */}
        <div className="mb-8">
          {currentRoadmap ? (
            <RoadmapHeader 
              roadmap={currentRoadmap}
              onUpdateName={(name) => updateRoadmap(currentRoadmap.id, { name })}
            />
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
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Map className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No roadmap selected</p>
              <p className="text-sm">Create a new roadmap to get started</p>
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