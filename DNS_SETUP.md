# DNS Configuration for Admin Subdomain

## Overview

The Design Ladder application is now configured to use a subdomain for the admin panel:

- **Main Site**: `https://designladder.site` - Landing page and form
- **Admin Panel**: `https://admin.designladder.site` - Admin login and dashboard

## DNS Configuration Required

To enable the admin subdomain, you need to add a DNS record in your domain registrar's control panel.

### Step-by-Step Instructions

1. **Log into your domain registrar** (where you purchased `designladder.site`)

2. **Navigate to DNS settings** (might be called "DNS Management", "DNS Records", or "Advanced DNS")

3. **Add a new CNAME record** with these values:

   ```
   Type:  CNAME
   Name:  admin
   Value: designladder.site
   TTL:   Automatic (or 3600)
   ```

   OR if your registrar requires the full domain:

   ```
   Type:  CNAME
   Name:  admin.designladder.site
   Value: designladder.site
   TTL:   Automatic (or 3600)
   ```

4. **Save the DNS record**

5. **Wait for DNS propagation** (usually 5-15 minutes, can take up to 48 hours)

### Netlify Configuration

If you're using Netlify, you also need to:

1. Log into your Netlify dashboard
2. Go to your site settings
3. Navigate to **Domain Management** > **Custom domains**
4. Click **Add domain alias**
5. Enter: `admin.designladder.site`
6. Click **Verify** and **Add domain**

Netlify will automatically provision an SSL certificate for the subdomain.

### Verification

Once DNS has propagated, verify the setup:

- Visit `https://designladder.site` - Should show landing page
- Visit `https://admin.designladder.site` - Should show admin login

### How It Works

The application checks the hostname on load:

```typescript
const hostname = window.location.hostname;
const isAdmin = hostname.startsWith('admin.');
```

- If hostname starts with `admin.`, it loads the admin interface
- Otherwise, it loads the public landing page and form
- No authentication check occurs on the main domain
- Authentication only happens on the admin subdomain

### Security Notes

- Admin authentication only runs on `admin.designladder.site`
- Public visitors to `designladder.site` won't trigger admin checks
- Both domains use the same SSL certificate (via Netlify)
- All traffic is HTTPS-only with HSTS enabled

### Troubleshooting

**Subdomain not working after DNS setup:**
- Check DNS propagation: `nslookup admin.designladder.site`
- Verify Netlify domain alias is added
- Clear browser cache and try incognito mode
- Wait longer (DNS can take up to 48 hours)

**Admin panel still showing on main domain:**
- Clear browser cache
- Check if you're already logged in (clear cookies)
- Verify the latest build is deployed

**SSL certificate issues:**
- Netlify auto-provisions SSL certificates
- Can take 5-10 minutes after domain is added
- Check Netlify dashboard > Domain settings > HTTPS

### Alternative Setup (A Record)

If you prefer using an A record instead of CNAME:

1. Get your Netlify site's IP address from Netlify dashboard
2. Add an A record:
   ```
   Type:  A
   Name:  admin
   Value: [Netlify IP address]
   TTL:   Automatic
   ```

Note: CNAME is recommended as it automatically follows if Netlify changes IPs.
