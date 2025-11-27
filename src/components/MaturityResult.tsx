import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Logo } from './Logo';

interface MaturityResultProps {
  level: number;
  percentage: number;
  onBack: () => void;
}

export const MaturityResult = ({ level, percentage, onBack }: MaturityResultProps) => {
  const { language } = useLanguage();
  const t = translations[language].maturityResult;

  const levelData = t.levels[level as keyof typeof t.levels];
  const percentageFormatted = Math.round(percentage * 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-black hover:opacity-70 transition-opacity mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">{t.back}</span>
        </button>

        <div className="text-center mb-12">
          <Logo showText={true} variant="dark" />
          <div className="mt-8 inline-block">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <div className="bg-gray-50 border-4 border-black p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2">{level}</div>
            <h2 className="text-3xl font-bold mb-2">{levelData.title}</h2>
            <p className="text-xl text-gray-600">{percentageFormatted}% {t.maturityScore}</p>
          </div>

          <div className="w-full bg-gray-200 h-4 mb-6">
            <div
              className="bg-black h-4 transition-all duration-1000"
              style={{ width: `${percentageFormatted}%` }}
            />
          </div>

          <p className="text-lg leading-relaxed mb-6">{levelData.description}</p>

          <div className="border-t-2 border-gray-300 pt-6">
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
        </div>

        <div className="bg-white border-4 border-black p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">{t.nextSteps}</h3>
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

        {level < 5 && (
          <div className="bg-gray-50 border-2 border-gray-300 p-6 text-center">
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
