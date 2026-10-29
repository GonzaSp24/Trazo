import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isAdminSession, passwordMatches, setAdminSession } from "./admin-auth.server.ts";

export const checkAdmin = createServerFn({ method: "GET" }).handler(async () => ({ ok: await isAdminSession() }));

export const loginAdmin = createServerFn({ method: "POST" })
.validator((d: unknown) => z.object({ password: z.string() }).parse(d))
.handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("Falta configurar ADMIN_PASSWORD");
    if (!passwordMatches(data.password, expected)) return { ok: false };
    await setAdminSession(true);
    return { ok: true };
});

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
    await setAdminSession(false);
    return { ok: true };
});
