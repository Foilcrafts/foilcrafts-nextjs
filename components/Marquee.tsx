export function Marquee({ items }: { items: readonly string[] }) {
  return (
    <div className="marquee">
      <div className="marquee__track">
        {items.map((x, i) => (
          <span key={`a-${i}`} className="marquee__item">
            {x}
          </span>
        ))}
        {items.map((x, i) => (
          <span key={`b-${i}`} className="marquee__item">
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
