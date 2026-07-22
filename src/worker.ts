import { handle } from '@astrojs/cloudflare/handler';

export default {
  async fetch(request, env, ctx) {
    const startedAt = Date.now();
    const url = new URL(request.url);

    if (url.hostname === 'www.trovatemi.it') {
      url.protocol = 'https:';
      url.hostname = 'trovatemi.it';

      const response = Response.redirect(url.toString(), 308);

      console.log(JSON.stringify({
        event: 'request.redirect',
        method: request.method,
        path: url.pathname,
        status: response.status,
        durationMs: Date.now() - startedAt,
      }));

      return response;
    }

    const response = await handle(request, env, ctx);

    console.log(JSON.stringify({
      event: 'request.complete',
      method: request.method,
      path: url.pathname,
      status: response.status,
      durationMs: Date.now() - startedAt,
    }));

    return response;
  },
} satisfies ExportedHandler<Env>;
