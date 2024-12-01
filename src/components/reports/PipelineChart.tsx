import React, { useMemo } from 'react';
import { usePipelineStore } from '../../store/pipelineStore';
import type { Deal } from '../../types/deal';

interface PipelineChartProps {
  deals: Deal[];
}

export const PipelineChart: React.FC<PipelineChartProps> = ({ deals }) => {
  const { stages } = usePipelineStore();
  
  const stageStats = useMemo(() => {
    const stats = stages.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage.name);
      return {
        ...stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
        deals: stageDeals
      };
    });

    const maxValue = Math.max(...stats.map(s => s.value));
    return stats.map(stat => ({
      ...stat,
      percentage: maxValue > 0 ? (stat.value / maxValue) * 100 : 0
    }));
  }, [stages, deals]);

  return (
    <div className="space-y-4">
      {stageStats.map((stage) => (
        <div key={stage.id} className="flex items-center">
          <div className="w-32 text-sm text-gray-600">{stage.name}</div>
          <div className="flex-1">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
          <div className="w-32 text-right">
            <span className="text-sm font-medium text-gray-900">
              ${stage.value.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({stage.count})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};