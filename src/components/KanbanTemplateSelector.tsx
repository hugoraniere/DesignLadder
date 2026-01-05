import { Check } from 'lucide-react';
import { KanbanTemplate, KANBAN_TEMPLATES } from '../types/kanban';
import { useState } from 'react';

interface KanbanTemplateSelectorProps {
  onSelectTemplate: (template: KanbanTemplate) => void;
  onCancel?: () => void;
}

export const KanbanTemplateSelector = ({ onSelectTemplate, onCancel }: KanbanTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<KanbanTemplate | null>(null);

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Escolha um template para o Kanban</h2>
        <p className="text-gray-600">
          Selecione como você quer organizar suas tarefas. Você poderá personalizar as colunas depois.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {KANBAN_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`text-left p-6 border-4 transition-all hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="bg-black text-white p-1 rounded-full">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Colunas incluídas:
              </p>
              <div className="flex flex-wrap gap-2">
                {template.columns.map((column, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-white border-2 border-gray-300 text-sm font-medium"
                  >
                    {column}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview visual */}
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="flex gap-2">
                {template.columns.map((column, index) => (
                  <div
                    key={index}
                    className="flex-1 min-w-0"
                  >
                    <div className="bg-gray-200 p-2 mb-1">
                      <div className="text-xs font-bold truncate">{column}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white border border-gray-300 p-1.5">
                        <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      {index === 0 && (
                        <div className="bg-white border border-gray-300 p-1.5">
                          <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedTemplate}
          className="flex-1 bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Criar Kanban
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-8 py-4 border-2 border-black font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-600">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Após criar o Kanban, você poderá renomear, reordenar, adicionar ou remover colunas conforme necessário.
        </p>
      </div>
    </div>
  );
};
