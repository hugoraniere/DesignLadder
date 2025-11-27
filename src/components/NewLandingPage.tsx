import { Logo } from './Logo';
import { useAnalytics } from '../hooks/useAnalytics';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Clock, CheckCircle, Globe, ArrowRight } from 'lucide-react';

interface NewLandingPageProps {
  onNavigateToMaturity: () => void;
  onNavigateToResearch: () => void;
}

export const NewLandingPage = ({ onNavigateToMaturity, onNavigateToResearch }: NewLandingPageProps) => {
  const { track } = useAnalytics();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].newLanding;

  const whySection = useScrollReveal();
  const whoSection = useScrollReveal();
  const notesSection = useScrollReveal();
  const footerSection = useScrollReveal();

  const handleCTAClick = () => {
    track('maturity_diagnostic_cta_click');
    onNavigateToMaturity();
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    setLanguage(newLang);
    track('language_change', { from: language, to: newLang });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-6xl w-full text-center space-y-8 md:space-y-12">
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in">
            <Logo showText={true} variant="dark" />
          </div>

          <div className="space-y-6 md:space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight opacity-0 animate-fade-in-up animation-delay-200">
              {t.hero.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-300">
              {t.hero.subtitle}
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 opacity-0 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{t.hero.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t.hero.report}</span>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up animation-delay-500">
            <button
              onClick={handleCTAClick}
              className="bg-black text-white px-12 py-5 text-xl font-bold hover:bg-gray-800 border-2 border-black transition-all duration-150 ease-out hover:scale-[1.02] inline-flex items-center gap-3"
            >
              {t.hero.cta}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Language Toggle - Fixed Top Right */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 flex items-center space-x-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors z-50"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold">{language === 'en' ? 'PT' : 'EN'}</span>
      </button>

      {/* Why Section */}
      <div ref={whySection} className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">{t.why.title}</h2>
          <p className="text-lg md:text-xl leading-relaxed text-gray-700 whitespace-pre-line">
            {t.why.text}
          </p>
        </div>
      </div>

      {/* Who Section */}
      <div ref={whoSection} className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">{t.who.title}</h2>
          <p className="text-lg md:text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            {t.who.description}
          </p>
          <div className="space-y-6">
            {t.who.roles.map((role: { title: string; description: string }, index: number) => (
              <div key={index} className="border-2 border-gray-200 p-6 hover:border-black transition-colors">
                <h3 className="text-xl font-bold mb-2 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  {role.title}
                </h3>
                <p className="text-gray-700 ml-8">{role.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 italic">{t.who.note}</p>
        </div>
      </div>

      {/* Quick Notes */}
      <div ref={notesSection} className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">{t.notes.title}</h2>
          <div className="space-y-8">
            {t.notes.items.map((item: { title: string; description: string }, index: number) => (
              <div key={index} className="border-l-4 border-black pl-6">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-lg text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with Research Form CTA */}
      <div ref={footerSection} className="py-20 px-4 border-t-2 border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">{t.footer.research.title}</h3>
            <p className="text-lg text-gray-700">{t.footer.research.description}</p>
            <button
              onClick={() => {
                track('research_form_cta_click');
                onNavigateToResearch();
              }}
              className="bg-white text-black px-8 py-3 text-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all inline-flex items-center gap-2"
            >
              {t.footer.research.cta}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-12 border-t-2 border-gray-200">
            <Logo showText={true} variant="dark" />
            <p className="mt-4 text-gray-600">{t.footer.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
