import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "./db.server";

export type CatalogVariant = { id: string; label: string; price: number; stock: number };
export type CatalogProduct = { id: string; name: string; image: string; category: string; categorySlug: string; variants: CatalogVariant[] };
export type CatalogCategory = { slug: string; label: string };

// Público: solo datos de vitrina.
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
    const prisma = getPrisma();
    try {
        const [products, categories] = await Promise.all([
            prisma.product.findMany({ include: { variants: { orderBy: { price: "asc" } }, category: true }, orderBy: { createdAt: "desc" } }),
            prisma.category.findMany({ orderBy: { label: "asc" } }),
        ]);
        return {
            products: products
            .filter((p) => p.variants.length > 0)
            .map((p): CatalogProduct => ({
                id: p.id, name: p.name, image: p.image ?? "", category: p.category.label, categorySlug: p.category.slug,
                variants: p.variants.map((v) => ({ id: v.id, label: v.label, price: v.price, stock: v.stock })),
            })),
            categories: categories.map((c): CatalogCategory => ({ slug: c.slug, label: c.label })),
        };
    } finally {
        await prisma.$disconnect();
    }
});
