import { useState, useMemo } from 'react';
import { Candidate, Stage } from '../../types';
import { ROLES, ROLE_META, ACTIVE_STAGES, STAGE_COLORS } from '../../data/roles';
import { User, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

interface HMViewProps {
  candidates: Candidate[];
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
}

export function HMView({ candidates, updateCandidate }: HMViewProps) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  
  const roleCandidates = useMemo(() => 
    candidates.filter(c => c.role === selectedRole && !['Rejected', 'Withdrawn'].includes(c.stage)),
  [candidates, selectedRole]);

  const today = new Date("2026-04-30");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hiring Manager View</h2>
          <p className="text-[var(--text-secondary)] mt-1">
            Focus view for {ROLE_META[selectedRole].hm} — Actionable candidates only.
          </p>
        </div>
        <select 
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="px-4 py-2 rounded-md border border-[var(--border-subtle)] bg-white text-sm font-semibold outline-none"
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </header>

      <div className="grid gap-4">
        {roleCandidates.map(c => {
          const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
          
          return (
            <div key={c.id} className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <div 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ backgroundColor: STAGE_COLORS[c.stage].bg, color: STAGE_COLORS[c.stage].tx }}
                  >
                    {c.stage}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>In stage for {days} days</span>
                  </div>
                  <span>•</span>
                  <span>Applied {new Date(c.date).toLocaleDateString()}</span>
                </div>
                {c.notes && (
                  <p className="mt-4 text-sm text-[var(--text-secondary)] bg-slate-50 p-3 rounded italic border-l-2 border-slate-200">
                    "{c.notes}"
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => updateCandidate(c.id, { stage: 'Rejected' })}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50"
                >
                  <XCircle size={14} /> Reject
                </button>
                <button 
                   onClick={() => {
                    const next: Record<Stage, Stage> = {
                      'Applied': 'Phone Screen', 'Phone Screen': 'First Interview',
                      'Assessment': 'First Interview', 'First Interview': 'Final Interview',
                      'Final Interview': 'Offer', 'Offer': 'Hired', 'Hired': 'Hired',
                      'Rejected': 'Applied', 'Withdrawn': 'Applied'
                    };
                    updateCandidate(c.id, { stage: next[c.stage] || c.stage });
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--accent-primary)] text-white text-xs font-bold hover:opacity-90"
                >
                  <CheckCircle size={14} /> Advance
                </button>
                <button className="flex-1 md:flex-none p-2.5 rounded-md border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          );
        })}
        {roleCandidates.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[var(--radius-lg)] border border-dashed border-slate-200">
            <p className="text-[var(--text-tertiary)]">No active candidates for this HM to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
