import { create } from 'zustand';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import type { Stage } from '../types/stage';

interface PipelineState {
  stages: Stage[];
  loading: boolean;
  error: string | null;
  updateStages: (stages: Stage[]) => Promise<void>;
  subscribeToPipeline: () => () => void;
}

const defaultStages: Stage[] = [
  { id: '1', name: 'Lead', color: '#818CF8' },
  { id: '2', name: 'Contact Made', color: '#60A5FA' },
  { id: '3', name: 'Proposal Sent', color: '#34D399' },
  { id: '4', name: 'Negotiation', color: '#FBBF24' },
  { id: '5', name: 'Closed Won', color: '#10B981' },
  { id: '6', name: 'Closed Lost', color: '#EF4444' },
];

export const usePipelineStore = create<PipelineState>((set) => ({
  stages: defaultStages,
  loading: false,
  error: null,

  subscribeToPipeline: () => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return () => {};

    const pipelineRef = doc(db, 'pipelines', user.organizationId);
    
    // First, try to get the existing pipeline
    getDoc(pipelineRef).then(async (doc) => {
      if (!doc.exists()) {
        // If no pipeline exists, create one with default stages
        await setDoc(pipelineRef, { stages: defaultStages });
        set({ stages: defaultStages });
      }
    });

    // Subscribe to changes
    const unsubscribe = onSnapshot(
      pipelineRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          set({ stages: data.stages || defaultStages });
        }
      },
      (error) => {
        console.error('Error in pipeline subscription:', error);
        set({ error: error.message });
      }
    );

    return unsubscribe;
  },

  updateStages: async (stages: Stage[]) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.organizationId) {
        throw new Error('User organization not found');
      }

      const pipelineRef = doc(db, 'pipelines', user.organizationId);
      await setDoc(pipelineRef, { stages }, { merge: true });
      
      set({ loading: false });
    } catch (error: any) {
      console.error('Error updating pipeline stages:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));