import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, PenTool, TrendingUp, ShieldCheck, Leaf } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: AppView.ACTION_LOGGER, label: 'Impact Engine', icon: <PenTool size={20} /> },
    { id: AppView.PREDICTIVE_ADVISOR, label: 'Advisor', icon: <TrendingUp size={20} /> },
    { id: AppView.GOVERNANCE_AUDIT, label: 'Governance', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
            <Leaf className="text-white w-6 h-6" />
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight">GreenLens AI</h1>
            <p className="text-xs text-slate-400">Enterprise Edition</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                JD
            </div>
            <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-slate-500">Sustainability Lead</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
