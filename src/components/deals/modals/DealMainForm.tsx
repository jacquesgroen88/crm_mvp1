import React, { useState, useEffect } from 'react';
import { useKanbanStore } from '../../../store/kanbanStore';
import { useTeamStore } from '../../../store/teamStore';
import { DealInformationForm } from '../forms/DealInformationForm';
import { CompanyInformationForm } from '../forms/CompanyInformationForm';
import { ContactInformationForm } from '../forms/ContactInformationForm';
import { CustomFieldsForm } from '../forms/CustomFieldsForm';
import { DealOwnerSelect } from '../DealOwnerSelect';
import { DealStatusUpdate } from '../DealStatusUpdate';
import type { Deal } from '../../../types/deal';
import type { CustomFieldValue } from '../../../types/customField';

interface DealMainFormProps {
  deal: Deal;
  onUnsavedChanges: (hasChanges: boolean) => void;
  loading: boolean;
}

export const DealMainForm: React.FC<DealMainFormProps> = ({ deal, onUnsavedChanges, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    company: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    notes: '',
    ownerId: '',
  });
  const [customFields, setCustomFields] = useState<CustomFieldValue[]>([]);
  const { updateDeal } = useKanbanStore();
  const { members } = useTeamStore();

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value.toString(),
        company: deal.company,
        contact: deal.contact,
        notes: deal.notes,
        ownerId: deal.ownerId || '',
      });
      setCustomFields(deal.customFields || []);
      onUnsavedChanges(false);
    }
  }, [deal]);

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
    onUnsavedChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    onUnsavedChanges(true);
  };

  const handleContactAction = (type: 'email' | 'phone') => {
    const contact = formData.contact;
    if (type === 'email' && contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else if (type === 'phone' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DealInformationForm
        title={formData.title}
        value={formData.value}
        onChange={handleChange}
      />

      <CompanyInformationForm
        company={formData.company}
        onChange={handleChange}
      />

      <ContactInformationForm
        contact={formData.contact}
        onChange={handleChange}
        onContactAction={handleContactAction}
      />

      {/* Deal Owner */}
      <div className="bg-navy-900/50 rounded-lg border border-navy-700">
        <div className="px-6 py-4 border-b border-navy-700">
          <h3 className="text-sm font-medium text-white">Deal Owner</h3>
        </div>
        <div className="p-6">
          <DealOwnerSelect
            currentOwnerId={formData.ownerId}
            onOwnerChange={(userId) => {
              setFormData(prev => ({ ...prev, ownerId: userId }));
              onUnsavedChanges(true);
            }}
            disabled={loading}
          />
        </div>
      </div>

      <CustomFieldsForm
        values={customFields}
        onChange={(values) => {
          setCustomFields(values);
          onUnsavedChanges(true);
        }}
      />

      {/* Save Changes & Status Update */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-navy-700">
        <button
          type="submit"
          disabled={loading || !hasUnsavedChanges}
          className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <DealStatusUpdate 
          onUpdateStatus={async (status) => {
            await updateDeal(deal.id, { stage: status });
          }} 
          loading={loading} 
        />
      </div>
    </form>
  );
};