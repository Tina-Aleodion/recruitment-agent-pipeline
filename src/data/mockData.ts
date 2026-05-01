import { Candidate, Stage } from "../types";
import { ROLE_META, ROLES } from "./roles";

const TODAY = new Date("2026-04-30");

const mkD = (n: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const firstNames = ["Ada", "Abi", "Ben", "Chi", "Dan", "Eve", "Flo", "Gil", "Han", "Ima", "Jay", "Kay", "Lem", "Mae", "Ned", "Ola", "Pat", "Qua", "Rae", "Sam", "Tam", "Ude", "Viv", "Wole", "Xen", "Yam", "Zam", "Ife", "Ayo", "Temi", "Sola", "Dami", "Fola", "Goke", "Hope", "Ike", "Joke", "Kola", "Lara"];
const lastNames = ["Osei", "Bello", "Mensah", "Fashola", "Peters", "Asante", "Adeyemi", "Okafor", "Nwosu", "Eze", "Bankole", "Adesanya", "Okonkwo", "Obi", "Nwobi", "Williams", "Ejike", "Oduya", "Adeniyi", "Umar", "Musa", "Ibrahim", "Hassan", "Ahmed", "Diallo", "Kamara", "Traoré", "Owusu", "Diop"];

export function generateMockCandidates(): Candidate[] {
  const candidates: Candidate[] = [];
  let idCounter = 1;

  // Add specific named candidates for realism (subset of original)
  const namedCandidates: Partial<Candidate>[] = [
    { name: "Priya Nair", role: "Senior Data Engineer", stage: "Phone Screen", date: mkD(2), notes: "Referred by Seun in eng. 7yrs data, AWS-heavy. Phone screen done — positive. Moving to first interview." },
    { name: "Fatima Diallo", role: "Senior Data Engineer", stage: "Phone Screen", date: mkD(6), notes: "Warm intro via Lagos tech community. 5yrs ex-Interswitch. Screen done — no HM handoff yet." },
    { name: "Chen Wei", role: "Senior Data Engineer", stage: "First Interview", date: mkD(7), notes: "Competing offer from Stripe mentioned casually. Needs urgent HM decision — won't wait long." },
    { name: "Aisha Traoré", role: "Senior Data Engineer", stage: "Offer", date: mkD(6), notes: "Offer extended. Verbal interest but no signature. Counter-offer risk." },
    { name: "Tariq Hassan", role: "Product Manager", stage: "Phone Screen", date: mkD(2), notes: "Ex-fintech. Strong instincts on merchant problems." },
    { name: "James Adeyemi", role: "Product Manager", stage: "Assessment", date: mkD(4), notes: "Written case study sent. Submitted on time. HM review pending." },
    { name: "Ngozi Okonkwo", role: "Product Manager", stage: "Offer", date: mkD(4), notes: "Verbal yes. Formal offer sent. Awaiting signed copy." },
    { name: "Samuel Eze", role: "Customer Success Lead", stage: "Phone Screen", date: mkD(3), notes: "Ex-Konga CS manager. Screen done this week." },
    { name: "Emeka Nwosu", role: "Finance Analyst", stage: "Phone Screen", date: mkD(3), notes: "Screen done. Strong variance analysis background." }
  ];

  namedCandidates.forEach(c => {
    candidates.push({
      id: `c-${idCounter++}`,
      name: c.name!,
      role: c.role!,
      stage: c.stage as Stage,
      date: c.date!,
      lastUpdated: c.date!,
      hm: ROLE_META[c.role!].hm,
      notes: c.notes
    });
  });

  // Bulk generation
  ROLES.forEach((role, ri) => {
    for (let i = 0; i < 40; i++) {
      const fn = firstNames[(ri * 50 + i) % firstNames.length];
      const ln = lastNames[(ri * 50 + i + 7) % lastNames.length];
      const days = Math.floor(Math.random() * 30) + 1;
      candidates.push({
        id: `c-${idCounter++}`,
        name: `${fn} ${ln}`,
        role,
        stage: "Applied",
        date: mkD(days),
        lastUpdated: mkD(days),
        hm: ROLE_META[role].hm,
        notes: "Automated bulk application."
      });
    }
  });

  return candidates;
}
