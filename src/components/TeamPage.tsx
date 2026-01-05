import { useState, useEffect } from 'react';
import { Users, User, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TeamPageProps {
  projectId: string;
}

interface Designer {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  storiesCount: number;
}

export const TeamPage = ({ projectId }: TeamPageProps) => {
  const [loading, setLoading] = useState(true);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);

  useEffect(() => {
    loadTeamData();
  }, [projectId]);

  const loadTeamData = async () => {
    try {
      setLoading(true);

      const { data: stories } = await supabase
        .from('design_stories')
        .select('designer_id, designer_name, designer_avatar_url')
        .eq('project_id', projectId)
        .not('designer_id', 'is', null);

      const designerMap = new Map<string, Designer>();

      stories?.forEach((story) => {
        if (story.designer_id) {
          if (!designerMap.has(story.designer_id)) {
            designerMap.set(story.designer_id, {
              id: story.designer_id,
              name: story.designer_name || 'Designer',
              email: '',
              avatar_url: story.designer_avatar_url,
              storiesCount: 0
            });
          }
          const designer = designerMap.get(story.designer_id)!;
          designer.storiesCount++;
        }
      });

      setDesigners(Array.from(designerMap.values()));
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estrutura do Time</h1>
          <p className="text-gray-600">Visualize a alocação e trabalho dos designers</p>
        </div>

        {designers.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">Nenhum designer alocado ainda</p>
            <p className="text-sm text-gray-500">
              Designers aparecerão aqui quando forem atribuídos a histórias no roadmap
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer) => (
              <div
                key={designer.id}
                className={`bg-white border-2 transition-all cursor-pointer ${
                  selectedDesigner === designer.id
                    ? 'border-black shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedDesigner(
                  selectedDesigner === designer.id ? null : designer.id
                )}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {designer.avatar_url ? (
                      <img
                        src={designer.avatar_url}
                        alt={designer.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-black"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-black">
                        <User className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{designer.name}</h3>
                      {designer.email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {designer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Histórias Ativas</span>
                      <span className="font-bold">{designer.storiesCount}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.hash = `#roadmap/${projectId}?designer=${designer.id}`;
                    }}
                    className="w-full mt-4 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Ver no Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white border-2 border-black p-6">
          <h2 className="text-xl font-bold mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Designers</p>
              <p className="text-3xl font-bold">{designers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Histórias Totais</p>
              <p className="text-3xl font-bold">
                {designers.reduce((acc, d) => acc + d.storiesCount, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Média por Designer</p>
              <p className="text-3xl font-bold">
                {designers.length > 0
                  ? (designers.reduce((acc, d) => acc + d.storiesCount, 0) / designers.length).toFixed(1)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
