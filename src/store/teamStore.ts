import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { nanoid } from 'nanoid';
import type { UserProfile, UserRole } from '../types/user';

interface TeamState {
  members: UserProfile[];
  loading: boolean;
  error: string | null;
  generateInviteCode: () => Promise<string>;
  validateInviteCode: (code: string) => Promise<{ organizationId: string; role: UserRole } | null>;
  subscribeToMembers: () => () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  loading: false,
  error: null,

  subscribeToMembers: () => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return () => {};

    const q = query(
      collection(db, 'users'),
      where('organizationId', '==', user.organizationId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as UserProfile[];
        set({ members });
      },
      (error) => {
        console.error('Error in members subscription:', error);
        set({ error: error.message });
      }
    );

    return unsubscribe;
  },

  generateInviteCode: async () => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.organizationId || !['owner', 'admin'].includes(user.role)) {
        throw new Error('Insufficient permissions');
      }

      const code = nanoid(8).toUpperCase();
      const inviteRef = doc(db, 'inviteCodes', code);
      
      await setDoc(inviteRef, {
        organizationId: user.organizationId,
        role: 'member',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdBy: user.uid
      });

      set({ loading: false });
      return code;
    } catch (error: any) {
      console.error('Error generating invite code:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  validateInviteCode: async (code: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!code) {
        set({ error: 'Invitation code is required', loading: false });
        return null;
      }

      const inviteRef = doc(db, 'inviteCodes', code.toUpperCase());
      const inviteDoc = await getDoc(inviteRef);

      if (!inviteDoc.exists()) {
        set({ error: 'Invalid invitation code', loading: false });
        return null;
      }

      const data = inviteDoc.data();
      const expiresAt = new Date(data.expiresAt);
      
      if (expiresAt < new Date()) {
        await deleteDoc(inviteRef); // Clean up expired code
        set({ error: 'Invitation code has expired', loading: false });
        return null;
      }

      // Delete the code after successful validation
      await deleteDoc(inviteRef);
      
      set({ loading: false });
      return {
        organizationId: data.organizationId,
        role: data.role
      };
    } catch (error: any) {
      console.error('Error validating invite code:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  }
}));