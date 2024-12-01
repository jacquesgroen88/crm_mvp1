import React from 'react';
import { Building2 } from 'lucide-react';

interface CompanyInformationFormProps {
  company: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyInformationForm: React.FC<CompanyInformationFormProps> = ({
  company,
  onChange
}) => {
  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700">
        <h3 className="text-sm font-medium text-white">Company Information</h3>
      </div>
      <div className="p-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="company"
              required
              value={company}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};