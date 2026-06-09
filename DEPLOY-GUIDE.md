# Deploy Guide

Two paths to production. Pick the one that fits the workflow.

---

## Option A — Vercel (recommended, free, native Next.js)

**Pros:** Built by the Next.js team. Free tier covers ~100K MAU. Auto-SSL. Auto-CDN. Zero ops. One-click GitHub integration. Best image optimization. Edge middleware support.

**Setup time:** 10 minutes end-to-end.

### Steps

1. **Push the project to GitHub** (private repo). Vercel deploys from a Git remote.
   ```bash
   cd foilcrafts-app
   git init  # if not done already
   git add . && git commit -m "Initial Next.js + Supabase build"
   gh repo create foilcrafts-app --private --source=. --push
   ```

2. **Sign up at https://vercel.com** with the same GitHub account.

3. **Vercel Dashboard → Add New → Project** → pick `foilcrafts-app` from the repo list → **Import**.

4. **Configure Environment Variables** (paste from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

5. **Deploy** → wait ~2 min → you'll get a URL like `https://foilcrafts-app.vercel.app`.

6. **Test the deploy** — open the URL, sign up, confirm email, get approved by admin, log into library.

### Custom domain (foilcrafts.com on Vercel)

7. Vercel Dashboard → your project → **Settings → Domains** → add `foilcrafts.com`.

8. Vercel shows DNS records to create. Add them at the domain registrar (WebCity India / OrderBox):
   - Either: **A record** `@ → 76.76.21.21` (Vercel's IP)
   - Or: **CNAME** `www → cname.vercel-dns.com` (if you keep www as primary)

9. Wait 5 min – 1 hour for DNS propagation. Vercel auto-issues a Let's Encrypt SSL.

10. **Update Supabase Auth → URL Configuration:**
    - Site URL: `https://foilcrafts.com`
    - Redirect URLs: `https://foilcrafts.com/auth/confirm`, `https://foilcrafts.com/reset-password`

11. **Cancel or downgrade Hostinger** (optional — Hostinger no longer hosting anything except maybe email). Keep email if you want — it's separate from web hosting.

### Cost
- Vercel: **$0/month** (free tier)
- Domain: ~₹100/month (or whatever WebCity charges)
- Email: keep on Hostinger (already paid) OR move to Cloudflare Email Routing (free)
- **Total: ~₹100/month** — way less than current Hostinger.

---

## Option B — Hostinger (Node.js app hosting)

**Pros:** Keep everything on the existing Hostinger account. One bill.

**Cons:** Hostinger's Node.js support is newer; ops experience varies. No edge optimizations. Slower middleware.

### Verify Node.js support
Open hPanel → check if "Node.js Application" or "Manage Node.js" appears in the sidebar.
- **If yes** → proceed with Option B.
- **If no** → upgrade to Hostinger Premium with Node.js OR fall back to Option A (Vercel).

### Steps

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Zip the project** (excluding `node_modules` and `.next/cache`):
   ```bash
   cd foilcrafts-app
   zip -r ../foilcrafts-nextjs.zip . \
     -x "node_modules/*" ".next/cache/*" ".git/*" ".env.local"
   ```

3. **In hPanel:** Hosting → manage `foilcrafts.com` → **Files → File Manager** → navigate to a Node.js app folder (e.g. `~/apps/foilcrafts-app/`).

4. **Upload + extract** the zip.

5. **hPanel → Node.js Application → Create application:**
   - Application root: `/apps/foilcrafts-app`
   - Application URL: `foilcrafts.com` (or a subdomain for staging)
   - Application startup file: `node_modules/next/dist/bin/next` with args `start -p $PORT`
   - Node.js version: **22.x** (matches dev)

6. **Add environment variables** (in the Node.js Application config):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

7. **Install dependencies** in the Node.js Application config: run `npm install --production`.

8. **Start the app** from the Node.js Application page.

9. **Update Supabase Auth → URL Configuration** as in Option A step 10.

### Cost
- Hostinger Premium (existing): **₹449/month** (already paying)
- **Total: ₹449/month** — same as now

---

## Going-live cutover plan (replacing the old WordPress site)

Before deploying the new site to `foilcrafts.com`:

1. **Take a Files Backup** in hPanel (1 click).
2. **Take a Database Backup** of the existing WordPress DB (1 click).
3. **Deploy the Next.js app** via Option A or B.
4. **Smoke test** the staging/preview URL fully (TEST-CHECKLIST.md).
5. **Cutover** — point the production domain at the new app.
6. **Monitor** for 24h. If anything breaks, restore from the backups in step 1-2.
7. **After 7 days** of clean operation, decommission the WordPress files / DB to free up disk space.

---

## Production environment variable checklist

| Variable | Where set | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env vars / Hostinger Node app config | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Same | ❌ Optional (not used in current build) |
| `NEXT_PUBLIC_SITE_URL` | Same | ⚠️ Recommended (used in email templates as fallback) |

---

## Where the protected files live in production

The PDFs in `/public/protected/catalogues/` are bundled into the deploy. They are NEVER directly accessible — only via the `/api/asset/[...path]` route which checks auth + status='approved' first.

If you ever want to add more protected files (e.g. a high-res image archive), drop them into `/public/protected/<folder>/...` and reference them as `/api/asset/<folder>/<filename>`.

---

## Rollback plan

**Vercel:** Vercel Dashboard → project → Deployments → click any previous deployment → "Promote to Production". 1-second rollback.

**Hostinger:** hPanel → restore from the backups taken before the cutover. ~5 minutes.

---

That's it. Pick A or B, follow the steps, and the site is live with real customer auth.
