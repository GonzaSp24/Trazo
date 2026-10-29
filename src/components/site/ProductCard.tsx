import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  return (
    <article
      className="group animate-rise flex flex-col"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative overflow-hidden rounded-brush-alt border-2 border-foreground bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-sticker-lg">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-brush bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
            {product.tag}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-medium leading-snug">{product.name}</h3>
          <p className="mt-1 font-hand text-2xl">{formatPrice(product.price)}</p>
        </div>
        <Button
          variant="gold"
          size="icon"
          aria-label={`Agregar ${product.name}`}
          onClick={() => {
            add({ id: product.id, name: product.name, price: product.price, image: product.image });
            toast.success(`${product.name} al carrito`);
          }}
        >
          <Plus />
        </Button>
      </div>
    </article>
  );
}
