import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Magnet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrushStroke } from "@/components/site/BrushStroke";
import { ProductCard } from "@/components/site/ProductCard";
import { featured } from "@/lib/products";
import imanes from "@/assets/p-imanes.jpg";
import stickers from "@/assets/p-stickers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trazo Espacio Gráfico — Impresión con oficio" },
      { name: "description", content: "Tarjetas, stickers, pines, kits emprendedores e imanes con tus fotos. Diseño e impresión en Buenos Aires." },
      { property: "og:title", content: "Trazo Espacio Gráfico — Impresión con oficio" },
      { property: "og:description", content: "Tarjetas, stickers, pines, kits emprendedores e imanes con tus fotos." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 overflow-hidden px-5 pb-16 pt-14 md:grid-cols-2 md:pt-24">
        <div className="animate-rise">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="size-4 text-gold" /> Estudio gráfico & imprenta
          </p>
          <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            Tus ideas,
            <br />
            <span className="relative inline-block font-semibold">
              <BrushStroke className="absolute -bottom-2 left-[-6%] -z-10 h-[70%] w-[112%]" />
              en papel.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Diseñamos e imprimimos piezas que se sienten hechas a mano: tarjetas, stickers, pines y todo lo que tu marca necesita.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="brush" size="lg">
              <Link to="/productos">Ver productos <ArrowRight /></Link>
            </Button>
            <Button asChild variant="sketch" size="lg">
              <Link to="/mural">Armá tu mural</Link>
            </Button>
          </div>
        </div>
        <div className="relative animate-rise" style={{ animationDelay: "150ms" }}>
          <div className="absolute -right-10 -top-6 h-40 w-40 rounded-brush-alt bg-gold/70 md:h-56 md:w-56" />
          <img src={stickers} alt="Stickers ilustrados de Trazo" width={816} height={816} className="relative aspect-[4/5] w-full rotate-2 rounded-brush-alt border-2 border-foreground object-cover shadow-sticker-lg" />
          <span className="absolute -bottom-6 -left-4 -rotate-6 rounded-brush bg-background px-5 py-2 font-hand text-3xl shadow-sticker">¡hecho con onda!</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-light md:text-5xl">
            Lo más <span className="brush-underline font-semibold">pedido</span>
          </h2>
          <Link to="/productos" className="hidden items-center gap-2 text-sm uppercase tracking-[0.2em] hover:text-muted-foreground sm:flex">
            Ver todo <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="relative grid overflow-hidden rounded-brush-alt border-2 border-foreground bg-primary text-primary-foreground md:grid-cols-2">
          <div className="relative z-10 p-10 md:p-16">
            <span className="inline-flex items-center gap-2 rounded-brush bg-gold px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-foreground">
              <Magnet className="size-4" /> Nuevo
            </span>
            <h2 className="mt-6 text-4xl font-light leading-tight md:text-6xl">
              Creador de <span className="font-hand text-gold">Mural de Imanes</span>
            </h2>
            <p className="mt-5 max-w-md text-primary-foreground/75">
              Subí tus fotos, acomodalas en nuestra heladera virtual y recibí tu pack de imanes 5×5 listos para llenar de recuerdos tu cocina.
            </p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link to="/mural">Probar el creador <ArrowRight /></Link>
            </Button>
          </div>
          <img src={imanes} alt="Imanes con fotos en una heladera" loading="lazy" width={816} height={816} className="h-72 w-full object-cover md:h-full" />
        </div>
      </section>
    </>
  );
}
