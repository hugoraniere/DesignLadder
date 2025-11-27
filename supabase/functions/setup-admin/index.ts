import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const adminEmail = 'hugo.raniere@gmail.com';
    const adminPassword = 'Silva9595!n';

    let userId: string;

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail);

    if (existingUser) {
      userId = existingUser.id;
      console.log('Admin user already exists:', userId);
    } else {
      const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });

      if (signUpError) {
        throw signUpError;
      }

      userId = authData.user.id;
      console.log('Created new admin user:', userId);
    }

    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert([{ id: userId, email: adminEmail, password_hash: 'managed_by_auth' }])
      .select()
      .maybeSingle();

    if (insertError && !insertError.message.includes('duplicate')) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user setup complete',
        userId 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error setting up admin:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
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