import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ActionLogger from './components/ActionLogger';
import PredictiveAdvisor from './components/PredictiveAdvisor';
import GovernanceLog from './components/GovernanceLog';
import { ActionLog, AppView, MetricImpact } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // Mock initial data
  const [logs, setLogs] = useState<ActionLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'Replaced 100 halogen bulbs with LEDs in the main lobby.',
      user: 'Jane Smith',
      department: 'Facilities',
      metrics: { co2_kg: 45, water_liters: 0, waste_kg: 0.5 },
      aiAnalysis: { confidence_score: 95, reasoning: 'Standard conversion for LED efficiency.', methodology: 'EPA Greenhouse Gas Equivalencies', sources: ['EPA'] },
      status: 'verified'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      description: 'Implemented double-sided printing policy in Finance dept.',
      user: 'Mike Johnson',
      department: 'Finance',
      metrics: { co2_kg: 15, water_liters: 200, waste_kg: 12 },
      aiAnalysis: { confidence_score: 88, reasoning: 'Estimated reduction in paper usage by 40%.', methodology: 'Paper Lifecycle Assessment', sources: ['Environmental Paper Network'] },
      status: 'verified'
    }
  ]);

  const addLog = (log: ActionLog) => {
    setLogs([log, ...logs]);
    setCurrentView(AppView.DASHBOARD); // Return to dashboard after logging
  };

  const getCumulativeMetrics = (): MetricImpact => {
    return logs.reduce((acc, log) => ({
      co2_kg: acc.co2_kg + log.metrics.co2_kg,
      water_liters: acc.water_liters + log.metrics.water_liters,
      waste_kg: acc.waste_kg + log.metrics.waste_kg
    }), { co2_kg: 0, water_liters: 0, waste_kg: 0 });
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard logs={logs} />;
      case AppView.ACTION_LOGGER:
        return <ActionLogger onAddLog={addLog} />;
      case AppView.PREDICTIVE_ADVISOR:
        return <PredictiveAdvisor currentMetrics={getCumulativeMetrics()} />;
      case AppView.GOVERNANCE_AUDIT:
        return <GovernanceLog logs={logs} />;
      default:
        return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
