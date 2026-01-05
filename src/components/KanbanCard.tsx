import { Calendar, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { KanbanCard as KanbanCardType } from '../types/kanban';

interface KanbanCardProps {
  card: KanbanCardType;
  onClick: () => void;
}

export const KanbanCard = ({ card, onClick }: KanbanCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-600 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-600 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-600 text-green-800';
      default:
        return 'bg-gray-100 border-gray-600 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const isOverdue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-black p-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Priority badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-sm flex-1">{card.title}</h4>
        <span className={`px-2 py-0.5 text-xs font-bold border ${getPriorityColor(card.priority)}`}>
          {getPriorityLabel(card.priority)}
        </span>
      </div>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 border border-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with metadata */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {/* Due date */}
          {card.due_date && (
            <div className={`flex items-center gap-1 ${isOverdue(card.due_date) ? 'text-red-600 font-bold' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.due_date)}</span>
              {isOverdue(card.due_date) && (
                <AlertCircle className="w-3 h-3" />
              )}
            </div>
          )}

          {/* Linked to roadmap */}
          {card.linked_roadmap_task_id && (
            <div className="flex items-center gap-1 text-blue-600">
              <LinkIcon className="w-3 h-3" />
              <span>Roadmap</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
