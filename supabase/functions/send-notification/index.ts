import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FormData {
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

const formatFrequency = (freq: string): string => {
  const map: Record<string, string> = {
    'once_in_a_while': 'Once in a while',
    'occasionally': 'Occasionally',
    'weekly': 'Weekly',
    'daily': 'Daily',
    'multiple_times_daily': 'Multiple times a day',
    'constant': 'Constant / Real-time'
  };
  return map[freq] || freq;
};

const formatRole = (role: string): string => {
  const map: Record<string, string> = {
    'head_manager': 'Head / Manager',
    'ic': 'IC (Designer, Researcher, Writer)',
    'product_manager': 'Product Manager',
    'engineer': 'Engineer',
    'founder_ceo': 'Founder / CEO',
    'freelancer': 'Freelancer / Contractor',
    'other': 'Other'
  };
  return map[role] || role;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: FormData = await req.json();

    const emailBody = `
New Design Ladder Submission
=============================

Timestamp: ${new Date().toLocaleString()}

PROBLEM:
${formData.problem}

DESIRED OUTCOME:
${formData.desired_outcome}

FREQUENCY: ${formatFrequency(formData.frequency)}
TEAM SIZE: ${formData.team_size}
ROLE: ${formatRole(formData.role)}
COMPANY SIZE: ${formData.company_size}
BUDGET: ${formData.budget}
URGENCY: ${formData.urgency.replace(/_/g, ' ')}
EARLY TESTER: ${formData.early_tester ? 'Yes' : 'No'}

COMPANY NAME: ${formData.company_name}
EMAIL: ${formData.email}

=============================
    `.trim();

    console.log('New submission received:', emailBody);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification logged' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing notification:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});