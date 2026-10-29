import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { canAddToCart } from "@/lib/order";
import { productImage } from "@/lib/product-images";
import type { CatalogProduct } from "@/lib/catalog.functions";

export function ProductCard({ product, index = 0 }: { product: CatalogProduct; index?: number }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const variant = product.variants.find((v) => v.id === variantId);
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const ok = canAddToCart(variantId, product.variants.map((v) => v.id));
  const image = productImage(product.image, product.categorySlug, product.category);
  return (
    <article className="group animate-rise flex flex-col" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="relative overflow-hidden rounded-brush-alt border-2 border-foreground bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-sticker-lg">
        <img src={image} alt={product.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-medium leading-snug">{product.name}</h3>
        <p className="mt-1 font-hand text-2xl">{variant ? formatPrice(variant.price) : `desde ${formatPrice(minPrice)}`}</p>
        <div className="mt-2 flex items-center gap-2">
          <Select value={variantId ?? ""} onValueChange={setVariantId}>
            <SelectTrigger className="h-9 flex-1 text-xs" aria-label={`Variante de ${product.name}`}>
              <SelectValue placeholder="Elegí una opción" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.label} — {formatPrice(v.price)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="gold"
            size="icon"
            disabled={!ok}
            aria-label={`Agregar ${product.name}`}
            onClick={() => {
              if (!variant) return;
              add({ id: variant.id, name: product.name, variant: variant.label, price: variant.price, image });
              toast.success(`${product.name} (${variant.label}) al carrito`);
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}
