import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronRight, Loader2, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, STORE_NAME, type ShopifyProductNode } from "@/lib/shopify";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const product = await fetchProductByHandle(params.handle);
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — ${STORE_NAME}` : `${STORE_NAME}`;
    const desc = p ? p.description.slice(0, 155) : "Shop trending deals and best sellers.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Product not found</h1>
      <p className="mt-2 text-muted-foreground">This product may have been removed.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to shop</Link>
      </Button>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const [activeImage, setActiveImage] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const p: ShopifyProductNode = product;
  const images = p.images.edges.map((e) => e.node);
  const minPrice = p.priceRange.minVariantPrice;
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const off = discountPercent(minPrice.amount, compareAt?.amount);

  // Initialize selected options from first variant
  const initial: Record<string, string> = {};
  const firstVariant = p.variants.edges[0]?.node;
  if (firstVariant) {
    firstVariant.selectedOptions.forEach((o) => (initial[o.name] = o.value));
  }

  const currentSelection = Object.keys(selected).length ? selected : initial;

  const matchedVariant = useMemo(() => {
    return p.variants.edges
      .map((e) => e.node)
      .find((v) =>
        v.selectedOptions.every(
          (o) => currentSelection[o.name] === o.value,
        ),
      );
  }, [p, currentSelection]);

  const variant = matchedVariant ?? firstVariant;
  const displayPrice = variant?.price ?? minPrice;
  const inStock = variant?.availableForSale ?? false;

  const handleAdd = async () => {
    if (!variant) return;
    if (!inStock) {
      toast.error("Out of stock", { description: "This variant is currently unavailable." });
      return;
    }
    await addItem({
      product: { node: p },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Added to cart", { description: p.title });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{p.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary/40">
            {images[activeImage] ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? p.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {off ? (
              <span className="deal-badge absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-bold">
                -{off}% OFF
              </span>
            ) : null}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage ? "border-ink" : "border-border hover:border-ink/40"
                  }`}
                >
                  <img src={img.url} alt={img.altText ?? p.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {p.tags?.includes("Best Sellers") ? (
            <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-background">
              <ShoppingBag className="h-3.5 w-3.5 text-primary" /> Best Seller
            </span>
          ) : null}
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {p.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink">
              {formatPrice(displayPrice.amount, displayPrice.currencyCode)}
            </span>
            {off && compareAt ? (
              <span className="price-strike text-lg text-muted-foreground">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            ) : null}
            {off ? (
              <span className="deal-badge rounded-full px-2.5 py-0.5 text-xs font-bold">
                Save {off}%
              </span>
            ) : null}
          </div>

          {/* Variants */}
          {p.options.map((opt) => (
            <div key={opt.name} className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink">
                {opt.name}:{" "}
                <span className="font-normal text-muted-foreground">
                  {currentSelection[opt.name] ?? opt.values[0]}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const isActive = (currentSelection[opt.name] ?? opt.values[0]) === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-ink bg-ink text-background"
                          : "border-border bg-background text-foreground hover:border-ink/40"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={handleAdd} disabled={isLoading || !inStock}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {inStock ? "Add to cart" : "Sold out"}
            </Button>
          </div>
          {!inStock && (
            <p className="mt-2 text-sm text-destructive">This variant is out of stock.</p>
          )}

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
            <Trust icon={<Truck className="h-5 w-5 text-primary" />} label="Fast shipping" />
            <Trust icon={<RefreshCw className="h-5 w-5 text-primary" />} label="Easy returns" />
            <Trust icon={<ShieldCheck className="h-5 w-5 text-primary" />} label="Secure pay" />
          </div>

          {/* Description */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="font-display text-lg font-bold text-ink">Description</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {p.description
                .split(/\n+/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">{icon}</div>
      <span className="text-xs font-medium text-ink">{label}</span>
    </div>
  );
}
