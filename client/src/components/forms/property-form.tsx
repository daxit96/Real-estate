import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().optional(),
  propertyType: z.enum(["apartment", "villa", "penthouse", "studio", "office", "commercial"]),
  listingType: z.enum(["sale", "rent", "both"]),
  price: z.number().min(1, "Price is required"),
  rentPrice: z.number().optional(),
  area: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  reraId: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSuccess: () => void;
}

export default function PropertyForm({ onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      propertyType: "apartment",
      listingType: "sale",
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      reraId: "",
    },
  });

  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const response = await apiRequest("POST", "/api/properties", {
        ...data,
        amenities: [], // TODO: Add amenities field
        images: [], // TODO: Add image upload
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      await createPropertyMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-property">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="e.g., Luxury 3BHK Apartment"
            data-testid="input-title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Property description..."
            rows={3}
            data-testid="input-description"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...form.register("address")}
            placeholder="Full address"
            data-testid="input-address"
          />
          {form.formState.errors.address && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.address.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...form.register("city")}
            placeholder="Mumbai"
            data-testid="input-city"
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            {...form.register("state")}
            placeholder="Maharashtra"
            data-testid="input-state"
          />
          {form.formState.errors.state && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select
            onValueChange={(value) => form.setValue("propertyType", value as PropertyFormData["propertyType"])}
            defaultValue={form.getValues("propertyType")}
          >
            <SelectTrigger data-testid="select-property-type">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="listingType">Listing Type *</Label>
          <Select
            onValueChange={(value) => form.setValue("listingType", value as PropertyFormData["listingType"])}
            defaultValue={form.getValues("listingType")}
          >
            <SelectTrigger data-testid="select-listing-type">
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            {...form.register("price", { valueAsNumber: true })}
            placeholder="2500000"
            data-testid="input-price"
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="rentPrice">Rent Price (if applicable)</Label>
          <Input
            id="rentPrice"
            type="number"
            {...form.register("rentPrice", { valueAsNumber: true })}
            placeholder="25000"
            data-testid="input-rent-price"
          />
        </div>

        <div>
          <Label htmlFor="area">Area (sq ft)</Label>
          <Input
            id="area"
            type="number"
            {...form.register("area", { valueAsNumber: true })}
            placeholder="1200"
            data-testid="input-area"
          />
        </div>

        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            {...form.register("bedrooms", { valueAsNumber: true })}
            placeholder="3"
            data-testid="input-bedrooms"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            {...form.register("bathrooms", { valueAsNumber: true })}
            placeholder="2"
            data-testid="input-bathrooms"
          />
        </div>

        <div>
          <Label htmlFor="parking">Parking Spaces</Label>
          <Input
            id="parking"
            type="number"
            {...form.register("parking", { valueAsNumber: true })}
            placeholder="1"
            data-testid="input-parking"
          />
        </div>

        <div>
          <Label htmlFor="reraId">RERA ID</Label>
          <Input
            id="reraId"
            {...form.register("reraId")}
            placeholder="MahaRERA registration number"
            data-testid="input-rera-id"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess} data-testid="button-cancel">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || createPropertyMutation.isPending}
          data-testid="button-submit"
        >
          {isSubmitting ? "Creating..." : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
