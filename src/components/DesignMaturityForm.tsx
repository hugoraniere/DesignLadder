import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Logo } from './Logo';
import { MaturityResult } from './MaturityResult';

interface DesignMaturityFormProps {
  onBack: () => void;
}

const WEIGHTS = {
  q1_processos: 3,
  q2_rituais: 3,
  q3_colaboracao_pm_eng: 4,
  q4_handoff: 2,
  q5_design_system: 2,
  q6_documentacao: 2,
  q7_pesquisa: 3,
  q8_qualidade: 3,
  q9_carreira: 3,
  q10_percepcao: 4,
};

const MAX_SCORE = 145; // 5 * 29 (sum of weights)

interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  q1_processos: string;
  q2_rituais: string;
  q3_colaboracao_pm_eng: string;
  q4_handoff: string;
  q5_design_system: string;
  q6_documentacao: string;
  q7_pesquisa: string;
  q8_qualidade: string;
  q9_carreira: string;
  q10_percepcao: string;
}

export const DesignMaturityForm = ({ onBack }: DesignMaturityFormProps) => {
  const { track } = useAnalytics();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].maturityForm;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ level: number; percentage: number; totalScore: number } | null>(null);
  const pageStartTime = useRef(performance.now());

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    role: '',
    q1_processos: '',
    q2_rituais: '',
    q3_colaboracao_pm_eng: '',
    q4_handoff: '',
    q5_design_system: '',
    q6_documentacao: '',
    q7_pesquisa: '',
    q8_qualidade: '',
    q9_carreira: '',
    q10_percepcao: '',
  });

  useEffect(() => {
    track('maturity_form_page_view', {
      timestamp: new Date().toISOString(),
      referrer: document.referrer
    });

    return () => {
      const timeSpent = performance.now() - pageStartTime.current;
      track('maturity_form_page_time_spent', {
        ms_spent: Math.round(timeSpent),
        completed: isSubmitted
      });
    };
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFocus = (field: string) => {
    track('maturity_form_field_focus', { field_name: field });
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof FormData];
    if (value && value.trim()) {
      track('maturity_form_field_complete', {
        field_name: field,
        has_value: true
      });
    }
  };

  const calculateScore = () => {
    let total = 0;
    Object.keys(WEIGHTS).forEach((key) => {
      const answer = Number(formData[key as keyof FormData] || 0);
      total += answer * WEIGHTS[key as keyof typeof WEIGHTS];
    });
    const percentage = total / MAX_SCORE;
    return { total, percentage };
  };

  const getMaturityLevel = (percentage: number): number => {
    if (percentage <= 0.20) return 1;
    if (percentage <= 0.40) return 2;
    if (percentage <= 0.65) return 3;
    if (percentage <= 0.85) return 4;
    return 5;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.errors.required;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.invalidEmail;
    }
    if (!formData.role) {
      newErrors.role = t.errors.required;
    }

    const questions = ['q1_processos', 'q2_rituais', 'q3_colaboracao_pm_eng', 'q4_handoff', 'q5_design_system', 'q6_documentacao', 'q7_pesquisa', 'q8_qualidade', 'q9_carreira', 'q10_percepcao'];
    questions.forEach(q => {
      if (!formData[q as keyof FormData]) {
        newErrors[q] = t.errors.required;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      track('maturity_form_validation_failed', {
        errors: Object.keys(errors)
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { total, percentage } = calculateScore();
      const level = getMaturityLevel(percentage);

      const { error } = await supabase
        .from('maturity_diagnosis')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          company: formData.company || null,
          role: formData.role,
          q1_processos: Number(formData.q1_processos),
          q2_rituais: Number(formData.q2_rituais),
          q3_colaboracao_pm_eng: Number(formData.q3_colaboracao_pm_eng),
          q4_handoff: Number(formData.q4_handoff),
          q5_design_system: Number(formData.q5_design_system),
          q6_documentacao: Number(formData.q6_documentacao),
          q7_pesquisa: Number(formData.q7_pesquisa),
          q8_qualidade: Number(formData.q8_qualidade),
          q9_carreira: Number(formData.q9_carreira),
          q10_percepcao: Number(formData.q10_percepcao),
          total_score: total,
          percentage: percentage,
          maturity_level: level,
        });

      if (error) throw error;

      track('maturity_form_submit_success', {
        maturity_level: level,
        total_score: total,
        percentage: percentage
      });

      setResult({ level, percentage, totalScore: total });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      track('maturity_form_submit_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      alert(t.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (isDirty && !isSubmitted) {
      setShowBackConfirm(true);
    } else {
      onBack();
    }
  };

  if (isSubmitted && result) {
    return <MaturityResult level={result.level} percentage={result.percentage} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-black hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">{t.back}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-bold">{language === 'en' ? 'PT' : 'EN'}</span>
          </button>
        </div>

        {showBackConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 max-w-md w-full border-4 border-black">
              <h3 className="text-2xl font-bold mb-4">{t.confirmBack.title}</h3>
              <p className="mb-6">{t.confirmBack.message}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowBackConfirm(false);
                    onBack();
                  }}
                  className="flex-1 bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors"
                >
                  {t.confirmBack.confirm}
                </button>
                <button
                  onClick={() => setShowBackConfirm(false)}
                  className="flex-1 border-2 border-black py-3 px-6 font-bold hover:bg-gray-100 transition-colors"
                >
                  {t.confirmBack.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12 text-center">
          <Logo showText={true} variant="dark" />
          <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-700">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-6 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold">{t.sections.contact}</h2>

            <div>
              <label className="block text-sm font-bold mb-2">
                {t.fields.fullName.label} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onFocus={() => handleFocus('fullName')}
                onBlur={() => handleBlur('fullName')}
                className={`w-full px-4 py-3 border-2 ${errors.fullName ? 'border-red-600' : 'border-black'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                {t.fields.email.label} <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-600' : 'border-black'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                {t.fields.company.label}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                onFocus={() => handleFocus('company')}
                onBlur={() => handleBlur('company')}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                {t.fields.role.label} <span className="text-red-600">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                onFocus={() => handleFocus('role')}
                onBlur={() => handleBlur('role')}
                className={`w-full px-4 py-3 border-2 ${errors.role ? 'border-red-600' : 'border-black'} focus:outline-none focus:ring-2 focus:ring-black bg-white`}
              >
                <option value="">{t.fields.role.placeholder}</option>
                {t.fields.role.options.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold">{t.sections.processes}</h2>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q1.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q1.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q1_processos"
                      value={option.value}
                      checked={formData.q1_processos === String(option.value)}
                      onChange={(e) => handleChange('q1_processos', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q1_processos && <p className="text-red-600 text-sm mt-1">{errors.q1_processos}</p>}
            </div>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q2.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q2.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q2_rituais"
                      value={option.value}
                      checked={formData.q2_rituais === String(option.value)}
                      onChange={(e) => handleChange('q2_rituais', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q2_rituais && <p className="text-red-600 text-sm mt-1">{errors.q2_rituais}</p>}
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold">{t.sections.collaboration}</h2>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q3.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q3.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q3_colaboracao_pm_eng"
                      value={option.value}
                      checked={formData.q3_colaboracao_pm_eng === String(option.value)}
                      onChange={(e) => handleChange('q3_colaboracao_pm_eng', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q3_colaboracao_pm_eng && <p className="text-red-600 text-sm mt-1">{errors.q3_colaboracao_pm_eng}</p>}
            </div>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q4.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q4.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q4_handoff"
                      value={option.value}
                      checked={formData.q4_handoff === String(option.value)}
                      onChange={(e) => handleChange('q4_handoff', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q4_handoff && <p className="text-red-600 text-sm mt-1">{errors.q4_handoff}</p>}
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold">{t.sections.designSystem}</h2>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q5.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q5.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q5_design_system"
                      value={option.value}
                      checked={formData.q5_design_system === String(option.value)}
                      onChange={(e) => handleChange('q5_design_system', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q5_design_system && <p className="text-red-600 text-sm mt-1">{errors.q5_design_system}</p>}
            </div>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q6.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q6.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q6_documentacao"
                      value={option.value}
                      checked={formData.q6_documentacao === String(option.value)}
                      onChange={(e) => handleChange('q6_documentacao', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q6_documentacao && <p className="text-red-600 text-sm mt-1">{errors.q6_documentacao}</p>}
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold">{t.sections.research}</h2>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q7.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q7.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q7_pesquisa"
                      value={option.value}
                      checked={formData.q7_pesquisa === String(option.value)}
                      onChange={(e) => handleChange('q7_pesquisa', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q7_pesquisa && <p className="text-red-600 text-sm mt-1">{errors.q7_pesquisa}</p>}
            </div>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q8.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q8.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q8_qualidade"
                      value={option.value}
                      checked={formData.q8_qualidade === String(option.value)}
                      onChange={(e) => handleChange('q8_qualidade', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q8_qualidade && <p className="text-red-600 text-sm mt-1">{errors.q8_qualidade}</p>}
            </div>
          </div>

          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold">{t.sections.culture}</h2>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q9.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q9.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q9_carreira"
                      value={option.value}
                      checked={formData.q9_carreira === String(option.value)}
                      onChange={(e) => handleChange('q9_carreira', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q9_carreira && <p className="text-red-600 text-sm mt-1">{errors.q9_carreira}</p>}
            </div>

            <div>
              <label className="block text-base font-bold mb-3">
                {t.questions.q10.text} <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {t.questions.q10.options.map((option: { value: number; label: string }) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q10_percepcao"
                      value={option.value}
                      checked={formData.q10_percepcao === String(option.value)}
                      onChange={(e) => handleChange('q10_percepcao', e.target.value)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.q10_percepcao && <p className="text-red-600 text-sm mt-1">{errors.q10_percepcao}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};
