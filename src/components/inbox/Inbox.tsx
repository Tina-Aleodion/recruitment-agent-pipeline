import { useMemo, useState } from 'react';
import { Candidate, Stage } from '../../types';
import { ACTIVE_STAGES, STAGE_COLORS } from '../../data/roles';
import { AlertCircle, Clock, Mail, MessageSquare, ArrowRight, UserCheck } from 'lucide-react';

interface InboxProps {
  candidates: Candidate[];
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
}

export function Inbox({ candidates, updateCandidate }: InboxProps) {
  const today = new Date("2026-04-30");

  const flaggedCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (!ACTIVE_STAGES.includes(c.stage)) return false;
      const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
      return days >= 5;
    }).sort((a, b) => {
      const daysA = Math.floor((today.getTime() - new Date(a.lastUpdated).getTime()) / 86400000);
      const daysB = Math.floor((today.getTime() - new Date(b.lastUpdated).getTime()) / 86400000);
      return daysB - daysA;
    });
  }, [candidates]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">AI Inbox</h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Showing {flaggedCandidates.length} candidates requiring immediate attention based on inactivity.
        </p>
      </header>

      <div className="grid gap-6">
        {flaggedCandidates.map(c => (
          <InboxItem 
            key={c.id} 
            candidate={c} 
            onAction={(stage) => updateCandidate(c.id, { stage })}
          />
        ))}
        {flaggedCandidates.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-sm">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck size={32} />
            </div>
            <h3 className="text-lg font-bold">Pipeline is healthy</h3>
            <p className="text-[var(--text-tertiary)] max-w-xs mx-auto mt-2">
              All active candidates have been contacted in the last 5 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InboxItem({ candidate, onAction }: { candidate: Candidate, onAction: (stage: Stage) => void }) {
  const days = Math.floor((new Date("2026-04-30").getTime() - new Date(candidate.lastUpdated).getTime()) / 86400000);
  const urgency = days >= 10 ? 'urgent' : 'stale';

  return (
    <div className={`
      bg-white border rounded-[var(--radius-lg)] overflow-hidden shadow-sm flex
      ${urgency === 'urgent' ? 'border-red-200' : 'border-amber-200'}
    `}>
      <div className={`w-1.5 ${urgency === 'urgent' ? 'bg-red-500' : 'bg-amber-500'}`} />
      
      <div className="flex-1 p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg">{candidate.name}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                urgency === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {days} days overdue
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{candidate.role} • {candidate.stage}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Hiring Manager</p>
            <p className="text-sm font-semibold">{candidate.hm}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-100 italic text-sm text-slate-600">
          {candidate.notes || "No notes available for this candidate."}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline">
              <Mail size={14} /> Draft Follow-up
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline">
              <MessageSquare size={14} /> Send Slack to HM
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onAction('Rejected')}
              className="px-4 py-2 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Reject Candidate
            </button>
            <button 
              onClick={() => {
                // Logic to move to next logic stage
                const nextStages: Record<Stage, Stage> = {
                  'Applied': 'Phone Screen',
                  'Phone Screen': 'First Interview',
                  'Assessment': 'First Interview',
                  'First Interview': 'Final Interview',
                  'Final Interview': 'Offer',
                  'Offer': 'Hired',
                  'Hired': 'Hired',
                  'Rejected': 'Applied',
                  'Withdrawn': 'Applied'
                };
                onAction(nextStages[candidate.stage] || candidate.stage);
              }}
              className="px-4 py-2 rounded-md bg-[var(--accent-primary)] text-white text-xs font-bold hover:opacity-90 flex items-center gap-2"
            >
              Move Forward <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
