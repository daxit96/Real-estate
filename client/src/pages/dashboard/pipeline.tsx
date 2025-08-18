import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import KanbanBoard from "@/components/ui/kanban-board";
import DealForm from "@/components/forms/deal-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Pipeline {
  id: string;
  name: string;
  description: string;
}

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

export default function Pipeline() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pipelines, isLoading: pipelinesLoading } = useQuery<Pipeline[]>({
    queryKey: ["/api/pipelines"],
  });

  const { data: stages, isLoading: stagesLoading } = useQuery<Stage[]>({
    queryKey: ["/api/pipelines", selectedPipeline, "stages"],
    enabled: !!selectedPipeline,
  });

  const { data: deals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals", selectedPipeline],
    queryFn: async () => {
      const url = selectedPipeline ? `/api/deals?pipelineId=${selectedPipeline}` : '/api/deals';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ dealId, updates }: { dealId: string; updates: any }) => {
      const response = await apiRequest("PUT", `/api/deals/${dealId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive",
      });
    },
  });

  // Set default pipeline
  if (pipelines && !selectedPipeline && pipelines.length > 0) {
    setSelectedPipeline(pipelines[0].id);
  }

  const handleDealMove = (dealId: string, newStageId: string, newPosition: number) => {
    updateDealMutation.mutate({
      dealId,
      updates: {
        stageId: newStageId,
        position: newPosition,
      },
    });
  };

  if (pipelinesLoading) {
    return <PipelineSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" data-testid="text-pipeline-title">
            Sales Pipeline
          </h1>
          <p className="text-slate-500" data-testid="text-pipeline-subtitle">
            Drag and drop deals between stages to update their status.
          </p>
        </div>
        <Dialog open={isDealFormOpen} onOpenChange={setIsDealFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-deal">
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
            </DialogHeader>
            <DealForm
              pipelineId={selectedPipeline || ""}
              onSuccess={() => {
                setIsDealFormOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Tabs */}
      {pipelines && pipelines.length > 1 && (
        <div className="mb-6">
          <div className="flex space-x-2">
            {pipelines.map((pipeline) => (
              <Button
                key={pipeline.id}
                variant={selectedPipeline === pipeline.id ? "default" : "outline"}
                onClick={() => setSelectedPipeline(pipeline.id)}
                data-testid={`button-pipeline-${pipeline.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {pipeline.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {stagesLoading || dealsLoading ? (
        <KanbanSkeleton />
      ) : stages && deals ? (
        <KanbanBoard
          stages={stages}
          deals={deals}
          onDealMove={handleDealMove}
          isUpdating={updateDealMutation.isPending}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No pipeline data available</p>
        </div>
      )}
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <KanbanSkeleton />
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-80">
          <Card>
            <CardHeader className="bg-slate-50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 min-h-[400px]">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="border rounded-lg p-3">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24 mb-2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
