import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Inbox } from './components/inbox/Inbox';
import { RoleOverview } from './components/overview/RoleOverview';
import { HMView } from './components/hm/HMView';
import { Reports } from './components/reports/Reports';
import { AuditLog } from './components/audit/AuditLog';
import { AddCandidate } from './components/forms/AddCandidate';
import { Candidate, AuditLogEntry, Stage } from './types';
import { generateMockCandidates } from './data/mockData';

export type Page = 'dash' | 'inbox' | 'add' | 'overview' | 'hm' | 'reports' | 'audit';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dash');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const savedData = localStorage.getItem('pa_data_v2');
    const savedAudit = localStorage.getItem('pa_audit_v2');
    
    if (savedData) {
      setCandidates(JSON.parse(savedData));
    } else {
      const initial = generateMockCandidates();
      setCandidates(initial);
      localStorage.setItem('pa_data_v2', JSON.stringify(initial));
    }

    if (savedAudit) {
      setAudit(JSON.parse(savedAudit));
    }
    
    setLoading(false);
  }, []);

  // Persist data
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('pa_data_v2', JSON.stringify(candidates));
      localStorage.setItem('pa_audit_v2', JSON.stringify(audit));
    }
  }, [candidates, audit, loading]);

  const logAction = (action: string, details: string, candidateId?: string) => {
    const newEntry: AuditLogEntry = {
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      candidateId,
      details
    };
    setAudit(prev => [newEntry, ...prev].slice(0, 500));
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates, lastUpdated: new Date().toISOString() };
        if (updates.stage && updates.stage !== c.stage) {
          logAction('Stage Change', `${c.name} moved from ${c.stage} to ${updates.stage}`, id);
        }
        return updated;
      }
      return c;
    }));
  };

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'lastUpdated'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: `c-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setCandidates(prev => [newCandidate, ...prev]);
    logAction('Candidate Added', `${newCandidate.name} added to ${newCandidate.role} pipeline`, newCandidate.id);
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        candidates={candidates}
        auditCount={audit.length}
      />
      
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {activePage === 'dash' && (
          <Dashboard 
            candidates={candidates} 
            updateCandidate={updateCandidate}
          />
        )}
        {activePage === 'inbox' && (
          <Inbox 
            candidates={candidates} 
            updateCandidate={updateCandidate}
          />
        )}
        {activePage === 'add' && (
          <AddCandidate onAdd={addCandidate} />
        )}
        {activePage === 'overview' && (
          <RoleOverview candidates={candidates} />
        )}
        {activePage === 'hm' && (
          <HMView candidates={candidates} updateCandidate={updateCandidate} />
        )}
        {activePage === 'reports' && (
          <Reports candidates={candidates} audit={audit} />
        )}
        {activePage === 'audit' && (
          <AuditLog audit={audit} setAudit={setAudit} />
        )}
      </main>
    </div>
  );
}
