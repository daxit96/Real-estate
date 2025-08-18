import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Tenant {
  id: string;
  name: string;
  role: string;
  subdomain?: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  userTenants: Tenant[] | null;
  currentTenant: Tenant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
}

interface RegisterData {
  tenantName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subdomain?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[] | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiRequest("GET", "/api/me");
      const data = await response.json();
      
      setUser(data.user);
      setUserTenants(data.tenants);
      
      // Set current tenant from localStorage or first available
      const savedTenantId = localStorage.getItem("current_tenant_id");
      const tenant = data.tenants.find((t: Tenant) => t.id === savedTenantId) || data.tenants[0];
      setCurrentTenant(tenant);
      
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_tenant_id");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await response.json();
    
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
    setUserTenants(data.tenants);
    
    // Set first tenant as current
    const firstTenant = data.tenants[0];
    setCurrentTenant(firstTenant);
    localStorage.setItem("current_tenant_id", firstTenant.id);
  };

  const register = async (registerData: RegisterData) => {
    const response = await apiRequest("POST", "/api/auth/register", registerData);
    const data = await response.json();
    
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
    setUserTenants([{
      id: data.tenant.id,
      name: data.tenant.name,
      role: "OWNER",
      subdomain: data.tenant.subdomain,
      status: "trial",
    }]);
    
    const tenant = {
      id: data.tenant.id,
      name: data.tenant.name,
      role: "OWNER",
      subdomain: data.tenant.subdomain,
      status: "trial",
    };
    setCurrentTenant(tenant);
    localStorage.setItem("current_tenant_id", tenant.id);
  };

  const logout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_tenant_id");
    setUser(null);
    setUserTenants(null);
    setCurrentTenant(null);
  };

  const switchTenant = (tenantId: string) => {
    const tenant = userTenants?.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem("current_tenant_id", tenantId);
    }
  };

  const value = {
    user,
    userTenants,
    currentTenant,
    isLoading,
    login,
    register,
    logout,
    switchTenant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
