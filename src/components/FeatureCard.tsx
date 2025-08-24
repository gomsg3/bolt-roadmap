import React, { useState, useRef } from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Feature, Theme } from '../types';
import { MONTHS, getMonthFromPosition } from '../utils/dateUtils';

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

interface FeatureCardProps {
  feature: Feature;
  theme?: Theme;
  onUpdate: (id: string, updates: Partial<Feature>) => void;
  onDelete: (id: string) => void;
  onEdit: (feature: Feature) => void;
  isDragging?: boolean;
  year: number;
}

export function FeatureCard({ 
  feature, 
  theme, 
  onUpdate, 
  onDelete, 
  onEdit, 
  isDragging = false,
  year 
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ startX: number; startWidth: number; startMonth: number; endMonth: number } | null>(null);

  // Only show features for the current year
  if (feature.year !== year) {
    return null;
  }

  // Calculate width and position based on months (1-12)
  const duration = feature.endMonth - feature.startMonth + 1;
  const widthPercentage = (duration / 12) * 100;
  const leftPercentage = ((feature.startMonth - 1) / 12) * 100;
  
  const themeColor = theme?.color || '#6B7280';

  const handleDragStart = (e: React.DragEvent) => {
    if (isResizing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', feature.id);
    e.dataTransfer.effectAllowed = 'move';
    const dragStartEvent = new CustomEvent('featureDragStart', { detail: feature.id });
    window.dispatchEvent(dragStartEvent);
  };

  const handleDragEnd = () => {
    if (!isResizing) {
      const dragEndEvent = new CustomEvent('featureDragEnd');
      window.dispatchEvent(dragEndEvent);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    const startX = e.clientX;
    
    resizeStartRef.current = {
      startX,
      startWidth: widthPercentage,
      startMonth: feature.startMonth,
      endMonth: feature.endMonth
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current || !cardRef.current) return;

      const container = cardRef.current.closest('.timeline-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - resizeStartRef.current.startX;
      const deltaPercentage = (deltaX / containerRect.width) * 100;
      const deltaMonths = Math.round((deltaPercentage / 100) * 12);

      let newStartMonth = resizeStartRef.current.startMonth;
      let newEndMonth = resizeStartRef.current.endMonth;

      if (direction === 'left') {
        newStartMonth = Math.max(1, resizeStartRef.current.startMonth + deltaMonths);
        newStartMonth = Math.min(newStartMonth, resizeStartRef.current.endMonth);
      } else {
        newEndMonth = Math.max(resizeStartRef.current.startMonth, resizeStartRef.current.endMonth + deltaMonths);
        newEndMonth = Math.min(12, newEndMonth);
      }

      if (newStartMonth !== feature.startMonth || newEndMonth !== feature.endMonth) {
        onUpdate(feature.id, {
          startMonth: newStartMonth,
          endMonth: newEndMonth
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={cardRef}
      className={`absolute top-0 h-16 rounded-lg shadow-md transition-all duration-300 group border border-white/30 ${
        isDragging ? 'opacity-50 scale-105 z-10' : 'z-0'
      } ${isHovered || isResizing ? 'z-20 scale-102' : ''} ${isResizing ? 'cursor-col-resize' : 'cursor-move'}`}
      style={{
        left: `${leftPercentage}%`,
        width: `${widthPercentage}%`,
        background: `linear-gradient(135deg, ${themeColor} 0%, ${adjustBrightness(themeColor, -15)} 100%)`,
        minWidth: '80px' // Minimum for usability
      }}
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/25 hover:bg-white/40 rounded-l-lg backdrop-blur-sm"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        style={{ zIndex: 10 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/60 rounded-full" />
      </div>

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/25 hover:bg-white/40 rounded-r-lg backdrop-blur-sm"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        style={{ zIndex: 10 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/60 rounded-full" />
      </div>

      <div className="h-full flex items-center justify-between px-4 text-white relative" style={{ zIndex: 5 }}>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate drop-shadow-sm">{feature.name}</div>
          <div className="text-xs opacity-85 truncate font-medium">
            {MONTHS[feature.startMonth - 1]} - {MONTHS[feature.endMonth - 1]}
          </div>
        </div>
        
        {isHovered && !isResizing && (
          <div className="flex gap-2 ml-3 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(feature);
              }}
              className="p-1.5 hover:bg-white/25 rounded-md transition-all duration-200 hover:scale-110"
            >
              <Edit2 className="h-4 w-4 drop-shadow-sm" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(feature.id);
              }}
              className="p-1.5 hover:bg-red-500/25 rounded-md transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="h-4 w-4 drop-shadow-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}