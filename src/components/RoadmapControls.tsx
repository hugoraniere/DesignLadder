import { ZoomIn, ZoomOut, Settings } from 'lucide-react';
import { ZoomLevel, SprintDuration, ZOOM_LEVELS, SPRINT_DURATIONS } from '../types/designStories';
import { useState } from 'react';

interface RoadmapControlsProps {
  zoomLevel: ZoomLevel;
  sprintDuration: SprintDuration;
  onZoomChange: (level: ZoomLevel) => void;
  onSprintChange: (duration: SprintDuration) => void;
}

export const RoadmapControls = ({
  zoomLevel,
  sprintDuration,
  onZoomChange,
  onSprintChange
}: RoadmapControlsProps) => {
  const [showSprintMenu, setShowSprintMenu] = useState(false);

  const currentZoomIndex = ZOOM_LEVELS.indexOf(zoomLevel);

  const handleZoomIn = () => {
    if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[currentZoomIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      onZoomChange(ZOOM_LEVELS[currentZoomIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 border-2 border-black">
        <button
          onClick={handleZoomOut}
          disabled={currentZoomIndex === 0}
          className="px-3 py-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-2">
          {ZOOM_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => onZoomChange(level)}
              className={`px-2 py-1 text-xs font-bold transition-colors ${
                level === zoomLevel
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {level}%
            </button>
          ))}
        </div>

        <button
          onClick={handleZoomIn}
          disabled={currentZoomIndex === ZOOM_LEVELS.length - 1}
          className="px-3 py-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l-2 border-black"
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowSprintMenu(!showSprintMenu)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="font-bold">Sprint: {sprintDuration} {sprintDuration === 1 ? 'semana' : 'semanas'}</span>
        </button>

        {showSprintMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowSprintMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-lg z-40">
              <div className="p-3 border-b-2 border-black">
                <h3 className="font-bold text-sm">Duração do Sprint</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Define a referência visual na timeline
                </p>
              </div>
              <div className="p-2">
                {SPRINT_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => {
                      onSprintChange(duration);
                      setShowSprintMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left font-bold transition-colors ${
                      duration === sprintDuration
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {duration} {duration === 1 ? 'semana' : 'semanas'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
