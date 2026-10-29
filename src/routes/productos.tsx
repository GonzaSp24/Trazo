import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { catalogQuery } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/productos")({
  validateSearch: z.object({ cat: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Productos — Trazo Espacio Gráfico" },
      { name: "description", content: "Catálogo de tarjetas, stickers, pines, kits, imanes y papelería impresa." },
      { property: "og:title", content: "Productos — Trazo Espacio Gráfico" },
      { property: "og:description", content: "Catálogo de tarjetas, stickers, pines, kits, imanes y papelería impresa." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  pendingComponent: () => <section className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-24 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Cargando…</section>,
  errorComponent: ({ error }) => <section role="alert" className="mx-auto max-w-7xl px-5 py-24"><p className="font-hand text-3xl">No pudimos cargar los productos.</p><p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p></section>,
  notFoundComponent: () => <p className="px-5 py-24">No encontrado.</p>,
  component: Productos,
});

function Productos() {
  const { data: { products, categories } } = useSuspenseQuery(catalogQuery);
  const { cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/productos" });
  const list = cat ? products.filter((p) => p.categorySlug === cat) : products;
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-4xl font-light md:text-6xl">
        Todo para <span className="brush-underline font-semibold">imprimir</span>
      </h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {[{ slug: undefined, label: "Todos" }, ...categories].map((c) => (
          <button
            key={c.slug ?? "all"}
            onClick={() => navigate({ search: { cat: c.slug } })}
            className={cn(
              "rounded-brush border-2 border-foreground px-4 py-1.5 text-sm transition-all hover:-translate-y-0.5",
              cat === c.slug ? "bg-foreground text-background" : "bg-background hover:bg-gold",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="mt-10 text-muted-foreground">Todavía no hay productos en esta categoría.</p>}
      <div className="mt-10 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
