import { useState } from 'react';
import { Modal } from './Modal';
import { submitResponse, FormData } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFieldFocus: (fieldName: string) => void;
  onSubmit: () => void;
  onAbandon: () => void;
}

export const FormModal = ({ isOpen, onClose, onFieldFocus, onSubmit, onAbandon }: FormModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    problem: '',
    desired_outcome: '',
    frequency: '',
    team_size: '',
    role: '',
    company_size: '',
    budget: '',
    urgency: '',
    early_tester: false,
    company_name: '',
    email: ''
  });

  const handleClose = () => {
    if (!isSubmitted && Object.values(formData).some(v => v !== '' && v !== false)) {
      onAbandon();
    }
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        problem: '',
        desired_outcome: '',
        frequency: '',
        team_size: '',
        role: '',
        company_size: '',
        budget: '',
        urgency: '',
        early_tester: false,
        company_name: '',
        email: ''
      });
      setError('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitResponse(formData);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.error('Email notification failed');
      }

      setIsSubmitted(true);
      onSubmit();
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">Thank you!</h2>
          <p className="text-xl">Your input helps shape the future of DesignOps.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Share Your Challenge</h2>
          <p className="text-lg text-gray-600">Help us understand what's holding your team back.</p>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            What's the most relevant problem your design team struggles with? *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the problem in your own words…"
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            onFocus={() => onFieldFocus('problem')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            What outcome do you want after solving this problem? *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Better alignment… more visibility… faster delivery…"
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.desired_outcome}
            onChange={(e) => handleChange('desired_outcome', e.target.value)}
            onFocus={() => onFieldFocus('desired_outcome')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            How often does this problem occur? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            onFocus={() => onFieldFocus('frequency')}
          >
            <option value="">Select frequency…</option>
            <option value="once_in_a_while">Once in a while</option>
            <option value="occasionally">Occasionally</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
            <option value="multiple_times_daily">Multiple times a day</option>
            <option value="constant">Constant / Real-time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            How big is your team? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.team_size}
            onChange={(e) => handleChange('team_size', e.target.value)}
            onFocus={() => onFieldFocus('team_size')}
          >
            <option value="">Select team size…</option>
            <option value="1">1 (solo)</option>
            <option value="2-5">2–5</option>
            <option value="6-10">6–10</option>
            <option value="11-20">11–20</option>
            <option value="21-50">21–50</option>
            <option value="50+">50+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            What's your role? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            onFocus={() => onFieldFocus('role')}
          >
            <option value="">Select role…</option>
            <option value="head_manager">Head / Manager</option>
            <option value="ic">IC (Designer, Researcher, Writer)</option>
            <option value="product_manager">Product Manager</option>
            <option value="engineer">Engineer</option>
            <option value="founder_ceo">Founder / CEO</option>
            <option value="freelancer">Freelancer / Contractor</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            What's your company size? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.company_size}
            onChange={(e) => handleChange('company_size', e.target.value)}
            onFocus={() => onFieldFocus('company_size')}
          >
            <option value="">Select company size…</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="201-500">201–500</option>
            <option value="501-1000">501–1000</option>
            <option value="1000+">1000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            What would be a realistic budget for a solution like this? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            onFocus={() => onFieldFocus('budget')}
          >
            <option value="">Select budget range…</option>
            <option value="5-10">$5–$10 / month</option>
            <option value="10-25">$10–$25 / month</option>
            <option value="25-50">$25–$50 / month</option>
            <option value="50-100">$50–$100 / month</option>
            <option value="100+">$100+</option>
            <option value="depends">Depends on the impact</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            When do you need this problem solved? *
          </label>
          <select
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
            value={formData.urgency}
            onChange={(e) => handleChange('urgency', e.target.value)}
            onFocus={() => onFieldFocus('urgency')}
          >
            <option value="">Select urgency…</option>
            <option value="asap">ASAP</option>
            <option value="1_week">In 1 week</option>
            <option value="2_weeks">In 2 weeks</option>
            <option value="1_month">In 1 month</option>
            <option value="no_rush">No rush</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 border-2 border-black"
              checked={formData.early_tester}
              onChange={(e) => handleChange('early_tester', e.target.checked)}
              onFocus={() => onFieldFocus('early_tester')}
            />
            <span className="text-sm font-bold">Would you be open to becoming an early tester?</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Company Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            onFocus={() => onFieldFocus('company_name')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Your Email *
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onFocus={() => onFieldFocus('email')}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </Modal>
  );
};
