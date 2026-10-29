import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, LayoutDashboard, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAdminProduct, getAdminData, saveAdminProduct, type AdminCategory, type AdminProduct, type AdminVariant } from "@/lib/admin.functions";
import { uploadProductImage } from "@/lib/storage";
import { checkAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth.functions";
import { useRouter } from "@tanstack/react-router";
import { Lock, LogOut } from "lucide-react";

const adminQuery = queryOptions({ queryKey: ["admin-data"], queryFn: () => getAdminData() });
type FormProduct = AdminProduct & { file?: File };
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Control — Trazo Espacio Gráfico" },
      { name: "description", content: "Gestión de inventario de Trazo Espacio Gráfico." },
      { property: "og:title", content: "Panel de Control — Trazo" },
      { property: "og:description", content: "Gestión de inventario de Trazo Espacio Gráfico." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async ({ context }) => {
    const { ok } = await checkAdmin();
    if (ok) await context.queryClient.ensureQueryData(adminQuery);
    return { authed: ok };
  },
  notFoundComponent: () => <p className="px-5 py-24">No encontrado.</p>,
  pendingComponent: () => <section className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-24 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Cargando…</section>,
  errorComponent: ({ error }) => <section role="alert" className="mx-auto max-w-6xl px-5 py-24"><p className="font-hand text-3xl">No pudimos conectar con la base de datos.</p><p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p></section>,
  component: AdminGate,
});

function AdminGate() {
  const { authed } = Route.useLoaderData();
  return authed ? <Admin /> : <AdminLogin />;
}

function AdminLogin() {
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { ok } = await login({ data: { password: String(new FormData(e.currentTarget).get("password") ?? "") } });
      if (ok) await router.invalidate();
      else setError(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo ingresar");
    } finally { setBusy(false); }
  };
  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-24">
      <form onSubmit={onSubmit} className="rounded-brush-alt border-2 border-foreground bg-card p-8 shadow-sticker">
        <span className="grid h-12 w-12 place-items-center rounded-brush bg-gold shadow-sticker"><Lock className="size-6" /></span>
        <h1 className="mt-5 text-3xl font-light">Panel de <span className="brush-underline font-semibold">Control</span></h1>
        <div className="mt-6 grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" autoFocus onChange={() => setError(false)} />
          {error && <p className="text-sm text-destructive">Contraseña incorrecta</p>}
        </div>
        <Button type="submit" variant="gold" size="lg" className="mt-6 w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Ingresar</Button>
      </form>
    </section>
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);
const newVariant = (): AdminVariant => ({ id: uid(), label: "", price: 0, stock: 0, isNew: true });
const emptyProduct = (): FormProduct => ({ id: "", name: "", categoryId: "", category: null, image: "", variants: [newVariant()] });

function Admin() {
  const { data: { products: items, categories } } = useSuspenseQuery(adminQuery);
  const qc = useQueryClient();
  const saveFn = useServerFn(saveAdminProduct);
  const deleteFn = useServerFn(deleteAdminProduct);
  const logoutFn = useServerFn(logoutAdmin);
  const router = useRouter();
  const [editing, setEditing] = useState<FormProduct | null>(null);
  const [toDelete, setToDelete] = useState<AdminProduct | null>(null);

  const saveMut = useMutation({
    mutationFn: async (p: FormProduct) => {
      const image = p.file ? await uploadProductImage(p.file) : p.image;
      await saveFn({ data: {
        id: p.id || "nuevo", name: p.name, image, categoryId: p.categoryId,
        variants: p.variants.map((v) => ({ id: v.id, label: v.label, price: Math.round(v.price), stock: Math.round(v.stock), isNew: v.isNew })),
      } });
    },
    onSuccess: (_r, p) => { toast.success(p.id ? "Producto actualizado" : "Producto creado"); setEditing(null); qc.invalidateQueries({ queryKey: adminQuery.queryKey }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar"),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: id }),
    onSuccess: () => { toast("Producto eliminado"); qc.invalidateQueries({ queryKey: adminQuery.queryKey }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo eliminar"),
  });
  const save = (p: FormProduct) => saveMut.mutate(p);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-3 text-3xl font-light md:text-5xl">
          <span className="grid h-12 w-12 place-items-center rounded-brush bg-gold shadow-sticker"><LayoutDashboard className="size-6" /></span>
          Panel de <span className="brush-underline font-semibold">Control</span>
        </h1>
        <div className="flex gap-2">
          <Button variant="gold" size="lg" onClick={() => setEditing(emptyProduct())}>
            <Plus /> Nuevo Producto
          </Button>
          <Button variant="sketch" size="lg" aria-label="Salir" onClick={async () => { await logoutFn(); qc.removeQueries({ queryKey: adminQuery.queryKey }); await router.invalidate(); }}>
            <LogOut />
          </Button>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-brush-alt border-2 border-foreground bg-card shadow-sticker">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="uppercase tracking-[0.15em] text-xs">Producto</TableHead>
              <TableHead className="hidden uppercase tracking-[0.15em] text-xs sm:table-cell">Categoría</TableHead>
              <TableHead className="uppercase tracking-[0.15em] text-xs">Variantes y precio</TableHead>
              <TableHead className="text-right uppercase tracking-[0.15em] text-xs">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Todavía no hay productos. Creá el primero con "+ Nuevo Producto".</TableCell></TableRow>
            )}
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.image ? <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-md border border-border object-cover" /> : <div className="h-12 w-12 shrink-0 rounded-md bg-muted" />}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <Badge variant="outline" className="mt-1 sm:hidden">{p.category?.label}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="rounded-brush border-foreground bg-accent text-accent-foreground hover:bg-gold">{p.category?.label}</Badge>
                </TableCell>
                <TableCell>
                  <ul className="space-y-0.5 text-sm">
                    {p.variants.map((v) => (
                      <li key={v.id} className="whitespace-nowrap">
                        {v.label} — <span className="font-semibold">{formatPrice(v.price)}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({v.stock} en stock)</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Editar ${p.name}`} onClick={() => setEditing(structuredClone(p))}><Pencil /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Eliminar ${p.name}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setToDelete(p)}><Trash2 /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog product={editing} categories={categories} saving={saveMut.isPending} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar "{toDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (toDelete) deleteMut.mutate(toDelete.id); setToDelete(null); }}
            >Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

type FormProps = { categories: AdminCategory[]; saving: boolean; onClose: () => void; onSave: (p: FormProduct) => void };

function ProductDialog({ product, ...rest }: FormProps & { product: FormProduct | null }) {
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && !rest.saving && rest.onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-background sm:max-w-2xl">
        {product && <ProductForm key={product.id || "new"} initial={product} {...rest} />}
      </DialogContent>
    </Dialog>
  );
}

function ProductForm({ initial, categories, saving, onClose, onSave }: FormProps & { initial: FormProduct }) {
  const [p, setP] = useState(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const setVariant = (id: string, patch: Partial<AdminVariant>) =>
    setP((x) => ({ ...x, variants: x.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));

  const submit = (): void => {
    if (!p.name.trim()) { toast.error("Poné un nombre al producto"); return; }
    if (!p.categoryId) { toast.error("Elegí una categoría"); return; }
    const variants = p.variants.filter((v) => v.label.trim()).map((v) => ({ ...v, label: v.label.trim() }));
    if (!variants.length) { toast.error("Agregá al menos una variante"); return; }
    onSave({ ...p, name: p.name.trim(), variants });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-hand text-4xl font-normal">{initial.id ? "Editar producto" : "Nuevo producto"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="Ej: Tarjetas clásicas" />
            </div>
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <Select value={p.categoryId} onValueChange={(categoryId) => setP({ ...p, categoryId })}>
                <SelectTrigger><SelectValue placeholder="Elegí una categoría" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Foto</Label>
            <button type="button" onClick={() => fileRef.current?.click()} className="group relative grid aspect-square place-items-center overflow-hidden rounded-brush-alt border-2 border-dashed border-foreground/40 bg-muted transition-colors hover:border-foreground hover:bg-accent">
              {p.image ? <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : (
                <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><ImagePlus className="size-6" />Subir foto</span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setP({ ...p, file: f, image: URL.createObjectURL(f) }); }} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="uppercase tracking-[0.15em]">Variantes</Label>
            <Button type="button" variant="sketch" size="sm" onClick={() => setP({ ...p, variants: [...p.variants, newVariant()] })}>
              <Plus /> Agregar variante
            </Button>
          </div>
          <div className="space-y-3">
            <div className="hidden grid-cols-[1fr_120px_90px_40px] gap-2 px-1 text-xs text-muted-foreground sm:grid">
              <span>Nombre</span><span>Precio</span><span>Stock</span><span />
            </div>
            {p.variants.map((v) => (
              <div key={v.id} className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-2 sm:grid-cols-[1fr_120px_90px_40px] sm:border-0 sm:bg-transparent sm:p-0">
                <Input className="col-span-2 sm:col-span-1" placeholder="Ej: Clásicas x100" value={v.label} onChange={(e) => setVariant(v.id, { label: e.target.value })} />
                <Input type="number" min={0} placeholder="Precio" value={v.price || ""} onChange={(e) => setVariant(v.id, { price: Number(e.target.value) })} />
                <Input type="number" min={0} placeholder="Stock" value={v.stock || ""} onChange={(e) => setVariant(v.id, { stock: Number(e.target.value) })} />
                <Button type="button" variant="ghost" size="icon" aria-label="Quitar variante" disabled={p.variants.length === 1} className="text-destructive hover:text-destructive" onClick={() => setP({ ...p, variants: p.variants.filter((x) => x.id !== v.id) })}><X /></Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="sketch" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button variant="gold" onClick={submit} disabled={saving}>{saving && <Loader2 className="animate-spin" />}Guardar Cambios</Button>
      </DialogFooter>
    </>
  );
}
