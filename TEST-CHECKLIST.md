# Test Checklist

Run this after every deploy. Test on desktop + mobile.

---

## A. Marketing pages (public — no auth needed)

- [ ] `/` — Home renders, hero slider auto-advances + manual dots/arrows work
- [ ] `/about` — About page hero + two text/image blocks + Process grid + Founders + Heritage stats
- [ ] `/foiling` — 14 family cards in grid; click one → drill-down modal opens with items
- [ ] `/digital-printing` — 10 print images in uniform grid
- [ ] `/cut-plates-embossing` — 9 plate images in uniform grid
- [ ] `/catalogs` — "Explore our catalogs." + 2 catalog cards visible; covers display fully (not cropped)
- [ ] `/contact` — Page hero + CTA + Customer Login section (form + locked-library teaser)
- [ ] Footer renders on every page with the correct B-37 Sector 57 Noida address
- [ ] All navigation links work (Home, About, Foiling, Digital Printing, Cut Plates and Embossing, Catalogs, Contact)
- [ ] Hamburger menu opens drawer on mobile (≤900px); all 7 links + Customer Login + Inquire visible
- [ ] No console errors on any page

## B. Anonymous user — auth gating

- [ ] Visit `/library` directly → redirected to `/login?next=/library`
- [ ] Visit `/admin` directly → redirected to `/login`
- [ ] Visit `/pending-approval` directly → redirected to `/login`
- [ ] Visit `/api/asset/catalogues/foil-crafts-catalog-26.pdf` directly → 401 or redirect (NOT the PDF)

## C. Signup flow

- [ ] Go to `/signup`
- [ ] Submit empty form → see error "Email and password are required"
- [ ] Submit with password length 5 → see error "Password must be at least 8 characters"
- [ ] Submit with invalid email → see error "valid email address"
- [ ] Submit with valid data → see success message + email sent
- [ ] Confirmation email arrives in inbox (check spam too)
- [ ] Click email confirmation link → redirected to `/pending-approval`
- [ ] `/pending-approval` shows the user's name + email + "under review" message
- [ ] Click "Sign out" on `/pending-approval` → redirected to `/`

## D. Login flow (pending user)

- [ ] Go to `/login`
- [ ] Submit wrong password → see "Incorrect email or password"
- [ ] Submit correct credentials → redirected to `/library`
- [ ] But because user is still 'pending' → middleware redirects them to `/pending-approval`
- [ ] No way to access `/library` while pending

## E. Admin approval flow

- [ ] As an unapproved test user, sign in.
- [ ] Open another browser as the admin.
- [ ] Go to `/admin` as admin.
- [ ] See the test user listed under "Pending" tab.
- [ ] Click **Approve** on the test user.
- [ ] Test user's row updates: shows "Approved" badge.
- [ ] Switch to test user's browser, refresh `/pending-approval` (or sign out and back in).
- [ ] Test user is now redirected to `/library` (their status is approved).

## F. Library access (approved user)

- [ ] `/library` shows welcome with the user's name + company
- [ ] Catalog cards visible — both Collection 26 and Collection 26/27
- [ ] Click a catalog card → PDF downloads (or opens in browser PDF viewer)
- [ ] PDF is the real catalog content (not a Next.js 404 / error page)
- [ ] Full Archive section shows the 3 capability cards linking to /foiling, /digital-printing, /cut-plates-embossing
- [ ] "Sign out" button at bottom works → returns to `/`

## G. Password reset flow

- [ ] Go to `/forgot-password`
- [ ] Enter test email → see "reset link has been sent" message
- [ ] Email arrives with reset link
- [ ] Click reset link → opens `/reset-password`
- [ ] Submit new password (mismatched confirm) → see error
- [ ] Submit matching new password (≥8 chars) → redirected to `/library`
- [ ] Old password no longer works on `/login`
- [ ] New password works

## H. Admin reject + revoke flows

- [ ] Sign up a second test user, confirm email.
- [ ] As admin at `/admin`, click **Reject** on the new pending user.
- [ ] User's row moves to "Rejected" tab, shows "Rejected" badge.
- [ ] Test user tries to sign in → goes to `/pending-approval` (status is still gated — rejected ≠ approved).
- [ ] Admin clicks **Approve** on the rejected user (the button is still there) → user is now approved.
- [ ] As admin, click **Revoke** on an approved user → user moves back to Pending.

## I. Access-request form (public, no auth)

- [ ] As anonymous user, go to `/contact`
- [ ] Scroll to "Request access" section
- [ ] Submit empty form → see "All fields are required"
- [ ] Submit invalid email → see "valid email address"
- [ ] Submit valid form → see success message
- [ ] As admin, check Supabase `access_requests` table (Dashboard → Table Editor) → row exists

## J. Middleware edge cases

- [ ] Logged in as approved user, visit `/login` → redirected to `/library` (already authed)
- [ ] Logged in as approved user, visit `/signup` → redirected to `/library`
- [ ] Logged in as pending user, visit `/login` → redirected to `/pending-approval`
- [ ] Logged in as approved user, visit `/admin` (without admin role) → redirected to `/`
- [ ] Logged in as approved user, visit `/api/asset/catalogues/foil-crafts-catalog-26.pdf` → PDF served
- [ ] Logged in as PENDING user, visit `/api/asset/...` → 403 (the API route's own check)

## K. Path-traversal safety

- [ ] As approved user, visit `/api/asset/../app/page.tsx` → 400 Bad Request
- [ ] As approved user, visit `/api/asset/../../etc/passwd` → 400 or 404
- [ ] As approved user, visit `/api/asset/catalogues/test.exe` → 403 (extension not allowed)

## L. Mobile (≤900px)

Repeat sections A–H on a real phone OR Chrome devtools at 390×844 viewport.
- [ ] Hamburger menu icon visible top-right on every page
- [ ] Drawer slides in from right, all links visible
- [ ] Forms (signup, login, contact) have 48px+ tall inputs
- [ ] iOS doesn't auto-zoom on input focus (inputs are 16px font)
- [ ] PDF download works from mobile

## M. Cross-browser smoke

- [ ] Chrome (desktop + Android)
- [ ] Safari (desktop + iOS)
- [ ] Firefox
- [ ] Samsung Internet (common in India)

---

## Pass/fail tracking

Date of test: ___________  Tester: ___________

- A. Marketing: ___ / 11
- B. Anonymous gating: ___ / 4
- C. Signup: ___ / 7
- D. Login: ___ / 4
- E. Admin approve: ___ / 7
- F. Library: ___ / 5
- G. Reset password: ___ / 7
- H. Admin reject/revoke: ___ / 6
- I. Access-request form: ___ / 6
- J. Middleware edges: ___ / 7
- K. Path traversal: ___ / 3
- L. Mobile: ___ / 6
- M. Cross-browser: ___ / 4

If anything fails → check `troubleshooting` in `supabase/SUPABASE-SETUP.md`.
