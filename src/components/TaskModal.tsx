import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, Phase } from '../types/roadmap';
import { formatDate, parseDate, adjustToBusinessDay } from '../utils/businessDays';

interface TaskModalProps {
  task: Task | null;
  phases: Phase[];
  defaultPhaseId?: string;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onSave: (taskData: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

export const TaskModal = ({
  task,
  phases,
  defaultPhaseId,
  defaultStartDate,
  defaultEndDate,
  onSave,
  onDelete,
  onClose,
}: TaskModalProps) => {
  const [name, setName] = useState('');
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
    } else {
      setPhaseId(defaultPhaseId || (phases[0]?.id ?? ''));
      setStartDate(defaultStartDate ? formatDate(adjustToBusinessDay(defaultStartDate)) : '');
      setEndDate(defaultEndDate ? formatDate(adjustToBusinessDay(defaultEndDate)) : '');
    }
  }, [task, defaultPhaseId, defaultStartDate, defaultEndDate, phases]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, dê um nome à tarefa');
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

    const taskData: Partial<Task> = {
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

    onSave(taskData);
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 max-w-2xl w-full border-4 border-black max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
              {phases.map((phase) => (
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

          <div className="flex gap-4">
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-3 border-2 border-red-600 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Excluir
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
