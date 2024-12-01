import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useTeamStore } from './teamStore';
import type { UserRole } from '../types/user';

interface UserData {
  uid: string;
  email: string;
  organizationId: string;
  role: UserRole;
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signUp: (email: string, password: string, companyName?: string, inviteCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<UserData, 'uid'>;
          set({ 
            user: {
              uid: firebaseUser.uid,
              ...userData
            },
            loading: false,
            error: null,
            initialized: true
          });
        } else {
          set({ 
            user: null, 
            loading: false,
            error: null,
            initialized: true
          });
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        set({ 
          user: null, 
          error: error.message,
          loading: false,
          initialized: true
        });
      }
    } else {
      set({ 
        user: null,
        loading: false,
        error: null,
        initialized: true
      });
    }
  });

  return {
    user: null,
    loading: true,
    error: null,
    initialized: false,
    
    signUp: async (email, password, companyName, inviteCode) => {
      try {
        set({ loading: true, error: null });
        
        // Create Firebase user
        const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
        
        let organizationId: string;
        let role: UserRole;

        if (inviteCode) {
          // Validate invite code and join existing organization
          const inviteData = await useTeamStore.getState().validateInviteCode(inviteCode);
          if (!inviteData) {
            throw new Error('Invalid or expired invitation code');
          }
          organizationId = inviteData.organizationId;
          role = inviteData.role;
        } else if (companyName) {
          // Create new organization
          organizationId = nanoid();
          role = 'owner';
          
          await setDoc(doc(db, 'organizations', organizationId), {
            name: companyName,
            createdAt: new Date().toISOString(),
            ownerId: firebaseUser.uid
          });
        } else {
          throw new Error('Either company name or invite code is required');
        }
        
        // Create user document
        const userData = {
          email,
          organizationId,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        
        set({ 
          user: {
            uid: firebaseUser.uid,
            ...userData
          },
          loading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Signup error:', error);
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    signIn: async (email, password) => {
      try {
        set({ loading: true, error: null });
        await signInWithEmailAndPassword(auth, email, password);
        set({ loading: false });
      } catch (error: any) {
        console.error('Sign in error:', error);
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    signOut: async () => {
      try {
        await firebaseSignOut(auth);
        set({ user: null });
      } catch (error: any) {
        console.error('Sign out error:', error);
        set({ error: error.message });
        throw error;
      }
    }
  };
});