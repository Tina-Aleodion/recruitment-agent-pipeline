import { useMemo } from 'react';
import { Candidate, Stage } from '../../types';
import { ROLES, ROLE_META, ACTIVE_STAGES } from '../../data/roles';
import { BarChart, TrendingDown, ArrowRight, Info } from 'lucide-react';

interface RoleOverviewProps {
  candidates: Candidate[];
}

export function RoleOverview({ candidates }: RoleOverviewProps) {
  const roleStats = useMemo(() => {
    return ROLES.map(role => {
      const roleCandidates = candidates.filter(c => c.role === role);
      const active = roleCandidates.filter(c => ACTIVE_STAGES.includes(c.stage));
      const hired = roleCandidates.filter(c => c.stage === 'Hired');
      const rejected = roleCandidates.filter(c => c.stage === 'Rejected');
      
      const stagesCount = ROLE_META[role].stages.map(s => ({
        stage: s,
        count: roleCandidates.filter(c => c.stage === s).length
      }));

      // Find bottleneck (stage with most active candidates)
      const activeStages = stagesCount.filter(s => ACTIVE_STAGES.includes(s.stage as Stage));
      const bottleneck = [...activeStages].sort((a, b) => b.count - a.count)[0];

      return {
        role,
        active: active.length,
        hired: hired.length,
        rejected: rejected.length,
        bottleneck: bottleneck?.stage || 'N/A',
        velocity: 'Medium', // Mock metric
        conversion: hired.length > 0 ? ((hired.length / (hired.length + rejected.length)) * 100).toFixed(1) : '0'
      };
    });
  }, [candidates]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Role Overview</h2>
        <p className="text-[var(--text-secondary)] mt-1">
          High-level pipeline health and conversion metrics across all active roles.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roleStats.map(stat => (
          <div key={stat.role} className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">{stat.role}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">HM: {ROLE_META[stat.role].hm}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{stat.active}</span>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Active</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-secondary)]">Bottleneck Stage:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{stat.bottleneck}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-secondary)]">Conversion (Offer/Reject):</span>
                <span className="font-bold text-[var(--status-green)]">{stat.conversion}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-secondary)]">Pipeline Velocity:</span>
                <span className="font-bold text-blue-600">{stat.velocity}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold">
                  +{stat.active > 3 ? stat.active - 3 : 0}
                </div>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                Full Role Audit <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Note */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[var(--radius-lg)] p-6 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Intelligence Summary</h4>
          <p className="text-sm text-indigo-800/80 mt-1">
            Current pipeline volume is stable. Bottleneck detected in **First Interview** stage across 3 roles due to HM availability. Recommend scheduling interview blocks for next Wednesday.
          </p>
        </div>
      </div>
    </div>
  );
}
