/* Shared layout wrapper for /login, /signup, /forgot-password, /reset-password.
   Pure server component. The form inside is whatever you compose. */

import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  sub,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-card__eyebrow">{eyebrow}</div>
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {sub && <p className="auth-card__sub">{sub}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}
