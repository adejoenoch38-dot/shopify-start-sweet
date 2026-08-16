import { useEffect, useState } from "react";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function Countdown({ target, className }: { target: number; className?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  return (
    <span className={className}>
      {[pad(h), pad(m), pad(s)].map((part, i) => (
        <span key={i} className="inline-flex items-center">
          {i > 0 && <span className="px-0.5 opacity-70">:</span>}
          <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-background tabular-nums">
            {part}
          </span>
        </span>
      ))}
    </span>
  );
}