import React, { useState } from 'react';
import { Users, Tag } from 'lucide-react';
import SupplierManagement from './SupplierManagement';
import ProductGradeManagement from './ProductGradeManagement';

type AdminSection = 'suppliers' | 'grades';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>('suppliers');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Administration</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSection('suppliers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeSection === 'suppliers'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Supplier Management</span>
          </button>
          <button
            onClick={() => setActiveSection('grades')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeSection === 'grades'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Tag className="h-5 w-5" />
            <span>Product Grades</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeSection === 'suppliers' ? <SupplierManagement /> : <ProductGradeManagement />}
      </div>
    </div>
  );
}