export default {
    async fetch(request, env) {
        return new Response("✅ Worker запущен! База: " + (env.DB ? "ЕСТЬ" : "НЕТ"));
    }
};
