import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const adminEmail = 'hugo.raniere@gmail.com';
const adminPassword = 'Silva9595!n';

function validateAdminPassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains common words or patterns');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function setupAdmin() {
  const validation = validateAdminPassword(adminPassword);

  if (!validation.isValid) {
    console.error('❌ Admin password does not meet security requirements:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease update the adminPassword in this script with a stronger password.');
    process.exit(1);
  }

  console.log('✓ Password meets security requirements');
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('Admin user already exists');
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const adminUser = users.find(u => u.email === adminEmail);

        if (adminUser) {
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert([{ id: adminUser.id, email: adminEmail, password_hash: 'managed_by_auth' }])
            .select()
            .maybeSingle();

          if (insertError && !insertError.message.includes('duplicate')) {
            throw insertError;
          }

          console.log('Admin user linked to admin_users table');
        }
      } else {
        throw signUpError;
      }
    } else if (authData.user) {
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ id: authData.user.id, email: adminEmail, password_hash: 'managed_by_auth' }]);

      if (insertError) {
        throw insertError;
      }

      console.log('Admin user created successfully');
      console.log('Email:', adminEmail);
      console.log('User ID:', authData.user.id);
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
