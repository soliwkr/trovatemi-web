import { handle } from '@astrojs/cloudflare/handler';

export default {
  async fetch(request, env, ctx) {
    const startedAt = Date.now();
    const response = await handle(request, env, ctx);

    console.log(JSON.stringify({
      event: 'request.complete',
      method: request.method,
      path: new URL(request.url).pathname,
      status: response.status,
      durationMs: Date.now() - startedAt,
    }));

    return response;
  },
} satisfies ExportedHandler<Env>;
