import React, { useEffect } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { User } from 'lucide-react';

interface DealOwnerSelectProps {
  currentOwnerId: string;
  onOwnerChange: (userId: string) => void;
  disabled?: boolean;
}

export const DealOwnerSelect: React.FC<DealOwnerSelectProps> = ({
  currentOwnerId,
  onOwnerChange,
  disabled
}) => {
  const { members, subscribeToMembers } = useTeamStore();

  useEffect(() => {
    const unsubscribe = subscribeToMembers();
    return () => unsubscribe();
  }, []);

  const getInitialsColor = (name: string) => {
    if (!name) return 'bg-navy-700';
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

  const currentOwner = members.find(m => m.uid === currentOwnerId);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Deal Owner
      </label>
      <div className="relative">
        <select
          value={currentOwnerId}
          onChange={(e) => onOwnerChange(e.target.value)}
          disabled={disabled}
          className="block w-full pl-12 pr-4 py-2.5 bg-navy-900 border border-navy-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        >
          <option value="" disabled>Select owner</option>
          {members.map((member) => (
            <option key={member.uid} value={member.uid} className="bg-navy-800 text-white">
              {member.displayName || member.email}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {currentOwner?.photoURL ? (
            <img
              src={currentOwner.photoURL}
              alt={currentOwner.displayName || currentOwner.email}
              className="w-6 h-6 rounded-full ring-2 ring-navy-600"
            />
          ) : (
            <div className={`w-6 h-6 rounded-full ${getInitialsColor(currentOwner?.displayName || '')} ring-2 ring-navy-600 flex items-center justify-center`}>
              {currentOwner ? (
                <span className="text-xs font-medium text-white">
                  {getInitials(currentOwner.displayName || currentOwner.email || '')}
                </span>
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Select who is responsible for managing this deal
      </p>
    </div>
  );
};