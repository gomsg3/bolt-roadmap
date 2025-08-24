import React, { useState } from 'react';
import { Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoadmapControlsProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onExport: () => void;
}

export function RoadmapControls({ currentYear, onYearChange, onExport }: RoadmapControlsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onYearChange(currentYear - 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-800 min-w-16 text-center">
          {currentYear}
        </span>
        <button
          onClick={() => onYearChange(currentYear + 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
    </div>
  );
}