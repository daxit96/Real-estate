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

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  alternatePhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  contactType: z.enum(["buyer", "seller", "tenant", "landlord", "investor"]),
  source: z.enum(["website", "referral", "advertisement", "cold_call", "social_media"]).optional(),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  contactType: string;
  source?: string;
  notes?: string;
}

interface ContactFormProps {
  contact?: Contact | null;
  onSuccess: () => void;
}

export default function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!contact;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      alternatePhone: contact?.alternatePhone || "",
      address: contact?.address || "",
      city: contact?.city || "",
      contactType: (contact?.contactType as ContactFormData["contactType"]) || "buyer",
      source: (contact?.source as ContactFormData["source"]) || undefined,
      notes: contact?.notes || "",
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const url = isEditing ? `/api/contacts/${contact.id}` : "/api/contacts";
      const method = isEditing ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Contact ${isEditing ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} contact`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await createContactMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-contact">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            placeholder="John"
            data-testid="input-first-name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            placeholder="Doe"
            data-testid="input-last-name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="john.doe@email.com"
            data-testid="input-email"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...form.register("phone")}
            placeholder="+91 98765 43210"
            data-testid="input-phone"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="alternatePhone">Alternate Phone</Label>
          <Input
            id="alternatePhone"
            type="tel"
            {...form.register("alternatePhone")}
            placeholder="+91 87654 32109"
            data-testid="input-alternate-phone"
          />
        </div>

        <div>
          <Label htmlFor="contactType">Contact Type *</Label>
          <Select
            onValueChange={(value) => form.setValue("contactType", value as ContactFormData["contactType"])}
            defaultValue={form.getValues("contactType")}
          >
            <SelectTrigger data-testid="select-contact-type">
              <SelectValue placeholder="Select contact type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="landlord">Landlord</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.contactType && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.contactType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="source">Source</Label>
          <Select
            onValueChange={(value) => form.setValue("source", value as ContactFormData["source"])}
            defaultValue={form.getValues("source")}
          >
            <SelectTrigger data-testid="select-source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="cold_call">Cold Call</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...form.register("city")}
            placeholder="Mumbai"
            data-testid="input-city"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...form.register("address")}
            placeholder="Full address"
            data-testid="input-address"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Additional notes about the contact..."
            rows={3}
            data-testid="input-notes"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess} data-testid="button-cancel">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || createContactMutation.isPending}
          data-testid="button-submit"
        >
          {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Contact" : "Create Contact")}
        </Button>
      </div>
    </form>
  );
}
