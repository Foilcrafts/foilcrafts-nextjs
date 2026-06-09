import Image from "next/image";
import { content } from "@/lib/content";

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
              {col.items.map((li, j) => (
                <li key={j}>
                  <a>{li}</a>
                </li>
              ))}
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
