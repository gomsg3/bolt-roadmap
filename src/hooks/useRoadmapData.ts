import { useState, useEffect } from 'react';
import { RoadmapData, Roadmap, Feature, Theme, ProjectInfo } from '../types';

const defaultProjectInfo: ProjectInfo = {
  name: 'Product Roadmap',
  description: 'Strategic product planning and feature prioritization',
  team: 'Product Team',
  lastUpdated: new Date().toLocaleDateString(),
  teamMembers: [],
  stakeholders: []
};

const defaultRoadmap: Roadmap = {
  id: '1',
  name: 'Q1-Q4 2025 Roadmap',
  description: 'Annual product roadmap for 2025',
  features: [
    {
      id: '1',
      name: 'User Authentication',
      description: 'Complete user login and registration system',
      year: 2025,
      quarter: 1,
      startMonth: 1,
      endMonth: 2,
      themeId: '1'
    },
    {
      id: '2',
      name: 'Dashboard Analytics',
      description: 'Real-time analytics and reporting dashboard',
      year: 2025,
      quarter: 1,
      startMonth: 3,
      endMonth: 4,
      themeId: '2'
    },
    {
      id: '3',
      name: 'Mobile App',
      description: 'iOS and Android mobile applications',
      year: 2025,
      quarter: 2,
      startMonth: 4,
      endMonth: 6,
      themeId: '1'
    },
    {
      id: '4',
      name: 'API Integration',
      description: 'Third-party API integrations',
      year: 2025,
      quarter: 1,
      startMonth: 2,
      endMonth: 4,
      themeId: '1'
    },
    {
      id: '5',
      name: 'Performance Optimization',
      description: 'System performance improvements',
      year: 2025,
      quarter: 1,
      startMonth: 1,
      endMonth: 3,
      themeId: '2'
    }
  ],
  themes: [
    {
      id: '1',
      name: 'Core Platform',
      description: 'Foundational platform features',
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Analytics & Insights',
      description: 'Data-driven features and reporting',
      color: '#10B981'
    }
  ]
};

const STORAGE_KEY = 'roadmap-data';

export function useRoadmapData() {
  const [data, setData] = useState<RoadmapData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      // If no current roadmap is set, use the latest one
      let currentRoadmapId = parsedData.currentRoadmapId;
      if (!currentRoadmapId && parsedData.roadmaps.length > 0) {
        // Find the roadmap with the highest ID (latest created)
        const latestRoadmap = parsedData.roadmaps.reduce((latest: Roadmap, current: Roadmap) => 
          parseInt(current.id) > parseInt(latest.id) ? current : latest
        );
        currentRoadmapId = latestRoadmap.id;
      }
      return {
        ...parsedData,
        projectInfo: parsedData.projectInfo || defaultProjectInfo,
        currentRoadmapId
      };
    }
    return {
      roadmaps: [defaultRoadmap],
      currentRoadmapId: '1',
      projectInfo: defaultProjectInfo
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const currentRoadmap = data.roadmaps.find(r => r.id === data.currentRoadmapId);

  const updateProjectInfo = (info: Partial<ProjectInfo>) => {
    setData(prev => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, ...info, lastUpdated: new Date().toLocaleDateString() }
    }));
  };

  const createRoadmap = (roadmap: Omit<Roadmap, 'id'>) => {
    const newRoadmap = { ...roadmap, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      roadmaps: [...prev.roadmaps, newRoadmap],
      currentRoadmapId: newRoadmap.id
    }));
    return newRoadmap;
  };

  const updateRoadmap = (id: string, updates: Partial<Roadmap>) => {
    setData(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const deleteRoadmap = (id: string) => {
    setData(prev => {
      const newRoadmaps = prev.roadmaps.filter(r => r.id !== id);
      return {
        ...prev,
        roadmaps: newRoadmaps,
        currentRoadmapId: newRoadmaps.length > 0 ? newRoadmaps[0].id : null
      };
    });
  };

  const setCurrentRoadmap = (id: string) => {
    setData(prev => ({ ...prev, currentRoadmapId: id }));
  };

  const addFeature = (feature: Omit<Feature, 'id'>) => {
    if (!currentRoadmap) return;
    
    const newFeature = { ...feature, id: Date.now().toString() };
    updateRoadmap(currentRoadmap.id, {
      features: [...currentRoadmap.features, newFeature]
    });
  };

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    if (!currentRoadmap) return;
    
    updateRoadmap(currentRoadmap.id, {
      features: currentRoadmap.features.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const deleteFeature = (id: string) => {
    if (!currentRoadmap) return;
    
    updateRoadmap(currentRoadmap.id, {
      features: currentRoadmap.features.filter(f => f.id !== id)
    });
  };

  const addTheme = (theme: Omit<Theme, 'id'>) => {
    if (!currentRoadmap) return;
    
    const newTheme = { ...theme, id: Date.now().toString() };
    updateRoadmap(currentRoadmap.id, {
      themes: [...currentRoadmap.themes, newTheme]
    });
    return newTheme;
  };

  const updateTheme = (id: string, updates: Partial<Theme>) => {
    if (!currentRoadmap) return;
    
    updateRoadmap(currentRoadmap.id, {
      themes: currentRoadmap.themes.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  };

  const deleteTheme = (id: string) => {
    if (!currentRoadmap) return;
    
    // Remove theme from features first
    const updatedFeatures = currentRoadmap.features.map(f => 
      f.themeId === id ? { ...f, themeId: undefined } : f
    );
    
    updateRoadmap(currentRoadmap.id, {
      themes: currentRoadmap.themes.filter(t => t.id !== id),
      features: updatedFeatures
    });
  };

  return {
    data,
    currentRoadmap,
    updateProjectInfo,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    setCurrentRoadmap,
    addFeature,
    updateFeature,
    deleteFeature,
    addTheme,
    updateTheme,
    deleteTheme
  };
}