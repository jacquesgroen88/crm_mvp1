import React, { useMemo } from 'react';
import { User } from 'lucide-react';
import type { Deal } from '../../types/deal';
import type { UserProfile } from '../../types/user';

interface TeamMemberStatsProps {
  deals: Deal[];
  members: UserProfile[];
  dateRange: string;
}

export const TeamMemberStats: React.FC<TeamMemberStatsProps> = ({ deals, members, dateRange }) => {
  const memberStats = useMemo(() => {
    return members.map(member => {
      const memberDeals = deals.filter(d => d.ownerId === member.uid);
      const wonDeals = memberDeals.filter(d => d.stage === 'Closed Won');
      const lostDeals = memberDeals.filter(d => d.stage === 'Closed Lost');
      const totalValue = memberDeals.reduce((sum, deal) => sum + deal.value, 0);
      const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
      const winRate = wonDeals.length + lostDeals.length > 0
        ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
        : 0;

      return {
        member,
        deals: memberDeals.length,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        totalValue,
        wonValue,
        winRate
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [deals, members]);

  const getInitialsColor = (name: string) => {
    if (!name) return 'bg-gray-500';
    const colors = [
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Member
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Value
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Won Value
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deals
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Won/Lost
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Win Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {memberStats.map(({ member, deals, wonDeals, lostDeals, totalValue, wonValue, winRate }) => (
            <tr key={member.uid} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {member.photoURL ? (
                    <img
                      src={member.photoURL}
                      alt={member.displayName || member.email}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${getInitialsColor(member.displayName || '')} flex items-center justify-center`}>
                      {member.displayName ? (
                        <span className="text-xs font-medium text-white">
                          {getInitials(member.displayName)}
                        </span>
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.displayName || member.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.jobTitle || 'Team Member'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                ${totalValue.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                ${wonValue.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {deals}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {wonDeals}/{lostDeals}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  winRate >= 70 ? 'bg-green-100 text-green-800' :
                  winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {winRate.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};