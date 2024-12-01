import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useKanbanStore } from '../../../store/kanbanStore';
import { DealProgressBar } from '../DealProgressBar';
import { MobileStageSelect } from '../MobileStageSelect';
import { DealMainForm } from './DealMainForm';
import { DealNotes } from '../DealNotes';
import { DealHistory } from '../DealHistory';
import type { Deal } from '../../../types/deal';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
}

export const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ isOpen, onClose, deal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { deleteDeal, loading, error } = useKanbanStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (hasUnsavedChanges) {
          if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, hasUnsavedChanges, onClose]);

  const handleStageChange = async (stage: string) => {
    await updateDeal(deal.id, { stage });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-navy-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-navy-800 border-b border-navy-700 rounded-t-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{deal.title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this deal?')) {
                    deleteDeal(deal.id);
                    onClose();
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-navy-700/50 transition-colors"
                title="Delete deal"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                      onClose();
                    }
                  } else {
                    onClose();
                  }
                }}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-navy-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Progress bar on desktop, stage select on mobile */}
          <div className="hidden md:block">
            <DealProgressBar deal={deal} />
          </div>
          <div className="block md:hidden">
            <MobileStageSelect 
              deal={deal}
              onStageChange={handleStageChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <DealMainForm 
            deal={deal} 
            onUnsavedChanges={setHasUnsavedChanges}
            loading={loading}
          />

          <DealNotes deal={deal} />
          <DealHistory stageHistory={deal.stageHistory || []} createdAt={deal.createdAt} />
        </div>
      </div>
    </div>
  );
};