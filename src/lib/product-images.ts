import tarjetas from "@/assets/p-tarjetas.jpg";
import stickers from "@/assets/p-stickers.jpg";
import pines from "@/assets/p-pines.jpg";
import kit from "@/assets/p-kit.jpg";
import imanes from "@/assets/p-imanes.jpg";
import flyers from "@/assets/p-flyers.jpg";

const BY_CATEGORY: Record<string, string> = {
  tarjetas, stickers, pines, kits: kit, kit, imanes, papeleria: flyers,
};

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** La foto de la base de datos tiene prioridad; si no hay, usa la ilustrativa de su categoría. */
export function productImage(image: string | null | undefined, categorySlug?: string, categoryLabel?: string): string {
  if (image) return image;
  return BY_CATEGORY[norm(categorySlug ?? "")] ?? BY_CATEGORY[norm(categoryLabel ?? "")] ?? flyers;
}
