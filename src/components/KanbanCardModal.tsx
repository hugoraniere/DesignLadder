import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Link as LinkIcon } from 'lucide-react';
import { KanbanCard, CardPriority } from '../types/kanban';

interface KanbanCardModalProps {
  card: KanbanCard;
  onUpdate: (cardId: string, updates: Partial<KanbanCard>) => void;
  onDelete: (cardId: string) => void;
  onClose: () => void;
}

export const KanbanCardModal = ({ card, onUpdate, onDelete, onClose }: KanbanCardModalProps) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState<CardPriority>(card.priority);
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [tags, setTags] = useState<string[]>(card.tags || []);
  const [newTag, setNewTag] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      title !== card.title ||
      description !== (card.description || '') ||
      priority !== card.priority ||
      dueDate !== (card.due_date || '') ||
      JSON.stringify(tags) !== JSON.stringify(card.tags || []);

    setHasChanges(changed);
  }, [title, description, priority, dueDate, tags, card]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('O título não pode estar vazio');
      return;
    }

    const updates: Partial<KanbanCard> = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate || null,
      tags: tags.length > 0 ? tags : null
    };

    onUpdate(card.id, updates);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este card?')) {
      onDelete(card.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-white border-l-4 border-black z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Editar Card</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Título do card"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Descreva os detalhes desta tarefa..."
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPriority('low')}
                  className={`py-3 px-4 border-2 font-bold transition-colors ${
                    priority === 'low'
                      ? 'bg-green-100 border-green-600 text-green-800'
                      : 'border-black hover:bg-gray-100'
                  }`}
                >
                  Baixa
                </button>
                <button
                  onClick={() => setPriority('medium')}
                  className={`py-3 px-4 border-2 font-bold transition-colors ${
                    priority === 'medium'
                      ? 'bg-yellow-100 border-yellow-600 text-yellow-800'
                      : 'border-black hover:bg-gray-100'
                  }`}
                >
                  Média
                </button>
                <button
                  onClick={() => setPriority('high')}
                  className={`py-3 px-4 border-2 font-bold transition-colors ${
                    priority === 'high'
                      ? 'bg-red-100 border-red-600 text-red-800'
                      : 'border-black hover:bg-gray-100'
                  }`}
                >
                  Alta
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Data de vencimento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Adicionar tag..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-200 border border-gray-400"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked roadmap task */}
            {card.linked_roadmap_task_id && (
              <div className="border-2 border-blue-600 bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                  <LinkIcon className="w-5 h-5" />
                  <span>Vinculado ao Roadmap</span>
                </div>
                <p className="text-sm text-blue-700">
                  Este card está vinculado a uma tarefa do roadmap macro.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 flex gap-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges || !title.trim()}
              className="flex-1 bg-black text-white py-4 px-6 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar alterações
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-4 border-2 border-red-600 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Excluir
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 border-2 border-black font-bold hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};
