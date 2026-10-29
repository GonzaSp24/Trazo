import { formatPrice } from "./products";

export const WHATSAPP_NUMBER = "543584250061";

export type OrderLine = { name: string; variant?: string | undefined; price: number; qty: number; photos?: string[] | undefined };

/** Una variante es obligatoria: sin ella no se agrega al carrito. */
export function canAddToCart(variantId: string | null | undefined, variantIds: string[]): boolean {
    return !!variantId && variantIds.includes(variantId);
}

export function buildOrderMessage(lines: OrderLine[]): string {
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const body = lines
    .map((l) => {
        const parts = [`• ${l.name}${l.variant ? ` — ${l.variant}` : ""}`, `  ${l.qty} × ${formatPrice(l.price)} = ${formatPrice(l.price * l.qty)}`];
        if (l.photos?.length) parts.push(`  Fotos:`, ...l.photos.map((p) => `  ${p}`));
        return parts.join("\n");
    })
    .join("\n");
    return `¡Hola Trazo! Quiero hacer este pedido:\n\n${body}\n\nTotal: ${formatPrice(total)}`;
}

export function buildWhatsAppUrl(lines: OrderLine[]): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(lines))}`;
}
