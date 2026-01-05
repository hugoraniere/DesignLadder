import { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { KanbanColumn as KanbanColumnType, KanbanCard, KanbanColumnWithCards, KanbanTemplate, KANBAN_TEMPLATES } from '../types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCardModal } from './KanbanCardModal';
import { KanbanTemplateSelector } from './KanbanTemplateSelector';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumnWithCards[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);

  useEffect(() => {
    loadKanbanData();
  }, [projectId]);

  const loadKanbanData = async () => {
    try {
      setLoading(true);

      // Load columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (columnsError) throw columnsError;

      // If no columns exist, show template selector
      if (!columnsData || columnsData.length === 0) {
        setShowTemplateSelector(true);
        setLoading(false);
        return;
      }

      // Load cards for all columns
      const { data: cardsData, error: cardsError } = await supabase
        .from('kanban_cards')
        .select('*')
        .in('column_id', columnsData.map(col => col.id))
        .order('position', { ascending: true });

      if (cardsError) throw cardsError;

      // Group cards by column
      const columnsWithCards: KanbanColumnWithCards[] = columnsData.map(col => ({
        ...col,
        cards: cardsData?.filter(card => card.column_id === col.id) || []
      }));

      setColumns(columnsWithCards);
    } catch (error) {
      console.error('[KanbanBoard] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createColumnsFromTemplate = async (template: KanbanTemplate) => {
    const selectedTemplate = KANBAN_TEMPLATES.find(t => t.id === template);
    if (!selectedTemplate) return;

    try {
      const newColumns = selectedTemplate.columns.map((name, index) => ({
        project_id: projectId,
        name,
        position: index + 1
      }));

      const { error } = await supabase
        .from('kanban_columns')
        .insert(newColumns);

      if (error) throw error;

      setShowTemplateSelector(false);
      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error creating columns from template:', error);
      alert('Erro ao criar colunas. Tente novamente.');
    }
  };

  const createColumn = async () => {
    if (!newColumnName.trim()) return;

    try {
      const maxPosition = columns.length > 0
        ? Math.max(...columns.map(col => col.position))
        : 0;

      const { error } = await supabase
        .from('kanban_columns')
        .insert({
          project_id: projectId,
          name: newColumnName.trim(),
          position: maxPosition + 1
        });

      if (error) throw error;

      setNewColumnName('');
      setShowNewColumnInput(false);
      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error creating column:', error);
      alert('Erro ao criar coluna. Tente novamente.');
    }
  };

  const updateColumn = async (columnId: string, updates: Partial<KanbanColumnType>) => {
    try {
      const { error } = await supabase
        .from('kanban_columns')
        .update(updates)
        .eq('id', columnId);

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error updating column:', error);
      alert('Erro ao atualizar coluna. Tente novamente.');
    }
  };

  const deleteColumn = async (columnId: string) => {
    // Prevent deleting if it's the last column
    if (columns.length === 1) {
      alert('Não é possível excluir a última coluna.');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta coluna? Todos os cards serão removidos.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error deleting column:', error);
      alert('Erro ao excluir coluna. Tente novamente.');
    }
  };

  const createCard = async (columnId: string, title: string) => {
    if (!title.trim()) return;

    try {
      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      const maxPosition = column.cards.length > 0
        ? Math.max(...column.cards.map(card => card.position))
        : 0;

      const { error } = await supabase
        .from('kanban_cards')
        .insert({
          column_id: columnId,
          title: title.trim(),
          position: maxPosition + 1,
          priority: 'medium'
        });

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error creating card:', error);
      alert('Erro ao criar card. Tente novamente.');
    }
  };

  const updateCard = async (cardId: string, updates: Partial<KanbanCard>) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .update(updates)
        .eq('id', cardId);

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error updating card:', error);
      alert('Erro ao atualizar card. Tente novamente.');
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Tem certeza que deseja excluir este card?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('kanban_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error deleting card:', error);
      alert('Erro ao excluir card. Tente novamente.');
    }
  };

  const moveCard = async (cardId: string, newColumnId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .update({
          column_id: newColumnId,
          position: newPosition
        })
        .eq('id', cardId);

      if (error) throw error;

      loadKanbanData();
    } catch (error) {
      console.error('[KanbanBoard] Error moving card:', error);
      alert('Erro ao mover card. Tente novamente.');
    }
  };

  const openCardModal = (card: KanbanCard) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
    setShowCardModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (showTemplateSelector) {
    return (
      <KanbanTemplateSelector
        onSelectTemplate={createColumnsFromTemplate}
        onCancel={() => setShowTemplateSelector(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
        <h2 className="text-2xl font-bold">Kanban</h2>
        <button
          onClick={() => setShowTemplateSelector(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Trocar template
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full pb-4 min-w-max">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              onUpdateColumn={updateColumn}
              onDeleteColumn={deleteColumn}
              onCreateCard={createCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onMoveCard={moveCard}
              onOpenCard={openCardModal}
            />
          ))}

          {/* New column button */}
          <div className="w-80 flex-shrink-0">
            {showNewColumnInput ? (
              <div className="bg-gray-100 p-4 border-2 border-black">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createColumn();
                    } else if (e.key === 'Escape') {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }
                  }}
                  placeholder="Nome da coluna"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={createColumn}
                    className="flex-1 bg-black text-white py-2 px-4 font-bold hover:bg-gray-800 transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }}
                    className="flex-1 border-2 border-black py-2 px-4 font-bold hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewColumnInput(true)}
                className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-black"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">Nova coluna</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && selectedCard && (
        <KanbanCardModal
          card={selectedCard}
          onUpdate={updateCard}
          onDelete={deleteCard}
          onClose={closeCardModal}
        />
      )}
    </div>
  );
};
