import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  BarChart2
} from 'lucide-react';
import { AddDealModal } from '../deals/AddDealModal';
import { MobileHeader } from './MobileHeader';
import { SidebarNav } from './SidebarNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-navy-900">
      {/* Mobile Header */}
      <MobileHeader 
        isMenuOpen={isMobileMenuOpen}
        onMenuToggle={setIsMobileMenuOpen}
      />

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-navy-900">
            <span className="text-xl font-bold text-white tracking-tight">NextClient CRM</span>
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <SidebarNav 
            onNavClick={() => setIsMobileMenuOpen(false)}
            onAddDeal={() => {
              setIsAddDealModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <main className="h-full">{children}</main>
      </div>

      {/* Add Deal Modal */}
      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        initialStage={undefined}
      />
    </div>
  );
};