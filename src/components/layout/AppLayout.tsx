import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const { theme } = useApp();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-[#FAFAFA] text-gray-900'
    }`}>
      {/* AbleSign-style top horizontal navigation bar */}
      <Navbar />

      {/* Main page content container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Global toasts container */}
      <ToastContainer />
    </div>
  );
};
