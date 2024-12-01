import React, { useEffect } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { MemberList } from './MemberList';
import { InviteTeamMember } from './InviteTeamMember';

export const TeamSettings = () => {
  const { members, subscribeToMembers } = useTeamStore();

  useEffect(() => {
    const unsubscribe = subscribeToMembers();
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team members and their access permissions
        </p>
      </div>

      {/* Invite Section */}
      <InviteTeamMember />

      {/* Active Members */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Members</h3>
        <MemberList members={members} />
      </div>
    </div>
  );
};