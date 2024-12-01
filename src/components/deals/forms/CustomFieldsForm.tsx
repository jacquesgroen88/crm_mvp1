import React from 'react';
import { CustomFieldsSection } from '../CustomFieldsSection';
import type { CustomFieldValue } from '../../../types/customField';

interface CustomFieldsFormProps {
  values: CustomFieldValue[];
  onChange: (values: CustomFieldValue[]) => void;
}

export const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  values,
  onChange
}) => {
  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700">
        <h3 className="text-sm font-medium text-white">Custom Fields</h3>
      </div>
      <div className="p-6">
        <CustomFieldsSection
          values={values}
          onChange={onChange}
        />
      </div>
    </div>
  );
};