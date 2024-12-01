import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCustomFieldsStore } from '../../store/customFieldsStore';
import type { CustomFieldType } from '../../types/customField';

export const CustomFieldsManager = () => {
  const { fields, addField, deleteField, loading, error } = useCustomFieldsStore();
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as CustomFieldType,
    required: false,
    options: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const options = newField.type === 'select' 
        ? newField.options
            .split(',')
            .map(o => o.trim())
            .filter(o => o.length > 0)
        : undefined;

      await addField({
        name: newField.name,
        type: newField.type,
        required: newField.required,
        options: options,
      });

      setNewField({ name: '', type: 'text', required: false, options: '' });
      setIsAddingField(false);
    } catch (err: any) {
      console.error('Error adding custom field:', err);
      alert(err.message || 'Failed to add custom field. Please try again.');
    }
  };

  const handleDelete = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this custom field? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteField(fieldId);
    } catch (err: any) {
      console.error('Error deleting custom field:', err);
      alert(err.message || 'Failed to delete custom field. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Custom Fields</h2>
        <button
          onClick={() => setIsAddingField(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {isAddingField && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name
              </label>
              <input
                type="text"
                required
                value={newField.name}
                onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={newField.type}
                onChange={(e) => {
                  const type = e.target.value as CustomFieldType;
                  setNewField(prev => ({
                    ...prev,
                    type,
                    options: type === 'select' ? prev.options : ''
                  }));
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
            </div>

            {newField.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={newField.options}
                  onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                  placeholder="Option 1, Option 2, Option 3"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter options separated by commas
                </p>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={newField.required}
                onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingField(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {loading ? 'Adding...' : 'Add Field'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between p-4 border rounded-md"
          >
            <div>
              <h3 className="font-medium">{field.name}</h3>
              <p className="text-sm text-gray-500">
                Type: {field.type}
                {field.required && ' • Required'}
                {field.options && ` • Options: ${field.options.join(', ')}`}
              </p>
            </div>
            <button
              onClick={() => handleDelete(field.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {fields.length === 0 && !isAddingField && (
          <p className="text-center text-gray-500 py-4">
            No custom fields added yet. Click "Add Field" to create your first custom field.
          </p>
        )}
      </div>
    </div>
  );
};