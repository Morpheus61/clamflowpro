import React from 'react';
import { Shell, Fish, Package, Settings, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <header className="container mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-6">
          <Shell className="h-16 w-16 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ClamFlow™ Pro
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
          Streamline your clam processing operations with our comprehensive management system
        </p>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ActionCard
            icon={<Fish className="h-8 w-8" />}
            title="Clam Purchase"
            description="Record new clam purchases from fishermen with automatic PO generation"
            features={[
              'Supplier management',
              'Price calculation',
              'Quality inspection',
              'Receipt generation'
            ]}
          />
          
          <ActionCard
            icon={<Package className="h-8 w-8" />}
            title="Production Management"
            description="Track and manage finished products inventory"
            features={[
              'Shell-on processing',
              'Meat extraction',
              'Yield tracking',
              'Lot management'
            ]}
          />
          
          <ActionCard
            icon={<Settings className="h-8 w-8" />}
            title="Administration"
            description="System configuration and reporting dashboard"
            features={[
              'User management',
              'Price configuration',
              'Reports generation',
              'System settings'
            ]}
          />
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-slate-400">
        <p>© 2024 ClamFlow™ Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

function ActionCard({ icon, title, description, features }: ActionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105">
      <div className="p-6">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Access {title}
        </button>
      </div>
    </div>
  );
}