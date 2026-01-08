'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), { ssr: false });

// Types
interface ExtractedItem {
  id: string;
  key?: string;
  label: string;
  value: string;
  page: number | null;
  status: 'ok' | 'warning' | 'error' | 'missing';
  confidence: 'high' | 'medium' | 'low';
  quote: string | null;
  reason: string;
}

interface Section {
  title: string;
  items: ExtractedItem[];
}

interface Issue {
  id: number;
  severity: 'high' | 'warning' | 'low';
  title: string;
  page: number;
  finding: string;
  regulation: string;
  recommendation: string;
  quote: string;
}

interface Analysis {
  summary?: { verified: number; warnings: number; missing: number; total?: number; total_items?: number };
  sections?: Record<string, Section>;
  issues?: Issue[];
  corporation?: string;
  address?: string;
  certificate_date?: string;
  expiry_date?: string;
  risk_rating?: 'GREEN' | 'YELLOW' | 'RED';
  page_count?: number;
  error?: {
    type: 'parse_error' | 'validation_error';
    message: string;
    details?: string[];
    raw?: string;
  };
}

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
      <span className="text-xs text-slate-400 mt-1">Based on disclosed info</span>
    </div>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  const config = {
    ok: { icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    warning: { icon: '!', color: 'text-amber-600', bg: 'bg-amber-100' },
    error: { icon: '✗', color: 'text-red-600', bg: 'bg-red-100' },
    missing: { icon: '?', color: 'text-gray-400', bg: 'bg-gray-100' },
  }[status] || { icon: '?', color: 'text-gray-400', bg: 'bg-gray-100' };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${config.color} ${config.bg}`}>
      {config.icon}
    </span>
  );
};

const ConfidenceBar = ({ level }: { level: string }) => {
  const width = { high: 'w-full', medium: 'w-2/3', low: 'w-1/3' }[level] || 'w-1/3';
  const color = { high: 'bg-emerald-500', medium: 'bg-amber-500', low: 'bg-red-500' }[level] || 'bg-gray-300';
  return (
    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden" title={`${level} confidence`}>
      <div className={`h-full ${width} ${color} rounded-full`} />
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity?: string }) => {
  const sev = severity || 'info';
  const config = {
    high: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚨' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️' },
    low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'ℹ️' },
    info: { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'ℹ️' },
  }[sev] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>{sev.toUpperCase()}
    </span>
  );
};

const DonutChart = ({ value, max, label, color = 'emerald' }: { value: number; max: number; label: string; color?: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors: Record<string, { stroke: string; bg: string }> = {
    emerald: { stroke: '#10b981', bg: '#d1fae5' },
    amber: { stroke: '#f59e0b', bg: '#fef3c7' },
    red: { stroke: '#ef4444', bg: '#fee2e2' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={c.bg} strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={c.stroke} strokeWidth="3" strokeDasharray={`${percentage} ${100 - percentage}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-navy-900">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="mt-2 text-xs text-slate-500 text-center">{label}</span>
    </div>
  );
};

const CollapsibleSection = ({ title, icon, children, defaultOpen = true, itemCount, warningCount = 0 }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-card">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 flex items-center justify-between bg-cream-50 hover:bg-cream-100 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-serif font-semibold text-navy-900">{title}</span>
          {itemCount !== undefined && <span className="text-xs text-slate-500">({itemCount} items)</span>}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4 border-t border-slate-200">{children}</div>}
    </div>
  );
};

const ItemRow = ({ item, onViewPDF }: { item: ExtractedItem; onViewPDF: (page: number | null, quote: string | null) => void }) => (
  <div className={`flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-cream-50 ${item.status === 'warning' || item.status === 'error' ? 'bg-amber-50/50' : ''}`}>
    <StatusIcon status={item.status} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">{item.label}</span>
        <ConfidenceBar level={item.confidence} />
      </div>
      <div className="mt-0.5 font-medium text-navy-900 break-words">{item.value}</div>
      {item.reason && item.status !== 'ok' && (
        <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">{item.reason}</div>
      )}
    </div>
    {item.page && (
      <button
        onClick={() => onViewPDF(item.page, item.quote)}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-navy-700 bg-brass-100 hover:bg-brass-200 rounded transition-colors"
        title={`View on page ${item.page}`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        p.{item.page}
      </button>
    )}
  </div>
);

const IssueCard = ({ issue, onViewPDF }: { issue: Issue; onViewPDF: (page: number, quote: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const borderColor = { high: 'border-red-200 bg-red-50', warning: 'border-amber-200 bg-amber-50', low: 'border-slate-200 bg-cream-50' }[issue.severity] || '';
  return (
    <div className={`border rounded-lg overflow-hidden ${borderColor}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left flex items-start gap-3">
        <SeverityBadge severity={issue.severity} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-navy-900">{issue.title}</h4>
            <span 
              onClick={(e) => { e.stopPropagation(); onViewPDF(issue.page, issue.quote); }}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-navy-700 bg-brass-100 hover:bg-brass-200 rounded cursor-pointer transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              p.{issue.page}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{issue.finding}</p>
        </div>
        <svg className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200/50 pt-3">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Finding</div>
            <p className="text-sm text-slate-700">{issue.finding}</p>
          </div>
          {issue.regulation && (
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Regulation</div>
              <p className="text-sm text-slate-700">{issue.regulation}</p>
            </div>
          )}
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Recommendation</div>
            <p className="text-sm text-slate-700">{issue.recommendation}</p>
          </div>
          {issue.quote && (
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Source</div>
              <blockquote className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">&ldquo;{issue.quote}&rdquo;</blockquote>
            </div>
          )}
          <button onClick={() => onViewPDF(issue.page, issue.quote)} className="text-sm text-brass-600 hover:text-brass-700 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View on Page {issue.page}
          </button>
        </div>
      )}
    </div>
  );
};

const generateClientLetter = (analysis: Analysis) => {
  const sections = analysis.sections || {};
  const rating = analysis.risk_rating || 'YELLOW';
  const issues = analysis.issues || [];
  
  // Helper to get item value from a section
  const getItem = (sectionKey: string, itemKey: string): string | null => {
    const section = sections[sectionKey];
    if (!section?.items) return null;
    const item = section.items.find((i: ExtractedItem) => i.key === itemKey);
    return item?.value || null;
  };
  
  // Helper to check if value confirms "none/zero" explicitly (only unambiguous confirmations)
  // Uses staged approach: normalization -> numeric extraction -> zero validation -> phrase whitelist
  const isConfirmedNone = (val: string | null): boolean => {
    if (!val) return false; // null means unknown, not confirmed none
    const normalized = val.trim().toLowerCase();
    
    // Stage 1: Exact zero value matches
    const exactZeroValues = ['0', '0.00', 'nil', '$0', '$0.00', 'zero'];
    if (exactZeroValues.includes(normalized)) return true;
    
    // Stage 2: Extract and evaluate MONETARY amounts (dollar signs)
    // These are unambiguous - if we see $X, it's meant to be a monetary value
    const dollarAmounts: number[] = [];
    const dollarMatches = [...normalized.matchAll(/\$[\d,]+(?:\.\d{1,2})?/g)];
    for (const match of dollarMatches) {
      const amount = parseFloat(match[0].replace(/[$,]/g, ''));
      if (!isNaN(amount)) dollarAmounts.push(amount);
    }
    
    // If we found dollar amounts:
    // - Any non-zero = NOT confirmed none (return false)
    // - All zeros = confirmed none (return true)
    if (dollarAmounts.length > 0) {
      if (dollarAmounts.some(a => a > 0)) return false;
      if (dollarAmounts.every(a => a === 0)) return true;
    }
    
    // Stage 3: Extract ALL balance-keyword + number pairs
    // Only captures the immediate amount value after each keyword
    // Expanded keyword list to cover common certificate terminology
    const balanceKeywordPattern = /(?:arrears|balance|owing|amount|outstanding|due|assessment|levy|contribution|fee)[:\s]+(?:\$)?([\d,]+(?:\.\d{1,2})?)/g;
    const keywordAmounts: number[] = [];
    
    const keywordMatches = [...normalized.matchAll(balanceKeywordPattern)];
    for (const match of keywordMatches) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount)) keywordAmounts.push(amount);
    }
    
    // If we found any keyword-associated amounts:
    // - Any non-zero = NOT confirmed none
    // - All zeros = confirmed none
    if (keywordAmounts.length > 0) {
      if (keywordAmounts.some(a => a > 0)) return false;
      if (keywordAmounts.every(a => a === 0)) return true;
    }
    
    // Stage 4: Curated zero-confirmation phrases (no numeric parsing needed)
    const confirmedNonePhrases = [
      'none outstanding',
      'nil outstanding',
      'zero outstanding',
      'zero balance',
      'no arrears',
      'no outstanding arrears',
      'arrears outstanding: nil',
      'arrears outstanding: none',
      'arrears: nil',
      'arrears: none',
      'balance: nil',
      'balance: none',
      'not in default',
      'in good standing',
      'no outstanding judgements',
      'no outstanding judgments',
      'no judgements',
      'no judgments',
      'judgements: nil',
      'judgments: nil',
      'judgements: none',
      'judgments: none',
      'no litigation',
      'no current litigation',
      'litigation: nil',
      'litigation: none',
      'no legal proceedings',
      'no proceedings',
      'no special assessment',
      'no special assessments',
      'no assessments',
      'assessment: nil',
      'assessments: nil',
      'assessment: none',
      'assessments: none',
      'no claims',
      'no potential claims',
      'claims: nil',
      'claims: none',
      'owner is not in default',
      'vendor is not in default',
      'unit owner is not in default',
      'corporation is not party to',
      'not party to any',
    ];
    
    return confirmedNonePhrases.some(phrase => normalized.includes(phrase));
  };
  
  // Helper to check if value indicates unknown/not available/ambiguous
  const isUnknownValue = (val: string | null): boolean => {
    if (val === null) return true;
    const normalized = val.trim().toLowerCase();
    // Exact matches for ambiguous/unknown values
    const unknownExact = [
      '', 'n/a', 'not applicable', 'not available', 'unavailable', 'unknown',
      '-', '--', '—', 'none', 'no', 'none reported', 'not indicated', 
      'not disclosed', 'information pending', 'see attached', 'refer to attached',
      'not provided', 'not supplied', 'tbd', 'to be determined', 'pending',
      'pending details', 'awaiting', 'awaiting information', 'contact management',
      'ask management', 'verify with management', 'unconfirmed', 'unclear',
      'not stated', 'not specified', 'missing', 'data not available',
    ];
    if (unknownExact.includes(normalized)) return true;
    // Phrases that indicate unknown when contained
    const unknownPhrases = [
      'not provided', 'not supplied', 'to be determined', 'tbd',
      'pending', 'awaiting', 'contact management', 'verify with',
      'not stated', 'not specified', 'refer to', 'see attached',
    ];
    return unknownPhrases.some(phrase => normalized.includes(phrase));
  };
  
  // Helper to check if value has meaningful content (positive finding)
  const hasMeaningfulValue = (val: string | null): boolean => {
    return val !== null && !isConfirmedNone(val) && !isUnknownValue(val);
  };
  
  // Extract key data points
  const corporation = analysis.corporation || 'the Corporation';
  const address = analysis.address || 'the subject property';
  const unit = analysis.unit || '';
  const parking = analysis.parking || '';
  const locker = analysis.locker || '';
  const commonInterest = analysis.common_interest || '';
  
  // Common expenses
  const monthlyAmount = getItem('common_expenses', 'monthly_amount') || getItem('commonExpenses', 'monthly_amount');
  const arrears = getItem('common_expenses', 'unit_arrears') || getItem('commonExpenses', 'unit_arrears');
  const pendingIncrease = getItem('common_expenses', 'pending_increases') || getItem('commonExpenses', 'pending_increases');
  
  // Reserve fund
  const reserveBalance = getItem('reserve_fund', 'reserve_balance') || getItem('reserveFund', 'reserve_balance');
  const lastStudyDate = getItem('reserve_fund', 'last_study_date') || getItem('reserveFund', 'last_study_date');
  const nextStudyDate = getItem('reserve_fund', 'next_study_date') || getItem('reserveFund', 'next_study_date');
  const reservePerUnit = getItem('reserve_fund', 'reserve_per_unit') || getItem('reserveFund', 'reserve_per_unit');
  const contributionTrend = getItem('reserve_fund', 'contribution_trend') || getItem('reserveFund', 'contribution_trend');
  
  // Legal proceedings
  const litigationDetails = getItem('legal_proceedings', 'current_litigation') || getItem('legalProceedings', 'current_litigation');
  const potentialClaims = getItem('legal_proceedings', 'potential_claims') || getItem('legalProceedings', 'potential_claims');
  const judgements = getItem('legal_proceedings', 'outstanding_judgements') || getItem('legalProceedings', 'outstanding_judgements');
  
  // Special assessments
  const specialAssessments = getItem('special_assessments', 'current_assessments') || getItem('specialAssessments', 'current_assessments');
  const plannedAssessments = getItem('special_assessments', 'planned_assessments') || getItem('specialAssessments', 'planned_assessments');
  
  // Determine opening statement based on risk rating and issues
  const highIssues = issues.filter(i => i.severity === 'high' || i.severity === 'error');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  
  let openingStatement = '';
  if (rating === 'GREEN' && highIssues.length === 0) {
    openingStatement = 'There are no issues or concerns with the status certificate.';
  } else if (rating === 'YELLOW' || warningIssues.length > 0) {
    openingStatement = 'There are some items that require your attention, as outlined below.';
  } else {
    openingStatement = 'There are significant concerns with this status certificate that require your immediate attention.';
  }
  
  // Build legal description
  let legalDescription = `Unit ${unit || '[unit number]'}`;
  if (locker) legalDescription += `, ${locker} (locker)`;
  if (parking) legalDescription += `, ${parking} (parking)`;
  legalDescription += `, ${corporation}`;
  
  // Build the letter
  let letter = `I have now had the chance to review the status certificate received from ${corporation}. ${openingStatement}

I would just draw your attention to the following:

The Corporation has confirmed that the legal description of the property is ${legalDescription}. The municipal address for the property is ${address}.

Please ensure that the legal description of the unit in the Agreement of Purchase and Sale matches the one in the status certificate.
`;

  // Payment status
  if (hasMeaningfulValue(arrears)) {
    // Has real arrears amount
    letter += `
The Status Certificate indicates that there are outstanding arrears of ${arrears} on this unit. Please ensure these are addressed prior to closing.
`;
  } else if (isConfirmedNone(arrears)) {
    // Explicitly confirmed no arrears ($0, "none", etc.)
    letter += `
The Status Certificate provides that the vendor is not in default on the payment of the common expenses.
`;
  } else {
    // Unknown/N/A or null - cannot confirm status
    letter += `
Please verify with the Corporation whether there are any outstanding common expense arrears on this unit.
`;
  }

  // Monthly amount
  if (monthlyAmount) {
    letter += `
The monthly common expenses amount for the unit is ${monthlyAmount}. Please note that you will need to provide a pre-authorized payment form to the Corporation after closing.

If any of the utilities are separately metered, you will have to contact the service providers prior to closing to set up your accounts.
`;
  }

  // Pending fee increases
  if (hasMeaningfulValue(pendingIncrease)) {
    letter += `
Please note: ${pendingIncrease}
`;
  } else {
    letter += `
The common expenses may increase at the start of the next fiscal year due to usual budgetary adjustments.
`;
  }

  // Reserve fund
  if (reserveBalance) {
    letter += `
The Corporation's reserve fund balance is ${reserveBalance}.
`;
  }

  // Reserve fund study
  if (lastStudyDate || nextStudyDate) {
    letter += `
The condominium corporation is required by law to complete a Reserve Fund Study regularly.`;
    if (lastStudyDate) {
      letter += ` According to the Status Certificate, the latest Reserve Fund Study was completed ${lastStudyDate}.`;
    }
    if (nextStudyDate) {
      letter += ` The next Reserve Fund Study should be completed ${nextStudyDate}.`;
    }
    letter += ` The contributions to the reserve fund (and thus, by extension, the common expenses) may increase based on the recommendations of the reserve fund study.
`;
  }

  // Reserve fund adequacy disclaimer
  letter += `
I am not in a position to comment on the adequacy of the reserve fund. However, I would recommend that you have the Budget Statement reviewed by your financial advisor, if necessary.
`;

  // Contribution trends
  if (hasMeaningfulValue(contributionTrend)) {
    letter += `
Based on available information, ${contributionTrend}
`;
  }
  
  // Reserve per unit
  if (reservePerUnit) {
    letter += `
The reserve fund contribution per unit is approximately ${reservePerUnit}.
`;
  }

  // Special assessments
  if (hasMeaningfulValue(specialAssessments)) {
    letter += `
IMPORTANT: The Corporation has levied a special assessment: ${specialAssessments}. Please ensure this is addressed in the transaction.
`;
  }

  if (hasMeaningfulValue(plannedAssessments)) {
    letter += `
The Corporation has indicated planned assessments: ${plannedAssessments}
`;
  }

  // Judgements
  if (hasMeaningfulValue(judgements)) {
    letter += `
Outstanding judgements: ${judgements}
`;
  } else if (isConfirmedNone(judgements)) {
    letter += `
There are no outstanding judgements against the Corporation.
`;
  }

  // Litigation
  if (hasMeaningfulValue(litigationDetails)) {
    letter += `
The corporation is party to legal proceedings: ${litigationDetails}
`;
  } else if (isConfirmedNone(litigationDetails)) {
    letter += `
The corporation is not party to any proceedings before a court of law, an arbitrator or an administrative tribunal.`;
  }

  // Potential claims
  if (hasMeaningfulValue(potentialClaims)) {
    letter += ` However, the corporation has given notice of potential claims: ${potentialClaims}
`;
  } else {
    letter += `
`;
  }

  // Key issues from analysis
  if (highIssues.length > 0) {
    letter += `
ITEMS REQUIRING IMMEDIATE ATTENTION:
`;
    highIssues.forEach(issue => {
      letter += `• ${issue.title}: ${issue.finding}
`;
    });
  }

  if (warningIssues.length > 0) {
    letter += `
ITEMS TO NOTE:
`;
    warningIssues.forEach(issue => {
      letter += `• ${issue.title}: ${issue.finding}
`;
    });
  }

  // Standard closing
  letter += `
The unit is not subject to agreements relating to additions, alterations or improvements made to the common elements. However, please note that the corporation has not carried out an inspection. It is your responsibility to ensure that the seller has not made any changes to the common elements or the unit without the authorization of the condominium.

Kindly review the Condominium's declaration and by-law/rules as you will be required to comply with the same.

Please contact me if you have any questions about these findings.

Best regards,
[Your Name]`;

  return letter;
};

interface PropertyInfo {
  propertyId: string;
  address: string;
  unit?: string;
  city?: string;
  files?: Array<{ name: string; size: number; docType: string }>;
  warnings?: string[];
}

interface DocumentsSummary {
  count: number;
  totalPages: number;
  totalSize: number;
  files?: Array<{ fileName: string; docType: string; pageCount: number; pageOffset: number }>;
}

// Main Component
export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [documentsSummary, setDocumentsSummary] = useState<DocumentsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const [showPDF, setShowPDF] = useState(true);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfHighlight, setPdfHighlight] = useState<string | null>(null);
  
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const letterRef = useRef<HTMLTextAreaElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // Load from sessionStorage
  useEffect(() => {
    const cached = sessionStorage.getItem('currentAnalysis');
    const cachedFile = sessionStorage.getItem('currentFile');
    const cachedProperty = sessionStorage.getItem('currentProperty');
    
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setAnalysis(data.analysis);
        setFileName(cachedFile || 'Certificate.pdf');
        setPdfUrl(sessionStorage.getItem('currentPdfUrl'));
        
        // Load property info if available
        if (cachedProperty) {
          setPropertyInfo(JSON.parse(cachedProperty));
        }
        
        // Load documents summary if available
        if (data.documentsSummary) {
          setDocumentsSummary(data.documentsSummary);
        }
      } catch {
        setError('Failed to load report data');
      }
    } else {
      setError('No report found. Please upload documents first.');
    }
    setLoading(false);
  }, []);

  const viewPDF = useCallback((page: number | null, highlight?: string | null) => {
    if (page) {
      setPdfPage(page);
      setPdfHighlight(highlight || null);
      setShowPDF(true);
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const exportAnalysis = useCallback(() => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `analysis-${analysis.corporation || 'report'}.json`;
    a.click();
  }, [analysis]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brass-500 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-slate-600">Loading analysis...</div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-navy-900 mb-2">Report Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => router.push('/analyze')} className="px-4 py-2 bg-brass-500 text-navy-900 rounded-lg hover:bg-brass-600">
            ← Upload Documents
          </button>
        </div>
      </div>
    );
  }

  const summary = analysis.summary || { total: 0, verified: 0, warnings: 0, missing: 0 };
  const totalItems = summary.total ?? summary.total_items ?? 0;
  const sections = analysis.sections || {};
  const issues = analysis.issues || [];
  const riskRating = analysis.risk_rating || 'YELLOW';
  const reserveSection = sections.reserve_fund;
  const reservePerUnit = parseFloat(reserveSection?.items.find(i => i.key === 'reserve_per_unit')?.value.replace(/[^0-9.]/g, '') || '0');
  const getSectionWarnings = (section: Section) => section.items.filter(i => i.status === 'warning' || i.status === 'error').length;
  const sectionIcons: Record<string, string> = { common_expenses: '💰', reserve_fund: '🏦', special_assessments: '📋', legal_proceedings: '⚖️', insurance: '🛡️', management: '👥', rules: '📜', building_notes: '🏢' };

  return (
    <div className="min-h-screen bg-cream-50 print:bg-white">
      {/* Header */}
      <header className="bg-navy-900 border-b border-navy-800 sticky top-0 z-30 print:static">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/analyze')} className="text-cream-200 hover:text-cream-100 print:hidden">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="font-serif font-semibold text-cream-100">
                {propertyInfo 
                  ? `Property Review: ${propertyInfo.address}${propertyInfo.unit ? ` #${propertyInfo.unit}` : ''}`
                  : analysis.corporation || 'Unknown Corporation'
                }
              </h1>
              <p className="text-sm text-cream-300">
                {documentsSummary 
                  ? `${documentsSummary.count} PDF${documentsSummary.count !== 1 ? 's' : ''} · ${documentsSummary.totalPages} pages · ${formatBytes(documentsSummary.totalSize)}`
                  : analysis.address || 'Address unavailable'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => setShowPDF(!showPDF)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${showPDF ? 'bg-brass-500 text-navy-900' : 'bg-navy-800 text-cream-200 hover:bg-navy-700'}`}
            >
              {showPDF ? 'Hide PDF' : 'Show PDF'}
            </button>
            <button onClick={() => setShowLetterModal(true)} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-navy-800 text-cream-200 hover:bg-navy-700">
              Client Letter
            </button>
            <button onClick={exportAnalysis} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-navy-800 text-cream-200 hover:bg-navy-700">
              Export JSON
            </button>
            <button onClick={() => window.print()} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-navy-800 text-cream-200 hover:bg-navy-700">
              Print
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)] print:h-auto print:block">
        {/* Left Panel - Analysis */}
        <div className={`${showPDF ? 'w-1/2' : 'w-full'} overflow-auto print:w-full`}>
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            
            {/* Warnings about failed documents */}
            {propertyInfo?.warnings && propertyInfo.warnings.length > 0 && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-amber-800">Some documents could not be processed</div>
                    {propertyInfo.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-amber-700 mt-1">{warning}</div>
                    ))}
                    <div className="text-xs text-amber-600 mt-2">The analysis below is based only on the documents that were successfully processed.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6">
              {analysis.error && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                  <div className="font-semibold">We could not fully parse the analysis.</div>
                  <div className="text-sm">{analysis.error.message}</div>
                  {analysis.error.details && analysis.error.details.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-xs">
                      {analysis.error.details.map((detail, index) => (
                        <li key={`${detail}-${index}`}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-serif font-semibold text-navy-900">Executive Summary</h2>
                  <p className="text-sm text-slate-500 mt-1">Certificate dated {analysis.certificate_date || 'N/A'} • Expires {analysis.expiry_date || 'N/A'}</p>
                </div>
                <RiskBadge rating={riskRating} />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-cream-50 rounded-lg border border-slate-100">
                  <div className="text-2xl font-bold text-navy-900">{totalItems}</div>
                  <div className="text-xs text-slate-500">Items Analyzed</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">{summary.verified}</div>
                  <div className="text-xs text-emerald-700">Verified OK</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="text-2xl font-bold text-amber-600">{summary.warnings}</div>
                  <div className="text-xs text-amber-700">Warnings</div>
                </div>
                <div className="text-center p-3 bg-cream-50 rounded-lg border border-slate-100">
                  <div className="text-2xl font-bold text-slate-400">{summary.missing}</div>
                  <div className="text-xs text-slate-500">Not Found</div>
                </div>
              </div>

              {reservePerUnit > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-serif font-medium text-navy-700 mb-4">Financial Overview</h3>
                  <div className="flex items-center gap-6">
                    <DonutChart value={reservePerUnit} max={10000} label="Reserve/Unit Health" color={reservePerUnit > 5000 ? 'emerald' : reservePerUnit > 2000 ? 'amber' : 'red'} />
                    <div>
                      <div className="text-2xl font-bold text-navy-900">${reservePerUnit.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">per unit</div>
                      <div className={`text-xs mt-1 ${reservePerUnit > 5000 ? 'text-emerald-600' : reservePerUnit > 2000 ? 'text-amber-600' : 'text-red-600'}`}>
                        {reservePerUnit > 5000 ? 'Healthy' : reservePerUnit > 2000 ? 'Adequate' : 'Low'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Issues */}
            {issues.length > 0 && (
              <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🚩</span>
                  <h2 className="text-lg font-serif font-semibold text-navy-900">Issues Flagged ({issues.length})</h2>
                </div>
                <div className="space-y-3">
                  {issues.map(issue => <IssueCard key={issue.id} issue={issue} onViewPDF={viewPDF} />)}
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-4">
              {Object.entries(sections).map(([key, section]) => (
                <CollapsibleSection
                  key={key}
                  title={section.title}
                  icon={sectionIcons[key] || '📄'}
                  itemCount={section.items.length}
                  warningCount={getSectionWarnings(section)}
                  defaultOpen={getSectionWarnings(section) > 0}
                >
                  <div className="divide-y divide-slate-100">
                    {section.items.map(item => <ItemRow key={item.id} item={item} onViewPDF={viewPDF} />)}
                  </div>
                </CollapsibleSection>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-400 py-8">
              Generated by CertAnalyzer • {new Date().toLocaleDateString()}
              <br />
              <span className="text-slate-300">This analysis is not legal advice. Always verify findings against the source document.</span>
            </div>
          </div>
        </div>

        {/* Right Panel - PDF Viewer */}
        {showPDF && (
          <div className="w-1/2 border-l border-slate-200 print:hidden bg-white">
            <PDFViewer
              reportId={reportId}
              pdfUrl={pdfUrl}
              page={pdfPage}
              highlight={pdfHighlight}
              darkMode={false}
              onClose={() => setShowPDF(false)}
              onPageChange={setPdfPage}
            />
          </div>
        )}
      </div>

      {/* Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowLetterModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-navy-900">Client Letter</h3>
              <button onClick={() => setShowLetterModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <textarea ref={letterRef} defaultValue={generateClientLetter(analysis)} className="w-full h-80 p-4 border border-slate-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-brass-500" />
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <button onClick={() => copyToClipboard(letterRef.current?.value || '')} className={`flex-1 py-2 px-4 rounded-lg font-medium ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-cream-100 text-navy-700 hover:bg-cream-200'}`}>
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
              <button onClick={() => {
                const blob = new Blob([letterRef.current?.value || ''], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `client-letter-${analysis.corporation || 'report'}.txt`;
                a.click();
              }} className="flex-1 py-2 px-4 rounded-lg font-medium bg-brass-500 text-navy-900 hover:bg-brass-600">
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:static { position: static !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:h-auto { height: auto !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background-color: white !important; }
        }
      `}</style>
    </div>
  );
}
