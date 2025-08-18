import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import Dashboard from "@/pages/dashboard/index";
import Pipeline from "@/pages/dashboard/pipeline";
import Properties from "@/pages/dashboard/properties";
import Contacts from "@/pages/dashboard/contacts";
import Leads from "@/pages/dashboard/leads";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { AuthProvider } from "@/lib/auth.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" nest>
        <DashboardLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/pipeline" component={Pipeline} />
            <Route path="/properties" component={Properties} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/leads" component={Leads} />
            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
