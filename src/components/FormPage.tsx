import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { Logo } from './Logo';

interface FormPageProps {
  onBack: () => void;
}

export const FormPage = ({ onBack }: FormPageProps) => {
  const { track } = useAnalytics();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].form;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pageStartTime = useRef(performance.now());

  const [formData, setFormData] = useState({
    problem: '',
    desired_outcome: '',
    frequency: '',
    team_size: '',
    role: '',
    company_size: '',
    budget: '',
    urgency: '',
    early_tester: '',
    company_name: '',
    email: ''
  });

  useEffect(() => {
    track('form_page_view', {
      timestamp: new Date().toISOString(),
      referrer: document.referrer
    });

    return () => {
      const timeSpent = performance.now() - pageStartTime.current;
      track('form_page_time_spent', {
        ms_spent: Math.round(timeSpent),
        completed: isSubmitted
      });
    };
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFocus = (field: string) => {
    track('form_field_focus', { field_name: field });
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    if (value && typeof value === 'string' && value.trim()) {
      track('form_field_complete', {
        field_name: field,
        has_value: true
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const fieldOrder = ['problem', 'desired_outcome', 'frequency', 'team_size', 'role', 'company_size', 'budget', 'urgency', 'early_tester', 'company_name', 'email'];

    if (!formData.problem.trim()) {
      newErrors.problem = t.errors.required;
      track('validation_error', { field_name: 'problem', error_type: 'required' });
    }
    if (!formData.desired_outcome.trim()) {
      newErrors.desired_outcome = t.errors.required;
      track('validation_error', { field_name: 'desired_outcome', error_type: 'required' });
    }
    if (!formData.frequency) {
      newErrors.frequency = t.errors.required;
      track('validation_error', { field_name: 'frequency', error_type: 'required' });
    }
    if (!formData.team_size) {
      newErrors.team_size = t.errors.required;
      track('validation_error', { field_name: 'team_size', error_type: 'required' });
    }
    if (!formData.role) {
      newErrors.role = t.errors.required;
      track('validation_error', { field_name: 'role', error_type: 'required' });
    }
    if (!formData.company_size) {
      newErrors.company_size = t.errors.required;
      track('validation_error', { field_name: 'company_size', error_type: 'required' });
    }
    if (!formData.budget) {
      newErrors.budget = t.errors.required;
      track('validation_error', { field_name: 'budget', error_type: 'required' });
    }
    if (!formData.urgency) {
      newErrors.urgency = t.errors.required;
      track('validation_error', { field_name: 'urgency', error_type: 'required' });
    }
    if (!formData.early_tester) {
      newErrors.early_tester = t.errors.selectOption;
      track('validation_error', { field_name: 'early_tester', error_type: 'required' });
    }
    if (!formData.company_name.trim()) {
      newErrors.company_name = t.errors.required;
      track('validation_error', { field_name: 'company_name', error_type: 'required' });
    }
    if (!formData.email.trim()) {
      newErrors.email = t.errors.required;
      track('validation_error', { field_name: 'email', error_type: 'required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.invalidEmail;
      track('validation_error', { field_name: 'email', error_type: 'invalid_email' });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = fieldOrder.find(field => newErrors[field]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
          if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            element.focus();
          }
        }, 100);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('responses').insert([formData]);

      if (error) throw error;

      track('form_submit', {
        has_early_tester: formData.early_tester,
        team_size: formData.team_size,
        role: formData.role,
        company_size: formData.company_size,
        frequency: formData.frequency,
        budget_range: formData.budget
      });

      setIsSubmitted(true);
      setIsDirty(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMsg = language === 'en'
        ? 'There was an error submitting your response. Please try again.'
        : 'Houve um erro ao enviar sua resposta. Por favor, tente novamente.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    setLanguage(newLang);
    track('language_change', { from: language, to: newLang, page: 'form' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-10 bg-white border-b border-black/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
            <Logo showText={false} variant="dark" className="scale-75" />
            <span className="ml-2 text-sm font-semibold">{t.header}</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{t.success.title}</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              {t.success.message}
              {formData.early_tester === 'yes' && t.success.messageEarlyTester}
            </p>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-black hover:bg-black hover:text-white transition-all duration-150 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.success.back}
          </button>
        </div>

        <footer className="py-8 px-4 border-t border-black/10 text-center text-sm text-gray-500">
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black hover:text-black transition-colors rounded"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">{translations[language].landing.footer.language}: {language === 'en' ? 'English' : 'Português'}</span>
          </button>
        </footer>
      </div>
    );
  }

  const handleBackClick = () => {
    if (isDirty) {
      setShowBackConfirm(true);
    } else {
      onBack();
    }
  };

  const confirmBack = () => {
    track('form_abandoned', {
      has_data: isDirty,
      filled_fields: Object.values(formData).filter(v => v && String(v).trim()).length
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Back' : 'Voltar'}
          </button>
          <div className="flex items-center">
            <Logo showText={false} variant="dark" className="scale-75" />
            <span className="ml-2 text-sm font-semibold">{t.header}</span>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 max-w-md w-full space-y-6 border-2 border-black">
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'Leave without submitting?' : 'Sair sem enviar?'}
            </h2>
            <p className="text-gray-600">
              {language === 'en'
                ? 'Your answers won\'t be saved if you go back now.'
                : 'Suas respostas não serão salvas se você voltar agora.'
              }
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBackConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-black font-semibold hover:bg-gray-50 transition-colors"
              >
                {language === 'en' ? 'Keep editing' : 'Continuar editando'}
              </button>
              <button
                onClick={confirmBack}
                className="flex-1 px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                {language === 'en' ? 'Leave' : 'Sair'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t.intro.title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t.intro.subtitle}
          </p>
          <p className="text-sm text-gray-500">{t.intro.required}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="space-y-6">
            <div className="space-y-3">
              <label className="block font-bold text-lg">
                {t.problem.label}
              </label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={(e) => handleChange('problem', e.target.value)}
                onFocus={() => handleFocus('problem')}
                onBlur={() => handleBlur('problem')}
                placeholder={t.problem.placeholder}
                rows={3}
                className={`w-full px-4 py-3 border-2 ${
                  errors.problem ? 'border-red-600' : 'border-black'
                } focus:outline-none focus:ring-2 focus:ring-black resize-none`}
              />
              {errors.problem && <p className="text-red-600 text-sm font-semibold">{errors.problem}</p>}
              <p className="text-xs text-gray-500">{t.problem.help}</p>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-lg">
                {t.outcome.label}
              </label>
              <textarea
                name="desired_outcome"
                value={formData.desired_outcome}
                onChange={(e) => handleChange('desired_outcome', e.target.value)}
                onFocus={() => handleFocus('desired_outcome')}
                onBlur={() => handleBlur('desired_outcome')}
                placeholder={t.outcome.placeholder}
                rows={3}
                className={`w-full px-4 py-3 border-2 ${
                  errors.desired_outcome ? 'border-red-600' : 'border-black'
                } focus:outline-none focus:ring-2 focus:ring-black resize-none`}
              />
              {errors.desired_outcome && <p className="text-red-600 text-sm font-semibold">{errors.desired_outcome}</p>}
              <p className="text-xs text-gray-500">{t.outcome.help}</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">{t.frequency.title}</h2>

            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="space-y-3">
                <label className="block font-bold">{t.frequency.label}</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  onFocus={() => handleFocus('frequency')}
                  onBlur={() => handleBlur('frequency')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.frequency ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.frequency.placeholder}</option>
                  <option value="once_in_a_while">{t.frequency.options.once}</option>
                  <option value="weekly">{t.frequency.options.weekly}</option>
                  <option value="daily">{t.frequency.options.daily}</option>
                  <option value="multiple_times_daily">{t.frequency.options.multiple}</option>
                </select>
                {errors.frequency && <p className="text-red-600 text-sm font-semibold">{errors.frequency}</p>}
              </div>

              <div className="space-y-3">
                <label className="block font-bold">{t.companySize.label}</label>
                <select
                  name="company_size"
                  value={formData.company_size}
                  onChange={(e) => handleChange('company_size', e.target.value)}
                  onFocus={() => handleFocus('company_size')}
                  onBlur={() => handleBlur('company_size')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.company_size ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.companySize.placeholder}</option>
                  <option value="1-10">{t.companySize.options['1-10']}</option>
                  <option value="11-50">{t.companySize.options['11-50']}</option>
                  <option value="51-200">{t.companySize.options['51-200']}</option>
                  <option value="201-1000">{t.companySize.options['201-1000']}</option>
                  <option value="1000+">{t.companySize.options['1000+']}</option>
                </select>
                {errors.company_size && <p className="text-red-600 text-sm font-semibold">{errors.company_size}</p>}
              </div>

              <div className="space-y-3">
                <label className="block font-bold">{t.teamSize.label}</label>
                <select
                  name="team_size"
                  value={formData.team_size}
                  onChange={(e) => handleChange('team_size', e.target.value)}
                  onFocus={() => handleFocus('team_size')}
                  onBlur={() => handleBlur('team_size')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.team_size ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.teamSize.placeholder}</option>
                  <option value="just_me">{t.teamSize.options.just_me}</option>
                  <option value="2-5">{t.teamSize.options['2-5']}</option>
                  <option value="6-10">{t.teamSize.options['6-10']}</option>
                  <option value="11-20">{t.teamSize.options['11-20']}</option>
                  <option value="20+">{t.teamSize.options['20+']}</option>
                </select>
                {errors.team_size && <p className="text-red-600 text-sm font-semibold">{errors.team_size}</p>}
              </div>

              <div className="space-y-3">
                <label className="block font-bold">{t.budget.label}</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  onFocus={() => handleFocus('budget')}
                  onBlur={() => handleBlur('budget')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.budget ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.budget.placeholder}</option>
                  <option value="under_100">{t.budget.options.under_100}</option>
                  <option value="100-500">{t.budget.options['100-500']}</option>
                  <option value="500-2000">{t.budget.options['500-2000']}</option>
                  <option value="2000-5000">{t.budget.options['2000-5000']}</option>
                  <option value="5000+">{t.budget.options['5000+']}</option>
                  <option value="not_sure">{t.budget.options.not_sure}</option>
                </select>
                {errors.budget && <p className="text-red-600 text-sm font-semibold">{errors.budget}</p>}
              </div>

              <div className="space-y-3">
                <label className="block font-bold">{t.role.label}</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onFocus={() => handleFocus('role')}
                  onBlur={() => handleBlur('role')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.role ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.role.placeholder}</option>
                  <option value="designer">{t.role.options.designer}</option>
                  <option value="lead">{t.role.options.lead}</option>
                  <option value="director">{t.role.options.director}</option>
                  <option value="ops">{t.role.options.ops}</option>
                  <option value="founder">{t.role.options.founder}</option>
                  <option value="pm">{t.role.options.pm}</option>
                  <option value="other">{t.role.options.other}</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm font-semibold">{errors.role}</p>}
              </div>

              <div className="space-y-3">
                <label className="block font-bold">{t.urgency.label}</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={(e) => handleChange('urgency', e.target.value)}
                  onFocus={() => handleFocus('urgency')}
                  onBlur={() => handleBlur('urgency')}
                  className={`form-select w-full px-4 py-3 pr-10 border-2 ${
                    errors.urgency ? 'border-red-600' : 'border-black'
                  } bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer`}
                >
                  <option value="">{t.urgency.placeholder}</option>
                  <option value="urgent">{t.urgency.options.urgent}</option>
                  <option value="soon">{t.urgency.options.soon}</option>
                  <option value="this_year">{t.urgency.options.this_year}</option>
                  <option value="exploring">{t.urgency.options.exploring}</option>
                </select>
                {errors.urgency && <p className="text-red-600 text-sm font-semibold">{errors.urgency}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">{t.contact.title}</h2>

            <div className="space-y-4">
              <label className="block font-bold text-lg">
                {t.contact.earlyTester.label}
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="early_tester"
                    value="yes"
                    checked={formData.early_tester === 'yes'}
                    onChange={(e) => handleChange('early_tester', e.target.value)}
                    onFocus={() => handleFocus('early_tester')}
                    className="w-5 h-5 border-2 border-black cursor-pointer accent-black"
                  />
                  <span className="text-base group-hover:opacity-70 transition-opacity">{t.contact.earlyTester.yes}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="early_tester"
                    value="no"
                    checked={formData.early_tester === 'no'}
                    onChange={(e) => handleChange('early_tester', e.target.value)}
                    onFocus={() => handleFocus('early_tester')}
                    className="w-5 h-5 border-2 border-black cursor-pointer accent-black"
                  />
                  <span className="text-base group-hover:opacity-70 transition-opacity">{t.contact.earlyTester.no}</span>
                </label>
              </div>
              {errors.early_tester && <p className="text-red-600 text-sm font-semibold">{errors.early_tester}</p>}
            </div>

            <div className="space-y-3">
              <label className="block font-bold">{t.contact.companyName.label}</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                onFocus={() => handleFocus('company_name')}
                onBlur={() => handleBlur('company_name')}
                className={`w-full px-4 py-3 border-2 ${
                  errors.company_name ? 'border-red-600' : 'border-black'
                } focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.company_name && <p className="text-red-600 text-sm font-semibold">{errors.company_name}</p>}
            </div>

            <div className="space-y-3">
              <label className="block font-bold">{t.contact.email.label}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 border-2 ${
                  errors.email ? 'border-red-600' : 'border-black'
                } focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {errors.email && <p className="text-red-600 text-sm font-semibold">{errors.email}</p>}
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? t.submitting : t.submit}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>

      <footer className="py-8 px-4 border-t border-black/10 text-center text-sm text-gray-500">
        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black hover:text-black transition-colors rounded"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{translations[language].landing.footer.language}: {language === 'en' ? 'English' : 'Português'}</span>
        </button>
      </footer>
    </div>
  );
};
