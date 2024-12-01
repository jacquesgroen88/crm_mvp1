import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: (isOpen: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMenuOpen,
  onMenuToggle,
}) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-navy-800 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-full">
          <button
            className="p-2 rounded-md text-white hover:bg-navy-700"
            onClick={() => onMenuToggle(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-white mx-auto">NextClient CRM</span>
        </div>
      </div>
    </div>
  );
};