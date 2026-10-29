import { describe, expect, it } from "vitest";
import { buildOrderMessage, buildWhatsAppUrl, canAddToCart } from "./order";

const n = (s: string) => s.replace(/\s/g, " ");

describe("pedido por WhatsApp", () => {
    it("envía al número de Trazo", () => {
        expect(buildWhatsAppUrl([{ name: "X", price: 1, qty: 1 }])).toMatch(/^https:\/\/wa\.me\/543584250061\?text=/);
    });
    it("suma el total con cantidades", () => {
        const msg = n(buildOrderMessage([
            { name: "Tarjetas", variant: "x100", price: 9800, qty: 2 },
            { name: "Mural de imanes x9", price: 13500, qty: 1, photos: ["https://a/1.jpg"] },
        ]));
        expect(msg).toContain("Total: $ 33.100");
        expect(msg).toContain("Tarjetas — x100");
        expect(msg).toContain("https://a/1.jpg");
    });
});

describe("variante obligatoria", () => {
    it("no deja agregar sin variante", () => {
        expect(canAddToCart(null, ["a"])).toBe(false);
        expect(canAddToCart("a", ["a"])).toBe(true);
    });
});
