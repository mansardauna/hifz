export const DEMO_SUBDOMAINS: string[] = ['demo', 'sample-demo'];

export const isDemoTenant = (subdomain?: string): boolean => {
  if (!subdomain) return false;
  const clean = subdomain.replace(/^tenant-/, '').toLowerCase().trim();
  return clean === 'demo' || clean === 'sample-demo';
};

