import React from 'react';
import { Shell, ClipboardList, Package, Users } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shell className="h-8 w-8" />
          <span className="text-xl font-bold">ClamFlow™ Pro</span>
        </div>
        <div className="flex space-x-6">
          <NavItem icon={<ClipboardList />} text="Purchase Orders" />
          <NavItem icon={<Package />} text="Lots" />
          <NavItem icon={<Users />} text="Suppliers" />
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <button className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
      {icon}
      <span>{text}</span>
    </button>
  );
}