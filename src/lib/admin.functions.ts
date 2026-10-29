import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPrisma } from "./db.server";
import { requireAdmin } from "./admin-auth.server";

export type AdminVariant = { id: string; label: string; price: number; stock: number; isNew?: boolean };
export type AdminCategory = { id: string; label: string };
export type AdminProduct = {
  id: string;
  name: string;
  image: string;
  categoryId: string;
  category: AdminCategory | null;
  variants: AdminVariant[];
};

// 1. Productos y categorías
export const getAdminData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const prisma = getPrisma();
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ include: { variants: true, category: true }, orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { label: "asc" } }),
    ]);
    return {
      products: products.map((p): AdminProduct => ({
        id: p.id,
        name: p.name,
        image: p.image ?? "",
        categoryId: p.categoryId,
        category: p.category ? { id: p.category.id, label: p.category.label } : null,
        variants: p.variants.map((v) => ({ id: v.id, label: v.label, price: v.price, stock: v.stock })),
      })),
      categories: categories.map((c): AdminCategory => ({ id: c.id, label: c.label })),
    };
  } finally {
    await prisma.$disconnect();
  }
});

const saveSchema = z.object({
  id: z.string(), // "nuevo" para crear
  name: z.string().trim().min(1),
  image: z.string(),
  categoryId: z.string().min(1),
  variants: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().trim().min(1),
        price: z.number().int().min(0),
        stock: z.number().int().min(0),
        isNew: z.boolean().optional(),
      }),
    )
    .min(1),
});

// 2. Crear / actualizar (alta, edición y baja de variantes en una transacción)
export const saveAdminProduct = createServerFn({ method: "POST" })
  .validator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const prisma = getPrisma();
    try {
      if (data.id === "nuevo") {
        await prisma.product.create({
          data: {
            name: data.name,
            image: data.image || null,
            categoryId: data.categoryId,
            variants: { create: data.variants.map((v) => ({ label: v.label, price: v.price, stock: v.stock })) },
          },
        });
      } else {
        const keep = data.variants.filter((v) => !v.isNew).map((v) => v.id);
        await prisma.$transaction([
          prisma.product.update({
            where: { id: data.id },
            data: { name: data.name, image: data.image || null, categoryId: data.categoryId },
          }),
          prisma.variant.deleteMany({ where: { productId: data.id, id: { notIn: keep } } }),
          ...data.variants.map((v) =>
            v.isNew
              ? prisma.variant.create({ data: { productId: data.id, label: v.label, price: v.price, stock: v.stock } })
              : prisma.variant.update({ where: { id: v.id }, data: { label: v.label, price: v.price, stock: v.stock } }),
          ),
        ]);
      }
      return { success: true };
    } finally {
      await prisma.$disconnect();
    }
  });

// 3. Borrar (las variantes se borran en cascada)
export const deleteAdminProduct = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().min(1).parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin();
    const prisma = getPrisma();
    try {
      await prisma.product.delete({ where: { id } });
      return { success: true };
    } finally {
      await prisma.$disconnect();
    }
  });
