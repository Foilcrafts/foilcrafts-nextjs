"use client";

// NavClient — handles all interactivity: scroll state, mobile drawer, keyboard.
// Receives user data from the server wrapper (Nav.tsx) as props.

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";

const NAV_ITEMS = [
  { href: "/", label: "Home", match: ["/"] },
  { href: "/about", label: "About", match: ["/about"] },
  { href: "/foiling", label: "Foiling", match: ["/foiling"] },
  { href: "/digital-printing", label: "Digital Printing", match: ["/digital-printing"] },
  { href: "/cut-plates-embossing", label: "Cut Plates and Embossing", match: ["/cut-plates-embossing"] },
  { href: "/catalogs", label: "Catalogs", match: ["/catalogs"] },
  { href: "/contact", label: "Contact", match: ["/contact"] },
];

interface NavClientProps {
  /** First name / display name if logged in, null if anonymous. */
  userName: string | null;
  /** True if the logged-in user has role='admin'. */
  isAdmin: boolean;
}

export function NavClient({ userName, isAdmin }: NavClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) document.body.classList.add("drawer-open");
    else document.body.classList.remove("drawer-open");
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Auto-close drawer when route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen((open) => (open ? false : open));
  }, [pathname]);

  // Close drawer on resize past 900px.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setDrawerOpen((open) => (open ? false : open));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navClass = `nav${isHome && !scrolled ? " hero-mode" : ""}${scrolled ? " scrolled" : ""}`;
  const loggedIn = userName !== null;

  return (
    <>
      <nav className={navClass} id="nav">
        <Link href="/" className="nav__logo" aria-label={content.brand.name}>
          <Image
            src={content.brand.logo.light}
            alt={content.brand.name}
            width={120}
            height={32}
            priority
            className="nav__logo-light"
            style={{ height: 32, width: "auto" }}
          />
          <Image
            src={content.brand.logo.primary}
            alt={content.brand.name}
            width={120}
            height={32}
            priority
            className="nav__logo-primary"
            style={{ height: 32, width: "auto" }}
          />
        </Link>

        <div className="nav__menu">
          {NAV_ITEMS.map((item) => {
            const active = item.match.some((m) =>
              m === "/" ? pathname === "/" : pathname.startsWith(m)
            );
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right-hand action buttons */}
        {loggedIn ? (
          <>
            {/* Logged-in user name indicator */}
            <Link href="/library" className="nav__user-name">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {userName}
            </Link>
            {/* Admin panel button — only for admins */}
            {isAdmin && (
              <Link href="/admin" className="nav__admin-btn" id="nav-admin-btn">
                Admin ↗
              </Link>
            )}
            <Link href="/contact" className="nav__cta">
              Inquire ↗
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="nav__login">
              Customer Login
            </Link>
            <Link href="/contact" className="nav__cta">
              Inquire ↗
            </Link>
          </>
        )}

        <button
          className={`nav__hamburger${drawerOpen ? " is-active" : ""}`}
          id="navHamburger"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="navDrawer"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`nav__drawer${drawerOpen ? " is-open" : ""}`}
        id="navDrawer"
        aria-hidden={!drawerOpen}
      >
        <div
          className="nav__drawer-backdrop"
          id="navDrawerBackdrop"
          onClick={() => setDrawerOpen(false)}
        />
        <aside className="nav__drawer-panel" role="dialog" aria-label="Site menu">
          <div className="nav__drawer-head">
            <Image
              src={content.brand.logo.primary}
              alt={content.brand.name}
              width={120}
              height={32}
              className="nav__drawer-logo"
              style={{ height: 32, width: "auto" }}
            />
            <button
              className="nav__drawer-close"
              id="navDrawerClose"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="nav__drawer-links">
            {NAV_ITEMS.map((item) => {
              const active = item.match.some((m) =>
                m === "/" ? pathname === "/" : pathname.startsWith(m)
              );
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "active" : ""}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="nav__drawer-cta-row">
            {loggedIn ? (
              <>
                <Link
                  href="/library"
                  className="nav__drawer-user-name"
                  onClick={() => setDrawerOpen(false)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  {userName}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="nav__drawer-login"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Admin panel
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="nav__drawer-cta"
                  onClick={() => setDrawerOpen(false)}
                >
                  Inquire ↗
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav__drawer-login"
                  onClick={() => setDrawerOpen(false)}
                >
                  Customer Login
                </Link>
                <Link
                  href="/contact"
                  className="nav__drawer-cta"
                  onClick={() => setDrawerOpen(false)}
                >
                  Inquire ↗
                </Link>
              </>
            )}
          </div>
          <div className="nav__drawer-foot">
            <div className="nav__drawer-meta">{content.brand.address_line}</div>
            <div className="nav__drawer-meta">
              {content.brand.name} · {content.brand.tagline}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
