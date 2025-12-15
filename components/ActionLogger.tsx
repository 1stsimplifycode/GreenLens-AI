import React, { useState } from 'react';
import { ActionLog } from '../types';
import { verifyActionImpact } from '../services/geminiService';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Save, RefreshCw } from 'lucide-react';

interface ActionLoggerProps {
  onAddLog: (log: ActionLog) => void;
}

const ActionLogger: React.FC<ActionLoggerProps> = ({ onAddLog }) => {
  const [description, setDescription] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<Partial<ActionLog> | null>(null);

  const handleVerify = async () => {
    if (!description.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await verifyActionImpact(description);
      setVerificationResult({
        description,
        timestamp: new Date().toISOString(),
        user: 'Current User',
        metrics: result.metrics,
        aiAnalysis: result.aiAnalysis,
        status: result.aiAnalysis.confidence_score > 70 ? 'verified' : 'flagged'
      });
    } catch (error) {
      alert("Verification failed. Please check your API key.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = () => {
    if (verificationResult) {
      const newLog: ActionLog = {
        id: crypto.randomUUID(),
        description: verificationResult.description!,
        timestamp: verificationResult.timestamp!,
        user: 'Employee #124', // Mock user
        department: 'Operations',
        metrics: verificationResult.metrics!,
        aiAnalysis: verificationResult.aiAnalysis!,
        status: verificationResult.status || 'pending'
      };
      onAddLog(newLog);
      // Reset
      setDescription('');
      setVerificationResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Impact Verification Engine</h2>
        <p className="text-slate-500">Describe your sustainability action. GreenLens AI will verify, measure, and audit the impact.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Action Description</label>
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              placeholder="e.g., Installed LED lighting in the warehouse, replacing 50 CFL bulbs."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <button
              onClick={handleVerify}
              disabled={isVerifying || !description}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Verify Impact
            </button>
          </div>
        </div>

        {verificationResult && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">AI Verification Result</h3>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationResult.aiAnalysis?.confidence_score! > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {verificationResult.aiAnalysis?.confidence_score! > 80 ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                Confidence Score: {verificationResult.aiAnalysis?.confidence_score}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide">CO2e Reduction</p>
                <p className="text-2xl font-bold text-emerald-600">{verificationResult.metrics?.co2_kg} <span className="text-sm font-normal text-slate-400">kg</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Water Saved</p>
                <p className="text-2xl font-bold text-blue-600">{verificationResult.metrics?.water_liters} <span className="text-sm font-normal text-slate-400">L</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Waste Diverted</p>
                <p className="text-2xl font-bold text-amber-600">{verificationResult.metrics?.waste_kg} <span className="text-sm font-normal text-slate-400">kg</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Explainability Trace</h4>
              <p className="text-sm text-slate-600 mb-2"><strong>Reasoning:</strong> {verificationResult.aiAnalysis?.reasoning}</p>
              <p className="text-sm text-slate-600 mb-2"><strong>Methodology:</strong> {verificationResult.aiAnalysis?.methodology}</p>
              <p className="text-xs text-slate-400 italic">Sources: {verificationResult.aiAnalysis?.sources.join(', ')}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
               <button
                  onClick={() => {setVerificationResult(null); setDescription('')}}
                  className="mr-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Commit to Ledger
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionLogger;
