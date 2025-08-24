import React from 'react';
import { Calendar, Target, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Roadmap } from '../types';
import { MONTHS, QUARTERS } from '../utils/dateUtils';

interface SummaryViewProps {
  roadmap: Roadmap;
  year: number;
}

export function SummaryView({ roadmap, year }: SummaryViewProps) {
  const currentYearFeatures = roadmap.features.filter(f => f.year === year);
  
  // Calculate statistics
  const totalFeatures = currentYearFeatures.length;
  const featuresPerQuarter = QUARTERS.map((quarter, index) => {
    const quarterNumber = index + 1;
    return {
      quarter,
      count: currentYearFeatures.filter(f => f.quarter === quarterNumber).length
    };
  });
  
  const themeStats = roadmap.themes.map(theme => ({
    ...theme,
    featureCount: currentYearFeatures.filter(f => f.themeId === theme.id).length
  }));
  
  const unassignedCount = currentYearFeatures.filter(f => !f.themeId).length;
  
  // Calculate timeline coverage
  const monthsCovered = new Set();
  currentYearFeatures.forEach(feature => {
    for (let month = feature.startMonth; month <= feature.endMonth; month++) {
      monthsCovered.add(month);
    }
  });
  
  const coveragePercentage = Math.round((monthsCovered.size / 12) * 100);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Features</p>
              <p className="text-3xl font-bold text-gray-900">{totalFeatures}</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Themes</p>
              <p className="text-3xl font-bold text-gray-900">{roadmap.themes.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Timeline Coverage</p>
              <p className="text-3xl font-bold text-gray-900">{coveragePercentage}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planning Year</p>
              <p className="text-3xl font-bold text-gray-900">{year}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quarterly Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          {featuresPerQuarter.map(({ quarter, count }) => (
            <div key={quarter} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{quarter} Features</div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features by Theme</h3>
        <div className="space-y-4">
          {themeStats.map((theme) => (
            <div key={theme.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.color }}
                />
                <div>
                  <div className="font-medium text-gray-900">{theme.name}</div>
                  {theme.description && (
                    <div className="text-sm text-gray-600">{theme.description}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{theme.featureCount}</div>
                <div className="text-sm text-gray-600">features</div>
              </div>
            </div>
          ))}
          
          {unassignedCount > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Unassigned</div>
                  <div className="text-sm text-gray-600">Features without themes</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{unassignedCount}</div>
                <div className="text-sm text-gray-600">features</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Overview</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-1 mb-2">
            {MONTHS.map((month, index) => (
              <div key={month} className="text-center text-xs text-gray-600 font-medium">
                {month}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1 h-8">
            {MONTHS.map((month, index) => {
              const monthNumber = index + 1;
              const hasFeatures = currentYearFeatures.some(f => 
                f.startMonth <= monthNumber && f.endMonth >= monthNumber
              );
              return (
                <div
                  key={month}
                  className={`rounded ${
                    hasFeatures ? 'bg-blue-200' : 'bg-gray-100'
                  }`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded" />
              <span>Active months</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 rounded" />
              <span>Inactive months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature List</h3>
        <div className="space-y-3">
          {currentYearFeatures.length > 0 ? (
            currentYearFeatures.map((feature) => {
              const theme = roadmap.themes.find(t => t.id === feature.themeId);
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme?.color || '#6B7280' }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{feature.name}</div>
                      <div className="text-sm text-gray-600">
                        {MONTHS[feature.startMonth - 1]} - {MONTHS[feature.endMonth - 1]} {year}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {theme?.name || 'Unassigned'}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No features planned for {year}</p>
              <p className="text-sm">Add features to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}