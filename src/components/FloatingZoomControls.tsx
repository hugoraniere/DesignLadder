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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-0 bg-white border-2 border-black shadow-lg">
      <button
        onClick={handleZoomOut}
        disabled={currentZoomIndex === 0}
        className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r border-gray-300"
        title="Diminuir zoom"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="px-4 py-2 min-w-[80px] text-center">
        <span className="text-sm font-medium">{zoomLevel}%</span>
      </div>

      <button
        onClick={handleZoomIn}
        disabled={currentZoomIndex === ZOOM_LEVELS.length - 1}
        className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-gray-300"
        title="Aumentar zoom"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
};
