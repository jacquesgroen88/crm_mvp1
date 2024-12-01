import React from 'react';
import { MessageSquare, DollarSign } from 'lucide-react';

interface DealInformationFormProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DealInformationForm: React.FC<DealInformationFormProps> = ({
  title,
  value,
  onChange
}) => {
  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700">
        <h3 className="text-sm font-medium text-white">Deal Information</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Deal Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="title"
              required
              value={title}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Deal Value
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="number"
              name="value"
              required
              value={value}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};