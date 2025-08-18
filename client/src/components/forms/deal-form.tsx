import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.number().min(1, "Deal value is required"),
  pipelineId: z.string().min(1, "Pipeline is required"),
  stageId: z.string().min(1, "Stage is required"),
  propertyId: z.string().optional(),
  contactId: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  pipelineId: string;
  onSuccess: () => void;
}

interface Pipeline {
  id: string;
  name: string;
}

interface Stage {
  id: string;
  name: string;
  pipelineId: string;
}

interface Property {
  id: string;
  title: string;
  address: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
}

export default function DealForm({ pipelineId, onSuccess }: DealFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState(pipelineId);
  const { toast } = useToast();

  const { data: pipelines } = useQuery<Pipeline[]>({
    queryKey: ["/api/pipelines"],
  });

  const { data: stages } = useQuery<Stage[]>({
    queryKey: ["/api/pipelines", selectedPipelineId, "stages"],
    enabled: !!selectedPipelineId,
  });

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      value: 0,
      pipelineId: selectedPipelineId,
      stageId: "",
      propertyId: "",
      contactId: "",
      probability: 50,
      expectedCloseDate: "",
      notes: "",
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      const response = await apiRequest("POST", "/api/deals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Deal created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create deal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true);
    try {
      await createDealMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePipelineChange = (newPipelineId: string) => {
    setSelectedPipelineId(newPipelineId);
    form.setValue("pipelineId", newPipelineId);
    form.setValue("stageId", ""); // Reset stage when pipeline changes
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-deal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Deal Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="e.g., Luxury Apartment Sale - John Doe"
            data-testid="input-title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="value">Deal Value *</Label>
          <Input
            id="value"
            type="number"
            {...form.register("value", { valueAsNumber: true })}
            placeholder="2500000"
            data-testid="input-value"
          />
          {form.formState.errors.value && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.value.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            {...form.register("probability", { valueAsNumber: true })}
            placeholder="50"
            data-testid="input-probability"
          />
        </div>

        <div>
          <Label htmlFor="pipeline">Pipeline *</Label>
          <Select
            onValueChange={handlePipelineChange}
            defaultValue={selectedPipelineId}
          >
            <SelectTrigger data-testid="select-pipeline">
              <SelectValue placeholder="Select pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines?.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.pipelineId && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.pipelineId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stage">Stage *</Label>
          <Select
            onValueChange={(value) => form.setValue("stageId", value)}
            disabled={!stages || stages.length === 0}
          >
            <SelectTrigger data-testid="select-stage">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages?.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.stageId && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.stageId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="property">Property (Optional)</Label>
          <Select
            onValueChange={(value) => form.setValue("propertyId", value)}
          >
            <SelectTrigger data-testid="select-property">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No property</SelectItem>
              {properties?.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contact">Contact (Optional)</Label>
          <Select
            onValueChange={(value) => form.setValue("contactId", value)}
          >
            <SelectTrigger data-testid="select-contact">
              <SelectValue placeholder="Select contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No contact</SelectItem>
              {contacts?.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
          <Input
            id="expectedCloseDate"
            type="date"
            {...form.register("expectedCloseDate")}
            data-testid="input-close-date"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Deal notes and comments..."
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
          disabled={isSubmitting || createDealMutation.isPending}
          data-testid="button-submit"
        >
          {isSubmitting ? "Creating..." : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}
