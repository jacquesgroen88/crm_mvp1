import React from 'react';
import { usePipelineStore } from '../../store/pipelineStore';
import { ChevronDown } from 'lucide-react';
import type { Deal } from '../../types/deal';

interface MobileStageSelectProps {
  deal: Deal;
  onStageChange: (stage: string) => void;
  disabled?: boolean;
}

export const MobileStageSelect: React.FC<MobileStageSelectProps> = ({
  deal,
  onStageChange,
  disabled
}) => {
  const { stages } = usePipelineStore();
  const currentStageIndex = stages.findIndex(s => s.name === deal.stage);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead':
        return 'bg-purple-500/20 text-purple-300';
      case 'Contact Made':
        return 'bg-blue-500/20 text-blue-300';
      case 'Proposal Sent':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'Negotiation':
        return 'bg-orange-500/20 text-orange-300';
      case 'Closed Won':
        return 'bg-green-500/20 text-green-300';
      case 'Closed Lost':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div>
      <div className="relative">
        <select
          value={deal.stage}
          onChange={(e) => onStageChange(e.target.value)}
          disabled={disabled}
          className="block w-full pl-4 pr-10 py-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.name} className="bg-navy-800">
              {stage.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full text-sm ${getStageColor(deal.stage)}`}>
          Stage {currentStageIndex + 1} of {stages.length}
        </div>
        <div className="text-sm text-gray-400">
          {currentStageIndex === stages.length - 1 ? 'Final Stage' : `${stages.length - currentStageIndex - 1} stages remaining`}
        </div>
      </div>
    </div>
  );
};