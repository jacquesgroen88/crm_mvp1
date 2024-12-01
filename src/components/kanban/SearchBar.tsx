import React from 'react';
import { Search, X, Archive } from 'lucide-react';
import { useKanbanStore } from '../../store/kanbanStore';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery, showArchived, setShowArchived } = useKanbanStore();

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 px-4 pt-4 lg:px-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-2.5 border border-navy-600 rounded-lg bg-navy-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
          placeholder="Search deals..."
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowArchived(!showArchived)}
        className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
          showArchived 
            ? 'bg-indigo-600 text-white border-indigo-500'
            : 'bg-transparent text-gray-400 border-navy-600 hover:border-indigo-500 hover:text-indigo-400'
        } transition-colors whitespace-nowrap`}
      >
        <Archive className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </span>
      </button>
    </div>
  );
};