export function getPlatformRootDomain(): string {
  if (process.env.NEXT_PUBLIC_ROOT_DOMAIN) return process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (typeof window !== 'undefined') return window.location.hostname;
  return 'localhost';
}

export function getTenantDomain(subdomain: string): string {
  return `${subdomain}.${getPlatformRootDomain()}`;
}
