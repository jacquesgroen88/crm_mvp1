export type UserRole = 'owner' | 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  organizationId: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  jobTitle?: string;
  createdAt: string;
  updatedAt: string;
}