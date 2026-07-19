/**
 * Minimal CORS proxy for GitHub Pages (static hosting).
 *
 * Deploy:
 *   1. Create a Cloudflare Worker and paste this script
 *   2. Set VITE_CORS_PROXY_URL to the worker URL (no trailing slash)
 *      e.g. https://honest-cors-proxy.your-subdomain.workers.dev
 *
 * Request format used by the app:
 *   GET/POST {WORKER}/{ENCODED_OR_PLAIN_TARGET_URL}
 *   Example:
 *   https://worker.dev/https://interview.honestfund.kr/tech/frontend/personal/request
 */
export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    const url = new URL(request.url);
    const target = url.pathname.slice(1) + url.search;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      return new Response('Missing target URL', { status: 400 });
    }

    const headers = new Headers(request.headers);
    headers.delete('host');

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : request.body,
      redirect: 'follow',
    });

    const responseHeaders = new Headers(upstream.headers);
    const cors = corsHeaders(request);
    cors.forEach((value, key) => responseHeaders.set(key, value));

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  },
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return new Headers({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      request.headers.get('Access-Control-Request-Headers') ||
      'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  });
}
