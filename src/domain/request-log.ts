const PRIVATE_TOKEN_ROUTES = new Set(['preview', 'attiva', 'r']);

export function safeLogPath(pathname: string): string {
  const segments = pathname.split('/');
  const route = segments[1];

  if (PRIVATE_TOKEN_ROUTES.has(route) && segments[2]) {
    return `/${route}/:token`;
  }

  return pathname;
}
