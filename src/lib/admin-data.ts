import tarjetas from "@/assets/p-tarjetas.jpg";
import stickers from "@/assets/p-stickers.jpg";
import pines from "@/assets/p-pines.jpg";
import kit from "@/assets/p-kit.jpg";

export type Variant = { id: string; name: string; price: number; stock: number };
export type AdminProduct = { id: string; name: string; category: string; image: string; variants: Variant[] };

export const adminCategories = ["Tarjetas", "Stickers", "Pines", "Kits", "Imanes", "Papelería"];

const v = (name: string, price: number, stock: number): Variant => ({ id: crypto.randomUUID?.() ?? name, name, price, stock });

export const mockInventory = (): AdminProduct[] => [
  { id: "1", name: "Tarjetas clásicas", category: "Tarjetas", image: tarjetas, variants: [v("x100 unidades", 14500, 40), v("x250 unidades", 29800, 15)] },
  { id: "2", name: "Tarjetas premium laminadas", category: "Tarjetas", image: tarjetas, variants: [v("x100 unidades", 21900, 20)] },
  { id: "3", name: "Stickers troquelados", category: "Stickers", image: stickers, variants: [v("x50 unidades", 9800, 60), v("x100 unidades", 17500, 30)] },
  { id: "4", name: "Stickers holográficos", category: "Stickers", image: stickers, variants: [v("x30 unidades", 11200, 25)] },
  { id: "5", name: "Plancha de stickers A4", category: "Stickers", image: stickers, variants: [v("x1 plancha", 6500, 80), v("x5 planchas", 28000, 12)] },
  { id: "6", name: "Pines 38mm", category: "Pines", image: pines, variants: [v("x10 unidades", 12000, 35), v("x25 unidades", 27000, 10)] },
  { id: "7", name: "Pines 55mm", category: "Pines", image: pines, variants: [v("x10 unidades", 15500, 18)] },
  { id: "8", name: "Kit emprendedor completo", category: "Kits", image: kit, variants: [v("Kit básico", 48900, 8), v("Kit pro", 72000, 4)] },
];
