import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import type { Deal, DealStageChange } from '../types/deal';

interface KanbanState {
  deals: Deal[];
  searchQuery: string;
  showArchived: boolean;
  loading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setShowArchived: (show: boolean) => void;
  filteredDeals: () => Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' | 'stageHistory' | 'ownerId' | 'ownerName' | 'ownerPhotoURL' | 'archived'>) => Promise<void>;
  updateDeal: (dealId: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
  moveDeal: (dealId: string, fromStage: string, toStage: string) => Promise<void>;
  subscribeToDeals: () => () => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  deals: [],
  searchQuery: '',
  showArchived: false,
  loading: false,
  error: null,
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setShowArchived: (show: boolean) => {
    set({ showArchived: show });
  },

  filteredDeals: () => {
    const { deals, searchQuery, showArchived } = get();
    let filtered = deals;

    // Filter archived deals
    if (!showArchived) {
      filtered = filtered.filter(deal => !deal.archived);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(query) ||
        deal.company.toLowerCase().includes(query) ||
        (deal.contact?.name || '').toLowerCase().includes(query) ||
        (deal.contact?.email || '').toLowerCase().includes(query) ||
        (deal.contact?.phone || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  },
  
  subscribeToDeals: () => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return () => {};

    const q = query(
      collection(db, 'deals'),
      where('organizationId', '==', user.organizationId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deal[];
      
      set({ deals });
    });

    return unsubscribe;
  },
  
  addDeal: async (dealData) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.organizationId) {
        throw new Error('User organization not found');
      }
      
      const now = new Date().toISOString();
      const newDeal = {
        ...dealData,
        organizationId: user.organizationId,
        ownerId: user.uid,
        ownerName: user.displayName || user.email || '',
        ownerPhotoURL: user.photoURL || '',
        createdAt: now,
        updatedAt: now,
        archived: false,
        stageHistory: [{
          from: '',
          to: dealData.stage,
          timestamp: now
        }]
      };
      
      await addDoc(collection(db, 'deals'), newDeal);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateDeal: async (dealId, dealData) => {
    try {
      set({ loading: true, error: null });
      const dealRef = doc(db, 'deals', dealId);
      const currentDeal = get().deals.find(d => d.id === dealId);
      
      if (!currentDeal) {
        throw new Error('Deal not found');
      }

      const updates: Partial<Deal> = {
        ...dealData,
        updatedAt: new Date().toISOString(),
      };

      // Only include owner fields if they are provided
      if (dealData.ownerId) {
        updates.ownerId = dealData.ownerId;
        updates.ownerName = dealData.ownerName || '';
        updates.ownerPhotoURL = dealData.ownerPhotoURL || '';
      }

      // Track stage changes and handle archiving
      if (dealData.stage && dealData.stage !== currentDeal.stage) {
        const stageChange: DealStageChange = {
          from: currentDeal.stage,
          to: dealData.stage,
          timestamp: new Date().toISOString()
        };
        updates.stageHistory = [...(currentDeal.stageHistory || []), stageChange];

        // Auto-archive when marked as lost
        if (dealData.stage === 'Closed Lost') {
          updates.archived = true;
        }
      }

      await updateDoc(dealRef, updates);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteDeal: async (dealId) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'deals', dealId));
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  moveDeal: async (dealId, fromStage, toStage) => {
    try {
      set({ loading: true, error: null });
      const dealRef = doc(db, 'deals', dealId);
      const currentDeal = get().deals.find(d => d.id === dealId);
      
      if (!currentDeal) {
        throw new Error('Deal not found');
      }

      const now = new Date().toISOString();
      const stageChange: DealStageChange = {
        from: fromStage,
        to: toStage,
        timestamp: now
      };

      const updates: Partial<Deal> = {
        stage: toStage,
        updatedAt: now,
        stageHistory: [...(currentDeal.stageHistory || []), stageChange]
      };

      // Auto-archive when moved to lost
      if (toStage === 'Closed Lost') {
        updates.archived = true;
      }

      await updateDoc(dealRef, updates);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));