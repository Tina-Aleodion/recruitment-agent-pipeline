import { useMemo, useState } from 'react';
import { Candidate, Stage } from '../../types';
import { ROLE_META, ROLES, ACTIVE_STAGES, STAGE_COLORS } from '../../data/roles';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Filter, X } from 'lucide-react';

interface DashboardProps {
  candidates: Candidate[];
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
}

export function Dashboard({ candidates, updateCandidate }: DashboardProps) {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [activeStageFilter, setActiveStageFilter] = useState<Stage | 'Stale' | 'Urgent' | null>(null);
  const [search, setSearch] = useState("");

  const today = new Date("2026-04-30");

  const roleCandidates = useMemo(() => 
    candidates.filter(c => c.role === activeRole),
  [candidates, activeRole]);

  const stats = useMemo(() => {
    const s: Record<string, number> = {};
    ROLE_META[activeRole].stages.forEach(st => {
      s[st] = roleCandidates.filter(c => c.stage === st).length;
    });
    
    const active = roleCandidates.filter(c => ACTIVE_STAGES.includes(c.stage));
    s['Stale'] = active.filter(c => {
      const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
      return days >= 5 && days < 10;
    }).length;
    s['Urgent'] = active.filter(c => {
      const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
      return days >= 10;
    }).length;

    return s;
  }, [roleCandidates, activeRole]);

  const filteredCandidates = useMemo(() => {
    let list = roleCandidates;
    
    if (activeStageFilter === 'Stale') {
      list = list.filter(c => {
        const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
        return ACTIVE_STAGES.includes(c.stage) && days >= 5 && days < 10;
      });
    } else if (activeStageFilter === 'Urgent') {
      list = list.filter(c => {
        const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
        return ACTIVE_STAGES.includes(c.stage) && days >= 10;
      });
    } else if (activeStageFilter) {
      list = list.filter(c => c.stage === activeStageFilter);
    }

    if (search) {
      list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }

    return list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [roleCandidates, activeStageFilter, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pipeline Dashboard</h2>
          <p className="text-[var(--text-secondary)] mt-1">Live visibility into active hiring workflows.</p>
        </div>
        <div className="flex gap-2">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => { setActiveRole(role); setActiveStageFilter(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeRole === role 
                ? 'bg-[var(--accent-primary)] text-white shadow-md' 
                : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </header>

      {/* Alert Banner */}
      {stats['Urgent'] > 0 && (
        <div className="bg-[var(--status-red-bg)] border border-red-200 rounded-[var(--radius-lg)] p-4 flex items-center gap-3 text-[var(--status-red)]">
          <AlertCircle size={20} />
          <span className="font-medium">
            Attention: {stats['Urgent']} candidates are in urgent need of follow-up (10+ days inactive).
          </span>
          <button 
            onClick={() => setActiveStageFilter('Urgent')}
            className="ml-auto text-xs font-bold underline underline-offset-4"
          >
            Review Now
          </button>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {ROLE_META[activeRole].stages.slice(0, 7).map(stage => (
          <button
            key={stage}
            onClick={() => setActiveStageFilter(activeStageFilter === stage ? null : stage)}
            className={`
              p-4 rounded-[var(--radius-lg)] border text-left transition-all
              ${activeStageFilter === stage 
                ? 'ring-2 ring-[var(--accent-primary)] border-transparent' 
                : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-tertiary)] shadow-sm'}
            `}
          >
            <div className="text-2xl font-bold">{stats[stage] || 0}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] mt-1">{stage}</div>
          </button>
        ))}
      </div>

      {/* Risks */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveStageFilter(activeStageFilter === 'Stale' ? null : 'Stale')}
          className={`flex-1 p-4 rounded-[var(--radius-lg)] border transition-all ${
            activeStageFilter === 'Stale' ? 'ring-2 ring-amber-500 border-transparent' : 'bg-amber-50 border-amber-100'
          }`}
        >
          <div className="text-2xl font-bold text-amber-700">{stats['Stale']}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 mt-1">Stale (5d+)</div>
        </button>
        <button
          onClick={() => setActiveStageFilter(activeStageFilter === 'Urgent' ? null : 'Urgent')}
          className={`flex-1 p-4 rounded-[var(--radius-lg)] border transition-all ${
            activeStageFilter === 'Urgent' ? 'ring-2 ring-red-500 border-transparent' : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="text-2xl font-bold text-red-700">{stats['Urgent']}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-red-600 mt-1">Urgent (10d+)</div>
        </button>
      </div>

      {/* Funnel Viz */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-6">Pipeline Funnel</h3>
        <div className="flex items-end gap-2 h-40">
          {ACTIVE_STAGES.map(stage => {
            const count = stats[stage] || 0;
            const max = Math.max(...ACTIVE_STAGES.map(s => stats[s] || 0), 1);
            const height = (count / max) * 100;
            const colors = STAGE_COLORS[stage];
            return (
              <div key={stage} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div 
                  className="w-full rounded-t-md transition-all duration-700 ease-out" 
                  style={{ height: `${height}%`, backgroundColor: colors.bg }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-2 rounded absolute mb-2 -translate-y-full flex flex-col items-center">
                    <span className="font-bold">{count}</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[var(--text-tertiary)] text-center uppercase tracking-tighter truncate w-full">
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
            Candidates {activeStageFilter && `(${activeStageFilter})`}
          </h3>
          <div className="flex gap-4">
             <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={14} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs focus:ring-2 ring-[var(--accent-primary)] outline-none w-64"
              />
            </div>
            {activeStageFilter && (
              <button 
                onClick={() => setActiveStageFilter(null)}
                className="text-xs font-bold text-[var(--status-blue)] flex items-center gap-1"
              >
                <X size={14} /> Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {filteredCandidates.map(c => (
            <CandidateCard 
              key={c.id} 
              candidate={c} 
              onMove={(stage) => updateCandidate(c.id, { stage })}
            />
          ))}
          {filteredCandidates.length === 0 && (
            <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)]">
              <p className="text-[var(--text-tertiary)]">No candidates matching these filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate, onMove }: { candidate: Candidate, onMove: (stage: Stage) => void }) {
  const days = Math.floor((new Date("2026-04-30").getTime() - new Date(candidate.lastUpdated).getTime()) / 86400000);
  const isUrgent = ACTIVE_STAGES.includes(candidate.stage) && days >= 10;
  const isStale = ACTIVE_STAGES.includes(candidate.stage) && days >= 5 && !isUrgent;

  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`
      bg-[var(--bg-secondary)] border rounded-[var(--radius-lg)] p-4 flex gap-4 items-start group transition-all hover:shadow-md
      ${isUrgent ? 'border-l-4 border-l-red-500' : isStale ? 'border-l-4 border-l-amber-500' : 'border-[var(--border-subtle)]'}
    `}>
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
        {initials}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[var(--text-primary)] truncate">{candidate.name}</h4>
          {isUrgent && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Urgent</span>}
          {isStale && <span className="bg-amber-100 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Stale</span>}
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{candidate.role} • HM: {candidate.hm}</p>
        {candidate.notes && (
          <p className="text-xs text-[var(--text-tertiary)] mt-2 line-clamp-1 italic">"{candidate.notes}"</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div 
          className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
          style={{ 
            backgroundColor: STAGE_COLORS[candidate.stage].bg, 
            color: STAGE_COLORS[candidate.stage].tx 
          }}
        >
          {candidate.stage}
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
          <Clock size={12} />
          <span className="text-[10px] font-medium">{days === 0 ? 'Updated today' : `Updated ${days}d ago`}</span>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
          {ROLE_META[candidate.role].stages.filter(s => s !== candidate.stage).slice(0, 3).map(next => (
            <button
              key={next}
              onClick={() => onMove(next)}
              className="text-[9px] font-bold px-2 py-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Move to {next}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
