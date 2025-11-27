import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FormData {
  problem: string;
  desired_outcome: string;
  frequency: string;
  team_size: string;
  role: string;
  company_size: string;
  budget: string;
  urgency: string;
  early_tester: boolean;
  company_name: string;
  email: string;
}

export const submitResponse = async (data: FormData) => {
  const { error } = await supabase
    .from('responses')
    .insert([data]);

  if (error) throw error;
};

export const trackEvent = async (eventType: string, eventData: any = {}, sessionId: string) => {
  await supabase
    .from('analytics_events')
    .insert([{
      event_type: eventType,
      event_data: eventData,
      session_id: sessionId
    }]);
};
