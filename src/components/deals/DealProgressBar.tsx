import React from 'react';
import { usePipelineStore } from '../../store/pipelineStore';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Check } from 'lucide-react';
import type { Deal } from '../../types/deal';

interface DealProgressBarProps {
  deal: Deal;
}

export const DealProgressBar: React.FC<DealProgressBarProps> = ({ deal }) => {
  const { stages } = usePipelineStore();
  const currentStageIndex = stages.findIndex(s => s.name === deal.stage);
  const lastStageChange = deal.stageHistory[deal.stageHistory.length - 1];
  const timeInCurrentStage = lastStageChange ? formatDistanceToNow(new Date(lastStageChange.timestamp)) : 'N/A';

  return (
    <div className="px-6 py-4 border-t border-navy-700">
      <div className="flex items-center justify-end text-sm mb-4">
        <div className="flex items-center text-gray-400">
          <Clock className="w-4 h-4 mr-1.5" />
          <span>Been in this stage for {timeInCurrentStage}</span>
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-[2px]">
          <div className="h-full bg-navy-700 absolute inset-0" />
          <div 
            className="h-full bg-indigo-500 absolute left-0 transition-all duration-300"
            style={{ 
              width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center">
              {/* Stage Indicator */}
              <div className="relative mb-8">
                {index === currentStageIndex && (
                  <div className="absolute -inset-2 border-2 border-indigo-500/20 rounded-full animate-pulse" />
                )}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${index < currentStageIndex 
                      ? 'bg-indigo-500 text-white' 
                      : index === currentStageIndex
                      ? 'bg-navy-800 border-2 border-indigo-500 text-white'
                      : 'bg-navy-800 border-2 border-navy-700 text-gray-400'
                    }
                  `}
                >
                  {index < currentStageIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Stage Name */}
              <span 
                className={`
                  text-xs font-medium whitespace-nowrap
                  ${index <= currentStageIndex ? 'text-indigo-400' : 'text-gray-500'}
                `}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};