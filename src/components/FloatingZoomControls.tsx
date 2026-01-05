import { ZoomIn, ZoomOut } from 'lucide-react';
import { ZoomLevel, ZOOM_LEVELS } from '../types/designStories';

interface FloatingZoomControlsProps {
  zoomLevel: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

export const FloatingZoomControls = ({ zoomLevel, onZoomChange }: FloatingZoomControlsProps) => {
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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border-2 border-black shadow-lg">
      <button
        onClick={handleZoomOut}
        disabled={currentZoomIndex === 0}
        className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Diminuir zoom"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 px-2 border-x-2 border-gray-200">
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onZoomChange(level)}
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              level === zoomLevel
                ? 'bg-black text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {level}%
          </button>
        ))}
      </div>

      <button
        onClick={handleZoomIn}
        disabled={currentZoomIndex === ZOOM_LEVELS.length - 1}
        className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Aumentar zoom"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
};
