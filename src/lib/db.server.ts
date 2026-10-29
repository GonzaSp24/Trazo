import prismaPkg from '@prisma/client';
const { PrismaClient } = prismaPkg;

// Usamos el cliente estándar sin adaptadores de Cloudflare
export function getPrisma() {
    const connectionString = process.env["DATABASE_URL"];
    if (!connectionString) {
        throw new Error("Falta configurar DATABASE_URL en el archivo .env");
    }
    
    return new PrismaClient();
}