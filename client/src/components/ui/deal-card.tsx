import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stage {
  id: string;
  name: string;
  color: string;
  position: number;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stageId: string;
  position: number;
  assignedTo: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    address: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  stage: Stage;
}

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
  isUpdating?: boolean;
}

export default function DealCard({ deal, isDragging, isUpdating }: DealCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getAgentInitials = (assignedTo: string) => {
    // This is a simple implementation - in a real app, you'd fetch user details
    return assignedTo.substring(0, 2).toUpperCase();
  };

  return (
    <Card 
      className={`cursor-move transition-all ${
        isDragging ? "shadow-lg rotate-1" : "hover:shadow-md"
      } ${isUpdating ? "opacity-50" : ""}`}
      data-testid={`deal-card-${deal.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-900 line-clamp-2" data-testid={`text-deal-title-${deal.id}`}>
            {deal.title}
          </h4>
          <span className="text-xs text-slate-500 whitespace-nowrap ml-2" data-testid={`text-deal-value-${deal.id}`}>
            {formatCurrency(deal.value)}
          </span>
        </div>
        
        {deal.property && (
          <p className="text-xs text-slate-600 mb-2 line-clamp-1" data-testid={`text-deal-property-${deal.id}`}>
            {deal.property.title}
          </p>
        )}
        
        {deal.contact && (
          <p className="text-xs text-slate-600 mb-2" data-testid={`text-deal-contact-${deal.id}`}>
            {deal.contact.firstName} {deal.contact.lastName}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
              {getAgentInitials(deal.assignedTo)}
            </div>
            <span className="text-xs text-slate-500" data-testid={`text-deal-agent-${deal.id}`}>
              Agent
            </span>
          </div>
          <span className="text-xs text-slate-500" data-testid={`text-deal-time-${deal.id}`}>
            {getTimeAgo(deal.createdAt)}
          </span>
        </div>
        
        {isUpdating && (
          <div className="mt-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
