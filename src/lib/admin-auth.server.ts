import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean };

function config() {
    const password = process.env["SESSION_SECRET"];
    if (!password || password.length < 32) throw new Error("Falta configurar SESSION_SECRET (32+ caracteres)");
    return {
        password,
        name: "trazo-admin",
        maxAge: 60 * 60 * 24 * 7,
        cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
    };
}

export function passwordMatches(input: string, expected: string) {
    const a = createHash("sha256").update(input, "utf8").digest();
    const b = createHash("sha256").update(expected, "utf8").digest();
    return timingSafeEqual(a, b);
}

export async function isAdminSession() {
    const s = await useSession<AdminSession>(config());
    return !!s.data.admin;
}

export async function setAdminSession(on: boolean) {
    const s = await useSession<AdminSession>(config());
    if (on) await s.update({ admin: true });
    else await s.clear();
}

export async function requireAdmin() {
    if (!(await isAdminSession())) throw new Error("No autorizado");
}
