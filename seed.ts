import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando carga de datos en la base de datos (Prisma 5)...");

  // 1. Categorías iniciales
  const categoriesData = [
    { label: "Tarjetas", slug: "tarjetas" },
    { label: "Stickers", slug: "stickers" },
    { label: "Pines", slug: "pines" },
    { label: "Kits", slug: "kits" },
    { label: "Imanes", slug: "imanes" },
    { label: "Papelería", slug: "papeleria" },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label },
      create: { label: cat.label, slug: cat.slug },
    });
    categoryMap.set(cat.slug, record.id);
    console.log(`  ✓ Categoría: ${cat.label}`);
  }

  // 2. Productos con sus variantes y stock
  const productsData = [
    {
      name: "Tarjetas clásicas",
      description: "Tarjetas de presentación en cartulina ilustración 350g con terminación mate o brillante.",
      categorySlug: "tarjetas",
      variants: [
        { label: "x100 unidades", price: 14500, stock: 50 },
        { label: "x200 unidades", price: 26000, stock: 30 },
        { label: "x500 unidades", price: 55000, stock: 15 },
      ],
    },
    {
      name: "Tarjetas premium laminadas",
      description: "Laminado soft touch mate con detalles sectorizados y esquinas redondeadas opcionales.",
      categorySlug: "tarjetas",
      variants: [
        { label: "x100 unidades", price: 21900, stock: 25 },
        { label: "x200 unidades", price: 39000, stock: 20 },
      ],
    },
    {
      name: "Stickers troquelados",
      description: "Vinilo autoadhesivo de alta resistencia al agua y sol, cortados individualmente a la silueta de tu diseño.",
      categorySlug: "stickers",
      variants: [
        { label: "x50 unidades", price: 9800, stock: 80 },
        { label: "x100 unidades", price: 17500, stock: 60 },
        { label: "x200 unidades", price: 31000, stock: 30 },
      ],
    },
    {
      name: "Planchas de stickers A4",
      description: "Plancha en vinilo brillante o mate con múltiples stickers precortados listos para despegar.",
      categorySlug: "stickers",
      variants: [
        { label: "1 unidad", price: 6500, stock: 100 },
        { label: "x5 unidades", price: 28000, stock: 40 },
      ],
    },
    {
      name: "Stickers holográficos",
      description: "Acabado brillante tornasolado que refleja la luz con efectos metálicos espectaculares.",
      categorySlug: "stickers",
      variants: [
        { label: "x30 unidades", price: 11200, stock: 50 },
        { label: "x60 unidades", price: 20000, stock: 30 },
      ],
    },
    {
      name: "Pines 38mm",
      description: "Pines metálicos prendedores de 38mm con acabado brillante y gancho de seguridad.",
      categorySlug: "pines",
      variants: [
        { label: "x10 unidades", price: 12000, stock: 40 },
        { label: "x25 unidades", price: 26500, stock: 25 },
        { label: "x50 unidades", price: 48000, stock: 15 },
      ],
    },
    {
      name: "Pines 55mm",
      description: "Pines tamaño grande ideales para campañas, eventos y merchandising.",
      categorySlug: "pines",
      variants: [
        { label: "x10 unidades", price: 15500, stock: 35 },
        { label: "x25 unidades", price: 34000, stock: 20 },
      ],
    },
    {
      name: "Kit emprendedor completo",
      description: "Combo inicial: 100 tarjetas + 50 stickers troquelados + 10 pines prendedores + packaging de regalo.",
      categorySlug: "kits",
      variants: [
        { label: "Pack inicial completo", price: 48900, stock: 20 },
      ],
    },
    {
      name: "Kit packaging marca",
      description: "50 bolsas de papel kraft impresas + papel de seda personalizado + 50 stickers cierra-bolsa.",
      categorySlug: "kits",
      variants: [
        { label: "Pack 50 entregas", price: 36500, stock: 15 },
      ],
    },
    {
      name: "Imanes con foto",
      description: "Fotos imantadas flexibles estilo Polaroid de 5x5 cm para heladera o pizarras magnéticas.",
      categorySlug: "imanes",
      variants: [
        { label: "Pack x6 imanes", price: 9900, stock: 50 },
        { label: "Pack x9 imanes", price: 13500, stock: 50 },
        { label: "Pack x12 imanes", price: 16900, stock: 35 },
      ],
    },
    {
      name: "Flyers A5",
      description: "Folletos publicitarios a todo color en papel ilustración 150g simple faz o doble faz.",
      categorySlug: "papeleria",
      variants: [
        { label: "x250 unidades", price: 16500, stock: 30 },
        { label: "x500 unidades", price: 27800, stock: 20 },
        { label: "x1000 unidades", price: 49000, stock: 10 },
      ],
    },
    {
      name: "Postales ilustradas",
      description: "Postales en cartulina texturada especial de 300g para arte, packaging o dedicatorias.",
      categorySlug: "papeleria",
      variants: [
        { label: "x20 unidades", price: 8900, stock: 45 },
        { label: "x50 unidades", price: 19500, stock: 25 },
      ],
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          name: item.name,
          description: item.description,
          categoryId,
          variants: {
            create: item.variants,
          },
        },
      });
      console.log(`  ✓ Creado: ${item.name} (${item.variants.length} variantes)`);
    } else {
      console.log(`  ↷ Ya existe: ${item.name}`);
    }
  }

  console.log("\n🎉 ¡Carga inicial completada con éxito!");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
