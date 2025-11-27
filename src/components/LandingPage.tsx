import { Logo } from './Logo';
import { useAnalytics } from '../hooks/useAnalytics';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Clock, Mail, Globe } from 'lucide-react';

interface LandingPageProps {
  onNavigateToForm: () => void;
  onNavigateToMaturity: () => void;
}

export const LandingPage = ({ onNavigateToForm, onNavigateToMaturity }: LandingPageProps) => {
  const { track } = useAnalytics();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].landing;

  const whySection = useScrollReveal();
  const whatSection = useScrollReveal();
  const whoSection = useScrollReveal();
  const faqSection = useScrollReveal();

  const handleCTAClick = () => {
    track('cta_click');
    onNavigateToForm();
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    setLanguage(newLang);
    track('language_change', { from: language, to: newLang });
  };

  return (
    <>
      <div className="min-h-screen bg-white text-black">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-20">
          <div className="max-w-6xl w-full text-center space-y-8 md:space-y-12">
            <div className="flex justify-center mb-6 opacity-0 animate-fade-in">
              <Logo showText={true} variant="dark" />
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="inline-block px-4 py-2 border border-black text-xs font-semibold tracking-wide uppercase opacity-0 animate-fade-in-up animation-delay-100">
                {language === 'en' ? 'For Product, UX & Design teams' : 'Para equipes de Produto, UX e Design'}
              </div>

              <h1 className="hero-title font-bold opacity-0 animate-fade-in-up animation-delay-200">
                {t.hero.title}
              </h1>

              <p className="hero-subtitle text-lg md:text-xl opacity-0 animate-fade-in-up animation-delay-300">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="space-y-4 opacity-0 animate-fade-in-up animation-delay-300">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCTAClick}
                  className="bg-black text-white px-10 py-4 text-lg font-bold hover:bg-white hover:text-black border-2 border-black transition-all duration-150 ease-out hover:scale-[1.02]"
                >
                  {t.hero.cta}
                </button>
                <button
                  onClick={() => {
                    track('maturity_cta_click');
                    onNavigateToMaturity();
                  }}
                  className="bg-white text-black px-10 py-4 text-lg font-bold hover:bg-black hover:text-white border-2 border-black transition-all duration-150 ease-out hover:scale-[1.02]"
                >
                  {language === 'en' ? 'Maturity Diagnosis' : 'Diagnóstico de Maturidade'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>3–4 {language === 'en' ? 'minutes' : 'minutos'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{language === 'en' ? 'No spam — just research' : 'Sem spam — apenas pesquisa'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          ref={whySection.ref}
          className={`py-20 md:py-28 px-4 border-t border-black/10 transition-all duration-300 ${
            whySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {language === 'en' ? 'Why I\'m asking these questions' : 'Por que estou fazendo essas perguntas'}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                {language === 'en'
                  ? 'I\'m a product designer working in low-maturity teams where things often ship before design is even involved.'
                  : 'Sou um product designer trabalhando em equipes de baixa maturidade onde as coisas geralmente são lançadas antes mesmo do design ser envolvido.'
                }
              </p>
              <p>
                {language === 'en'
                  ? 'Instead of guessing solutions, I\'m collecting stories from real Product/UX teams about their workflow, alignment and DesignOps pains. Your answers help me see patterns and prioritize what\'s worth building.'
                  : 'Em vez de adivinhar soluções, estou coletando histórias de equipes reais de Produto/UX sobre seu fluxo de trabalho, alinhamento e dores de DesignOps. Suas respostas me ajudam a ver padrões e priorizar o que vale a pena construir.'
                }
              </p>
              <div className="pt-6 border-t border-black/10">
                <p className="text-base font-medium text-black">— Hugo, Product & UX Designer</p>
                <p className="text-sm text-gray-600 mt-2">
                  {t.hero.subtitle2}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={whatSection.ref}
          className={`py-20 md:py-28 px-4 bg-black text-white transition-all duration-300 ${
            whatSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t.what.title}</h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{t.what.collaboration.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t.what.collaboration.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">{t.what.operations.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t.what.operations.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">{t.what.quality.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t.what.quality.description}
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-lg text-gray-300">
                {language === 'en'
                  ? 'If it affects how your design team works together, I want to hear about it.'
                  : 'Se isso afeta como sua equipe de design trabalha em conjunto, quero saber sobre isso.'
                }
              </p>
              <button
                onClick={handleCTAClick}
                className="bg-white text-black px-10 py-4 text-lg font-bold hover:bg-black hover:text-white border-2 border-white transition-all duration-150 ease-out hover:scale-[1.02] inline-block"
              >
                {t.hero.cta}
              </button>
            </div>
          </div>
        </section>

        <section
          ref={whoSection.ref}
          className={`py-20 md:py-28 px-4 transition-all duration-300 ${
            whoSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {language === 'en' ? 'Who should answer?' : 'Quem deve responder?'}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="px-6 py-4 border-2 border-black text-center font-semibold">
                {language === 'en' ? 'Heads of Design / Design Managers' : 'Heads de Design / Gerentes de Design'}
              </div>
              <div className="px-6 py-4 border-2 border-black text-center font-semibold">
                {language === 'en' ? 'Product Designers & UX Researchers' : 'Product Designers & Pesquisadores UX'}
              </div>
              <div className="px-6 py-4 border-2 border-black text-center font-semibold">
                {language === 'en' ? 'Product Managers working closely with design' : 'Product Managers que trabalham próximo ao design'}
              </div>
              <div className="px-6 py-4 border-2 border-black text-center font-semibold">
                {language === 'en' ? 'Founders building their first design team' : 'Fundadores construindo sua primeira equipe de design'}
              </div>
            </div>

            <p className="text-center text-gray-600 text-lg">
              {language === 'en'
                ? 'Whether your team is 2 or 50 people, your pain points are equally valuable.'
                : 'Seja sua equipe de 2 ou 50 pessoas, seus pontos de dor são igualmente valiosos.'
              }
            </p>
          </div>
        </section>

        <section
          ref={faqSection.ref}
          className={`py-20 md:py-28 px-4 border-t border-black/10 bg-gray-50 transition-all duration-300 ${
            faqSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">{t.faq.title}</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2"></div>
                <div>
                  <h3 className="font-bold mb-1">{t.faq.confidential.title}</h3>
                  <p className="text-gray-700">
                    {t.faq.confidential.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2"></div>
                <div>
                  <h3 className="font-bold mb-1">{t.faq.newsletter.title}</h3>
                  <p className="text-gray-700">
                    {t.faq.newsletter.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2"></div>
                <div>
                  <h3 className="font-bold mb-1">{t.faq.real.title}</h3>
                  <p className="text-gray-700">
                    {t.faq.real.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-black/10 text-center text-sm text-gray-500">
          <div className="flex justify-center mb-4">
            <Logo showText={false} variant="dark" className="scale-75" />
          </div>
          <p className="mb-4">{t.footer.tagline}</p>
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black hover:text-black transition-colors rounded"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">{t.footer.language}: {language === 'en' ? 'English' : 'Português'}</span>
          </button>
        </footer>
      </div>
    </>
  );
};
