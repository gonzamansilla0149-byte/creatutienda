export default {
  async fetch(request, env) {

    const url = new URL(request.url);
    const path = url.pathname;

    // =============================
    // CORS
    // =============================

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    if (request.method === "OPTIONS") {
      return new Response("", { headers: corsHeaders });
    }

    // =============================
    // LANDING
    // =============================

    if (path === "/") {
      return new Response("SaaS Core funcionando");
    }

    // =============================
    // HEALTH CHECK
    // =============================

    if (path === "/api/health") {
      return json({ status: "ok" });
    }

    // =============================
    // CREAR TIENDA
    // POST /api/store
    // =============================

    if (path === "/api/store" && request.method === "POST") {

      try {
        const body = await request.json();
        const { slug, config } = body;

        if (!slug || !config) {
          return json({ error: "Missing slug or config" }, 400);
        }

        const existing = await env.SHOPS.get(`store:${slug}:config`);
        if (existing) {
          return json({ error: "Store already exists" }, 409);
        }

        await env.SHOPS.put(
          `store:${slug}:config`,
          JSON.stringify(config)
        );

        return json({ ok: true });

      } catch (err) {
        return json({ error: "Invalid request" }, 400);
      }
    }

    // =============================
    // OBTENER CONFIG TIENDA
    // GET /api/store/:slug
    // =============================

    if (path.startsWith("/api/store/") && request.method === "GET") {

      const slug = path.split("/")[3];

      if (!slug) {
        return json({ error: "Missing slug" }, 400);
      }

      const config = await env.SHOPS.get(
        `store:${slug}:config`,
        "json"
      );

      if (!config) {
        return json({ error: "Store not found" }, 404);
      }

      return json(config);
    }

    // =============================
    // NOT FOUND
    // =============================

    return new Response("Not found", { status: 404 });
  }
};
