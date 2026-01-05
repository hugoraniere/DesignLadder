import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StoryTask, DesignStoryWithPhases } from '../types/designStories';
import { formatDate, parseDate, adjustToBusinessDay } from '../utils/businessDays';

interface StoryTaskModalProps {
  task: StoryTask | null;
  stories: DesignStoryWithPhases[];
  defaultStoryId?: string;
  defaultPhaseId?: string;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onSave: (taskData: Partial<StoryTask>, storyId: string) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

export const StoryTaskModal = ({
  task,
  stories,
  defaultStoryId,
  defaultPhaseId,
  defaultStartDate,
  defaultEndDate,
  onSave,
  onDelete,
  onClose,
}: StoryTaskModalProps) => {
  const [name, setName] = useState('');
  const [storyId, setStoryId] = useState('');
  const [phaseId, setPhaseId] = useState('');
  const [type, setType] = useState<'activity' | 'meeting'>('activity');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed'>('planned');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setPhaseId(task.phase_id);
      setType(task.type);
      setStartDate(task.start_date);
      setEndDate(task.end_date);
      setStatus(task.status);
      setNotes(task.notes || '');

      const story = stories.find(s => s.phases.some(p => p.id === task.phase_id));
      if (story) {
        setStoryId(story.id);
      }
    } else {
      setStoryId(defaultStoryId || (stories[0]?.id ?? ''));
      setPhaseId(defaultPhaseId || '');
      setStartDate(defaultStartDate ? formatDate(adjustToBusinessDay(defaultStartDate)) : '');
      setEndDate(defaultEndDate ? formatDate(adjustToBusinessDay(defaultEndDate)) : '');
    }
  }, [task, defaultStoryId, defaultPhaseId, defaultStartDate, defaultEndDate, stories]);

  const selectedStory = stories.find(s => s.id === storyId);
  const availablePhases = selectedStory?.phases || [];

  useEffect(() => {
    if (storyId && !task) {
      if (defaultPhaseId && availablePhases.some(p => p.id === defaultPhaseId)) {
        setPhaseId(defaultPhaseId);
      } else if (availablePhases.length > 0 && !phaseId) {
        setPhaseId(availablePhases[0].id);
      }
    }
  }, [storyId, availablePhases, defaultPhaseId, task, phaseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, dê um nome à tarefa');
      return;
    }

    if (!phaseId) {
      alert('Por favor, selecione uma fase');
      return;
    }

    if (!startDate || !endDate) {
      alert('Por favor, defina as datas de início e fim');
      return;
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (end < start) {
      alert('A data de término deve ser posterior à data de início');
      return;
    }

    setSaving(true);

    const taskData: Partial<StoryTask> = {
      name: name.trim(),
      phase_id: phaseId,
      type,
      start_date: startDate,
      end_date: endDate,
      status,
      notes: notes.trim() || null,
    };

    if (task) {
      taskData.id = task.id;
    }

    onSave(taskData, storyId);
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-2xl border-4 border-black flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Nome da tarefa <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: Entrevistas com usuários"
                  disabled={saving}
                  autoFocus
                />
              </div>

              {!task && stories.length > 1 && (
                <div>
                  <label className="block text-sm font-bold mb-2">
                    História <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={storyId}
                    onChange={(e) => setStoryId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    disabled={saving || !!defaultStoryId}
                  >
                    {stories.map((story) => (
                      <option key={story.id} value={story.id}>
                        {story.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-2">
                  Fase <span className="text-red-600">*</span>
                </label>
                <select
                  value={phaseId}
                  onChange={(e) => setPhaseId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  disabled={saving}
                >
                  {availablePhases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Tipo <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="activity"
                      checked={type === 'activity'}
                      onChange={(e) => setType(e.target.value as 'activity')}
                      className="w-5 h-5"
                      disabled={saving}
                    />
                    <span className="font-bold">Atividade</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="meeting"
                      checked={type === 'meeting'}
                      onChange={(e) => setType(e.target.value as 'meeting')}
                      className="w-5 h-5"
                      disabled={saving}
                    />
                    <span className="font-bold">Reunião</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Data de início <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Data de término <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'planned' | 'in_progress' | 'completed')
                  }
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  disabled={saving}
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  placeholder="Anotações adicionais sobre a tarefa"
                  disabled={saving}
                />
              </div>
            </form>
          </div>

          <div className="p-4 border-t-2 border-gray-200 flex gap-3 flex-shrink-0 bg-white">
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-3 border-2 border-red-600 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Excluir
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border-2 border-black font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                const form = (e.currentTarget as HTMLButtonElement).closest('form');
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
