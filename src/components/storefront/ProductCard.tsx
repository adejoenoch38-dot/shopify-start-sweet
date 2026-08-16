import { Link } from "@tanstack/react-router";
import { ShoppingBag, Loader2, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, discountPercent } from "@/lib/format";
import { socialProof } from "@/lib/social-proof";
import type { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const p = product.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const image = p.images.edges[0]?.node;
  const minPrice = p.priceRange.minVariantPrice;
  const compareAt = p.compareAtPriceRange?.minVariantPrice?.amount;
  const off = discountPercent(minPrice.amount, compareAt);
  const variant = p.variants.edges.find((e) => e.node.availableForSale)?.node ?? p.variants.edges[0]?.node;
  const proof = socialProof(p.id);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Added to cart", {
      description: p.title,
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: p.handle }}
      className="group card-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        {off ? (
          <span className="deal-badge absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold">
            -{off}%
          </span>
        ) : null}
        {variant && !variant.availableForSale ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-background">
            Sold out
          </span>
        ) : null}
        {variant?.availableForSale && proof.almostGone ? (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-background">
            <Eye className="h-3 w-3 text-primary" />
            {proof.viewing} people viewing
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground">
          {p.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-0.5 font-semibold text-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {proof.rating.toFixed(1)}
          </span>
          <span>({proof.reviews})</span>
          <span aria-hidden>·</span>
          <span className="font-semibold text-foreground">{proof.soldLabel}</span>
        </div>
        {variant?.availableForSale ? (
          <div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={proof.almostGone ? "h-full bg-deal" : "h-full bg-primary"}
                style={{ width: `${Math.min(92, 100 - proof.stockLeft * 2)}%` }}
              />
            </div>
            <p
              className={`mt-1 text-[11px] font-semibold ${
                proof.almostGone ? "text-deal" : "text-muted-foreground"
              }`}
            >
              {proof.almostGone
                ? `Almost gone — only ${proof.stockLeft} left`
                : `${proof.stockLeft} left in stock`}
            </p>
          </div>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">
              {formatPrice(minPrice.amount, minPrice.currencyCode)}
            </span>
            {off ? (
              <span className="price-strike text-xs text-muted-foreground">
                {formatPrice(compareAt!, minPrice.currencyCode)}
              </span>
            ) : null}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant || !variant.availableForSale}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
