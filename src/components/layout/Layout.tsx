import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../LoadingScreen';

const Layout: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-6">
          <Breadcrumb />
        </div>
        
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
        <p> {new Date().getFullYear()} ETH Node Deployer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;