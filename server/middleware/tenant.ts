import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { AuthRequest } from "./auth";

export interface TenantRequest extends AuthRequest {
  tenant?: {
    id: string;
    name: string;
    subdomain?: string;
    status: string;
  };
}

export async function resolveTenant(
  req: TenantRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let tenantId: string | undefined;

    // 1. Try to get tenant from JWT payload (current tenant)
    if (req.user?.currentTenantId) {
      tenantId = req.user.currentTenantId;
    }

    // 2. Try to get tenant from X-Tenant-ID header
    if (!tenantId) {
      const headerTenantId = req.headers["x-tenant-id"] as string;
      if (headerTenantId && req.user?.tenantIds.includes(headerTenantId)) {
        tenantId = headerTenantId;
      }
    }

    // 3. Try to extract from subdomain (tenant.crm.com)
    if (!tenantId) {
      const host = req.headers.host;
      if (host) {
        const parts = host.split(".");
        if (parts.length > 2) {
          const subdomain = parts[0];
          const tenant = await storage.getTenantBySubdomain(subdomain);
          if (tenant && req.user?.tenantIds.includes(tenant.id)) {
            tenantId = tenant.id;
          }
        }
      }
    }

    // 4. Default to first tenant if user has access
    if (!tenantId && req.user?.tenantIds.length) {
      tenantId = req.user.tenantIds[0];
    }

    if (!tenantId) {
      res.status(403).json({ message: "Unable to resolve tenant context" });
      return;
    }

    // Verify tenant exists and user has access
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    if (!req.user?.tenantIds.includes(tenantId)) {
      res.status(403).json({ message: "Access denied to tenant" });
      return;
    }

    // Check tenant status
    if (tenant.status === "suspended") {
      res.status(403).json({ message: "Tenant account suspended" });
      return;
    }

    if (tenant.status === "expired") {
      res.status(402).json({ message: "Tenant subscription expired" });
      return;
    }

    req.tenant = {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain || undefined,
      status: tenant.status,
    };

    // Update user's current tenant context
    if (req.user) {
      req.user.currentTenantId = tenantId;
    }

    next();
  } catch (error) {
    console.error("Tenant resolution error:", error);
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
