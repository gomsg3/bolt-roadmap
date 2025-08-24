import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { Feature, Theme } from '../types';
import { MONTHS, getMonthFromPosition } from '../utils/dateUtils';

interface TimelineViewProps {
  features: Feature[];
  themes: Theme[];
  year: number;
  onUpdateFeature: (id: string, updates: Partial<Feature>) => void;
  onDeleteFeature: (id: string) => void;
  onEditFeature: (feature: Feature) => void;
  onAddFeature: () => void;
  onAddTheme: () => void;
}

// Helper function to check if two features overlap in timeline
function featuresOverlap(feature1: Feature, feature2: Feature): boolean {
  return !(feature1.endMonth < feature2.startMonth || feature2.endMonth < feature1.startMonth);
}

// Helper function to organize features into non-overlapping rows
function organizeFeatureRows(features: Feature[]): Feature[][] {
  const rows: Feature[][] = [];
  
  features.forEach(feature => {
    let placed = false;
    
    // Try to place in existing rows
    for (let i = 0; i < rows.length; i++) {
      const canPlaceInRow = !rows[i].some(existingFeature => 
        featuresOverlap(feature, existingFeature)
      );
      
      if (canPlaceInRow) {
        rows[i].push(feature);
        placed = true;
        break;
      }
    }
    
    // If couldn't place in existing rows, create new row
    if (!placed) {
      rows.push([feature]);
    }
  });
  
  return rows;
}

export function TimelineView({
  features,
  themes,
  year,
  onUpdateFeature,
  onDeleteFeature,
  onEditFeature,
  onAddFeature,
  onAddTheme
}: TimelineViewProps) {
  const [draggedFeatureId, setDraggedFeatureId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetThemeId?: string) => {
    e.preventDefault();
    const featureId = e.dataTransfer.getData('text/plain');
    
    if (!featureId) return;
    
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    
    // Find the timeline container within the drop target
    const dropTarget = e.currentTarget as HTMLElement;
    const timelineContainer = dropTarget.querySelector('.timeline-container') as HTMLElement;
    
    if (timelineContainer) {
      const rect = timelineContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const containerWidth = rect.width;
      const newStartMonth = Math.max(1, Math.min(12, Math.round((x / containerWidth) * 12) + 1));
      
      const duration = feature.endMonth - feature.startMonth;
      const newEndMonth = Math.min(12, newStartMonth + duration);
      
      onUpdateFeature(featureId, {
        startMonth: newStartMonth,
        endMonth: newEndMonth,
        themeId: targetThemeId
      });
    }
    
    setDraggedFeatureId(null);
  };

  const currentYearFeatures = features.filter(f => f.year === year);

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{year} Strategic Roadmap</h3>
          <div className="flex gap-3">
            <button
              onClick={onAddTheme}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-all duration-200 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Theme
            </button>
            <button
              onClick={onAddFeature}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-all duration-200 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </button>
          </div>
        </div>

        {/* Left Sidebar with Themes and Features */}
        <div className="flex gap-8">
          {/* Integrated Tabular Timeline View */}
          <div className="w-full">
            {/* Header Row */}
            <div className="flex border-b border-gray-200">
              <div className="w-80 px-4 py-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-600">Features</div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-12 gap-0">
                  {MONTHS.map((month, index) => (
                    <div
                      key={month}
                      className="text-center text-sm font-medium text-gray-600 py-3 border-r border-gray-100 last:border-r-0"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quarter Row */}
            <div className="flex border-b border-gray-200">
              <div className="w-80 px-4 py-2 border-r border-gray-200">
                <div className="text-xs text-gray-500">{year}</div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-0">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
                    <div
                      key={quarter}
                      className="text-center py-2 border-r border-gray-100 last:border-r-0"
                    >
                      <div className="text-sm font-semibold text-gray-700">{quarter}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Rows */}
            <div className="divide-y divide-gray-100">
              {themes.map((theme) => {
                const themeFeatures = currentYearFeatures.filter(f => f.themeId === theme.id);
                const featureRows = organizeFeatureRows(themeFeatures);
                
                return (
                  <div key={theme.id}>
                    {/* Theme Header */}
                    <div className="flex bg-slate-50/50">
                      <div className="w-80 px-4 py-3 border-r border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                          <div>
                            <div className="font-medium text-gray-800">{theme.name}</div>
                            {theme.description && (
                              <div className="text-xs text-gray-500">{theme.description}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 py-3"></div>
                    </div>
                    
                    {/* Feature Rows for this theme */}
                    {featureRows.map((row, rowIndex) => (
                      <div 
                        key={rowIndex} 
                        className="flex hover:bg-slate-50/30 transition-colors duration-150"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, theme.id)}
                      >
                        <div className="w-80 px-4 py-4 border-r border-gray-100">
                          <div className="space-y-2">
                            {row.map((feature) => (
                              <div
                                key={feature.id}
                                className="cursor-pointer hover:text-slate-700 transition-colors duration-150"
                                onClick={() => onEditFeature(feature)}
                              >
                                <div className="font-medium text-sm text-gray-800">{feature.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 py-4 relative">
                          <div className="timeline-container">
                            <div className="grid grid-cols-12 h-full absolute inset-0 pointer-events-none opacity-30">
                              {MONTHS.map((month, index) => (
                                <div
                                  key={month}
                                  className="h-full border-r border-gray-200 last:border-r-0"
                                />
                              ))}
                            </div>
                            {row.map((feature) => {
                              const duration = feature.endMonth - feature.startMonth + 1;
                              const widthPercentage = (duration / 12) * 100;
                              const leftPercentage = ((feature.startMonth - 1) / 12) * 100;
                              
                              return (
                                <div
                                  key={feature.id}
                                  className="absolute top-2 h-6 rounded cursor-pointer transition-all duration-200 hover:opacity-80 group"
                                  style={{
                                    left: `${leftPercentage}%`,
                                    width: `${widthPercentage}%`,
                                    backgroundColor: theme.color,
                                    opacity: draggedFeatureId === feature.id ? 0.5 : 0.8
                                  }}
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', feature.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                    setDraggedFeatureId(feature.id);
                                  }}
                                  onDragEnd={() => {
                                    setDraggedFeatureId(null);
                                  }}
                                  onClick={() => onEditFeature(feature)}
                                  title={feature.name}
                                >
                                  <div className="px-2 py-1 text-white text-xs font-medium truncate pointer-events-none">
                                    {feature.name}
                                  </div>
                                  {/* Left resize handle */}
                                  <div
                                    className="absolute left-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 hover:bg-white/50 rounded-l"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      
                                      const container = e.currentTarget.closest('.timeline-container');
                                      if (!container) return;
                                      
                                      const startX = e.clientX;
                                      const startMonth = feature.startMonth;
                                      
                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const rect = container.getBoundingClientRect();
                                        const deltaX = moveEvent.clientX - startX;
                                        const deltaPercentage = (deltaX / rect.width) * 100;
                                        const deltaMonths = Math.round((deltaPercentage / 100) * 12);
                                        
                                        const newStartMonth = Math.max(1, Math.min(feature.endMonth, startMonth + deltaMonths));
                                        
                                        if (newStartMonth !== feature.startMonth) {
                                          onUpdateFeature(feature.id, { startMonth: newStartMonth });
                                        }
                                      };
                                      
                                      const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                      };
                                      
                                      document.addEventListener('mousemove', handleMouseMove);
                                      document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                  >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/80 rounded-full" />
                                  </div>
                                  
                                  {/* Right resize handle */}
                                  <div
                                    className="absolute right-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 hover:bg-white/50 rounded-r"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      
                                      const container = e.currentTarget.closest('.timeline-container');
                                      if (!container) return;
                                      
                                      const startX = e.clientX;
                                      const startEndMonth = feature.endMonth;
                                      
                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const rect = container.getBoundingClientRect();
                                        const deltaX = moveEvent.clientX - startX;
                                        const deltaPercentage = (deltaX / rect.width) * 100;
                                        const deltaMonths = Math.round((deltaPercentage / 100) * 12);
                                        
                                        const newEndMonth = Math.min(12, Math.max(feature.startMonth, startEndMonth + deltaMonths));
                                        
                                        if (newEndMonth !== feature.endMonth) {
                                          onUpdateFeature(feature.id, { endMonth: newEndMonth });
                                        }
                                      };
                                      
                                      const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                      };
                                      
                                      document.addEventListener('mousemove', handleMouseMove);
                                      document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                  >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/80 rounded-full" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {themeFeatures.length === 0 && (
                      <div 
                        className="flex"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, theme.id)}
                      >
                        <div className="w-80 px-4 py-4 border-r border-gray-100">
                          <div className="text-sm text-gray-400 italic">No features assigned</div>
                        </div>
                        <div className="flex-1 py-4 relative">
                          <div className="timeline-container h-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Unassigned Features */}
              {currentYearFeatures.filter(f => !f.themeId).length > 0 && (
                <div>
                  {/* Unassigned Header */}
                  <div className="flex bg-slate-50/50">
                    <div className="w-80 px-4 py-3 border-r border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <div>
                          <div className="font-medium text-gray-800">Unassigned</div>
                          <div className="text-xs text-gray-500">Features without themes</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 py-3"></div>
                  </div>
                  
                  {/* Unassigned Feature Rows */}
                  {(() => {
                    const unassignedFeatures = currentYearFeatures.filter(f => !f.themeId);
                    const unassignedRows = organizeFeatureRows(unassignedFeatures);
                    
                    return unassignedRows.map((row, rowIndex) => (
                      <div 
                        key={rowIndex} 
                        className="flex hover:bg-slate-50/30 transition-colors duration-150"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, undefined)}
                      >
                        <div className="w-80 px-4 py-4 border-r border-gray-100">
                          <div className="space-y-2">
                            {row.map((feature) => (
                              <div
                                key={feature.id}
                                className="cursor-pointer hover:text-slate-700 transition-colors duration-150"
                                onClick={() => onEditFeature(feature)}
                              >
                                <div className="font-medium text-sm text-gray-800">{feature.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 py-4 relative">
                          <div className="timeline-container">
                            <div className="grid grid-cols-12 h-full absolute inset-0 pointer-events-none opacity-30">
                              {MONTHS.map((month, index) => (
                                <div
                                  key={month}
                                  className="h-full border-r border-gray-200 last:border-r-0"
                                />
                              ))}
                            </div>
                            {row.map((feature) => {
                              const duration = feature.endMonth - feature.startMonth + 1;
                              const widthPercentage = (duration / 12) * 100;
                              const leftPercentage = ((feature.startMonth - 1) / 12) * 100;
                              
                              return (
                                <div
                                  key={feature.id}
                                  className="absolute top-2 h-6 rounded cursor-pointer transition-all duration-200 hover:opacity-80"
                                  style={{
                                    left: `${leftPercentage}%`,
                                    width: `${widthPercentage}%`,
                                    backgroundColor: '#64748b',
                                    opacity: draggedFeatureId === feature.id ? 0.5 : 0.8
                                  }}
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', feature.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                    setDraggedFeatureId(feature.id);
                                  }}
                                  onDragEnd={() => {
                                    setDraggedFeatureId(null);
                                  }}
                                  onClick={() => onEditFeature(feature)}
                                  title={feature.name}
                                >
                                  <div className="px-2 py-1 text-white text-xs font-medium truncate pointer-events-none">
                                    {feature.name}
                                  </div>
                                  {/* Left resize handle */}
                                  <div
                                    className="absolute left-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 hover:bg-white/50 rounded-l"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      
                                      const container = e.currentTarget.closest('.timeline-container');
                                      if (!container) return;
                                      
                                      const startX = e.clientX;
                                      const startMonth = feature.startMonth;
                                      
                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const rect = container.getBoundingClientRect();
                                        const deltaX = moveEvent.clientX - startX;
                                        const deltaPercentage = (deltaX / rect.width) * 100;
                                        const deltaMonths = Math.round((deltaPercentage / 100) * 12);
                                        
                                        const newStartMonth = Math.max(1, Math.min(feature.endMonth, startMonth + deltaMonths));
                                        
                                        if (newStartMonth !== feature.startMonth) {
                                          onUpdateFeature(feature.id, { startMonth: newStartMonth });
                                        }
                                      };
                                      
                                      const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                      };
                                      
                                      document.addEventListener('mousemove', handleMouseMove);
                                      document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                  >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/80 rounded-full" />
                                  </div>
                                  
                                  {/* Right resize handle */}
                                  <div
                                    className="absolute right-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 hover:bg-white/50 rounded-r"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      
                                      const container = e.currentTarget.closest('.timeline-container');
                                      if (!container) return;
                                      
                                      const startX = e.clientX;
                                      const startEndMonth = feature.endMonth;
                                      
                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const rect = container.getBoundingClientRect();
                                        const deltaX = moveEvent.clientX - startX;
                                        const deltaPercentage = (deltaX / rect.width) * 100;
                                        const deltaMonths = Math.round((deltaPercentage / 100) * 12);
                                        
                                        const newEndMonth = Math.min(12, Math.max(feature.startMonth, startEndMonth + deltaMonths));
                                        
                                        if (newEndMonth !== feature.endMonth) {
                                          onUpdateFeature(feature.id, { endMonth: newEndMonth });
                                        }
                                      };
                                      
                                      const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                      };
                                      
                                      document.addEventListener('mousemove', handleMouseMove);
                                      document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                  >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/80 rounded-full" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}