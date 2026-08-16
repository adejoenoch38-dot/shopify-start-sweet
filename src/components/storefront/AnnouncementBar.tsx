import { useEffect, useState } from "react";
import { Truck, ShieldCheck, RotateCcw, Zap } from "lucide-react";
import { Countdown } from "./Countdown";
import { dealCountdownTarget } from "@/lib/social-proof";

const MESSAGES = [
  { icon: Truck, text: "Free shipping on orders over $29" },
  { icon: RotateCcw, text: "Free returns within 30 days" },
  { icon: ShieldCheck, text: "Secure checkout · Buyer protection" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [target] = useState(() => dealCountdownTarget());

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const Msg = MESSAGES[i] ?? MESSAGES[0]!;
  const Icon = Msg.icon;

  return (
    <div className="bg-ink text-background">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-3 px-4 text-xs font-medium sm:justify-between sm:px-6">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {Msg.text}
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <Zap className="h-3.5 w-3.5 text-primary" />
          Today&apos;s deals end in
          <Countdown target={target} className="flex items-center text-[11px] font-bold" />
        </span>
      </div>
    </div>
  );
}