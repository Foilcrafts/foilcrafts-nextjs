module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/utils/supabase/middleware.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
// Supabase session-refresh helper — called from the root middleware.ts.
// Refreshes auth cookies on every request so sessions don't expire mid-browse.
// Returns the supabase client, response, and authenticated user for route gating.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
;
;
async function updateSession(request) {
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://vlfrnxxtykdjrpaukovh.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_WpXkTXjs1YKKXFMcC3xBsA_2Z-SRmbd"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                cookiesToSet.forEach(({ name, value, options })=>supabaseResponse.cookies.set(name, value, options));
            }
        }
    });
    // Refresh / read the auth user. Required to maintain the session.
    const { data: { user } } = await supabase.auth.getUser();
    return {
        supabaseResponse,
        user,
        supabase
    };
}
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
// Foil Crafts auth middleware.
// Runs on every request EXCEPT static assets. Refreshes the Supabase session,
// gates protected routes based on the user's status in profiles, and tracks user visits.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$middleware$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/supabase/middleware.ts [middleware] (ecmascript)");
;
;
// ─────────────────────────────────────────────────────────────────────────────
// Route classification
// ─────────────────────────────────────────────────────────────────────────────
// Public marketing pages — anyone can see these.
const PUBLIC_PATHS = [
    "/",
    "/about",
    "/foiling",
    "/digital-printing",
    "/cut-plates-embossing",
    "/catalogs",
    "/contact"
];
// Auth-related pages — public, but redirect AWAY if already logged in.
const AUTH_PATHS = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password"
];
// Routes that require a logged-in user (any status).
const AUTHED_ANY_STATUS_PATHS = [
    "/pending-approval"
];
// Routes that require status='approved'.
const APPROVED_ONLY_PATHS = [
    "/library"
];
// Routes that require role='admin'.
const ADMIN_ONLY_PATHS = [
    "/admin"
];
function startsWithAny(path, list) {
    return list.some((p)=>path === p || path.startsWith(`${p}/`));
}
async function proxy(request) {
    const { pathname } = request.nextUrl;
    // Refresh the auth cookies on every request — required for Supabase SSR.
    const { supabaseResponse, user, supabase } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$middleware$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["updateSession"])(request);
    // Fetch profile and check visit tracking in one go if user is logged in.
    let profile = null;
    if (user) {
        try {
            const { data } = await supabase.from("profiles").select("status, role, last_visited_at, visit_count").eq("id", user.id).single();
            profile = data;
            if (profile) {
                const now = new Date();
                const lastVisited = profile.last_visited_at ? new Date(profile.last_visited_at) : null;
                // Throttle visit tracking to once every 15 minutes to avoid excessive DB writes.
                if (!lastVisited || now.getTime() - lastVisited.getTime() > 15 * 60 * 1000) {
                    const newCount = (profile.visit_count ?? 0) + 1;
                    await supabase.from("profiles").update({
                        last_visited_at: now.toISOString(),
                        visit_count: newCount
                    }).eq("id", user.id);
                    // Update local profile object so subsequent checks use the updated values.
                    profile.last_visited_at = now.toISOString();
                    profile.visit_count = newCount;
                }
            }
        } catch (err) {
            console.error("Middleware visit tracking error:", err);
        }
    }
    // ── Public marketing pages ─────────────────────────────────────────────
    if (PUBLIC_PATHS.includes(pathname)) {
        return supabaseResponse;
    }
    // ── Auth pages: if already logged in, send to /library (approved) or
    //    /pending-approval (still pending) ───────────────────────────────────
    if (startsWithAny(pathname, AUTH_PATHS)) {
        if (user) {
            if (profile?.status === "approved") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/library", request.url));
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/pending-approval", request.url));
        }
        return supabaseResponse;
    }
    // ── /pending-approval ─ requires login (any status) ────────────────────
    if (startsWithAny(pathname, AUTHED_ANY_STATUS_PATHS)) {
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        }
        return supabaseResponse;
    }
    // ── Approved-only routes (/library, /api/asset) ────────────────────────
    if (startsWithAny(pathname, APPROVED_ONLY_PATHS)) {
        if (!user) {
            const url = new URL("/login", request.url);
            url.searchParams.set("next", pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        if (profile?.status !== "approved") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/pending-approval", request.url));
        }
        return supabaseResponse;
    }
    // ── Admin-only routes ──────────────────────────────────────────────────
    if (startsWithAny(pathname, ADMIN_ONLY_PATHS)) {
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        }
        if (profile?.role !== "admin") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
        }
        return supabaseResponse;
    }
    // Default: pass through (e.g. /auth/confirm, future routes).
    return supabaseResponse;
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - /images/* (public marketing images — never gated)
     * - file extensions for images / fonts / etc.
     */ "/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09n_wdq._.js.map