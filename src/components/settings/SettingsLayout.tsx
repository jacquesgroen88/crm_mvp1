import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { GitBranch, User, Users, Wrench } from 'lucide-react';

export const SettingsLayout = () => {
  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <nav className="space-y-1">
          <NavLink
            to="/settings/profile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </NavLink>
          <NavLink
            to="/settings/team"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Team
          </NavLink>
          <NavLink
            to="/settings/pipeline"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <GitBranch className="w-5 h-5 mr-3" />
            Pipeline
          </NavLink>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};