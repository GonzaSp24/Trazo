import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, products } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Productos — Trazo Espacio Gráfico" },
      { name: "description", content: "Catálogo de tarjetas, stickers, pines, kits, imanes y papelería impresa." },
      { property: "og:title", content: "Productos — Trazo Espacio Gráfico" },
      { property: "og:description", content: "Catálogo de tarjetas, stickers, pines, kits, imanes y papelería impresa." },
    ],
  }),
  component: Productos,
});

function Productos() {
  const [cat, setCat] = useState<string | null>(null);
  const list = cat ? products.filter((p) => p.category === cat) : products;
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-4xl font-light md:text-6xl">
        Todo para <span className="brush-underline font-semibold">imprimir</span>
      </h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-brush border-2 border-foreground px-4 py-1.5 text-sm transition-all hover:-translate-y-0.5",
              cat === c ? "bg-foreground text-background" : "bg-background hover:bg-gold",
            )}
          >
            {c ?? "Todos"}
          </button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
