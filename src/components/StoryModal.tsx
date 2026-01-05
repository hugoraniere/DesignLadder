import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { DesignStoryWithPhases, PhaseTemplate, DEFAULT_PHASE_TEMPLATES, STORY_COLOR_PALETTE } from '../types/designStories';
import { formatDate } from '../utils/businessDays';

interface StoryModalProps {
  story: DesignStoryWithPhases | null;
  projectStartDate: string;
  onSave: (data: StoryFormData) => void;
  onClose: () => void;
}

export interface StoryFormData {
  name: string;
  color: string;
  start_date: string;
  handoff_date: string | null;
  phases: PhaseTemplate[];
}

export const StoryModal = ({ story, projectStartDate, onSave, onClose }: StoryModalProps) => {
  const [name, setName] = useState(story?.name || '');
  const [color, setColor] = useState(story?.color || STORY_COLOR_PALETTE[0]);
  const [startDate, setStartDate] = useState(story?.start_date || projectStartDate);
  const [handoffDate, setHandoffDate] = useState(story?.handoff_date || '');
  const [phases, setPhases] = useState<PhaseTemplate[]>(
    story?.phases.map(p => ({
      name: p.name,
      duration_days: p.duration_days,
      color: p.color || undefined
    })) || [...DEFAULT_PHASE_TEMPLATES]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAddPhase = () => {
    setPhases([...phases, { name: 'Nova fase', duration_days: 5 }]);
  };

  const handleRemovePhase = (index: number) => {
    if (phases.length === 1) {
      alert('Uma história deve ter pelo menos uma fase.');
      return;
    }
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index: number, field: keyof PhaseTemplate, value: any) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('O nome da história não pode estar vazio.');
      return;
    }

    if (phases.some(p => !p.name.trim() || p.duration_days < 1)) {
      alert('Todas as fases devem ter nome e duração válidos.');
      return;
    }

    onSave({
      name: name.trim(),
      color,
      start_date: startDate,
      handoff_date: handoffDate || null,
      phases
    });
  };

  const totalDays = phases.reduce((sum, p) => sum + p.duration_days, 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-3xl border-4 border-black flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold">
              {story ? 'Editar História' : 'Nova História de Design'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Nome da história *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: Redesign da Home"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Cor identificadora
                </label>
                <div className="flex gap-2">
                  {STORY_COLOR_PALETTE.map(paletteColor => (
                    <button
                      key={paletteColor}
                      onClick={() => setColor(paletteColor)}
                      className={`w-10 h-10 rounded border-2 transition-all ${
                        color === paletteColor ? 'border-black scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: paletteColor }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Data de início *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Data de handoff (opcional)
                  </label>
                  <input
                    type="date"
                    value={handoffDate}
                    onChange={(e) => setHandoffDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold">
                    Fases da história
                  </label>
                  <div className="text-xs text-gray-600">
                    Duração total: <strong>{totalDays} dias</strong>
                  </div>
                </div>

                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start p-3 border-2 border-gray-300 bg-gray-50"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={phase.name}
                          onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black mb-2"
                          placeholder="Nome da fase"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            min="1"
                            value={phase.duration_days}
                            onChange={(e) => handlePhaseChange(index, 'duration_days', parseInt(e.target.value) || 1)}
                            className="w-24 px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <span className="text-sm text-gray-600">dias</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemovePhase(index)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                        disabled={phases.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddPhase}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-400 hover:border-black hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar fase
                </button>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-600">
                <p className="text-sm text-blue-800">
                  <strong>Dica:</strong> Após criar a história, você poderá ajustar a duração das fases
                  arrastando os divisores verticais entre elas na timeline.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t-2 border-gray-200 flex gap-3 flex-shrink-0 bg-white">
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors"
            >
              {story ? 'Salvar alterações' : 'Criar história'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-black font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
