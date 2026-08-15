import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { fetchCollections, STORE_NAME, type ShopifyCollection } from "@/lib/shopify";

const FALLBACK_COLLECTIONS: ShopifyCollection[] = [
  { node: { title: "Best Sellers", handle: "best-sellers" } },
  { node: { title: "Trending Deals", handle: "trending-deals" } },
  { node: { title: "Clothing", handle: "clothing" } },
  { node: { title: "Jewelry", handle: "jewelry" } },
  { node: { title: "Toys", handle: "toys" } },
  { node: { title: "Electronics", handle: "electronics" } },
  { node: { title: "Pet Supplies", handle: "pet-supplies" } },
  { node: { title: "Health & Beauty", handle: "health-beauty" } },
];

export function StoreHeader() {
  const [collections, setCollections] = useState<ShopifyCollection[]>(FALLBACK_COLLECTIONS);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchCollections()
      .then((cols) => {
        if (cols && cols.length > 0) setCollections(cols);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label={STORE_NAME}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background">
            <Flame className="h-5 w-5 text-primary" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            {STORE_NAME}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Collections">
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            All
          </Link>
          {collections.slice(0, 8).map((c) => (
            <Link
              key={c.node.handle}
              to="/"
              search={{ collection: c.node.handle }}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              {c.node.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <CartDrawer />
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background lg:hidden" aria-label="Collections mobile">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent"
            >
              All Products
            </Link>
            {collections.map((c) => (
              <Link
                key={c.node.handle}
                to="/"
                search={{ collection: c.node.handle }}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent"
              >
                {c.node.title}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
