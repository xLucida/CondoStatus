'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample data from real TSCC 1511 certificate
const DEMO_ANALYSIS = {
  corporation: "Toronto Standard Condominium Corporation No. 1511",
  address: "650 Lawrence Avenue West, Unit 519, Toronto, ON M6A 3E8",
  certificate_date: "April 21, 2021",
  expiry_date: "July 21, 2021",
  risk_rating: "GREEN" as const,
  page_count: 47,
  summary: { total: 28, verified: 22, warnings: 3, missing: 3 },
  sections: {
    common_expenses: {
      title: "Common Expenses",
      items: [
        { id: "ce-1", key: "monthly_common_expenses", label: "Monthly Common Expenses", value: "$635.86", status: "ok" as const, confidence: "high" as const, page: 3, quote: null, reason: "" },
        { id: "ce-2", label: "Unit Arrears", value: "$0.00 (NIL)", status: "ok" as const, confidence: "high" as const, page: 4, quote: null, reason: "" },
        { id: "ce-3", label: "Parking Unit", value: "B092", status: "ok" as const, confidence: "high" as const, page: 2, quote: null, reason: "" },
        { id: "ce-4", label: "Common Interest", value: "0.3086294%", status: "ok" as const, confidence: "high" as const, page: 2, quote: null, reason: "" },
      ]
    },
    reserve_fund: {
      title: "Reserve Fund",
      items: [
        { id: "rf-1", key: "reserve_fund_balance", label: "Reserve Fund Balance", value: "$3,304,327.04", status: "ok" as const, confidence: "high" as const, page: 12, quote: null, reason: "" },
        { id: "rf-2", key: "reserve_per_unit", label: "Reserve Per Unit", value: "$7,667.58", status: "ok" as const, confidence: "high" as const, page: 12, quote: null, reason: "Healthy - above $5,000/unit threshold" },
        { id: "rf-3", label: "Reserve Study Date", value: "November 27, 2018", status: "warning" as const, confidence: "high" as const, page: 12, quote: "Reserve Fund Study dated November 27, 2018", reason: "Study is 2.5 years old - approaching 3-year limit" },
        { id: "rf-4", label: "Study Preparer", value: "R and C Engineering Ltd.", status: "ok" as const, confidence: "high" as const, page: 12, quote: null, reason: "" },
        { id: "rf-5", label: "Annual Contribution", value: "$542,849.00", status: "ok" as const, confidence: "high" as const, page: 12, quote: null, reason: "" },
        { id: "rf-6", label: "Adequacy", value: "Adequate (per Board)", status: "ok" as const, confidence: "medium" as const, page: 12, quote: null, reason: "" },
      ]
    },
    insurance: {
      title: "Insurance Coverage",
      items: [
        { id: "ins-1", label: "Building Coverage", value: "$114,908,821.00", status: "ok" as const, confidence: "high" as const, page: 15, quote: null, reason: "" },
        { id: "ins-2", label: "Standard Deductible", value: "$10,000", status: "ok" as const, confidence: "high" as const, page: 15, quote: null, reason: "" },
        { id: "ins-3", label: "Water Damage Deductible", value: "$10,000", status: "ok" as const, confidence: "high" as const, page: 15, quote: null, reason: "Below $25k threshold" },
        { id: "ins-4", label: "Flood Deductible", value: "$25,000", status: "warning" as const, confidence: "high" as const, page: 15, quote: "Flood deductible: $25,000", reason: "At threshold - verify coverage" },
        { id: "ins-5", label: "Liability Coverage", value: "$10,000,000", status: "ok" as const, confidence: "high" as const, page: 15, quote: null, reason: "" },
      ]
    },
    legal_proceedings: {
      title: "Legal & Compliance",
      items: [
        { id: "leg-1", label: "Outstanding Judgments", value: "None", status: "ok" as const, confidence: "high" as const, page: 8, quote: null, reason: "" },
        { id: "leg-2", label: "Current Litigation", value: "None", status: "ok" as const, confidence: "high" as const, page: 8, quote: null, reason: "" },
        { id: "leg-3", label: "Administrator Appointed", value: "No", status: "ok" as const, confidence: "high" as const, page: 9, quote: null, reason: "" },
      ]
    },
    management: {
      title: "Management & Governance",
      items: [
        { id: "mgmt-1", label: "Property Manager", value: "360 Community Management Ltd.", status: "ok" as const, confidence: "high" as const, page: 1, quote: null, reason: "" },
        { id: "mgmt-2", label: "Manager Contact", value: "(905) 604-3602", status: "ok" as const, confidence: "high" as const, page: 1, quote: null, reason: "" },
        { id: "mgmt-3", label: "Board of Directors", value: "7 directors", status: "ok" as const, confidence: "medium" as const, page: 20, quote: null, reason: "" },
        { id: "mgmt-4", label: "Total Units", value: "431 units", status: "ok" as const, confidence: "high" as const, page: 2, quote: null, reason: "" },
      ]
    },
    building_notes: {
      title: "Building-Specific Notes",
      items: [
        { id: "bn-1", label: "Kitec Plumbing", value: "Replacement substantially completed", status: "ok" as const, confidence: "high" as const, page: 18, quote: null, reason: "Positive - known issue proactively addressed" },
      ]
    }
  },
  issues: [
    {
      id: 1,
      severity: "warning" as const,
      title: "Reserve Fund Study Approaching Expiry",
      finding: "The most recent reserve fund study is dated November 27, 2018, which is 2.5 years old at the certificate date.",
      regulation: "Ontario Regulation 48/01 requires reserve fund studies to be updated every 3 years.",
      recommendation: "Confirm the next study is scheduled for November 2021 as indicated in the certificate.",
      quote: "Reserve Fund Study dated November 27, 2018",
      page: 12
    },
    {
      id: 2,
      severity: "low" as const,
      title: "Flood Deductible at Threshold",
      finding: "The flood damage deductible is $25,000, which is at the typical warning threshold.",
      regulation: "No specific regulation, but higher deductibles may result in unit owner liability.",
      recommendation: "Advise client about potential liability for flood-related claims.",
      quote: "Flood deductible: $25,000",
      page: 15
    },
    {
      id: 3,
      severity: "low" as const, 
      title: "COVID-19 Disclosure",
      finding: "Certificate includes standard COVID-19 impact disclosure regarding potential delays.",
      regulation: "Standard disclosure during pandemic period.",
      recommendation: "No action required - informational only.",
      quote: "Due to COVID-19, certain deadlines may be affected",
      page: 2
    }
  ],
  missing_items: [
    { id: "m-1", label: "AGM Minutes", description: "Annual General Meeting minutes not attached", page: null },
    { id: "m-2", label: "Audited Financial Statements", description: "Most recent audited financials not included", page: null },
    { id: "m-3", label: "Engineering Reports", description: "No recent engineering assessment attached", page: null },
  ],
  questions_to_ask: [
    { id: "q-1", question: "When is the next Reserve Fund Study scheduled?", context: "Current study dated November 2018 is approaching 3-year limit", page: 12 },
    { id: "q-2", question: "Are any special assessments proposed but not yet approved?", context: "Certificate does not disclose pending assessments", page: null },
    { id: "q-3", question: "Confirm flood deductible applies to common elements only?", context: "Flood deductible is $25,000 - confirm unit owner liability exposure", page: 15 },
    { id: "q-4", question: "Request copy of most recent AGM minutes", context: "Not attached to certificate package", page: null },
  ]
};

// Components
const RiskBadge = ({ rating }: { rating: 'GREEN' | 'YELLOW' | 'RED' }) => {
  const config = {
    GREEN: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '✓', label: 'Low Flagged Risk' },
    YELLOW: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠', label: 'Medium Flagged Risk' },
    RED: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '✗', label: 'High Flagged Risk' },
  }[rating];
  return (
    <div className="flex flex-col items-end">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${config.bg} ${config.border}`}>
        <span className={`text-xl font-bold ${config.text}`}>{config.icon}</span>
        <span className={`font-semibold ${config.text}`}>{config.label}</span>
      </div>
      <span className="text-xs text-gray-400 mt-1">Based on disclosed info</span>
    </div>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  const config: Record<string, { icon: string; color: string; bg: string }> = {
    ok: { icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    warning: { icon: '!', color: 'text-amber-600', bg: 'bg-amber-100' },
    error: { icon: '✗', color: 'text-red-600', bg: 'bg-red-100' },
    missing: { icon: '?', color: 'text-gray-400', bg: 'bg-gray-100' },
  };
  const c = config[status] || config.missing;
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${c.color} ${c.bg}`}>
      {c.icon}
    </span>
  );
};

const ConfidenceBar = ({ level }: { level: string }) => {
  const width: Record<string, string> = { high: 'w-full', medium: 'w-2/3', low: 'w-1/3' };
  const color: Record<string, string> = { high: 'bg-emerald-500', medium: 'bg-amber-500', low: 'bg-red-500' };
  return (
    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden" title={`${level} confidence`}>
      <div className={`h-full ${width[level] || 'w-1/3'} ${color[level] || 'bg-gray-300'} rounded-full`} />
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚨' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️' },
    low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'ℹ️' },
  };
  const c = config[severity] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${c.bg} ${c.text}`}>
      <span>{c.icon}</span>{severity.toUpperCase()}
    </span>
  );
};

const DonutChart = ({ value, max, label, color = 'emerald', showTooltip = false }: { value: number; max: number; label: string; color?: string; showTooltip?: boolean }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors: Record<string, { stroke: string; bg: string }> = {
    emerald: { stroke: '#10b981', bg: '#d1fae5' },
    amber: { stroke: '#f59e0b', bg: '#fef3c7' },
    red: { stroke: '#ef4444', bg: '#fee2e2' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className="flex flex-col items-center relative">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={c.bg} strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={c.stroke} strokeWidth="3" strokeDasharray={`${percentage} ${100 - percentage}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-xs text-gray-500 text-center">{label}</span>
        {showTooltip && (
          <button 
            onClick={() => setTooltipOpen(!tooltipOpen)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
      {tooltipOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 z-50 shadow-lg">
          <div className="font-medium mb-2">Reserve/Unit Health Calculation</div>
          <ul className="space-y-1 text-gray-300">
            <li>• Reserve balance ÷ total units</li>
            <li>• Above $5,000/unit = Healthy (green)</li>
            <li>• $2,000-$5,000/unit = Adequate (amber)</li>
            <li>• Below $2,000/unit = Low (red)</li>
          </ul>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900" />
        </div>
      )}
    </div>
  );
};

const CollapsibleSection = ({ title, icon, children, defaultOpen = true, itemCount, warningCount = 0, id }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border border-gray-200 rounded-lg overflow-hidden bg-white scroll-mt-20">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-900">{title}</span>
          {itemCount !== undefined && <span className="text-xs text-gray-500">({itemCount} items)</span>}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};

const PageBadge = ({ page, onClick, onCopy }: { page: number; onClick?: () => void; onCopy?: () => void }) => {
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  return (
    <div className="relative">
      <span 
        onClick={onClick}
        onContextMenu={(e) => { e.preventDefault(); setShowCopyMenu(!showCopyMenu); }}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded ${onClick ? 'hover:bg-blue-100 cursor-pointer transition-colors' : ''}`}
        title={`Source: Page ${page} (right-click to copy)`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        p.{page}
      </span>
      {showCopyMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
          <button 
            onClick={() => { onCopy?.(); setShowCopyMenu(false); }}
            className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy citation
          </button>
        </div>
      )}
    </div>
  );
};

const ItemRow = ({ item, onPageClick, onCopyCitation }: { item: any; onPageClick?: (page: number) => void; onCopyCitation?: (text: string) => void }) => (
  <div className={`flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-gray-50 ${item.status === 'warning' || item.status === 'error' ? 'bg-amber-50/50' : ''}`}>
    <StatusIcon status={item.status} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{item.label}</span>
        <ConfidenceBar level={item.confidence} />
      </div>
      <div className="mt-0.5 font-medium text-gray-900 break-words">{item.value}</div>
      {item.reason && item.status !== 'ok' && (
        <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">{item.reason}</div>
      )}
    </div>
    {item.page && (
      <PageBadge 
        page={item.page} 
        onClick={onPageClick ? () => onPageClick(item.page) : undefined}
        onCopy={() => onCopyCitation?.(`${item.label}: ${item.value} (p.${item.page})`)}
      />
    )}
  </div>
);

const IssueCard = ({ issue, onPageClick, onCopyCitation, defaultExpanded = false }: { issue: any; onPageClick?: (page: number) => void; onCopyCitation?: (text: string) => void; defaultExpanded?: boolean }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const borderColor: Record<string, string> = { high: 'border-red-200 bg-red-50', warning: 'border-amber-200 bg-amber-50', low: 'border-blue-200 bg-blue-50' };
  return (
    <div className={`border rounded-lg overflow-hidden ${borderColor[issue.severity] || ''}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left flex items-start gap-3">
        <SeverityBadge severity={issue.severity} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900">{issue.title}</h4>
            {issue.page && (
              <PageBadge 
                page={issue.page} 
                onClick={() => { onPageClick?.(issue.page); }}
                onCopy={() => onCopyCitation?.(`${issue.title}: ${issue.finding} (p.${issue.page})`)}
              />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{issue.finding}</p>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200/50 pt-3">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Finding</div>
            <p className="text-sm text-gray-700">{issue.finding}</p>
          </div>
          {issue.regulation && (
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Regulation</div>
              <p className="text-sm text-gray-700">{issue.regulation}</p>
            </div>
          )}
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recommendation</div>
            <p className="text-sm text-gray-700">{issue.recommendation}</p>
          </div>
          {issue.quote && (
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Source Quote</div>
              <blockquote className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">&ldquo;{issue.quote}&rdquo;</blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Jump Navigation Component
const JumpNavigation = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: 'action-list', label: 'Action List', icon: '📋' },
    { id: 'issues', label: 'Issues', icon: '🚩' },
    { id: 'reserve_fund', label: 'Reserve Fund', icon: '🏦' },
    { id: 'insurance', label: 'Insurance', icon: '🛡️' },
    { id: 'legal_proceedings', label: 'Legal', icon: '⚖️' },
    { id: 'management', label: 'Governance', icon: '👥' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            activeSection === section.id 
              ? 'bg-brass-100 text-navy-800 border border-brass-300' 
              : 'bg-white text-slate-600 hover:bg-cream-100 border border-slate-200'
          }`}
        >
          <span className="mr-1">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </div>
  );
};

// Main Component
export default function DemoPage() {
  const router = useRouter();
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [activeSection, setActiveSection] = useState('action-list');
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const letterRef = useRef<HTMLTextAreaElement>(null);

  const analysis = DEMO_ANALYSIS;
  const reservePerUnit = 7667.58;
  const sectionIcons: Record<string, string> = { common_expenses: '💰', reserve_fund: '🏦', special_assessments: '📋', legal_proceedings: '⚖️', insurance: '🛡️', management: '👥', rules: '📜', building_notes: '🏢' };
  const getSectionWarnings = (section: any) => section.items.filter((i: any) => i.status === 'warning' || i.status === 'error').length;

  // Track scroll position for sticky CTA and active section
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 800);
      
      // Update active section based on scroll position
      const sections = ['action-list', 'issues', 'reserve_fund', 'insurance', 'legal_proceedings', 'management'];
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedText(text.slice(0, 30) + '...');
    setTimeout(() => { setCopied(false); setCopiedText(''); }, 2000);
  }, []);

  const handlePageClick = useCallback((page: number) => {
    alert(`In the full version, this would open the PDF viewer to page ${page}.`);
  }, []);

  const generateClientLetter = () => {
    return `Dear Client,

We have completed our review of the Status Certificate for ${analysis.corporation} located at ${analysis.address}.

SUMMARY
The certificate dated ${analysis.certificate_date} (expiring ${analysis.expiry_date}) indicates low flagged risk based on disclosed information.

KEY FINDINGS
• Reserve Fund Study Approaching Expiry: The study is 2.5 years old - approaching 3-year limit (p.12)
• Flood Deductible at Threshold: $25,000 deductible may affect liability (p.15)

QUESTIONS TO ASK PROPERTY MANAGER
• When is the next Reserve Fund Study scheduled? (Current study approaching 3-year limit)
• Confirm flood deductible applies to common elements only
• Request copy of most recent AGM minutes

EXTRACTED DATA SUMMARY
• Total items reviewed: ${analysis.summary.total}
• Items verified: ${analysis.summary.verified}
• Items requiring attention: ${analysis.summary.warnings}
• Information not disclosed: ${analysis.summary.missing}

DISCLAIMER
This report provides information extraction and issue spotting only. It is not legal advice. Please consult with your legal counsel regarding any concerns.

Please contact us if you have any questions.

Best regards,
[Your Name]`;
  };

  // Count high severity issues
  const highSeverityIssues = analysis.issues.filter(i => ['high', 'warning'].includes(i.severity));

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Demo Banner */}
      <div className="bg-navy-900 text-cream-100 text-center py-2 px-4 text-sm">
        <span className="font-medium">📋 Demo Report</span> — This is a sample analysis from a real Ontario status certificate.{' '}
        <button onClick={() => router.push('/analyze')} className="text-brass-400 underline hover:no-underline">
          Upload your own →
        </button>
      </div>

      {/* Header with Export Controls */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="text-navy-600 hover:text-navy-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="font-serif font-semibold text-navy-900 text-sm sm:text-base">{analysis.corporation}</h1>
              <p className="text-xs sm:text-sm text-slate-500">{analysis.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()} 
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hidden sm:flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button 
              onClick={() => copyToClipboard(window.location.href)} 
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hidden sm:flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button onClick={() => setShowLetterModal(true)} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1">
              <span>📧</span>
              <span className="hidden sm:inline">Client Letter</span>
            </button>
            <button onClick={() => router.push('/analyze')} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-brass-500 text-navy-950 hover:bg-brass-400">
              Try Your Own
            </button>
          </div>
        </div>
        {/* Jump Navigation */}
        <div className="px-4 py-2 border-t border-slate-100 bg-cream-50">
          <JumpNavigation activeSection={activeSection} />
        </div>
      </header>

      {/* Toast notification for copy */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to clipboard
        </div>
      )}

      {/* Main */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Action List - Sticky at top */}
        <div id="action-list" className="bg-white rounded-xl shadow-card border border-slate-200 p-6 scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📋</span>
            <h2 className="text-lg font-serif font-semibold text-navy-900">Action List</h2>
            <span className="text-xs text-slate-400">(Quick scan before diving in)</span>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <button 
              onClick={() => document.getElementById('issues')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left hover:bg-amber-100 transition-colors"
            >
              <div className="text-2xl font-bold text-amber-700">{analysis.issues.length}</div>
              <div className="text-sm text-amber-800">Flagged items to review</div>
            </button>
            
            <button 
              onClick={() => document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl font-bold text-blue-700">{analysis.questions_to_ask.length}</div>
              <div className="text-sm text-blue-800">Questions to ask manager</div>
            </button>
            
            <button 
              onClick={() => setShowMissingModal(true)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left hover:bg-slate-100 transition-colors"
            >
              <div className="text-2xl font-bold text-slate-500">{analysis.missing_items.length}</div>
              <div className="text-sm text-slate-600">Missing / Not disclosed</div>
            </button>
          </div>
        </div>

        {/* Decision Readiness Box */}
        {highSeverityIssues.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Decision Readiness</h3>
                <p className="text-sm text-gray-600 mb-3">Based on disclosed info, here's what would typically require attention before going firm:</p>
                <ul className="space-y-2">
                  {highSeverityIssues.slice(0, 3).map(issue => (
                    <li key={issue.id} className="flex items-start gap-2 text-sm">
                      <SeverityBadge severity={issue.severity} />
                      <span className="text-gray-700">{issue.title}</span>
                      {issue.page && (
                        <button 
                          onClick={() => handlePageClick(issue.page)}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          p.{issue.page}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-serif font-semibold text-navy-900">Executive Summary</h2>
              <p className="text-sm text-slate-500 mt-1">Certificate dated {analysis.certificate_date} • Expires {analysis.expiry_date}</p>
            </div>
            <RiskBadge rating={analysis.risk_rating} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analysis.summary.total}</div>
              <div className="text-xs text-gray-500">Items Analyzed</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{analysis.summary.verified}</div>
              <div className="text-xs text-emerald-700">Verified OK</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{analysis.summary.warnings}</div>
              <div className="text-xs text-amber-700">Warnings</div>
            </div>
            <button 
              onClick={() => setShowMissingModal(true)}
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-400">{analysis.summary.missing}</div>
              <div className="text-xs text-gray-500 underline">Missing / Not disclosed</div>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Financial Overview</h3>
            <div className="flex items-center gap-6">
              <DonutChart value={reservePerUnit} max={10000} label="Reserve/Unit Health" color="emerald" showTooltip />
              <div>
                <div className="text-2xl font-bold text-gray-900">${reservePerUnit.toLocaleString()}</div>
                <div className="text-sm text-gray-500">per unit</div>
                <div className="text-xs text-emerald-600 mt-1">Healthy</div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
            Issue severity summary based on disclosed information. Not legal advice.
          </p>
        </div>

        {/* Issues */}
        <div id="issues" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🚩</span>
            <h2 className="text-lg font-semibold text-gray-900">Issues Flagged ({analysis.issues.length})</h2>
          </div>
          <div className="space-y-3">
            {analysis.issues.map((issue, index) => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                onPageClick={handlePageClick}
                onCopyCitation={copyToClipboard}
                defaultExpanded={index === 0 && ['high', 'warning'].includes(issue.severity)}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Information extraction and issue spotting only. Not legal advice.
          </p>
        </div>

        {/* Questions to Ask */}
        <div id="questions" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">❓</span>
            <h2 className="text-lg font-semibold text-gray-900">Questions to Ask Property Manager</h2>
          </div>
          <div className="space-y-3">
            {analysis.questions_to_ask.map((q) => (
              <div key={q.id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{q.question}</p>
                    <p className="text-sm text-gray-600 mt-1">{q.context}</p>
                  </div>
                  {q.page && (
                    <PageBadge 
                      page={q.page} 
                      onClick={() => handlePageClick(q.page!)}
                      onCopy={() => copyToClipboard(`${q.question} (see p.${q.page})`)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {Object.entries(analysis.sections).map(([key, section]) => (
            <CollapsibleSection
              key={key}
              id={key}
              title={section.title}
              icon={sectionIcons[key] || '📄'}
              itemCount={section.items.length}
              warningCount={getSectionWarnings(section)}
              defaultOpen={getSectionWarnings(section) > 0 || key === 'common_expenses'}
            >
              <div className="divide-y divide-gray-100">
                {section.items.map((item: any) => (
                  <ItemRow 
                    key={item.id} 
                    item={item} 
                    onPageClick={handlePageClick}
                    onCopyCitation={copyToClipboard}
                  />
                ))}
              </div>
            </CollapsibleSection>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-cream-100 rounded-xl border border-cream-300 p-6 text-center">
          <h3 className="text-lg font-serif font-semibold text-navy-900 mb-2">Ready to analyze your own certificate?</h3>
          <p className="text-slate-600 mb-4">Upload a PDF and get a detailed breakdown in under 2 minutes.</p>
          <button onClick={() => router.push('/analyze')} className="px-6 py-3 bg-brass-500 text-navy-950 font-medium rounded-lg hover:bg-brass-400">
            Analyze Status Certificate
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 pb-8">
          <p>Demo report generated from TSCC 1511 status certificate.</p>
          <p className="mt-1">Information extraction and issue spotting only. Not legal advice.</p>
        </footer>
      </div>

      {/* Sticky CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-navy-800 p-3 z-40 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm text-cream-100 hidden sm:block">Ready to analyze your own certificate?</span>
            <button 
              onClick={() => router.push('/analyze')} 
              className="w-full sm:w-auto px-6 py-2 bg-brass-500 text-navy-950 font-medium rounded-lg hover:bg-brass-400"
            >
              Analyze Status Certificate
            </button>
          </div>
        </div>
      )}

      {/* Missing Items Modal */}
      {showMissingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-cream-50 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-elevated">
            <div className="p-4 border-b border-slate-200 bg-navy-900 flex items-center justify-between rounded-t-xl">
              <h3 className="font-serif font-semibold text-cream-100">Missing / Not Disclosed ({analysis.missing_items.length})</h3>
              <button onClick={() => setShowMissingModal(false)} className="text-cream-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="text-sm text-slate-600 mb-4">
                The following items were not found in the certificate package. Consider requesting these from the property manager.
              </p>
              <div className="space-y-3">
                {analysis.missing_items.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="font-medium text-navy-900">{item.label}</div>
                    <div className="text-sm text-slate-600">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-cream-100">
              <button 
                onClick={() => setShowMissingModal(false)} 
                className="w-full px-4 py-2 bg-navy-900 text-cream-100 rounded-lg hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-cream-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-elevated">
            <div className="p-4 border-b border-slate-200 bg-navy-900 flex items-center justify-between rounded-t-xl">
              <h3 className="font-serif font-semibold text-cream-100">Client Letter</h3>
              <button onClick={() => setShowLetterModal(false)} className="text-cream-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <textarea
                ref={letterRef}
                className="w-full h-96 p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brass-400"
                defaultValue={generateClientLetter()}
              />
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2 justify-end bg-cream-100">
              <button 
                onClick={() => copyToClipboard(letterRef.current?.value || '')} 
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
              <button onClick={() => setShowLetterModal(false)} className="px-4 py-2 bg-navy-900 text-cream-100 rounded-lg hover:bg-navy-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
