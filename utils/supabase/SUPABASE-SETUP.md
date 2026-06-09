# Supabase Setup Guide

Step-by-step setup for the Foil Crafts auth + access-control backend. Total time: **~20 minutes**.

---

## 1. Create the Supabase project (3 min)

1. Go to https://supabase.com → sign in (or create an account).
2. Click **New project**.
3. Fill in:
   - **Name:** `foilcrafts-prod` (or whatever)
   - **Database password:** generate a strong one, save it in a password manager
   - **Region:** `Mumbai (ap-south-1)` — closest to Foil Crafts users in India
   - **Plan:** Free is enough for 50,000 monthly active users
4. Click **Create new project**. Wait ~2 min for provisioning.

---

## 2. Run the schema (2 min)

1. In your new Supabase project → left sidebar → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo.
3. Copy the entire file's contents into the SQL Editor.
4. Click **Run**.
5. You should see "Success. No rows returned." Verify by clicking **Table Editor** in the sidebar — `profiles` and `access_requests` tables should be there.

---

## 3. Configure Auth settings (3 min)

1. Left sidebar → **Authentication** → **Providers**.
2. Make sure **Email** is enabled (it is by default).
3. Optional: enable **Confirm email** (recommended for production — adds an email-confirmation step to signup).
4. Left sidebar → **Authentication** → **URL Configuration**.
5. Set the following:
   - **Site URL:** `https://foilcrafts.com` (or the staging URL for now)
   - **Redirect URLs:** add both
     - `https://foilcrafts.com/auth/confirm`
     - `https://foilcrafts.com/reset-password`
     - Plus your local dev URL: `http://localhost:3000/auth/confirm` and `http://localhost:3000/reset-password`

---

## 4. Customize email templates (5 min — optional but recommended)

Supabase sends transactional emails. The defaults work, but custom branded templates feel professional.

1. Left sidebar → **Authentication** → **Email Templates**.
2. Three templates to customize:
   - **Confirm signup** (sent after user signs up)
   - **Reset password** (sent when user requests password reset)
   - **Magic link** (not used by us, can skip)

### Suggested copy

**Confirm signup:**
```
Subject: Confirm your Foil Crafts access request

Hi {{ .Email }},

Thanks for requesting access to the Foil Crafts trade library.

Please confirm this email address by clicking the link below:
{{ .ConfirmationURL }}

Once confirmed, our team will review your request within one business day and email you when access is granted.

— The Foil Crafts team
www.foilcrafts.com · B-37, Sector 57, Noida
```

**Reset password:**
```
Subject: Reset your Foil Crafts password

Hi,

A password reset was requested for {{ .Email }}.

Click here to set a new password:
{{ .ConfirmationURL }}

If you didn't request this, you can safely ignore this email.

— The Foil Crafts team
```

---

## 5. (Optional) Custom SMTP — send from info@foilcrafts.com (5 min)

Supabase's default email sender is rate-limited (4 emails/hour in free tier). For production, configure custom SMTP so emails come from Foil Crafts directly.

1. Left sidebar → **Project Settings** → **Auth** → scroll to **SMTP Settings**.
2. Toggle **Enable Custom SMTP**.
3. Fill in (these are Hostinger Email SMTP settings — adjust if email is hosted elsewhere):
   - **Host:** `smtp.hostinger.com`
   - **Port:** `465`
   - **Username:** `info@foilcrafts.com`
   - **Password:** the email account password from hPanel
   - **Sender name:** `Foil Crafts`
   - **Sender email:** `info@foilcrafts.com`
4. Click **Save**.
5. Test by triggering a password reset on your dev site.

---

## 6. Grab your API keys (1 min)

1. Left sidebar → **Project Settings** → **API**.
2. Copy these two values:
   - **Project URL** (e.g. `https://xyzabc.supabase.co`)
   - **Publishable key** (under "API keys" — also called the anon key)
3. Open `.env.local` in the project root and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=ey...
   ```
4. Save.

For production: set these as environment variables in your hosting platform (Vercel: Project Settings → Environment Variables; Hostinger: in the Node app config).

---

## 7. Make the first admin user (3 min)

The admin user can approve / reject signups via `/admin`. To create one:

1. Run the dev server (`npm run dev`) or visit your deployed site.
2. Go to `/signup` and create an account with the admin's real email (e.g. `gaurav@foilcrafts.com`).
3. Confirm the email (check inbox, click the link).
4. In Supabase → **SQL Editor** → run:
   ```sql
   update public.profiles
   set role = 'admin', status = 'approved'
   where email = 'gaurav@foilcrafts.com';
   ```
5. The admin can now sign in at `/login` and will be redirected to `/library` (because their status is approved). They can navigate to `/admin` to see the approval queue.

---

## 8. Test the full flow (2 min)

1. Open a private/incognito browser window.
2. Go to `/signup` and create a test account (any email).
3. Confirm via the email link.
4. You should be sent to `/pending-approval` (because status is 'pending').
5. In another browser (or normal window), sign in as the admin and go to `/admin`.
6. You should see the pending account → click **Approve**.
7. Back in the test browser, refresh → you should be sent to `/library` with full access.
8. Try clicking a catalog PDF download → it should stream successfully.
9. Sign out of the test account.
10. Try visiting `/library` directly in incognito → should redirect to `/login`.

All flows verified. Ship it. 🚀

---

## Troubleshooting

**"Invalid login credentials" on every login**
- The user's email isn't confirmed. They need to click the confirmation link first.
- Or: in Supabase → Authentication → Settings, disable "Confirm email" if you want signup to work without confirmation.

**Welcome emails aren't arriving**
- Check the Supabase rate limit (4/hour on default SMTP). Configure custom SMTP (Step 5).
- Check the user's spam folder.
- Verify the redirect URL in Auth → URL Configuration matches your deploy.

**`/admin` redirects to /**
- The signed-in user doesn't have `role='admin'` in profiles. Run the SQL update from Step 7.

**PDF downloads return 401 even when logged in**
- The signed-in user's status isn't 'approved'. Admin must approve them first.

**The site goes blank after signing in**
- Open browser devtools → Console. Likely a Supabase env var typo. Verify `.env.local`.

**RLS errors on profile update**
- The `profiles` table RLS policies allow users to update their own profile but NOT change status or role. That's intentional — only admins can change those. If the user tries to update their own status, the policy will reject it.
