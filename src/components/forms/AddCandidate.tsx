import { useState } from 'react';
import { Candidate, Stage } from '../../types';
import { ROLES, ROLE_META } from '../../data/roles';
import { Sparkles, UserPlus, Loader2, Check } from 'lucide-react';

interface AddCandidateProps {
  onAdd: (candidate: Omit<Candidate, 'id' | 'lastUpdated'>) => void;
}

export function AddCandidate({ onAdd }: AddCandidateProps) {
  const [rawText, setRawText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    role: ROLES[0],
    stage: "Applied" as Stage,
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setParsing(true);
    
    // Simulate AI parsing delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Simple mock heuristic extraction
    const lines = rawText.split('\n');
    const name = lines[0]?.slice(0, 50) || "Extracted Name";
    const roleMatch = ROLES.find(r => rawText.toLowerCase().includes(r.toLowerCase()));
    
    setForm(prev => ({
      ...prev,
      name: name.replace(/[^a-zA-Z\s]/g, '').trim() || "Extracted Name",
      role: roleMatch || prev.role,
      notes: `Extracted from raw text: "${rawText.slice(0, 100)}..."`
    }));
    
    setParsing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) return;

    onAdd({
      ...form,
      hm: ROLE_META[form.role].hm,
      date: new Date(form.date).toISOString()
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({
        name: "",
        role: ROLES[0],
        stage: "Applied",
        notes: "",
        date: new Date().toISOString().split('T')[0]
      });
      setRawText("");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Add Candidate</h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Add a single candidate manually or use AI to parse a CV/email snippet.
        </p>
      </header>

      {/* AI Parser Section */}
      <section className="bg-[var(--accent-primary)] text-white rounded-[var(--radius-lg)] p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-amber-400" />
            <h3 className="font-bold text-lg">AI Parser</h3>
          </div>
          <p className="text-white/70 text-sm mb-6">
            Paste a CV summary, LinkedIn bio, or an email thread. We'll extract the candidate's name, intent, and recommended stage.
          </p>
          <textarea 
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="e.g. 'Just spoke to Chioma Okafor — ex-GTBank, 9 years corporate finance. Add her to Finance Analyst at phone screen.'"
            className="w-full h-32 bg-white/10 border border-white/20 rounded-[var(--radius-md)] p-4 text-sm placeholder:text-white/40 outline-none focus:ring-2 ring-white/50 transition-all"
          />
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={handleParse}
              disabled={parsing || !rawText}
              className="bg-white text-[var(--accent-primary)] px-6 py-2.5 rounded-[var(--radius-md)] font-bold text-sm flex items-center gap-2 hover:bg-white/90 disabled:opacity-50"
            >
              {parsing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {parsing ? 'Parsing...' : 'Extract Details'}
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </section>

      {/* Manual Form */}
      <section className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <UserPlus size={20} className="text-[var(--text-tertiary)]" />
          <h3 className="font-bold text-lg">Manual Entry</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Full Name</label>
              <input 
                type="text" 
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] focus:ring-2 ring-[var(--accent-primary)] outline-none"
                placeholder="Candidate Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Role</label>
              <select 
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] focus:ring-2 ring-[var(--accent-primary)] outline-none bg-white"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Initial Stage</label>
              <select 
                value={form.stage}
                onChange={e => setForm({...form, stage: e.target.value as Stage})}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] focus:ring-2 ring-[var(--accent-primary)] outline-none bg-white"
              >
                {ROLE_META[form.role].stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Applied Date</label>
              <input 
                type="date" 
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] focus:ring-2 ring-[var(--accent-primary)] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Notes</label>
            <textarea 
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full h-24 px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] focus:ring-2 ring-[var(--accent-primary)] outline-none"
              placeholder="Add any context or assessment feedback..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={success}
              className={`w-full py-3 rounded-[var(--radius-md)] font-bold transition-all flex items-center justify-center gap-2 ${
                success ? 'bg-[var(--status-green)] text-white' : 'bg-[var(--accent-primary)] text-white hover:opacity-90'
              }`}
            >
              {success ? <Check size={18} /> : <UserPlus size={18} />}
              {success ? 'Candidate Added Successfully!' : 'Add to Pipeline'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
