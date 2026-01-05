import { useState } from 'react';
import { Plus, MoreVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { KanbanColumnWithCards, KanbanCard, KanbanColumn as KanbanColumnType } from '../types/kanban';
import { KanbanCard as KanbanCardComponent } from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnWithCards;
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, newColumnId: string, newPosition: number) => void;
  onOpenCard: (card: KanbanCard) => void;
}

export const KanbanColumn = ({
  column,
  onUpdateColumn,
  onDeleteColumn,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onOpenCard
}: KanbanColumnProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(column.name);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewCardInput, setShowNewCardInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== column.name) {
      onUpdateColumn(column.id, { name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(column.name);
    setIsEditingName(false);
  };

  const handleCreateCard = () => {
    if (newCardTitle.trim()) {
      onCreateCard(column.id, newCardTitle);
      setNewCardTitle('');
      setShowNewCardInput(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      cardId: card.id,
      sourceColumnId: column.id,
      sourcePosition: card.position
    }));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { cardId, sourceColumnId } = data;

      // Calculate new position (1-based)
      const newPosition = targetIndex + 1;

      onMoveCard(cardId, column.id, newPosition);
    } catch (error) {
      console.error('[KanbanColumn] Error handling drop:', error);
    }
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { cardId } = data;

      // Drop at the end of the column
      const newPosition = column.cards.length + 1;

      onMoveCard(cardId, column.id, newPosition);
    } catch (error) {
      console.error('[KanbanColumn] Error handling column drop:', error);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 flex flex-col">
      {/* Column Header */}
      <div className="bg-gray-100 border-2 border-black p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="flex-1 px-2 py-1 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black text-sm font-bold"
                autoFocus
              />
              <button onClick={handleSaveName} className="p-1 hover:bg-gray-200">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={handleCancelEdit} className="p-1 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                {column.name}
                <span className="bg-black text-white px-2 py-0.5 text-xs rounded-full">
                  {column.cards.length}
                </span>
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white border-2 border-black shadow-lg z-20">
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-200"
                      >
                        <Pencil className="w-4 h-4" />
                        Renomear
                      </button>
                      <button
                        onClick={() => {
                          onDeleteColumn(column.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir coluna
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick add card button */}
        {!showNewCardInput && (
          <button
            onClick={() => setShowNewCardInput(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar card
          </button>
        )}
      </div>

      {/* New card input */}
      {showNewCardInput && (
        <div className="bg-white border-2 border-black p-3 mb-2">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateCard();
              if (e.key === 'Escape') {
                setShowNewCardInput(false);
                setNewCardTitle('');
              }
            }}
            placeholder="Título do card..."
            className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black text-sm mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateCard}
              className="flex-1 bg-black text-white py-1 px-3 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowNewCardInput(false);
                setNewCardTitle('');
              }}
              className="flex-1 border-2 border-black py-1 px-3 text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Cards list */}
      <div
        className="flex-1 space-y-2 overflow-y-auto min-h-[200px]"
        onDragOver={handleColumnDragOver}
        onDrop={handleColumnDrop}
      >
        {column.cards.map((card, index) => (
          <div
            key={card.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {dragOverIndex === index && (
              <div className="h-2 bg-blue-400 rounded mb-2" />
            )}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
            >
              <KanbanCardComponent
                card={card}
                onClick={() => onOpenCard(card)}
              />
            </div>
          </div>
        ))}
        {dragOverIndex === column.cards.length && (
          <div className="h-2 bg-blue-400 rounded" />
        )}
      </div>
    </div>
  );
};
