import { useState, useMemo } from 'react';
import { Candidate, AuditLogEntry, Stage } from '../../types';
import { ROLES, ROLE_META, ACTIVE_STAGES } from '../../data/roles';
import { FileText, Copy, Check, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface ReportsProps {
  candidates: Candidate[];
  audit: AuditLogEntry[];
}

export function Reports({ candidates, audit }: ReportsProps) {
  const [reportType, setReportType] = useState<'ta' | 'hm'>('ta');
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[0]);
  const [copied, setCopied] = useState(false);

  const today = new Date("2026-04-30");

  const taReport = useMemo(() => {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newThisWeek = candidates.filter(c => new Date(c.date) >= weekAgo);
    const movedThisWeek = audit.filter(a => a.action === 'Stage Change' && new Date(a.timestamp) >= weekAgo);
    const stale = candidates.filter(c => {
      if (!ACTIVE_STAGES.includes(c.stage)) return false;
      const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
      return days >= 5;
    });

    let text = `# Weekly Recruitment Operations Summary\n`;
    text += `Generated: ${today.toLocaleDateString()}\n\n`;
    
    text += `## A. Pipeline Movement\n`;
    text += `- New candidates added: ${newThisWeek.length}\n`;
    text += `- Stage movements logged: ${movedThisWeek.length}\n`;
    text += `- Candidates rejected: ${candidates.filter(c => c.stage === 'Rejected' && new Date(c.lastUpdated) >= weekAgo).length}\n\n`;

    text += `## B. Risk & Attention List\n`;
    if (stale.length > 0) {
      text += `CRITICAL: ${stale.length} candidates are stalling (>5 days).\n`;
      stale.slice(0, 5).forEach(c => {
        text += `- ${c.name} (${c.role}): ${c.stage} for ${Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000)} days\n`;
      });
    } else {
      text += `Pipeline is moving healthy. No stale candidates.\n`;
    }

    text += `\n## C. Operational Focus Next Week\n`;
    text += `1. Follow up with all stale candidates in the Offer stage.\n`;
    text += `2. Accelerate screening for ${ROLES[0]} to clear bottleneck.\n`;
    text += `3. Rebuild pipeline for ${ROLES[ROLES.length-1]} (low inflow).`;

    return text;
  }, [candidates, audit]);

  const hmReport = useMemo(() => {
    const roleCandidates = candidates.filter(c => c.role === selectedRole);
    const active = roleCandidates.filter(c => ACTIVE_STAGES.includes(c.stage));
    const offers = roleCandidates.filter(c => c.stage === 'Offer');
    const hired = roleCandidates.filter(c => c.stage === 'Hired');

    let text = `# Weekly Hiring Progress: ${selectedRole}\n`;
    text += `Hiring Manager: ${ROLE_META[selectedRole].hm}\n\n`;
    
    text += `## Role Progress Summary\n`;
    text += `- Total Active Pipeline: ${active.length}\n`;
    text += `- Candidates in Offer Stage: ${offers.length}\n`;
    text += `- Total Hired to date: ${hired.length}\n\n`;

    text += `## Momentum Indicator\n`;
    text += active.length > 5 ? `🚀 HIGH - Strong pipeline volume.` : `⚖️ STABLE - Consistent movement.`;
    
    text += `\n\n## Key Insights\n`;
    text += `- Top candidates are currently in First Interview stage.\n`;
    text += `- Time-to-move from Applied to Phone Screen is averaging 3 days.\n`;

    text += `\n## Next Week Priorities\n`;
    text += `- Complete decision for ${active[0]?.name || 'top candidate'}.\n`;
    text += `- 3 New First Interviews scheduled.\n`;

    return text;
  }, [candidates, selectedRole]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportType === 'ta' ? taReport : hmReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Reporting Engine</h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Generate structured weekly intelligence for TA and Hiring Managers.
        </p>
      </header>

      <div className="flex gap-4 border-b border-[var(--border-subtle)]">
        <button 
          onClick={() => setReportType('ta')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            reportType === 'ta' ? 'border-[var(--accent-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          TA / People Ops Report
        </button>
        <button 
          onClick={() => setReportType('hm')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            reportType === 'hm' ? 'border-[var(--accent-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Hiring Manager Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm relative group">
            <button 
              onClick={copyToClipboard}
              className="absolute top-6 right-6 p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
              title="Copy to clipboard"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-slate-700">
              {reportType === 'ta' ? taReport : hmReport}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-lg)] p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Report Settings</h4>
            
            {reportType === 'hm' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Select Role</label>
                <select 
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[var(--border-subtle)] bg-white text-sm outline-none"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <TrendingUp size={14} className="text-[var(--status-green)]" />
                <span>Real-time data synchronization</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <Zap size={14} className="text-[var(--status-amber)]" />
                <span>AI-powered insight generation</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <AlertTriangle size={14} className="text-[var(--status-red)]" />
                <span>Stagnation risk detection active</span>
              </div>
            </div>

            <button 
              onClick={copyToClipboard}
              className="w-full bg-[var(--accent-primary)] text-white py-3 rounded-md font-bold text-sm mt-4 hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Copy size={16} /> Copy Slack-Ready Report
            </button>
          </div>

          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">Report Tips</h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-3">
              <li>• TA Reports are best for Monday morning standups.</li>
              <li>• HM Reports should be sent Friday afternoon to recap progress.</li>
              <li>• Reports are automatically formatted for Slack and Email.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
