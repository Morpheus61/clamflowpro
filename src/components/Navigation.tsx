import React from 'react';
import { Menu, Shell, Package, FileText, Settings, Scale, ArrowLeft } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function Navigation({ activeView, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Menu</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shell className="w-8 h-8" />
              <span className="text-xl font-bold">ClamFlow™</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <NavLink
              icon={<Package />}
              text="Production"
              isActive={activeView === 'production'}
              onClick={() => onNavigate('production')}
            />
            <NavLink
              icon={<FileText />}
              text="Quality Control"
              isActive={activeView === 'quality'}
              onClick={() => onNavigate('quality')}
            />
            <NavLink
              icon={<Settings />}
              text="Admin"
              isActive={activeView === 'admin'}
              onClick={() => onNavigate('admin')}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

function NavLink({ icon, text, isActive, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-indigo-700 text-white' 
          : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
        }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}