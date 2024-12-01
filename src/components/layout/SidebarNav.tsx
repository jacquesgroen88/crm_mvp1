import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Plus, BarChart2 } from 'lucide-react';

interface SidebarNavProps {
  onNavClick: () => void;
  onAddDeal: () => void;
  onSignOut: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  onNavClick,
  onAddDeal,
  onSignOut,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/dashboard"
          onClick={onNavClick}
          className={`flex items-center px-4 py-2 text-gray-300 rounded-md transition-colors ${
            isActive('/dashboard') ? 'bg-navy-700 text-white' : 'hover:bg-navy-700 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/reports"
          onClick={onNavClick}
          className={`flex items-center px-4 py-2 text-gray-300 rounded-md transition-colors ${
            isActive('/reports') ? 'bg-navy-700 text-white' : 'hover:bg-navy-700 hover:text-white'
          }`}
        >
          <BarChart2 className="h-5 w-5 mr-3" />
          Reports
        </Link>
        <Link
          to="/settings"
          onClick={onNavClick}
          className={`flex items-center px-4 py-2 text-gray-300 rounded-md transition-colors ${
            isActive('/settings') ? 'bg-navy-700 text-white' : 'hover:bg-navy-700 hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
      </nav>

      {/* Add Deal Button */}
      <div className="px-4 py-4">
        <button
          onClick={onAddDeal}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Sign Out Button */}
      <div className="px-4 py-4 border-t border-navy-700">
        <button
          onClick={onSignOut}
          className="w-full flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-navy-700 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </>
  );
};