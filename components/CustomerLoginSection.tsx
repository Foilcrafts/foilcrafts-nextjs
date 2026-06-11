"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signUp, signIn, type AuthState } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { content } from "@/lib/content";

const INITIAL: AuthState = {};

export function CustomerLoginSection() {
  const [signupState, signupAction, isSignupPending] = useActionState(
    signUp,
    INITIAL
  );

  const [loginState, loginFormAction, isLoginPending] = useActionState(
    signIn,
    INITIAL
  );

  const [activeTab, setActiveTab] = useState<"request" | "login">("request");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      }
    });

    // Check URL hash to activate the login tab if requested
    if (typeof window !== "undefined" && (window.location.hash === "#customer-login" || window.location.hash === "#trade-login")) {
      setActiveTab("login");
    }
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const bgImage = "/images/foiling/ft-metallic/Compressed/FC-1063.jpg";

  const renderTabHeader = () => (
    <div className="cl-tab-header">
      <button
        type="button"
        className={`cl-tab-btn ${activeTab === "request" ? "active" : ""}`}
        onClick={() => setActiveTab("request")}
      >
        Request Access
      </button>
      <button
        type="button"
        className={`cl-tab-btn ${activeTab === "login" ? "active" : ""}`}
        onClick={() => setActiveTab("login")}
      >
        Trade Login
      </button>
    </div>
  );

  return (
    <section id="customer-login" className="cl-section">
      <div className="cl-grid">
        {!user && activeTab === "login" ? (
          <form className="cl-form" action={loginFormAction}>
            {renderTabHeader()}
            <div className="cl-form-head">
              <h2>Trade login</h2>
              <p>Enter the credentials shared with you upon approval.</p>
            </div>

            {loginState?.error && (
              <div
                role="alert"
                style={{
                  background: "rgba(92,26,27,.06)",
                  border: "1px solid var(--oxblood)",
                  padding: "14px 18px",
                  borderRadius: 2,
                  marginBottom: 24,
                  color: "var(--oxblood)",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                }}
              >
                {loginState.error}
              </div>
            )}

            <div className="cl-field">
              <label htmlFor="login-email">
                Email ID <span className="req">*</span>
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <div className="cl-field">
              <label htmlFor="login-password">
                Password <span className="req">*</span>
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="cl-submit" disabled={isLoginPending}>
              {isLoginPending ? "Signing in..." : "Sign in"}
            </button>

            <div style={{ marginTop: 18, textAlign: "center", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".15em" }}>
              <Link href="/forgot-password" style={{ color: "var(--ash)", textDecoration: "underline" }}>
                Forgot your password?
              </Link>
            </div>

            <p className="cl-fineprint">
              Accounts are approved after trade verification by {content.brand.name}.
            </p>
          </form>
        ) : (
          <form className="cl-form" action={user ? undefined : signupAction}>
            {!user && renderTabHeader()}
            <div className="cl-form-head">
              <h2>Request access</h2>
              <p>Trade enquiries only. Fields marked are required.</p>
            </div>

            {signupState.message && (
              <div
                role="status"
                style={{
                  background: "rgba(200,168,120,.12)",
                  border: "1px solid var(--gold)",
                  padding: "16px 20px",
                  borderRadius: 2,
                  marginBottom: 24,
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--ink)",
                }}
              >
                {signupState.message}
              </div>
            )}
            {signupState.error && (
              <div
                role="alert"
                style={{
                  background: "rgba(92,26,27,.06)",
                  border: "1px solid var(--oxblood)",
                  padding: "14px 18px",
                  borderRadius: 2,
                  marginBottom: 24,
                  color: "var(--oxblood)",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                }}
              >
                {signupState.error}
              </div>
            )}

            <div className="cl-field">
              <label htmlFor="cl-name">
                Name <span className="req">*</span>
              </label>
              <input
                id="cl-name"
                name="name"
                type="text"
                required={!user}
                placeholder={profile?.full_name ?? user?.user_metadata?.full_name ?? ""}
                autoComplete="name"
              />
            </div>
            <div className="cl-field">
              <label htmlFor="cl-company">
                Company name <span className="req">*</span>
              </label>
              <input
                id="cl-company"
                name="company"
                type="text"
                required={!user}
                placeholder={profile?.company ?? user?.user_metadata?.company ?? ""}
                autoComplete="organization"
              />
            </div>
            <div className="cl-field">
              <label htmlFor="cl-phone">
                Phone number <span className="req">*</span>
              </label>
              <input
                id="cl-phone"
                name="phone"
                type="tel"
                required={!user}
                placeholder={profile?.phone ?? user?.user_metadata?.phone ?? ""}
                autoComplete="tel"
              />
            </div>
            <div className="cl-field">
              <label htmlFor="cl-email">
                Email ID <span className="req">*</span>
              </label>
              <input
                id="cl-email"
                name="email"
                type="email"
                required={!user}
                placeholder={profile?.email ?? user?.email ?? ""}
                autoComplete="email"
              />
            </div>
            {!user && (
              <div className="cl-field">
                <label htmlFor="cl-password">
                  Password <span className="req">*</span>{" "}
                  <span style={{ opacity: 0.5 }}>(min 8 characters)</span>
                </label>
                <input
                  id="cl-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            )}

            {user ? (
              <button type="button" className="cl-submit" onClick={handleSignOut}>
                Sign out
              </button>
            ) : (
              <button type="submit" className="cl-submit" disabled={isSignupPending}>
                {isSignupPending ? "Creating account..." : "Request access"}
              </button>
            )}

            {!user && (
              <p className="cl-fineprint">
                By requesting, you agree your details will be reviewed by{" "}
                {content.brand.name} for trade verification. Already approved?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  style={{ textDecoration: "underline", color: "inherit", cursor: "pointer", border: "none", background: "none", font: "inherit", padding: 0 }}
                >
                  Sign in here →
                </button>
              </p>
            )}
          </form>
        )}

        <div className="cl-card">
          <div
            className="cl-card__bg"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {user ? (
            <div className="cl-card__inner">
              <div className="cl-lock" style={{ fontSize: 38 }}>✦</div>
              <h3>Library unlocked</h3>
              <p>
                Welcome back, {profile?.company || user?.user_metadata?.company || "Trade Partner"}. You have full access to all collections, digital prints, and cut plate catalogues.
              </p>
              <Link href="/library" className="cl-card__cta">
                Go to the library →
              </Link>
            </div>
          ) : (
            <div className="cl-card__inner">
              <div className="cl-lock">🔒</div>
              <h3>The full library is locked</h3>
              <p>
                Foiling (all 14 families), Digital Printing and the complete Cut
                Plates 2025 catalogue — in high resolution, with article numbers
                and ordering — unlock after approval.
              </p>
              <Link href="/login" className="cl-card__cta">
                Preview the library →
              </Link>
              <span className="cl-card__approval">
                Approved by Foil Crafts · trade partners only
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
