import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  X, 
  Filter, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calculator
} from 'lucide-react';

interface UniversityRequirement {
  id: string;
  name: string;
  cityState?: string;
  country: string;
  flag: string;
  satRange: string;
  minSat: number;
  minDet: number;
  minIelts: number;
  minToefl: number;
  satPolicy?: string;
  notes: string;
  website: string;
}

const UNIVERSITIES: UniversityRequirement[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    cityState: 'Cambridge, MA',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1520–1580 (Math: 780–800, EBRW: 740–780)',
    minSat: 1520,
    minDet: 125,
    minIelts: 7.0,
    minToefl: 90,
    satPolicy: 'SAT Required',
    notes: 'Standardized testing is strictly required. Heavy emphasis on quantitative excellence (SAT Math 780–800). Recommended IELTS 7.5+ or DET 125+ for international applicants.',
    website: 'https://mitadmissions.org'
  },
  {
    id: 'princeton',
    name: 'Princeton University',
    cityState: 'Princeton, NJ',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1510–1570 (Math: 760–800, EBRW: 730–780)',
    minSat: 1510,
    minDet: 130,
    minIelts: 7.5,
    minToefl: 108,
    satPolicy: 'SAT Considered / Rigorous Review',
    notes: 'Holistic review of academic rigor and intellectual curiosity. High English proficiency expected (IELTS 7.5–8.0+ or DET 130+ recommended).',
    website: 'https://admission.princeton.edu'
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    cityState: 'Cambridge, MA',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1500–1580 (Math: 760–800, EBRW: 740–780)',
    minSat: 1500,
    minDet: 125,
    minIelts: 7.5,
    minToefl: 104,
    satPolicy: 'SAT Required',
    notes: 'Standardized testing reinstated. International applicants typically present IELTS 7.5+ or DET 125+ alongside competitive high school transcripts.',
    website: 'https://college.harvard.edu/admissions'
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    cityState: 'Stanford, CA',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1500–1570 (Math: 760–800, EBRW: 730–780)',
    minSat: 1500,
    minDet: 125,
    minIelts: 7.5,
    minToefl: 100,
    satPolicy: 'SAT Required',
    notes: 'Evaluates intellectual vitality, problem-solving, and English mastery (IELTS 7.5+ or DET 125–135+ recommended).',
    website: 'https://admission.stanford.edu'
  },
  {
    id: 'yale',
    name: 'Yale University',
    cityState: 'New Haven, CT',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1510–1580 (Math: 760–800, EBRW: 740–780)',
    minSat: 1510,
    minDet: 125,
    minIelts: 7.0,
    minToefl: 100,
    satPolicy: 'Test-Flexible (SAT / ACT / AP / IB)',
    notes: 'Requires 7.0+ on each IELTS band or DET 125+. Competitive applicants typically present 1520+ SAT or equivalent test-flexible credentials.',
    website: 'https://admissions.yale.edu'
  },
  {
    id: 'caltech',
    name: 'California Institute of Technology (Caltech)',
    cityState: 'Pasadena, CA',
    country: 'United States',
    flag: '🇺🇸',
    satRange: '1530–1580 (Math: 790–800, EBRW: 740–780)',
    minSat: 1530,
    minDet: 130,
    minIelts: 7.5,
    minToefl: 100,
    satPolicy: 'SAT Required',
    notes: 'SAT required. Near-perfect quantitative Math scores (790–800) are common. Non-native English applicants must present IELTS 7.5+ or DET 130+.',
    website: 'https://www.admissions.caltech.edu'
  },
  {
    id: 'oxford',
    name: 'University of Oxford',
    cityState: 'Oxford',
    country: 'United Kingdom',
    flag: '🇬🇧',
    satRange: '1470–1550+ (with subject APs/IB)',
    minSat: 1470,
    minDet: 135,
    minIelts: 7.5,
    minToefl: 110,
    satPolicy: 'SAT 1470+ (US High School) + 3 APs (Grade 5)',
    notes: 'Higher level requirement: Band 7.5 minimum with at least 7.0 in each component. US track requires SAT 1470+ plus relevant APs.',
    website: 'https://www.ox.ac.uk'
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    cityState: 'Cambridge',
    country: 'United Kingdom',
    flag: '🇬🇧',
    satRange: '1500+ (with subject APs)',
    minSat: 1500,
    minDet: 135,
    minIelts: 7.5,
    minToefl: 110,
    satPolicy: 'SAT 1500+ (750+ Math / 750+ EBRW) + APs',
    notes: 'Requires 7.5 overall with 7.0+ in Listening, Reading, Writing, and Speaking. College subject interviews and admissions assessments required.',
    website: 'https://www.cam.ac.uk'
  },
  {
    id: 'utoronto',
    name: 'University of Toronto',
    cityState: 'Toronto, ON',
    country: 'Canada',
    flag: '🇨🇦',
    satRange: '1350–1500 (Engineering: 1450+)',
    minSat: 1350,
    minDet: 120,
    minIelts: 6.5,
    minToefl: 100,
    satPolicy: 'SAT Accepted (US curriculum)',
    notes: 'DET 120+ with subscore min 100, or IELTS 6.5 with no band below 6.0.',
    website: 'https://www.utoronto.ca'
  },
  {
    id: 'nus',
    name: 'National University of Singapore (NUS)',
    cityState: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    satRange: '1450–1550 (Math: 750–800)',
    minSat: 1450,
    minDet: 120,
    minIelts: 6.5,
    minToefl: 92,
    satPolicy: 'SAT 1400–1500+ + AP Exams for US track',
    notes: 'IELTS Band 6.5 minimum (Reading & Writing 6.5 required) or DET 120+.',
    website: 'https://www.nus.edu.sg'
  }
];

interface AdmissionsReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdmissionsReferenceModal({
  isOpen,
  onClose
}: AdmissionsReferenceModalProps) {
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'benchmarks' | 'concordance'>('benchmarks');
  const [refScoreTest, setRefScoreTest] = useState<'DET' | 'IELTS' | 'SAT'>('DET');
  const [refScoreVal, setRefScoreVal] = useState<number>(125);

  if (!isOpen) return null;

  const filteredUnis = UNIVERSITIES.filter(u => {
    if (countryFilter !== 'ALL' && u.country !== countryFilter) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 p-4 sm:p-6 flex items-center justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl relative overflow-hidden my-auto p-6 sm:p-8 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold mb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Reference Utility (Separated from Test Prep)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              University Admissions Benchmarks & Concordance Reference
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Historical reference data gathered from official university admission portals.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close reference drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="my-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong className="font-bold">Approximate reference only:</strong> Standardized test providers (College Board, IELTS, Duolingo) do not issue exact mathematical equivalencies across distinct exam formats. Minimum requirements vary by academic department. Always verify directly on each university’s official admissions website.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSubTab('benchmarks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'benchmarks'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Institutional Benchmarks ({filteredUnis.length})
            </button>
            <button
              onClick={() => setActiveSubTab('concordance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'concordance'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Approximate Concordance Tables
            </button>
          </div>

          {activeSubTab === 'benchmarks' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">Country:</span>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold"
              >
                <option value="ALL">All Countries ({UNIVERSITIES.length})</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Singapore">🇸🇬 Singapore</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-3 flex-1 space-y-4">
          {activeSubTab === 'benchmarks' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredUnis.map((uni) => (
                <div
                  key={uni.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xl leading-none">{uni.flag}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug font-display">
                            {uni.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {uni.cityState ? `${uni.cityState}, ${uni.country}` : uni.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      <div className="bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 text-center">
                        <span className="text-[9px] font-black uppercase text-indigo-700 block">SAT</span>
                        <span className="text-xs font-bold text-indigo-950">+{uni.minSat}</span>
                      </div>
                      <div className="bg-rose-50/70 p-2 rounded-lg border border-rose-100 text-center">
                        <span className="text-[9px] font-black uppercase text-rose-700 block">IELTS</span>
                        <span className="text-xs font-bold text-rose-950">+{uni.minIelts}</span>
                      </div>
                      <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-center">
                        <span className="text-[9px] font-black uppercase text-emerald-700 block">DET</span>
                        <span className="text-xs font-bold text-emerald-950">+{uni.minDet}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {uni.notes}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">Official Portal</span>
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <span>Admissions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Estimated Language Band Ranges (Informational Reference)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-700 bg-slate-100/70">
                        <th className="py-2.5 px-3">IELTS Band</th>
                        <th className="py-2.5 px-3">DET Approx. Range</th>
                        <th className="py-2.5 px-3">TOEFL iBT Approx.</th>
                        <th className="py-2.5 px-3">CEFR Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">8.5 – 9.0</td>
                        <td className="py-2 px-3">145 – 160</td>
                        <td className="py-2 px-3">115 – 120</td>
                        <td className="py-2 px-3 font-bold text-indigo-600">C2 (Mastery)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">7.5 – 8.0</td>
                        <td className="py-2 px-3">130 – 140</td>
                        <td className="py-2 px-3">102 – 114</td>
                        <td className="py-2 px-3 font-bold text-indigo-600">C1 (Effective Operational)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">6.5 – 7.0</td>
                        <td className="py-2 px-3">115 – 125</td>
                        <td className="py-2 px-3">79 – 101</td>
                        <td className="py-2 px-3 font-bold text-indigo-600">B2 (Vantage)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">5.5 – 6.0</td>
                        <td className="py-2 px-3">95 – 110</td>
                        <td className="py-2 px-3">46 – 78</td>
                        <td className="py-2 px-3 font-bold text-indigo-600">B2 / B1 (Threshold)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic">
                  Note: Conversions represent approximate empirical ranges published in historical language research. They are not direct mathematical substitutes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
}
