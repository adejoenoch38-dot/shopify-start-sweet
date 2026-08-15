import { Link } from "@tanstack/react-router";
import { Flame, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { STORE_NAME } from "@/lib/shopify";

const COLS = [
  { title: "Best Sellers", handle: "best-sellers" },
  { title: "Trending Deals", handle: "trending-deals" },
  { title: "Clothing", handle: "clothing" },
  { title: "Jewelry", handle: "jewelry" },
  { title: "Toys", handle: "toys" },
  { title: "Electronics", handle: "electronics" },
];

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 border-b border-border pb-8 sm:grid-cols-3">
          <Feature icon={<Truck className="h-5 w-5 text-primary" />} title="Free shipping" desc="On qualifying orders" />
          <Feature icon={<RefreshCw className="h-5 w-5 text-primary" />} title="Easy returns" desc="Hassle-free refunds" />
          <Feature icon={<ShieldCheck className="h-5 w-5 text-primary" />} title="Secure checkout" desc="Powered by Shopify" />
        </div>

        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background">
                <Flame className="h-5 w-5 text-primary" />
              </span>
              <span className="font-display text-lg font-extrabold text-ink">{STORE_NAME}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Trending deals and everyday best sellers, shipped to your door.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Shop</h4>
            <ul className="mt-3 space-y-2">
              {COLS.map((c) => (
                <li key={c.handle}>
                  <Link
                    to="/"
                    search={{ collection: c.handle }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Shipping & Delivery</li>
              <li>Returns & Refunds</li>
              <li>Track Your Order</li>
              <li>Contact Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Stay in the loop</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Get the best deals first. Secure checkout powered by Shopify.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
