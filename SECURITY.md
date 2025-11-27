# Security Documentation

## Overview

This document outlines the security measures implemented in the Design Ladder application and clarifies the security responsibilities when using Bolt's managed infrastructure.

## Authentication & Authorization

### Implementation
- **Authentication Provider**: Supabase Auth (Bolt-managed instance)
- **Authentication Method**: Email/Password
- **Session Management**: JWT-based sessions with automatic refresh
- **Admin Access Control**: Role-based access with `admin_users` table validation

### Admin Security
- Admins are verified against the `admin_users` table before accessing the dashboard
- Non-admin users are immediately signed out and rejected
- Admin sessions are managed securely with Supabase Auth

## Password Security

### Client-Side Protection (Application Layer)

The application implements comprehensive **client-side password validation**:

1. **Password Strength Requirements**:
   - Minimum 12 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
   - No common passwords or repetitive patterns

2. **Breach Detection**:
   - Integration with HaveIBeenPwned API (k-anonymity model)
   - Passwords are checked against known breaches without exposing the actual password
   - Uses SHA-1 hash prefix matching for privacy
   - Real-time validation during password entry

3. **Visual Feedback**:
   - Password strength indicator (Weak/Medium/Strong)
   - Real-time error messages for validation failures
   - Breach status notifications

### Server-Side Protection (Infrastructure Layer)

**IMPORTANT**: The following features are managed by **Bolt's Supabase infrastructure** and **cannot be configured by application developers**:

- **Leaked Password Protection**: Server-side breach detection via Supabase Auth
- **Rate Limiting**: Automatic protection against brute force attacks
- **Email Verification**: Controlled at infrastructure level
- **Password Policies**: Additional server-side enforcement

### What This Means

Since you're using **Bolt's managed Supabase instance** (`wrwxswqnpypfceguuryw.supabase.co`):

✅ **You CAN control**:
- Client-side password validation
- Application-level security policies
- User experience and feedback
- Additional breach checking (HaveIBeenPwned)

❌ **You CANNOT control**:
- Supabase Auth server-side settings
- Infrastructure-level security policies
- Database-level configurations requiring Supabase Dashboard access

**If you receive warnings about "Leaked Password Protection Disabled"**, this is a **Bolt infrastructure setting**, not something you can or should configure yourself.

## Database Security

### Row Level Security (RLS)

All database tables implement Row Level Security:

1. **form_submissions**:
   - Only authenticated users can read their own submissions
   - Admins can read all submissions

2. **admin_users**:
   - Only admins can read admin user records
   - Strict ownership validation

3. **analytics_events**:
   - Public write access for analytics tracking
   - Admin read access only

### Data Protection

- All database connections use HTTPS/SSL
- Supabase connection credentials are embedded securely
- No sensitive data exposed in client-side code
- Environment variables managed securely

## Network Security

### HTTPS/SSL
- ✅ All resources served over HTTPS
- ✅ Google Analytics: HTTPS
- ✅ Google Fonts: HTTPS
- ✅ Supabase API: HTTPS
- ✅ No mixed content warnings

### Content Security
- Badge scripts removed to prevent HTTP 400 errors
- All external resources whitelisted and verified
- No third-party tracking scripts beyond Google Analytics

## Security Best Practices Implemented

1. **Authentication**:
   - Secure session management
   - Automatic token refresh
   - Proper sign-out handling

2. **Passwords**:
   - Strong validation rules
   - Breach detection
   - No password storage in localStorage
   - Hashed passwords via Supabase Auth

3. **Data Access**:
   - RLS policies on all tables
   - Admin role verification
   - No direct database access from client

4. **API Security**:
   - Public anon key only for client-side
   - Service role key only for server-side operations
   - Proper separation of concerns

## Security Limitations

### Bolt Managed Infrastructure

When using Bolt's managed Supabase instance, certain security features are controlled at the infrastructure level:

- You **DO NOT** have access to the Supabase Dashboard
- You **CANNOT** modify Auth settings directly
- Server-side password policies are managed by Bolt
- Email verification settings are infrastructure-controlled

### Recommendations

1. **Implement robust client-side validation** (already done)
2. **Use strong passwords** for all admin accounts
3. **Monitor access logs** through your application
4. **Report security concerns** to Bolt support team
5. **Keep dependencies updated** regularly

## Incident Response

If you suspect a security issue:

1. **For Application Issues**: Review this security documentation
2. **For Infrastructure Issues**: Contact Bolt support
3. **For Supabase Auth Issues**: These are managed by Bolt infrastructure

## Compliance

- **GDPR**: User data collection with consent
- **Privacy**: No unnecessary data collection
- **Data Retention**: Controlled by your application logic
- **Encryption**: All data in transit encrypted (HTTPS/TLS)

## Audit Trail

Security measures implemented:
- ✅ Client-side password validation
- ✅ HaveIBeenPwned integration
- ✅ Password strength indicators
- ✅ RLS policies on all tables
- ✅ Admin role verification
- ✅ HTTPS for all resources
- ✅ Secure session management
- ✅ No mixed content warnings

Last Updated: 2025-11-23
