import React from 'react';
import { CampaignGenerator } from './components/CampaignGenerator';
import { Rocket } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Rocket className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">MarketMind<span className="text-indigo-600">AI</span></span>
            </div>
            <div className="flex items-center">
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">v1.0 Beta</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CampaignGenerator />
      </main>
    </div>
  );
}

export default App;