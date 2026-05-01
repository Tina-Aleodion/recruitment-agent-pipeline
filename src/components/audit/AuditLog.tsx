import { AuditLogEntry } from '../../types';
import { History, Trash2, Calendar, User } from 'lucide-react';

interface AuditLogProps {
  audit: AuditLogEntry[];
  setAudit: (audit: AuditLogEntry[]) => void;
}

export function AuditLog({ audit, setAudit }: AuditLogProps) {
  const clearLog = () => {
    if (confirm("Are you sure you want to clear the audit log? This cannot be undone.")) {
      setAudit([]);
      localStorage.removeItem('pa_audit_v2');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-[var(--text-secondary)] mt-1">
            Tracking every candidate movement and AI interaction.
          </p>
        </div>
        <button 
          onClick={clearLog}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50"
        >
          <Trash2 size={14} /> Clear Log
        </button>
      </header>

      <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[var(--border-subtle)]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {audit.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--text-secondary)] font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-slate-400" />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      entry.action === 'Stage Change' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                    <div className="flex items-center gap-2">
                      {entry.candidateId && <User size={12} className="text-slate-400" />}
                      {entry.details}
                    </div>
                  </td>
                </tr>
              ))}
              {audit.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-[var(--text-tertiary)] italic">
                    No activity logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
