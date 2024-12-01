import React from 'react';
import { useCustomFieldsStore } from '../../store/customFieldsStore';
import type { CustomFieldValue } from '../../types/customField';

interface CustomFieldsSectionProps {
  values: CustomFieldValue[];
  onChange: (values: CustomFieldValue[]) => void;
}

export const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ values, onChange }) => {
  const { fields } = useCustomFieldsStore();

  const handleFieldChange = (fieldId: string, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    let processedValue: string | number | null = value.trim();

    // Don't save empty values
    if (processedValue === '') {
      const newValues = values.filter(v => v.fieldId !== fieldId);
      onChange(newValues);
      return;
    }

    // Process value based on field type
    if (field.type === 'number') {
      const num = parseFloat(value);
      processedValue = isNaN(num) ? null : num;
    } else if (field.type === 'select') {
      processedValue = field.options?.includes(value) ? value : null;
    }

    // Only add the field if we have a valid value
    if (processedValue !== null) {
      const newValues = values.filter(v => v.fieldId !== fieldId);
      newValues.push({ fieldId, value: processedValue });
      onChange(newValues);
    }
  };

  const getValue = (fieldId: string): string => {
    const fieldValue = values.find(v => v.fieldId === fieldId)?.value;
    return fieldValue?.toString() || '';
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={getValue(field.id)}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === 'date' ? (
            <input
              type="date"
              value={getValue(field.id)}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            />
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={getValue(field.id)}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              placeholder={`Enter ${field.name.toLowerCase()}`}
            />
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No custom fields configured. Add them in Settings → Pipeline.
        </p>
      )}
    </div>
  );
};