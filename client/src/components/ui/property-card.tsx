import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Car, Edit, Eye, Trash2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  propertyType: string;
  listingType: string;
  price: number;
  rentPrice?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  amenities: string[];
  images: string[];
  status: string;
  createdAt: string;
}

interface PropertyCardProps {
  property: Property;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function PropertyCard({ property, onDelete, isDeleting }: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      sold: "bg-red-100 text-red-800",
      rented: "bg-blue-100 text-blue-800",
      hold: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  const getListingTypeColor = (type: string) => {
    return type === "sale" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800";
  };

  // Use placeholder image if no images available
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-property-${property.id}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback to unsplash image if original fails
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
          }}
          data-testid={`img-property-${property.id}`}
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Badge className={getStatusColor(property.status)} data-testid={`badge-status-${property.id}`}>
            {property.status}
          </Badge>
          <Badge className={getListingTypeColor(property.listingType)} data-testid={`badge-type-${property.id}`}>
            For {property.listingType === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1" data-testid={`text-title-${property.id}`}>
            {property.title}
          </h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-2" data-testid={`text-address-${property.id}`}>
          {property.address}, {property.city}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
          {property.bedrooms && (
            <span className="flex items-center" data-testid={`text-bedrooms-${property.id}`}>
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center" data-testid={`text-bathrooms-${property.id}`}>
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} Baths
            </span>
          )}
          {property.parking && (
            <span className="flex items-center" data-testid={`text-parking-${property.id}`}>
              <Car className="h-4 w-4 mr-1" />
              {property.parking} Cars
            </span>
          )}
          {property.area && (
            <span data-testid={`text-area-${property.id}`}>
              {property.area} sq ft
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-900" data-testid={`text-price-${property.id}`}>
              {formatCurrency(property.price)}
            </span>
            {property.listingType === "rent" && property.rentPrice && (
              <span className="text-sm text-slate-500 ml-1">/month</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              data-testid={`button-edit-${property.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              data-testid={`button-view-${property.id}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(property.id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
              data-testid={`button-delete-${property.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
