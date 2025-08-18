import { useState } from "react";
import { Building2, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth.tsx";
import { useLocation } from "wouter";

export default function Header() {
  const { user, currentTenant, userTenants, logout, switchTenant } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40" data-testid="header">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="text-primary text-xl mr-2 h-6 w-6" />
              <span className="text-lg font-semibold text-slate-900" data-testid="text-app-name">
                RealEstate CRM
              </span>
            </div>
            
            {/* Tenant Switcher */}
            {userTenants && userTenants.length > 1 && (
              <div className="ml-8 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      data-testid="button-tenant-switcher"
                    >
                      <span data-testid="text-current-tenant">
                        {currentTenant?.name || "Select Tenant"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {userTenants.map((tenant) => (
                      <DropdownMenuItem
                        key={tenant.id}
                        onClick={() => switchTenant(tenant.id)}
                        className={currentTenant?.id === tenant.id ? "bg-slate-100" : ""}
                        data-testid={`option-tenant-${tenant.id}`}
                      >
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-slate-500 capitalize">{tenant.role}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" data-testid="button-notifications">
              <Bell className="h-5 w-5 text-slate-500" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user ? getInitials(user.firstName, user.lastName) : "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700" data-testid="text-user-name">
                    {user ? `${user.firstName} ${user.lastName}` : "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem data-testid="button-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
