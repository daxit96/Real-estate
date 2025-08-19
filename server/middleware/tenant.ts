import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { AuthRequest } from "./auth";

export interface TenantRequest extends AuthRequest {
  tenant?: {
    id: string;
    name: string;
    subdomain?: string;
    status: string;
    subscription_id?: string | null;
  };
}

// Resolve tenant from headers, host, or user's currentTenantId
export async function resolveTenant(
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1) X-Tenant-Id header (explicit)
    const headerTenant = (req.headers["x-tenant-id"] || req.headers["x-tenantid"]) as string | undefined;
    if (headerTenant) {
      const t = await storage.getTenant(headerTenant);
      if (t) {
        req.tenant = { id: t.id, name: t.name, subdomain: t.subdomain || undefined, status: t.status };
        return next();
      }
    }

    // 2) Current user context - token may include currentTenantId
    if (req.user && req.user.currentTenantId) {
      const t = await storage.getTenant(req.user.currentTenantId);
      if (t) {
        req.tenant = { id: t.id, name: t.name, subdomain: t.subdomain || undefined, status: t.status };
        return next();
      }
    }

    // 3) Host-based subdomain (example: acme.realtyflow.local)
    const host = req.headers.host;
    if (host) {
      const parts = (host as string).split(":")[0].split(".");
      if (parts.length >= 3) {
        const subdomain = parts[0];
        const t = await storage.getTenantBySubdomain(subdomain);
        if (t) {
          req.tenant = { id: t.id, name: t.name, subdomain: t.subdomain || undefined, status: t.status };
          return next();
        }
      }
    }

    // 4) Fallback: if the user has tenantIds list, pick the first one
    if (req.user && Array.isArray(req.user.tenantIds) && req.user.tenantIds.length > 0) {
      const t = await storage.getTenant(req.user.tenantIds[0]);
      if (t) {
        req.tenant = { id: t.id, name: t.name, subdomain: t.subdomain || undefined, status: t.status };
        return next();
      }
    }

    // No tenant resolved - proceed without tenant (some public routes may still work)
    return next();
  } catch (err) {
    console.error("resolveTenant error:", err);
    res.status(500).json({ message: "Error resolving tenant" });
  }
}

// Middleware to ensure tenant is resolved for protected routes
export function requireTenant(
  req: TenantRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.tenant) {
    res.status(403).json({ message: "Tenant context required" });
    return;
  }
  next();
}

// Middleware to require that tenant has an active subscription (or in trial)
export function requireActiveSubscription(
  req: TenantRequest,
  res: Response,
  next: NextFunction
): void {
  // Allow if tenant is active or trial
  if (req.tenant && (req.tenant.status === "active" || req.tenant.status === "trial")) {
    return next();
  }
  // If no tenant but user is admin on platform, allow
  if (req.user && Array.isArray(req.user.tenantIds) && req.user.tenantIds.length === 0) {
    return next();
  }
  res.status(402).json({ message: "Tenant subscription is not active. Please upgrade to continue." });
}
