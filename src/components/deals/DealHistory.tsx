import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { History, ArrowRight } from 'lucide-react';
import type { DealStageChange } from '../../types/deal';

interface DealHistoryProps {
  stageHistory: DealStageChange[];
  createdAt: string;
}

export const DealHistory: React.FC<DealHistoryProps> = ({ stageHistory, createdAt }) => {
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

  const totalDays = Math.ceil(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white flex items-center">
          <History className="w-4 h-4 mr-2 text-gray-400" />
          Deal History
        </h3>
        <span className="text-sm text-gray-400">
          {totalDays} days in pipeline
        </span>
      </div>

      <div className="p-6">
        <ul className="space-y-6">
          {stageHistory.map((change, idx) => (
            <li key={change.timestamp} className="relative">
              {idx !== stageHistory.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-navy-700"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-navy-800 flex items-center justify-center ring-4 ring-navy-900">
                    <History className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-300">
                      {change.from ? (
                        <span className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(change.from)}`}>
                            {change.from}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-500" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(change.to)}`}>
                            {change.to}
                          </span>
                        </span>
                      ) : (
                        <span>Deal created in <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(change.to)}`}>
                          {change.to}
                        </span></span>
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-400">
                    <time dateTime={change.timestamp} title={format(new Date(change.timestamp), 'PPpp')}>
                      {formatDistanceToNow(new Date(change.timestamp))} ago
                    </time>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};