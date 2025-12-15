import React from 'react';
import { ActionLog } from '../types';
import { ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

interface GovernanceLogProps {
  logs: ActionLog[];
}

const GovernanceLog: React.FC<GovernanceLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Governance & Audit Log</h2>
            <p className="text-slate-500">Immutable ledger of all AI-verified sustainability claims.</p>
        </div>
        <button className="text-sm text-indigo-600 font-medium hover:underline">Download CSV Report</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">AI Confidence</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impact (CO2e)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'verified' ? 'bg-green-100 text-green-800' : 
                        log.status === 'flagged' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status === 'verified' ? <ShieldCheck className="w-3 h-3 mr-1"/> : <AlertTriangle className="w-3 h-3 mr-1"/>}
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-2">
                            {log.user.charAt(0)}
                        </div>
                        {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${log.aiAnalysis.confidence_score}%` }}></div>
                        </div>
                        {log.aiAnalysis.confidence_score}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {log.metrics.co2_kg} kg
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No records found in the audit ledger.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GovernanceLog;
