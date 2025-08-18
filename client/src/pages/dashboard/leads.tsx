import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  source?: string;
  status: string;
  budget?: number;
  requirements?: string;
  assignedTo?: string;
  priority: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
}

export default function Leads() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ leadId, updates }: { leadId: string; updates: any }) => {
      const response = await apiRequest("PUT", `/api/leads/${leadId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const filteredLeads = leads?.filter(lead =>
    `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.requirements?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    const colors = {
      hot: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-blue-100 text-blue-800",
      low: "bg-slate-100 text-slate-800",
    };
    return colors[priority as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-green-100 text-green-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-purple-100 text-purple-800",
      unqualified: "bg-red-100 text-red-800",
      converted: "bg-emerald-100 text-emerald-800",
    };
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return <LeadsSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" data-testid="text-leads-title">
            Leads
          </h1>
          <p className="text-slate-500" data-testid="text-leads-subtitle">
            Track and convert your prospects into clients.
          </p>
        </div>
        <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-lead">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            {/* TODO: Implement LeadForm component */}
            <div className="p-4 text-center text-slate-500">
              Lead form component to be implemented
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search leads by name, email, phone, or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads && filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="leads-grid">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow" data-testid={`card-lead-${lead.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(lead.firstName, lead.lastName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900" data-testid={`text-name-${lead.id}`}>
                        {lead.firstName} {lead.lastName}
                      </h3>
                      {lead.requirements && (
                        <p className="text-sm text-slate-500" data-testid={`text-requirements-${lead.id}`}>
                          {lead.requirements.length > 50 
                            ? `${lead.requirements.substring(0, 50)}...`
                            : lead.requirements
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge 
                      className={`capitalize ${getPriorityColor(lead.priority)}`}
                      data-testid={`badge-priority-${lead.id}`}
                    >
                      {lead.priority}
                    </Badge>
                    <Badge 
                      className={`capitalize ${getStatusColor(lead.status)}`}
                      data-testid={`badge-status-${lead.id}`}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {lead.email && (
                    <div className="flex items-center text-sm text-slate-600" data-testid={`text-email-${lead.id}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {lead.email}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-600" data-testid={`text-phone-${lead.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {lead.phone}
                  </div>
                  {lead.budget && (
                    <div className="flex items-center text-sm text-slate-600" data-testid={`text-budget-${lead.id}`}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Budget: {formatCurrency(lead.budget)}
                    </div>
                  )}
                  {lead.nextFollowUp && (
                    <div className="flex items-center text-sm text-slate-600" data-testid={`text-followup-${lead.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Follow up: {new Date(lead.nextFollowUp).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Created {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateLeadMutation.mutate({
                        leadId: lead.id,
                        updates: { lastContactDate: new Date().toISOString() }
                      })}
                      disabled={updateLeadMutation.isPending}
                      data-testid={`button-contact-${lead.id}`}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateLeadMutation.mutate({
                        leadId: lead.id,
                        updates: { 
                          status: "qualified",
                          lastContactDate: new Date().toISOString()
                        }
                      })}
                      disabled={updateLeadMutation.isPending || lead.status === "qualified"}
                      data-testid={`button-qualify-${lead.id}`}
                    >
                      {lead.status === "qualified" ? "Qualified" : "Qualify"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-slate-500">
              {searchTerm ? (
                <>
                  <p className="text-lg font-medium mb-2">No leads found</p>
                  <p>Try adjusting your search criteria</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">No leads yet</p>
                  <p className="mb-4">Start by adding your first lead</p>
                  <Button onClick={() => setIsLeadFormOpen(true)} data-testid="button-add-first-lead">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LeadsSkeleton() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
