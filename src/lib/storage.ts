import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "products";
let client: SupabaseClient | null = null;

function getClient() {
    const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
    const key = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;
    if (!url || !key) throw new Error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
    client ??= createClient(url, key, { auth: { persistSession: false } });
    return client;
}

/** Sube una foto al bucket público "products" y devuelve su URL pública. */
export async function uploadProductImage(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");
    if (file.size > 5 * 1024 * 1024) throw new Error("La imagen supera los 5 MB");
    const sb = getClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
