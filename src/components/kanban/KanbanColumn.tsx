import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, ChevronRight } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import { AddDealModal } from '../deals/AddDealModal';
import type { Deal } from '../../types/deal';

interface KanbanColumnProps {
  stage: string;
  deals: Deal[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, deals }) => {
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id: stage,
    data: { stage },
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <>
      <div className="flex-shrink-0 w-80">
        <div className="p-3 flex items-center justify-between bg-navy-800/50 sticky top-0 z-10">
          <div>
            <h3 className="text-sm font-medium text-white mb-1">{stage}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{deals.length} deals</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="md:hidden">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </span>
          <button 
            className="p-1.5 hover:bg-navy-700 rounded-md text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsAddDealModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </button>
          </div>
        </div>
        
        <div
          ref={setNodeRef}
          className="p-2 space-y-2 min-h-[calc(100vh-12rem)] touch-pan-y"
        >
          <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
            {deals.map((deal) => (
              <KanbanCard key={deal.id} deal={deal} />
            ))}
          </SortableContext>
        </div>
      </div>

      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        initialStage={stage}
      />
    </>
  );
};