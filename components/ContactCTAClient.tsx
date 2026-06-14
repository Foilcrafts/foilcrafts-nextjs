"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface ContactCTAClientProps {
  headline: string;
  action: string;
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function ContactCTAClient({
  headline,
  action,
  secondaryAction,
}: ContactCTAClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoggedIn) {
    return (
      <>
        <h2 dangerouslySetInnerHTML={{ __html: "Visit the<br><em>material library.</em>" }} />
        <div>
          <Link
            href="/library"
            className="cta__secondary"
            style={{ marginLeft: 0 }}
          >
            Visit the library
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 dangerouslySetInnerHTML={{ __html: headline }} />
      <div>
        <Link href="/contact" className="cta__action">
          {action}
        </Link>
        {secondaryAction && (
          <Link href={secondaryAction.href} className="cta__secondary">
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </>
  );
}
