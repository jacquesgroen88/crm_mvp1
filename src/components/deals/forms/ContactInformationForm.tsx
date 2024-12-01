import React from 'react';
import { Mail, Phone } from 'lucide-react';
import type { DealContact } from '../../../types/deal';

interface ContactInformationFormProps {
  contact: DealContact;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContactAction: (type: 'email' | 'phone') => void;
}

export const ContactInformationForm: React.FC<ContactInformationFormProps> = ({
  contact,
  onChange,
  onContactAction
}) => {
  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700">
        <h3 className="text-sm font-medium text-white">Contact Information</h3>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Name
          </label>
          <input
            type="text"
            name="contact.name"
            required
            value={contact.name}
            onChange={onChange}
            className="block w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="contact.email"
                required
                value={contact.email}
                onChange={onChange}
                className="block w-full pl-10 pr-12 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => onContactAction('email')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-300"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="tel"
                name="contact.phone"
                required
                value={contact.phone}
                onChange={onChange}
                className="block w-full pl-10 pr-12 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => onContactAction('phone')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-300"
              >
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};