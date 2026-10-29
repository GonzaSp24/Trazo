import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ImagePlus, Magnet, RotateCcw, ShoppingBag, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { uploadMuralImages } from "@/lib/storage";
import { MAGNET_PACKS, formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mural")({
  head: () => ({
    meta: [
      { title: "Creador de Mural de Imanes — Trazo" },
      { name: "description", content: "Subí tus fotos, armá tu mural en la heladera virtual y pedí tu pack de imanes 5×5." },
      { property: "og:title", content: "Creador de Mural de Imanes — Trazo" },
      { property: "og:description", content: "Subí tus fotos y armá tu mural de imanes 5×5." },
    ],
  }),
  component: Mural,
});

type MagnetItem = { id: number; x: number; y: number; rot: number; src?: string | undefined };

const SAMPLE_TONES = ["bg-gold", "bg-foreground", "bg-accent", "bg-muted", "bg-secondary"];

function layout(n: number, prev: MagnetItem[] = []): MagnetItem[] {
  const cols = n <= 6 ? 3 : n <= 9 ? 3 : 4;
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: 12 + (i % cols) * (76 / Math.max(cols - 1, 1)) * 0.9,
    y: 10 + Math.floor(i / cols) * 22,
    rot: (Math.random() - 0.5) * 8,
    src: prev[i]?.src,
  }));
}

function Mural() {
  const [pack, setPack] = useState(MAGNET_PACKS[1]!);
  const [magnets, setMagnets] = useState<MagnetItem[]>(() => layout(9).map((m) => ({ ...m, rot: 0 })));
  const [drag, setDrag] = useState<number | null>(null);
  const fridge = useRef<HTMLDivElement>(null);
  const offset = useRef({ dx: 0, dy: 0 });
  const fileInput = useRef<HTMLInputElement>(null);
  const { add } = useCart();
  const filesBySrc = useRef(new Map<string, File>());
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setMagnets((prev) => layout(pack.size, prev));
  }, [pack]);

  const filled = magnets.filter((m) => m.src).length;

  const onDown = (e: PointerEvent<HTMLDivElement>, m: MagnetItem) => {
    const rect = fridge.current!.getBoundingClientRect();
    offset.current = {
      dx: e.clientX - (rect.left + (m.x / 100) * rect.width),
      dy: e.clientY - (rect.top + (m.y / 100) * rect.height),
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag(m.id);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag === null || !fridge.current) return;
    const r = fridge.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - offset.current.dx - r.left) / r.width) * 100, 0), 80);
    const y = Math.min(Math.max(((e.clientY - offset.current.dy - r.top) / r.height) * 100, 0), 86);
    setMagnets((ms) => ms.map((m) => (m.id === drag ? { ...m, x, y } : m)));
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => { const u = URL.createObjectURL(f); filesBySrc.current.set(u, f); return u; });
    setMagnets((ms) => {
      let k = 0;
      return ms.map((m) => (!m.src && k < urls.length ? { ...m, src: urls[k++] } : m));
    });
    if (urls.length > pack.size - filled) toast.info(`Tu pack admite ${pack.size} fotos; usamos las primeras.`);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      <h1 className="text-4xl font-light md:text-6xl">
        Mural de <span className="brush-underline font-semibold">imanes</span>
      </h1>
      <p className="mt-3 text-muted-foreground">Arrastrá los imanes para armar tu composición. Cada imán mide 5×5 cm.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Heladera */}
        <div className="rounded-[2.5rem] border-2 border-fridge-edge bg-fridge p-3 shadow-magnet">
          <div
            ref={fridge}
            onPointerMove={onMove}
            onPointerUp={() => setDrag(null)}
            className="relative aspect-[4/5] w-full touch-none overflow-hidden rounded-[2rem] bg-gradient-to-br from-background/60 via-fridge to-fridge-edge/60 sm:aspect-[5/4]"
          >
            <div className="absolute right-5 top-1/2 h-40 w-3 -translate-y-1/2 rounded-full bg-fridge-edge shadow-inner" />
            {magnets.map((m, i) => (
              <div
                key={m.id}
                onPointerDown={(e) => onDown(e, m)}
                style={{ left: `${m.x}%`, top: `${m.y}%`, transform: `rotate(${drag === m.id ? 0 : m.rot}deg) scale(${drag === m.id ? 1.08 : 1})` }}
                className={cn(
                  "absolute w-[18%] cursor-grab select-none rounded-md border-[3px] border-card bg-card shadow-magnet transition-[transform,box-shadow] duration-200 hover:scale-105 sm:w-[15%]",
                  drag === m.id && "z-20 cursor-grabbing shadow-sticker-lg",
                )}
              >
                {m.src ? (
                  <img src={m.src} alt="" draggable={false} className="pointer-events-none aspect-square w-full rounded-sm object-cover" />
                ) : (
                  <div className={cn("grid aspect-square w-full place-items-center rounded-sm opacity-70", SAMPLE_TONES[i % SAMPLE_TONES.length])}>
                    <ImagePlus className="size-5 text-muted-foreground mix-blend-difference" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel */}
        <aside className="h-fit rounded-brush-alt border-2 border-foreground bg-card p-7 shadow-sticker-lg lg:sticky lg:top-28">
          <h2 className="font-hand text-4xl">Armá tu mural</h2>
          <p className="mt-1 text-sm text-muted-foreground">Elegí tu pack y subí tus fotos favoritas.</p>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Pack</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {MAGNET_PACKS.map((p) => (
              <button
                key={p.size}
                onClick={() => setPack(p)}
                className={cn(
                  "rounded-brush border-2 border-foreground py-3 text-sm font-medium transition-all hover:-translate-y-0.5",
                  pack.size === p.size ? "bg-gold" : "bg-background",
                )}
              >
                x{p.size}
              </button>
            ))}
          </div>

          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
          <Button variant="sketch" size="lg" className="mt-6 w-full" onClick={() => fileInput.current?.click()}>
            <ImagePlus /> Subir fotos
          </Button>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <Magnet className="size-5 text-gold" />
              <div>
                <p className="font-medium">Pack x{pack.size} imanes</p>
                <p className="text-xs text-muted-foreground">{filled}/{pack.size} fotos cargadas</p>
              </div>
            </div>
            <p className="font-hand text-2xl">{formatPrice(pack.price)}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gold transition-all duration-500" style={{ width: `${(filled / pack.size) * 100}%` }} />
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setMagnets((ms) => layout(ms.length, ms))}><Shuffle /> Reordenar</Button>
            <Button variant="ghost" size="sm" onClick={() => setMagnets(layout(pack.size))}><RotateCcw /> Vaciar</Button>
          </div>

          <Button
            variant="brush"
            size="lg"
            className="mt-6 w-full"
            disabled={adding}
            onClick={async () => {
              const files = magnets.map((m) => (m.src ? filesBySrc.current.get(m.src) : undefined)).filter((f): f is File => !!f);
              setAdding(true);
              try {
                const photos = files.length ? await uploadMuralImages(files) : [];
                add({ id: `mural-${pack.size}-${Date.now()}`, name: `Mural de imanes x${pack.size}`, price: pack.price, image: magnets.find((m) => m.src)?.src, photos });
                toast.success(`Pack x${pack.size} agregado al carrito`);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "No se pudieron subir las fotos");
              } finally {
                setAdding(false);
              }
            }}
          >
            <ShoppingBag /> {adding ? "Subiendo fotos…" : "Agregar al carrito"}
          </Button>
        </aside>
      </div>
    </section>
  );
}
