import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SprintDuration, SPRINT_DURATIONS } from '../types/designStories';

interface SettingsModalProps {
  sprintDuration: SprintDuration;
  onSprintChange: (duration: SprintDuration) => void;
  onClose: () => void;
}

export const SettingsModal = ({ sprintDuration, onSprintChange, onClose }: SettingsModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-md border-2 border-black shadow-xl">
          <div className="flex items-center justify-between p-4 border-b-2 border-black">
            <h2 className="text-lg font-bold">Configurações do Roadmap</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div>
              <label className="block text-sm font-bold mb-2">
                Duração do Sprint
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Define o agrupamento de semanas na visualização da timeline
              </p>
              <div className="space-y-2">
                {SPRINT_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onSprintChange(duration)}
                    className={`w-full px-4 py-3 text-left font-medium transition-colors border-2 ${
                      duration === sprintDuration
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-gray-300 hover:border-black'
                    }`}
                  >
                    {duration} {duration === 1 ? 'semana' : 'semanas'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
