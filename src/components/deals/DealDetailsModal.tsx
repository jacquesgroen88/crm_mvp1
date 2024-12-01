import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Mail, Phone, Building2, DollarSign, MessageSquare } from 'lucide-react';
import { useKanbanStore } from '../../store/kanbanStore';
import { useTeamStore } from '../../store/teamStore';
import { CustomFieldsSection } from './CustomFieldsSection';
import { DealNotes } from './DealNotes';
import { DealHistory } from './DealHistory';
import { DealStatusUpdate } from './DealStatusUpdate';
import { MobileStageSelect } from './MobileStageSelect';
import { DealProgressBar } from './DealProgressBar';
import { DealOwnerSelect } from './DealOwnerSelect';
import type { Deal } from '../../types/deal';
import type { CustomFieldValue } from '../../types/customField';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
}

export const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ isOpen, onClose, deal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    company: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    stage: '',
    notes: '',
    ownerId: '',
  });
  const [customFields, setCustomFields] = useState<CustomFieldValue[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { updateDeal, deleteDeal, loading, error } = useKanbanStore();
  const { members } = useTeamStore();

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value.toString(),
        company: deal.company,
        contact: deal.contact,
        stage: deal.stage,
        notes: deal.notes,
        ownerId: deal.ownerId || '',
      });
      setCustomFields(deal.customFields || []);
      setHasUnsavedChanges(false);
    }
  }, [deal]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const owner = members.find(m => m.uid === formData.ownerId);
    await updateDeal(deal.id, {
      ...formData,
      value: parseFloat(formData.value) || 0,
      customFields,
      ownerId: formData.ownerId,
      ownerName: owner?.displayName || owner?.email || '',
      ownerPhotoURL: owner?.photoURL,
    });
    setHasUnsavedChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleStageChange = async (stage: string) => {
    await updateDeal(deal.id, { stage });
    setFormData(prev => ({ ...prev, stage }));
  };

  const handleOwnerChange = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      ownerId: userId
    }));
    setHasUnsavedChanges(true);
  };

  const handleContactAction = (type: 'email' | 'phone') => {
    const contact = formData.contact;
    if (type === 'email' && contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else if (type === 'phone' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
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
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Mobile Stage Select */}
          <div className="block md:hidden">
            <div className="bg-navy-900/50 rounded-lg border border-navy-700 mb-6">
              <div className="px-6 py-4 border-b border-navy-700">
                <h3 className="text-sm font-medium text-white">Deal Stage</h3>
              </div>
              <div className="p-6">
                <MobileStageSelect 
                  deal={deal}
                  onStageChange={handleStageChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deal Information */}
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
                      value={formData.title}
                      onChange={handleChange}
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
                      value={formData.value}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
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
                      value={formData.company}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
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
                    value={formData.contact.name}
                    onChange={handleChange}
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
                        value={formData.contact.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleContactAction('email')}
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
                        value={formData.contact.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-2 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleContactAction('phone')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-300"
                      >
                        <Phone className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Owner */}
            <div className="bg-navy-900/50 rounded-lg border border-navy-700">
              <div className="px-6 py-4 border-b border-navy-700">
                <h3 className="text-sm font-medium text-white">Deal Owner</h3>
              </div>
              <div className="p-6">
                <DealOwnerSelect
                  currentOwnerId={formData.ownerId}
                  onOwnerChange={handleOwnerChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Custom Fields */}
            <div className="bg-navy-900/50 rounded-lg border border-navy-700">
              <div className="px-6 py-4 border-b border-navy-700">
                <h3 className="text-sm font-medium text-white">Custom Fields</h3>
              </div>
              <div className="p-6">
                <CustomFieldsSection
                  values={customFields}
                  onChange={setCustomFields}
                />
              </div>
            </div>

            {/* Save Changes & Status Update */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-navy-700">
              <button
                type="submit"
                disabled={loading || !hasUnsavedChanges}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <DealStatusUpdate onUpdateStatus={async (status) => {
                await updateDeal(deal.id, { stage: status });
              }} loading={loading} />
            </div>
          </form>

          <DealNotes deal={deal} />
          <DealHistory stageHistory={deal.stageHistory || []} createdAt={deal.createdAt} />
        </div>
      </div>
    </div>
  );
};