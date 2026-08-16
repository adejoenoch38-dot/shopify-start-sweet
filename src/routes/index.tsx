import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgePercent,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SearchBar } from "@/components/storefront/SearchBar";
import { Countdown } from "@/components/storefront/Countdown";
import { dealCountdownTarget } from "@/lib/social-proof";
import {
  fetchProducts,
  fetchCollectionProducts,
  fetchCollections,
  STORE_NAME,
  type ShopifyProduct,
  type ShopifyCollection,
} from "@/lib/shopify";

export const Route = createFileRoute("/")({
  validateSearch: (search) =>
    z.object({ collection: z.string().optional(), q: z.string().optional() }).parse(search),
  head: () => ({
    meta: [
      { title: `${STORE_NAME} — Trending Deals & Best Sellers` },
      {
        name: "description",
        content:
          "Shop trending deals and everyday best sellers across clothing, jewelry, toys, electronics and more. Secure checkout powered by Shopify.",
      },
      { property: "og:title", content: `${STORE_NAME} — Trending Deals & Best Sellers` },
      {
        property: "og:description",
        content: "Shop trending deals and everyday best sellers. Secure checkout powered by Shopify.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { collection, q } = Route.useSearch();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [cols, setCols] = useState<ShopifyCollection[]>([]);
  const [dealTarget] = useState(() => dealCountdownTarget());

  useEffect(() => {
    fetchCollections()
      .then((c) => {
        if (c && c.length) setCols(c);
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async (col: string | undefined, term: string | undefined) => {
    setLoading(true);
    setProducts([]);
    setCursor(null);
    setHasNext(false);
    try {
      const data = term
        ? await fetchProducts(48, `title:*${term}* OR product_type:*${term}* OR tag:*${term}*`)
        : col
          ? await fetchCollectionProducts(col, 24)
          : await fetchProducts(24);
      const edges = data?.edges ?? [];
      const filtered = term
        ? edges.filter((e: ShopifyProduct) =>
            e.node.title.toLowerCase().includes(term.toLowerCase()),
          )
        : edges;
      setProducts(filtered.length > 0 ? filtered : edges);
      setHasNext(Boolean(data?.pageInfo?.hasNextPage));
      setCursor(data?.pageInfo?.endCursor ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(collection, q);
  }, [collection, q, load]);

  const loadMore = async () => {
    if (!hasNext || loadingMore || q) return;
    setLoadingMore(true);
    try {
      const data = collection
        ? await fetchCollectionProducts(collection, 24, cursor ?? undefined)
        : await fetchProducts(24, undefined);
      const edges = data?.edges ?? [];
      setProducts((prev) => [...prev, ...edges]);
      setHasNext(Boolean(data?.pageInfo?.hasNextPage));
      setCursor(data?.pageInfo?.endCursor ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeTitle = q
    ? `Results for “${q}”`
    : collection
      ? cols.find((c) => c.node.handle === collection)?.node.title ?? "Collection"
      : "All Products";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-paper hero-grain">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-background">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Fresh deals, every day
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Trending deals &<br />
              everyday <span className="text-primary">best sellers</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Hand-picked products across fashion, home, toys and tech — at prices
              you'll love. Shop the full catalog and check out securely with Shopify.
            </p>
            <div className="mt-6 max-w-lg">
              <SearchBar initialValue={q ?? ""} />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#shop">Shop now</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#collections">Browse collections</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink/80">
              <li className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" /> Free shipping over $29
              </li>
              <li className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-primary" /> Free 30-day returns
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Buyer protection
              </li>
              <li className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" /> 120K+ happy shoppers
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lightning deals urgency strip */}
      <div className="border-b border-border bg-deal text-deal-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 text-sm font-bold sm:px-6">
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" /> Lightning deals
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <BadgePercent className="h-4 w-4" /> Up to 70% off — limited stock
          </span>
          <span className="flex items-center gap-2">
            Ends in <Countdown target={dealTarget} className="flex items-center text-xs" />
          </span>
        </div>
      </div>

      {/* Collection pills */}
      <div id="collections" className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          <CollectionPill active={!collection} label="All" />
          {cols.map((c) => (
            <CollectionPill
              key={c.node.handle}
              active={collection === c.node.handle}
              label={c.node.title}
              handle={c.node.handle}
            />
          ))}
        </div>
      </div>

      {/* Product grid */}
      <section id="shop" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {activeTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${products.length} products`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold text-ink">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another collection or check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {products.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
            {hasNext && (
              <div className="mt-10 flex justify-center">
                <Button size="lg" variant="outline" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function CollectionPill({
  active,
  label,
  handle,
}: {
  active: boolean;
  label: string;
  handle?: string;
}) {
  const to = handle ? "/?collection=" + encodeURIComponent(handle) : "/";
  return (
    <a
      href={to}
      className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-background"
          : "border-border bg-background text-foreground/80 hover:border-ink/40 hover:text-foreground"
      }`}
    >
      {label}
    </a>
  );
}
