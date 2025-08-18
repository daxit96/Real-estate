// Tenant utility functions

export function getTenantFromHost(host: string): string | null {
  if (!host) return null;
  
  const parts = host.split(".");
  if (parts.length < 3) return null;
  
  const subdomain = parts[0];
  // Skip common subdomains
  if (["www", "api", "app"].includes(subdomain)) return null;
  
  return subdomain;
}

export function buildTenantUrl(subdomain: string, path: string = ""): string {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const url = new URL(baseUrl);
  
  if (subdomain) {
    url.hostname = `${subdomain}.${url.hostname}`;
  }
  
  if (path) {
    url.pathname = path;
  }
  
  return url.toString();
}

export function getCurrentTenantId(): string | null {
  return localStorage.getItem("current_tenant_id");
}

export function setCurrentTenantId(tenantId: string): void {
  localStorage.setItem("current_tenant_id", tenantId);
}

export function clearCurrentTenantId(): void {
  localStorage.removeItem("current_tenant_id");
}
