import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ListTodo, Home, Users, ChartLine, Calendar, CreditCard, ArrowRight } from "lucide-react";

export default function Landing() {
  const [currentView, setCurrentView] = useState<"landing" | "demo">("landing");

  if (currentView === "demo") {
    return <DemoView onBack={() => setCurrentView("landing")} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="text-primary text-2xl mr-2 h-8 w-8" />
                <span className="text-xl font-bold text-slate-900">RealEstate CRM</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <a href="#features" className="text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Login</Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="button-signup">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 to-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
                Pipeline-First CRM for 
                <span className="text-primary"> Real Estate</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Streamline your real estate brokerage with our multi-tenant CRM. Manage properties, track deals, and close more transactions with powerful automation.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link href="/signup">
                  <Button size="lg" className="mr-4" data-testid="button-hero-signup">
                    Start Free Trial
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView("demo")}
                  data-testid="button-demo"
                >
                  View Live Demo <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              {/* Dashboard Preview */}
              <div className="relative mx-auto w-full rounded-lg shadow-2xl lg:max-w-md">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Sales Pipeline</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-slate-100 p-2 rounded">
                        <div className="font-medium mb-1">Leads</div>
                        <div className="space-y-1">
                          <div className="bg-white p-1 rounded shadow-sm">Property A</div>
                          <div className="bg-white p-1 rounded shadow-sm">Property B</div>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="font-medium mb-1">Qualified</div>
                        <div className="bg-white p-1 rounded shadow-sm">Property C</div>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <div className="font-medium mb-1">Token</div>
                        <div className="bg-white p-1 rounded shadow-sm">Property D</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="font-medium mb-1">Closed</div>
                        <div className="bg-white p-1 rounded shadow-sm">Property E</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to close more deals</h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
              Built specifically for real estate professionals with multi-tenant architecture
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <ListTodo className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Pipeline Management</h3>
                <p className="mt-2 text-base text-slate-500">
                  Visual kanban boards to track deals from lead to closing
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Property Management</h3>
                <p className="mt-2 text-base text-slate-500">
                  Comprehensive property database with images and specifications
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Team Collaboration</h3>
                <p className="mt-2 text-base text-slate-500">
                  Multi-tenant architecture with role-based access control
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <ChartLine className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Analytics & Reports</h3>
                <p className="mt-2 text-base text-slate-500">
                  Track performance, conversion rates, and commission calculations
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Site Visit Scheduling</h3>
                <p className="mt-2 text-base text-slate-500">
                  Automated scheduling with WhatsApp and email notifications
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">Payment Integration</h3>
                <p className="mt-2 text-base text-slate-500">
                  Stripe and Razorpay integration for seamless transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Demo Coming Soon</h2>
            <p className="text-slate-500 mb-6">
              Our interactive demo is currently under construction. In the meantime, you can start your free trial to explore all features.
            </p>
            <div className="space-y-3">
              <Link href="/signup">
                <Button className="w-full" data-testid="button-demo-signup">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" onClick={onBack} className="w-full" data-testid="button-back">
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
