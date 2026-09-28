import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Calendar, Filter, FileText } from 'lucide-react';
import { auditService, AuditRecord } from '../../services/auditService';

export const AuditLogView: React.FC = () => {
  const [records] = useState<AuditRecord[]>(auditService.getRecords());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Enterprise Compliance & Security Audit Logs
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Immutable audit trails tracking all administrative actions and security events.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Status</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="p-4 text-zinc-500 font-mono whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{r.userName}</div>
                    <div className="text-[10px] text-zinc-500">{r.userRole}</div>
                  </td>
                  <td className="p-4 font-semibold text-indigo-600">{r.action}</td>
                  <td className="p-4">{r.resource}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-500">{r.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
