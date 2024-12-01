import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import type { CustomField, CustomFieldType } from '../types/customField';

interface CustomFieldsState {
  fields: CustomField[];
  loading: boolean;
  error: string | null;
  addField: (field: Omit<CustomField, 'id' | 'createdAt' | 'organizationId'>) => Promise<void>;
  deleteField: (fieldId: string) => Promise<void>;
  subscribeToFields: () => () => void;
}

export const useCustomFieldsStore = create<CustomFieldsState>((set, get) => ({
  fields: [],
  loading: false,
  error: null,

  subscribeToFields: () => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) {
      console.error('No organization ID found in user data:', user);
      return () => {};
    }

    const q = query(
      collection(db, 'customFields'),
      where('organizationId', '==', user.organizationId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fields = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CustomField[];
        set({ fields });
      },
      (error) => {
        console.error('Error in custom fields subscription:', error);
        set({ error: error.message });
      }
    );

    return unsubscribe;
  },

  addField: async (fieldData) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.organizationId) {
        throw new Error('User organization not found');
      }

      // Validate field name
      const name = fieldData.name?.trim();
      if (!name) {
        throw new Error('Field name is required');
      }

      // Validate field type
      if (!['text', 'number', 'date', 'select'].includes(fieldData.type)) {
        throw new Error('Invalid field type');
      }

      // Create the base field data
      const newField: Omit<CustomField, 'id'> = {
        name,
        type: fieldData.type,
        required: Boolean(fieldData.required),
        organizationId: user.organizationId,
        createdAt: new Date().toISOString()
      };

      // Only add options if it's a select field and options are provided
      if (fieldData.type === 'select' && fieldData.options) {
        const options = fieldData.options
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
        
        if (options.length === 0) {
          throw new Error('Select fields must have at least one valid option');
        }
        
        newField.options = options;
      }

      await addDoc(collection(db, 'customFields'), newField);
      set({ loading: false });
    } catch (error: any) {
      console.error('Error adding custom field:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteField: async (fieldId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'customFields', fieldId));
      set({ loading: false });
    } catch (error: any) {
      console.error('Error deleting custom field:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));