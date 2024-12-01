import { UserRole } from './user';

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}