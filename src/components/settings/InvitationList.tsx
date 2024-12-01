import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, X } from 'lucide-react';
import type { Invitation } from '../../types/invitation';

interface InvitationListProps {
  invitations: Invitation[];
  onCancelInvitation: (id: string) => void;
  loading?: boolean;
}

export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  onCancelInvitation,
  loading
}) => {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{invitation.email}</h4>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <span>Invited {formatDistanceToNow(new Date(invitation.createdAt))} ago</span>
                <span>•</span>
                <span className="capitalize">{invitation.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onCancelInvitation(invitation.id)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};