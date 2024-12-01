import React, { useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { SearchBar } from './SearchBar';
import { useKanbanStore } from '../../store/kanbanStore';
import { useCustomFieldsStore } from '../../store/customFieldsStore';
import { usePipelineStore } from '../../store/pipelineStore';

export const KanbanBoard = () => {
  const { filteredDeals, moveDeal, subscribeToDeals } = useKanbanStore();
  const { subscribeToFields } = useCustomFieldsStore();
  const { stages, subscribeToPipeline } = usePipelineStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const deals = filteredDeals();

  useEffect(() => {
    const unsubscribeDeals = subscribeToDeals();
    const unsubscribeFields = subscribeToFields();
    const unsubscribePipeline = subscribeToPipeline();
    
    return () => {
      unsubscribeDeals();
      unsubscribeFields();
      unsubscribePipeline();
    };
  }, []);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeStage = active.data.current.stage;
      const overStage = over.data.current.stage;
      
      if (activeStage !== overStage) {
        moveDeal(active.id, activeStage, overStage);
      }
    }
    
    setActiveId(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-0">
        <SearchBar />
      </div>
      <div className="flex-1 p-6 overflow-x-auto">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage.name}
                deals={deals.filter((deal) => deal.stage === stage.name)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <KanbanCard
                deal={deals.find((deal) => deal.id === activeId)!}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};