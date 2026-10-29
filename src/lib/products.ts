import tarjetas from "@/assets/p-tarjetas.jpg";
import stickers from "@/assets/p-stickers.jpg";
import pines from "@/assets/p-pines.jpg";
import kit from "@/assets/p-kit.jpg";
import imanes from "@/assets/p-imanes.jpg";
import flyers from "@/assets/p-flyers.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tag?: string;
};

export const categories = ["Tarjetas", "Stickers", "Pines", "Kits", "Imanes", "Papelería"];

export const products: Product[] = [
  { id: "tarjetas-clasicas", name: "Tarjetas clásicas x100", category: "Tarjetas", price: 14500, image: tarjetas, tag: "Más vendido" },
  { id: "stickers-troquelados", name: "Stickers troquelados x50", category: "Stickers", price: 9800, image: stickers },
  { id: "pines-38mm", name: "Pines 38mm x10", category: "Pines", price: 12000, image: pines, tag: "Nuevo" },
  { id: "kit-emprendedor", name: "Kit emprendedor completo", category: "Kits", price: 48900, image: kit, tag: "Combo" },
  { id: "tarjetas-premium", name: "Tarjetas premium laminadas", category: "Tarjetas", price: 21900, image: tarjetas },
  { id: "planchas-stickers", name: "Plancha de stickers A4", category: "Stickers", price: 6500, image: stickers },
  { id: "pines-55mm", name: "Pines 55mm x10", category: "Pines", price: 15500, image: pines },
  { id: "kit-packaging", name: "Kit packaging marca", category: "Kits", price: 36500, image: kit },
  { id: "imanes-foto", name: "Imanes con foto x9", category: "Imanes", price: 13500, image: imanes },
  { id: "flyers-a5", name: "Flyers A5 x500", category: "Papelería", price: 27800, image: flyers },
  { id: "postales", name: "Postales ilustradas x20", category: "Papelería", price: 8900, image: flyers },
  { id: "stickers-holo", name: "Stickers holográficos x30", category: "Stickers", price: 11200, image: stickers, tag: "Nuevo" },
];

export const featured = ["tarjetas-clasicas", "stickers-troquelados", "pines-38mm", "kit-emprendedor"].map(
  (id) => products.find((p) => p.id === id)!,
);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const MAGNET_PACKS = [
  { size: 6, price: 9900 },
  { size: 9, price: 13500 },
  { size: 12, price: 16900 },
];
