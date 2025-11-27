import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Logo } from './Logo';

interface NewMaturityFormProps {
  onBack: () => void;
  onComplete: (responseId: string) => void;
}

const MAX_SCORE = 55; // 11 questions * 5 points

interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
}

const getArchetype = (score: number): { level: number; name: string } => {
  if (score <= 15) return { level: 1, name: 'Nascer / "Foundations Missing"' };
  if (score <= 26) return { level: 2, name: 'Formar / "Emerging Structure"' };
  if (score <= 37) return { level: 3, name: 'Operar / "Operational Stability"' };
  if (score <= 46) return { level: 4, name: 'Influenciar / "Strategic Contribution"' };
  return { level: 5, name: 'Liderar / "High-Performance Design Team"' };
};

export const NewMaturityForm = ({ onBack, onComplete }: NewMaturityFormProps) => {
  const { track } = useAnalytics();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].maturityForm;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const pageStartTime = useRef(performance.now());

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    role: '',
    q1: '', q2: '', q3: '', q4: '', q5: '',
    q6: '', q7: '', q8: '', q9: '', q10: '', q11: ''
  });

  useEffect(() => {
    track('maturity_form_page_view', {
      timestamp: new Date().toISOString(),
      referrer: document.referrer
    });

    return () => {
      const timeSpent = performance.now() - pageStartTime.current;
      track('maturity_form_page_time_spent', {
        ms_spent: Math.round(timeSpent)
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
    for (let i = 1; i <= 11; i++) {
      const key = `q${i}` as keyof FormData;
      total += Number(formData[key] || 0);
    }
    return total;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = t.errors.required;
    if (!formData.email.trim()) {
      newErrors.email = t.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.invalidEmail;
    }
    if (!formData.role) newErrors.role = t.errors.required;

    for (let i = 1; i <= 11; i++) {
      const key = `q${i}`;
      if (!formData[key as keyof FormData]) {
        newErrors[key] = t.errors.required;
      }
    }

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

    setSubmitError('');

    const isValid = validateForm();

    if (!isValid) {
      track('maturity_form_validation_failed', {
        errors: Object.keys(errors)
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalScore = calculateScore();
      const percentage = totalScore / MAX_SCORE;
      const { level, name: archetype } = getArchetype(totalScore);

      const { data, error } = await supabase
        .from('maturity_diagnosis')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          company: formData.company || null,
          role: formData.role,
          q1_processos: Number(formData.q1),
          q2_rituais: Number(formData.q2),
          q3_colaboracao_pm_eng: Number(formData.q3),
          q4_handoff: Number(formData.q4),
          q5_design_system: Number(formData.q5),
          q6_documentacao: Number(formData.q6),
          q7_pesquisa: Number(formData.q7),
          q8_qualidade: Number(formData.q8),
          q9_carreira: Number(formData.q9),
          q10_percepcao: Number(formData.q10),
          q11_cultura: Number(formData.q11),
          total_score: totalScore,
          percentage: percentage,
          maturity_level: level,
          archetype: archetype
        })
        .select('id, response_id')
        .single();

      if (error) {
        throw error;
      }

      track('maturity_form_submit_success', {
        maturity_level: level,
        total_score: totalScore,
        archetype: archetype
      });

      if (data?.response_id) {
        onComplete(data.response_id);
      } else if (data?.id) {
        onComplete(data.id);
      } else {
        throw new Error('No identifier returned from database');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error
        ? `${t.submitError} (${error.message})`
        : t.submitError;
      setSubmitError(errorMessage);
      track('maturity_form_submit_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (isDirty) {
      setShowBackConfirm(true);
    } else {
      onBack();
    }
  };

  const renderQuestion = (questionKey: string, questionData: any) => {
    return (
      <div key={questionKey}>
        <label className="block text-base font-bold mb-3">
          {questionData.text} <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          {questionData.options.map((option: any) => (
            <label
              key={option.value}
              className="flex items-start space-x-3 p-3 border-2 border-gray-300 hover:border-black cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={questionKey}
                value={option.value}
                checked={formData[questionKey as keyof FormData] === String(option.value)}
                onChange={(e) => handleChange(questionKey, e.target.value)}
                onFocus={() => handleFocus(questionKey)}
                className="mt-1"
              />
              <span className="flex-1">{option.label}</span>
            </label>
          ))}
        </div>
        {errors[questionKey] && <p className="text-red-600 text-sm mt-1">{errors[questionKey]}</p>}
      </div>
    );
  };

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

        {/* Validation Error Banner */}
        {false && Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-4 border-red-600 p-6 mb-8">
            <h3 className="text-red-900 font-bold text-xl mb-3 flex items-center gap-2">
              ⚠️ {language === 'en' ? 'Please complete all required fields' : 'Por favor, preencha todos os campos obrigatórios'}
            </h3>
            <p className="text-red-800 mb-3">
              {language === 'en'
                ? `${Object.keys(errors).length} field${Object.keys(errors).length > 1 ? 's' : ''} need${Object.keys(errors).length === 1 ? 's' : ''} your attention:`
                : `${Object.keys(errors).length} campo${Object.keys(errors).length > 1 ? 's' : ''} precisa${Object.keys(errors).length === 1 ? '' : 'm'} da sua atenção:`
              }
            </p>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {Object.keys(errors).map(key => (
                <li key={key}>
                  {key === 'fullName' && (language === 'en' ? 'Full Name' : 'Nome Completo')}
                  {key === 'email' && 'Email'}
                  {key === 'role' && (language === 'en' ? 'Role' : 'Cargo')}
                  {key.startsWith('q') && `${language === 'en' ? 'Question' : 'Questão'} ${key.substring(1)}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Error Banner */}
        {submitError && (
          <div className="bg-red-50 border-4 border-red-600 p-6 mb-8">
            <h3 className="text-red-900 font-bold text-xl mb-2 flex items-center gap-2">
              ⚠️ {language === 'en' ? 'Error' : 'Erro'}
            </h3>
            <p className="text-red-800">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Contact Information */}
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

          {/* Questions */}
          <div className="space-y-12">
            {Object.entries(t.questions).map(([questionKey, questionData]) => (
              <div key={questionKey}>
                {renderQuestion(questionKey, questionData)}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};
