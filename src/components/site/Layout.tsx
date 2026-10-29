import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Minus, Plus, ShoppingBag, MapPin } from "lucide-react";
import logo from "@/assets/trazo-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/mural", label: "Mural de imanes" },
] as const;

export function Navbar() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" aria-label="Trazo Espacio Gráfico — inicio">
          <img src={logo} alt="Trazo Espacio Gráfico" className="h-11 w-auto md:h-12" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground brush-underline" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Button variant="sketch" size="icon" className="relative h-11 w-11" onClick={() => setOpen(true)} aria-label="Carrito">
          <ShoppingBag className="!size-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-foreground px-1 text-xs font-semibold text-background">
              {count}
            </span>
          )}
        </Button>
      </div>
      <nav className="flex justify-center gap-6 border-t border-border py-2 md:hidden">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="text-xs uppercase tracking-[0.15em] text-muted-foreground" activeProps={{ className: "text-foreground font-semibold" }} activeOptions={{ exact: true }}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function CartSheet() {
  const { items, open, setOpen, update, total } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-hand text-4xl font-normal">Tu carrito</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {items.length === 0 && <p className="text-muted-foreground">Todavía no agregaste nada. ¡Dale, que hay mucho para imprimir!</p>}
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 rounded-brush-alt border border-border bg-card p-3">
              {i.image && <img src={i.image} alt="" className="h-16 w-16 rounded-md object-cover" />}
              <div className="flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(i.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => update(i.id, i.qty - 1)} aria-label="Restar"><Minus /></Button>
                <span className="w-5 text-center text-sm">{i.qty}</span>
                <Button variant="ghost" size="icon" onClick={() => update(i.id, i.qty + 1)} aria-label="Sumar"><Plus /></Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="uppercase tracking-[0.2em] text-sm">Total</span>
            <span className="font-hand text-3xl">{formatPrice(total)}</span>
          </div>
          <Button variant="brush" size="lg" className="w-full" disabled={!items.length} onClick={() => toast("¡Gracias! El pago llegará pronto.")}>
            Finalizar compra
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-foreground bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <img src={logo} alt="Trazo Espacio Gráfico" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Imprimimos ideas con oficio. Diseño e impresión para emprendedores, marcas y momentos.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tienda</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:brush-underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Instagram className="size-4" /> @trazo.grafica</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> hola@trazografica.com</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> Buenos Aires, Argentina</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-5 text-center text-xs uppercase tracking-logo text-muted-foreground">
        © 2026 Todos los derechos reservados · <Link to="/admin" className="cursor-text">Trazo</Link>
      </p>
    </footer>
  );
}
