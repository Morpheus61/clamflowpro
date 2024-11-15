import React from 'react';
import { Shell } from 'lucide-react';
import ProductionStream from './components/production/ProductionStream';
import QualityControlStream from './components/quality/QualityControlStream';
import AdminPanel from './components/admin/AdminPanel';
import { LotProvider } from './components/LotContext';
import { useNotification } from './hooks/useNotification';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';

type ViewType = 'home' | 'production' | 'quality' | 'admin';

function App() {
  const [activeView, setActiveView] = React.useState<ViewType>('home');

  const handleNavigate = (view: ViewType) => {
    setActiveView(view);
  };

  if (activeView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shell className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ClamFlow™ Pro
            </h1>
            <p className="text-blue-100 text-sm">
              Clam Processing Management System
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <MenuButton
              title="Production Stream"
              description="Manage clam processing operations"
              onClick={() => handleNavigate('production')}
              bgColor="bg-green-500"
              hoverColor="hover:bg-green-600"
            />
            <MenuButton
              title="Quality Control"
              description="Monitor and verify product quality"
              onClick={() => handleNavigate('quality')}
              bgColor="bg-blue-500"
              hoverColor="hover:bg-blue-600"
            />
            <MenuButton
              title="Administration"
              description="Manage suppliers and product grades"
              onClick={() => handleNavigate('admin')}
              bgColor="bg-purple-500"
              hoverColor="hover:bg-purple-600"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LotProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation activeView={activeView} onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8">
          {activeView === 'production' && <ProductionStream />}
          {activeView === 'quality' && <QualityControlStream />}
          {activeView === 'admin' && <AdminPanel />}
        </main>
      </div>
    </LotProvider>
  );
}

interface MenuButtonProps {
  title: string;
  description: string;
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
}

function MenuButton({ title, description, onClick, bgColor, hoverColor }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full ${bgColor} ${hoverColor} text-white rounded-xl shadow-xl overflow-hidden transition transform hover:scale-105 text-left p-6`}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}

export default App;