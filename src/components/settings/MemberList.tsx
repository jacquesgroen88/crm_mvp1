import React from 'react';
import { Mail, Shield } from 'lucide-react';
import type { UserProfile } from '../../types/user';

interface MemberListProps {
  members: UserProfile[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.uid}
          className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {member.photoURL ? (
                <img
                  src={member.photoURL}
                  alt={member.displayName || member.email}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {member.displayName || member.email}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {member.jobTitle && (
              <span className="text-sm text-gray-500">{member.jobTitle}</span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                member.role
              )}`}
            >
              <Shield className="w-3 h-3 mr-1" />
              {member.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};