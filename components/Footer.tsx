import Link from "next/link";
import Image from "next/image";
import { content } from "@/lib/content";

function getFooterHref(item: string): string {
  switch (item.trim().toLowerCase()) {
    // Foiling Families
    case "ft metallic":
    case "animal prints":
    case "abstract":
    case "holographic":
    case "crackles":
    case "florals":
    case "acid foils":
    case "distress":
    case "hand painted":
    case "small prints":
    case "stripes":
    case "tie & dye":
    case "transparent patents":
    case "wrinkled":
      return "/foiling";

    // Other Crafts
    case "cut plates & embossing":
      return "/cut-plates-embossing";
    case "digital printing":
      return "/digital-printing";
    case "finished leather":
      return "/foiling";
    case "bespoke production":
      return "/contact";

    // Studio
    case "capabilities":
      return "/#capabilities";
    case "about":
      return "/about";
    case "process grid":
      return "/about#process";
    case "founders":
      return "/about#founders";
    case "heritage":
      return "/about#heritage";
    case "catalogs":
      return "/catalogs";
    case "customer login":
      return "/contact#customer-login";

    // Contact
    case "info@foilcrafts.com":
      return "mailto:info@foilcrafts.com";
    case "+91 9899 71 9197":
      return "tel:+919899719197";
    case "instagram":
      return "https://www.instagram.com/foilcrafts?utm_source=qr&igsh=MWVocHA4MjUyZjB6cg%3D%3D";
    case "linkedin":
      return "https://www.linkedin.com/company/foil-crafts/";
    case "b-37, sector 57, noida":
      return "https://maps.google.com/?q=B-37,+Sector+57,+Noida";

    default:
      return "#";
  }
}

export function Footer() {
  const f = content.footer;
  return (
    <footer>
      <div className="footer-grid">
        <div className="brand">
          <Image
            src={content.brand.logo.light ?? content.brand.logo.primary}
            alt={content.brand.name}
            width={140}
            height={56}
            style={{ height: 56, width: "auto", marginBottom: 18 }}
          />
          <p>{f.brand_text}</p>
        </div>
        {f.columns.map((col, i) => (
          <div key={i}>
            <h4>{col.heading}</h4>
            <ul>
              {col.items.map((li, j) => {
                const href = getFooterHref(li);
                const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

                return (
                  <li key={j}>
                    {isExternal ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {li}
                      </a>
                    ) : (
                      <Link href={href}>
                        {li}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>{f.copyright}</span>
        <span>{f.tagline}</span>
        <span>{f.version ?? "Site v1.0"}</span>
      </div>
    </footer>
  );
}

