import React, { useState } from 'react';
import { MetricImpact, ScenarioResult } from '../types';
import { runPredictiveScenario } from '../services/geminiService';
import { ArrowRight, Loader2, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface PredictiveAdvisorProps {
  currentMetrics: MetricImpact;
}

const PredictiveAdvisor: React.FC<PredictiveAdvisorProps> = ({ currentMetrics }) => {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    try {
      const data = await runPredictiveScenario(currentMetrics, scenario);
      setResult(data);
    } catch (e) {
      alert("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Predictive Sustainability Advisor</h2>
        <p className="text-slate-500">Simulate strategic changes and forecast their impact on your ESG goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Simulation Parameters</h3>
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">"What if we..."</label>
                <textarea
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    placeholder="e.g., Transition 30% of the fleet to electric vehicles by next quarter"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                />
            </div>
            <button
                onClick={handleSimulate}
                disabled={loading || !scenario}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Target className="w-4 h-4 mr-2" />}
                Run Simulation
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Current Baseline (Annualized)</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded">
                        <div className="text-xs text-slate-500">CO2</div>
                        <div className="font-mono text-sm">{currentMetrics.co2_kg.toFixed(0)}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                        <div className="text-xs text-slate-500">Water</div>
                        <div className="font-mono text-sm">{currentMetrics.water_liters.toFixed(0)}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                        <div className="text-xs text-slate-500">Waste</div>
                        <div className="font-mono text-sm">{currentMetrics.waste_kg.toFixed(0)}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Results Section */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${!result && 'flex items-center justify-center bg-slate-50 border-dashed'}`}>
            {!result ? (
                <div className="text-center text-slate-400">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Run a simulation to see projected outcomes.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800">Projected Outcomes</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div>
                                <span className="text-sm text-emerald-800 font-medium">CO2 Impact</span>
                                <div className="text-2xl font-bold text-emerald-900">{result.projectedMetrics.co2_kg.toFixed(0)} <span className="text-xs font-normal">kg</span></div>
                            </div>
                            <div className={`text-lg font-bold ${result.impactChange.co2_percent < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {result.impactChange.co2_percent > 0 ? '+' : ''}{result.impactChange.co2_percent}%
                            </div>
                        </div>
                        
                         {/* Other metrics simplified for view */}
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Strategic Analysis</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{result.analysis}</p>
                        
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Recommendations</h4>
                        <ul className="space-y-2">
                            {result.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-600">
                                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAdvisor;
