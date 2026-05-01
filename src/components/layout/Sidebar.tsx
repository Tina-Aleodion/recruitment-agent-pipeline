import { LayoutDashboard, Inbox, UserPlus, BarChart3, Users, FileText, History } from 'lucide-react';
import { Page } from '../../App';
import { Candidate } from '../../types';
import { useMemo } from 'react';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  candidates: Candidate[];
  auditCount: number;
}

export function Sidebar({ activePage, setActivePage, candidates, auditCount }: SidebarProps) {
  const flaggedCount = useMemo(() => {
    const today = new Date("2026-04-30");
    return candidates.filter(c => {
      if (["Hired", "Rejected", "Withdrawn"].includes(c.stage)) return false;
      const days = Math.floor((today.getTime() - new Date(c.lastUpdated).getTime()) / 86400000);
      return days >= 5;
    }).length;
  }, [candidates]);

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'AI Inbox', icon: Inbox, badge: flaggedCount, badgeColor: 'bg-red-500' },
    { id: 'add', label: 'Add Candidate', icon: UserPlus },
    { type: 'separator', label: 'Views' },
    { id: 'overview', label: 'Role Overview', icon: BarChart3 },
    { id: 'hm', label: 'HM View', icon: Users },
    { type: 'separator', label: 'Reports' },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit', label: 'Audit Log', icon: History, badge: auditCount, badgeColor: 'bg-slate-500' },
  ];

  return (
    <nav className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--status-green)] pulse" />
        <h1 className="font-bold text-lg tracking-tight">Pipeline Agent</h1>
      </div>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          if (item.type === 'separator') {
            return (
              <div key={`sep-${idx}`} className="pt-4 pb-2 px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-[var(--accent-primary)] text-[var(--bg-secondary)] shadow-lg' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}
              `}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--status-red-bg)] text-[var(--status-red)]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-[var(--border-subtle)]">
        <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-3 space-y-2">
          <div className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">Pipeline Health</div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold">{candidates.filter(c => !["Hired", "Rejected", "Withdrawn"].includes(c.stage)).length}</span>
            <span className="text-[10px] text-[var(--status-green)] font-medium">Active Candidates</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
