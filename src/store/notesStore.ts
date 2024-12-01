import { create } from 'zustand';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './authStore';
import type { Note } from '../types/note';

interface UploadProgress {
  id: string;
  progress: number;
  fileName: string;
}

interface NotesState {
  notes: Note[];
  uploadProgress: UploadProgress[];
  loading: boolean;
  error: string | null;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'organizationId' | 'createdBy'>, images?: File[]) => Promise<void>;
  subscribeToNotes: (dealId: string) => () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  uploadProgress: [],
  loading: false,
  error: null,

  subscribeToNotes: (dealId: string) => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return () => {};

    const q = query(
      collection(db, 'notes'),
      where('dealId', '==', dealId),
      where('organizationId', '==', user.organizationId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notes = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() 
              ? data.createdAt.toDate().toISOString() 
              : new Date().toISOString()
          };
        }) as Note[];
        set({ notes, error: null });
      },
      (error) => {
        console.error('Error in notes subscription:', error);
        set({ error: error.message });
      }
    );

    return unsubscribe;
  },

  addNote: async (noteData, images = []) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user?.organizationId) {
        throw new Error('User organization not found');
      }

      // Upload images with progress tracking
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          try {
            const uploadId = uuidv4();
            const fileName = `${uploadId}-${image.name}`;
            const imageRef = ref(storage, `notes/${fileName}`);

            // Create upload task
            const uploadTask = uploadBytesResumable(imageRef, image);

            // Track progress
            const progressPromise = new Promise<string>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  set(state => ({
                    uploadProgress: [
                      ...state.uploadProgress.filter(p => p.id !== uploadId),
                      { id: uploadId, progress, fileName: image.name }
                    ]
                  }));
                },
                (error) => {
                  reject(error);
                },
                async () => {
                  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  // Remove progress indicator when complete
                  set(state => ({
                    uploadProgress: state.uploadProgress.filter(p => p.id !== uploadId)
                  }));
                  resolve(downloadUrl);
                }
              );
            });

            return progressPromise;
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
        })
      );

      const newNote = {
        ...noteData,
        organizationId: user.organizationId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        type: noteData.type || 'note',
        images: imageUrls
      };

      await addDoc(collection(db, 'notes'), newNote);
      set({ loading: false, error: null });
    } catch (error: any) {
      console.error('Error adding note:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));