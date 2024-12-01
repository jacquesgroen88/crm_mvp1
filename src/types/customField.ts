export type CustomFieldType = 'text' | 'number' | 'date' | 'select';

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[]; // For select type fields
  organizationId: string;
  createdAt: string;
}

// Update Deal type to include custom fields
export interface CustomFieldValue {
  fieldId: string;
  value: string | number | null;
}