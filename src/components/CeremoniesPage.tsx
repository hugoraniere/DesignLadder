import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Users, Clock, Target, List, Link as LinkIcon, KanbanSquare, GitBranch, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

interface Ceremony {
  id: string;
  project_id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  duration_minutes: number;
  objective: string | null;
  agenda: string | null;
  participants: string[] | null;
  meeting_link: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
}

interface CeremoniesPageProps {
  projectId: string;
  onBack: () => void;
}

const FREQUENCY_LABELS = {
  daily: 'Diária',
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal'
};

export const CeremoniesPage = ({ projectId, onBack }: CeremoniesPageProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCeremony, setEditingCeremony] = useState<Ceremony | null>(null);

  const [formName, setFormName] = useState('');
  const [formFrequency, setFormFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [formDuration, setFormDuration] = useState(60);
  const [formObjective, setFormObjective] = useState('');
  const [formAgenda, setFormAgenda] = useState('');
  const [formParticipants, setFormParticipants] = useState('');
  const [formMeetingLink, setFormMeetingLink] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      const { data: ceremoniesData, error: ceremoniesError } = await supabase
        .from('ceremonies')
        .select('*')
        .eq('project_id', projectId)
        .order('position');

      if (ceremoniesError) throw ceremoniesError;
      setCeremonies(ceremoniesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ceremony?: Ceremony) => {
    if (ceremony) {
      setEditingCeremony(ceremony);
      setFormName(ceremony.name);
      setFormFrequency(ceremony.frequency);
      setFormDuration(ceremony.duration_minutes);
      setFormObjective(ceremony.objective || '');
      setFormAgenda(ceremony.agenda || '');
      setFormParticipants(ceremony.participants?.join(', ') || '');
      setFormMeetingLink(ceremony.meeting_link || '');
    } else {
      setEditingCeremony(null);
      setFormName('');
      setFormFrequency('weekly');
      setFormDuration(60);
      setFormObjective('');
      setFormAgenda('');
      setFormParticipants('');
      setFormMeetingLink('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCeremony(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('O nome da cerimônia é obrigatório');
      return;
    }

    try {
      const participantsArray = formParticipants
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const ceremonyData = {
        project_id: projectId,
        name: formName.trim(),
        frequency: formFrequency,
        duration_minutes: formDuration,
        objective: formObjective.trim() || null,
        agenda: formAgenda.trim() || null,
        participants: participantsArray.length > 0 ? participantsArray : null,
        meeting_link: formMeetingLink.trim() || null,
        position: editingCeremony?.position || ceremonies.length + 1
      };

      if (editingCeremony) {
        const { error } = await supabase
          .from('ceremonies')
          .update(ceremonyData)
          .eq('id', editingCeremony.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ceremonies')
          .insert(ceremonyData);

        if (error) throw error;
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error saving ceremony:', error);
      alert('Erro ao salvar cerimônia');
    }
  };

  const handleDelete = async (ceremonyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta cerimônia?')) return;

    try {
      const { error } = await supabase
        .from('ceremonies')
        .delete()
        .eq('id', ceremonyId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting ceremony:', error);
      alert('Erro ao excluir cerimônia');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black sticky top-0 bg-white z-40">
        <div className="max-w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.hash = '#app'}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm"
                title="Ver todos os projetos"
              >
                <ArrowLeft className="w-4 h-4" />
                Meus Projetos
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <Logo showText={false} variant="dark" />
              <h1 className="text-lg font-bold">{project?.name}</h1>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Nova Cerimônia
            </button>
          </div>

          <div className="flex">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-gray-50 hover:bg-gray-100"
            >
              <GitBranch className="w-4 h-4" />
              Roadmap
            </button>
            <button
              onClick={() => window.location.hash = `#kanban/${projectId}`}
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-gray-50 hover:bg-gray-100"
            >
              <KanbanSquare className="w-4 h-4" />
              Kanban
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-white border-b-2 border-black -mb-[2px] relative z-10"
            >
              <Calendar className="w-4 h-4" />
              Cerimônias
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {ceremonies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma cerimônia cadastrada</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Criar primeira cerimônia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ceremonies.map((ceremony) => (
              <div
                key={ceremony.id}
                className="border-2 border-black bg-white hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold">{ceremony.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(ceremony)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ceremony.id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{FREQUENCY_LABELS[ceremony.frequency]} - {ceremony.duration_minutes} min</span>
                    </div>

                    {ceremony.objective && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{ceremony.objective}</span>
                      </div>
                    )}

                    {ceremony.agenda && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <List className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{ceremony.agenda}</span>
                      </div>
                    )}

                    {ceremony.participants && ceremony.participants.length > 0 && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{ceremony.participants.join(', ')}</span>
                      </div>
                    )}

                    {ceremony.meeting_link && (
                      <a
                        href={ceremony.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Link da reunião
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseModal}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl border-4 border-black">
              <div className="p-6 border-b-2 border-gray-200">
                <h2 className="text-xl font-bold">
                  {editingCeremony ? 'Editar Cerimônia' : 'Nova Cerimônia'}
                </h2>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold mb-2">Nome *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Ex: Design Critique"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Frequência</label>
                    <select
                      value={formFrequency}
                      onChange={(e) => setFormFrequency(e.target.value as any)}
                      className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="daily">Diária</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quinzenal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Duração (min)</label>
                    <input
                      type="number"
                      value={formDuration}
                      onChange={(e) => setFormDuration(parseInt(e.target.value) || 0)}
                      min="5"
                      step="5"
                      className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Objetivo</label>
                  <input
                    type="text"
                    value={formObjective}
                    onChange={(e) => setFormObjective(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Ex: Feedback e padrões"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Pauta</label>
                  <textarea
                    value={formAgenda}
                    onChange={(e) => setFormAgenda(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder="Ex: Apresentação, feedback, boas práticas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Participantes (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formParticipants}
                    onChange={(e) => setFormParticipants(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Ex: Designers, Devs, PMs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Link da reunião</label>
                  <input
                    type="url"
                    value={formMeetingLink}
                    onChange={(e) => setFormMeetingLink(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              </div>

              <div className="p-6 border-t-2 border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 border-2 border-black font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  {editingCeremony ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
