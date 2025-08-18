import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DealCard from "./deal-card";

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

interface KanbanBoardProps {
  stages: Stage[];
  deals: Deal[];
  onDealMove: (dealId: string, newStageId: string, newPosition: number) => void;
  isUpdating: boolean;
}

export default function KanbanBoard({ stages, deals, onDealMove, isUpdating }: KanbanBoardProps) {
  const [localDeals, setLocalDeals] = useState(deals);

  // Update local state when deals prop changes
  if (JSON.stringify(localDeals) !== JSON.stringify(deals)) {
    setLocalDeals(deals);
  }

  const getDealsForStage = (stageId: string) => {
    return localDeals
      .filter(deal => deal.stageId === stageId)
      .sort((a, b) => a.position - b.position);
  };

  const getStageColor = (color: string) => {
    // Convert hex color to appropriate background class
    const colorMap: { [key: string]: string } = {
      "#6b7280": "bg-slate-50",
      "#3b82f6": "bg-blue-50",
      "#f59e0b": "bg-amber-50",
      "#10b981": "bg-green-50",
      "#ef4444": "bg-red-50",
      "#8b5cf6": "bg-purple-50",
    };
    return colorMap[color] || "bg-slate-50";
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // If dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Update local state optimistically
    const newDeals = [...localDeals];
    const draggedDeal = newDeals.find(deal => deal.id === draggableId);
    
    if (!draggedDeal) return;

    // Remove from source
    const sourceDeals = getDealsForStage(source.droppableId);
    const destinationDeals = getDealsForStage(destination.droppableId);

    // Update the dragged deal
    draggedDeal.stageId = destination.droppableId;
    draggedDeal.position = destination.index;

    // Update positions for other deals in destination stage
    destinationDeals.forEach((deal, index) => {
      if (deal.id !== draggableId) {
        if (index >= destination.index) {
          const dealInArray = newDeals.find(d => d.id === deal.id);
          if (dealInArray) dealInArray.position = index + 1;
        }
      }
    });

    // Update positions for deals in source stage (if different from destination)
    if (source.droppableId !== destination.droppableId) {
      sourceDeals.forEach((deal, index) => {
        if (deal.id !== draggableId && index > source.index) {
          const dealInArray = newDeals.find(d => d.id === deal.id);
          if (dealInArray) dealInArray.position = index - 1;
        }
      });
    }

    setLocalDeals(newDeals);

    // Call the API
    onDealMove(draggableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-6" data-testid="kanban-board">
        {stages
          .sort((a, b) => a.position - b.position)
          .map((stage) => {
            const stageDeals = getDealsForStage(stage.id);
            
            return (
              <div key={stage.id} className="flex-shrink-0 w-80" data-testid={`stage-${stage.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card>
                  <CardHeader className={`${getStageColor(stage.color)} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-900" data-testid={`text-stage-name-${stage.id}`}>
                        {stage.name}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        data-testid={`badge-count-${stage.id}`}
                      >
                        {stageDeals.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <CardContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 space-y-3 min-h-[400px] transition-colors ${
                          snapshot.isDraggingOver ? "bg-slate-50" : ""
                        }`}
                        data-testid={`droppable-${stage.id}`}
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-shadow ${
                                  snapshot.isDragging ? "shadow-lg rotate-3" : ""
                                }`}
                                data-testid={`deal-${deal.id}`}
                              >
                                <DealCard 
                                  deal={deal} 
                                  isDragging={snapshot.isDragging}
                                  isUpdating={isUpdating}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {stageDeals.length === 0 && (
                          <div 
                            className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg"
                            data-testid={`empty-stage-${stage.id}`}
                          >
                            Drop deals here
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </div>
            );
          })}
      </div>
    </DragDropContext>
  );
}
