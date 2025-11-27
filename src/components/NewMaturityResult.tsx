import { useState, useEffect } from 'react';
import { CheckCircle, Download, Loader2, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Logo } from './Logo';

interface NewMaturityResultProps {
  responseId: string;
  onBack: () => void;
}

interface DiagnosisData {
  id: string;
  response_id: string | null;
  full_name: string;
  email: string;
  company: string | null;
  role: string;
  total_score: number;
  maturity_level: number;
  archetype: string;
  feedback: string | null;
}

export const NewMaturityResult = ({ responseId, onBack }: NewMaturityResultProps) => {
  const { language } = useLanguage();
  const t = translations[language].maturityResult;

  const [data, setData] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackValue, setFeedbackValue] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadDiagnosis();
  }, [responseId]);

  const loadDiagnosis = async () => {
    try {
      const { data: result, error } = await supabase
        .from('maturity_diagnosis')
        .select('*')
        .or(`response_id.eq.${responseId},id.eq.${responseId}`)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setData(result);
      setFeedbackValue(result?.feedback || null);
    } catch (error) {
      console.error('Error loading diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedback: string) => {
    if (!data) return;

    setSubmittingFeedback(true);
    try {
      const identifier = data.response_id || data.id;
      const column = data.response_id ? 'response_id' : 'id';

      const { error } = await supabase
        .from('maturity_diagnosis')
        .update({ feedback })
        .eq(column, identifier);

      if (error) throw error;
      setFeedbackValue(feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const shareToSocial = (platform: 'instagram' | 'linkedin' | 'whatsapp' | 'twitter') => {
    if (!data) return;

    const url = window.location.href;
    const text = `Acabei de descobrir que meu time de design está no nível ${data.maturity_level} (${data.archetype})! Descubra o seu em:`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Texto copiado! Cole no Instagram para compartilhar.');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Resultado não encontrado</h1>
          <button onClick={onBack} className="bg-black text-white px-6 py-3 font-bold">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const levelData = t.levels[data.maturity_level as keyof typeof t.levels];
  const percentage = Math.round((data.total_score / 55) * 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12 print:mb-8">
          <Logo showText={true} variant="dark" />
          <div className="mt-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-gray-50 border-4 border-black p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2">{data.maturity_level}</div>
            <h2 className="text-3xl font-bold mb-2">{data.archetype}</h2>
            <p className="text-xl text-gray-600">
              {data.total_score} / 55 pontos ({percentage}%)
            </p>
          </div>

          <div className="w-full bg-gray-200 h-4 mb-6">
            <div
              className="bg-black h-4 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-lg leading-relaxed mb-6">{levelData.description}</p>

          <div className="border-t-2 border-gray-300 pt-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{levelData.characteristicsTitle}</h3>
            <ul className="space-y-2">
              {levelData.characteristics.map((characteristic: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-black font-bold mt-1">•</span>
                  <span>{characteristic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-xl font-bold mb-4">{t.nextSteps}</h3>
            <div className="space-y-4">
              {levelData.nextSteps.map((step: string, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Participant Info */}
        <div className="bg-white border-2 border-gray-200 p-6 mb-8 print:hidden">
          <h3 className="text-xl font-bold mb-4">Informações do Participante</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Nome:</strong> {data.full_name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            {data.company && <p><strong>Empresa:</strong> {data.company}</p>}
            <p><strong>Cargo:</strong> {data.role}</p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gray-50 border-2 border-gray-300 p-6 mb-8 print:hidden">
          <h3 className="text-xl font-bold mb-4">Essa análise fez sentido para você?</h3>
          {feedbackValue ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold">Obrigado pelo seu feedback!</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleFeedback('sim')}
                disabled={submittingFeedback}
                className="flex-1 bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Sim, totalmente
              </button>
              <button
                onClick={() => handleFeedback('parcialmente')}
                disabled={submittingFeedback}
                className="flex-1 bg-white text-black py-3 px-6 font-bold border-2 border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Parcialmente
              </button>
              <button
                onClick={() => handleFeedback('nao')}
                disabled={submittingFeedback}
                className="flex-1 bg-white text-black py-3 px-6 font-bold border-2 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Não muito
              </button>
            </div>
          )}
        </div>

        {/* Social Share */}
        <div className="bg-white border-2 border-gray-200 p-6 mb-8 print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Compartilhar Resultado</h3>
            <Share2 className="w-5 h-5" />
          </div>
          <p className="text-gray-700 mb-4">Mostre para seu time ou rede profissional!</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="bg-[#25D366] text-white py-3 px-4 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => shareToSocial('linkedin')}
              className="bg-[#0A66C2] text-white py-3 px-4 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
            <button
              onClick={() => shareToSocial('twitter')}
              className="bg-black text-white py-3 px-4 font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={() => shareToSocial('instagram')}
              className="bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#C13584] text-white py-3 px-4 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={downloadPDF}
            className="flex-1 bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            Baixar PDF
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-white text-black py-4 px-8 font-bold text-lg border-2 border-black hover:bg-gray-100 transition-colors"
          >
            Voltar à Página Inicial
          </button>
        </div>

        {/* CTA */}
        {data.maturity_level < 5 && (
          <div className="bg-gray-50 border-2 border-gray-300 p-6 text-center mt-8 print:hidden">
            <h3 className="text-xl font-bold mb-2">{t.cta.title}</h3>
            <p className="text-gray-700 mb-4">{t.cta.description}</p>
            <a
              href="mailto:contato@designladder.site"
              className="inline-block bg-black text-white py-3 px-8 font-bold hover:bg-gray-800 transition-colors"
            >
              {t.cta.button}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
