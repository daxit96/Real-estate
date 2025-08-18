import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantIds: string[];
    currentTenantId?: string;
  };
}

export function generateToken(userId: string, tenantIds: string[]): string {
  return jwt.sign(
    { userId, tenantIds, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      tenantIds: string[];
    };

    const user = await storage.getUser(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // Get current tenant from header or use first available
    const tenantId = req.headers["x-tenant-id"] as string;
    const validTenantId = tenantId && decoded.tenantIds.includes(tenantId) 
      ? tenantId 
      : decoded.tenantIds[0];

    req.user = {
      id: decoded.userId,
      email: user.email,
      tenantIds: decoded.tenantIds,
      currentTenantId: validTenantId,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.currentTenantId) {
      res.status(403).json({ message: "No tenant context" });
      return;
    }

    try {
      const userTenant = await storage.getUserInTenant(
        req.user.id,
        req.user.currentTenantId
      );

      if (!userTenant || !allowedRoles.includes(userTenant.role)) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking permissions" });
    }
  };
}

export const requireOwner = requireRole(["OWNER"]);
export const requireAdmin = requireRole(["OWNER", "ADMIN"]);
export const requireAgent = requireRole(["OWNER", "ADMIN", "AGENT", "LISTING_MANAGER"]);
