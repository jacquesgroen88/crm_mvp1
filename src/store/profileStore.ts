import { create } from 'zustand';
import { db, storage } from '../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from './authStore';

interface ProfileState {
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<{ displayName: string; phoneNumber: string; jobTitle: string }>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,
  error: null,

  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.uid) {
        throw new Error('User not found');
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      // Update local user state
      const updatedDoc = await getDoc(userRef);
      const updatedData = updatedDoc.data();
      useAuthStore.setState((state) => ({
        ...state,
        user: {
          ...state.user!,
          ...updatedData,
        },
      }));

      set({ loading: false });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  uploadProfileImage: async (file: File) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.uid) {
        throw new Error('User not found');
      }

      // Upload image to Storage
      const imageRef = ref(storage, `profiles/${user.uid}/avatar`);
      await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(imageRef);

      // Update user document with new photo URL
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      // Update local user state
      const updatedDoc = await getDoc(userRef);
      const updatedData = updatedDoc.data();
      useAuthStore.setState((state) => ({
        ...state,
        user: {
          ...state.user!,
          ...updatedData,
        },
      }));

      set({ loading: false });
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));