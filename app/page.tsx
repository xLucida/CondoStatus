import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-white to-slate-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-50/30 to-transparent" />
        
        <div className="container-wide relative section-padding">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h1 className="font-serif text-display text-navy-900 mb-6 animate-fade-in-up">
                Ontario status certificate review in under 2 minutes.
              </h1>
              
              <p className="text-lg text-slate-600 mb-4 leading-relaxed animate-fade-in-up">
                Red flags, key numbers, missing disclosures, and page-cited findings—exportable for your client file.
              </p>
              
              <p className="text-sm text-slate-500 mb-8 animate-fade-in-up">
                Works with the Ontario standard status certificate form and attachments.
              </p>
              
              <div id="hero-cta" className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 animate-fade-in-up">
                <Link href="/analyze" className="btn-accent text-base px-8 py-4">
                  Analyze Status Certificate
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/demo" className="btn-secondary">
                  View Demo Report
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 animate-fade-in border-t border-slate-100 pt-6">
                <span>Page citations</span>
                <span className="text-slate-300">·</span>
                <span>Auto-delete controls</span>
                <span className="text-slate-300">·</span>
                <span>No training on your data</span>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up lg:block">
              <div className="absolute -inset-4 bg-gradient-to-br from-brass-100/50 to-navy-100/30 rounded-3xl blur-2xl hidden lg:block" />
              <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden">
                <div className="bg-navy-900 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-cream-100 text-sm font-medium">Sample Analysis Report</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Corporation</div>
                      <div className="font-serif font-semibold text-navy-900">TSCC No. 2847</div>
                    </div>
                    <span className="badge-warning">Medium Risk</span>
                  </div>
                  <div className="divider" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-serif font-bold text-navy-900">32</div>
                      <div className="text-xs text-slate-500">Items Analyzed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif font-bold text-emerald-600">24</div>
                      <div className="text-xs text-slate-500">Verified OK</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif font-bold text-red-600">2</div>
                      <div className="text-xs text-slate-500">Critical</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-800 font-medium">Special assessment: $18,500 due at closing</span>
                      <span className="ml-auto text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-medium">p.23</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-800 font-medium">Pending litigation: slip-and-fall claim</span>
                      <span className="ml-auto text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-medium">p.31</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700">Reserve fund at 72% of target</span>
                      <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">p.12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works Micro-Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-cream-100 font-serif font-bold">1</span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-navy-900 mb-1">Upload PDF</h3>
                <p className="text-slate-600 text-sm">Drop your status certificate. Any Ontario format.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-cream-100 font-serif font-bold">2</span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-navy-900 mb-1">Get red flags + key numbers</h3>
                <p className="text-slate-600 text-sm">AI extracts 28+ data points with page citations.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-cream-100 font-serif font-bold">3</span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-navy-900 mb-1">Export & share</h3>
                <p className="text-slate-600 text-sm">PDF report or shareable link for your client.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - 4 tiles, larger text */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-headline text-navy-900 mb-4">
              Minutes, not hours
            </h2>
            <p className="text-lg text-slate-600">
              Stop manually combing through 50+ page documents. Get structured, actionable insights instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🚩', title: 'Red flags surfaced', desc: 'Critical issues ranked by severity with page citations.' },
              { icon: '💰', title: 'Key numbers extracted', desc: 'Fees, reserves, insurance, arrears—all in one place.' },
              { icon: '📄', title: 'Page citations', desc: 'Every finding links to a source page for verification.' },
              { icon: '🗑️', title: 'Auto-delete controls', desc: 'Documents deleted after 7 days, or instantly on request.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-cream-50 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-slate-700 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section className="section-padding bg-gradient-to-b from-slate-50 to-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-info mb-4">AI-Powered Analysis</span>
              <h2 className="font-serif text-headline text-navy-900 mb-6">
                Automatic risk detection
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our AI scans for the issues that matter most to real estate transactions, surfacing concerns before they become deal-breakers.
              </p>
              <ul className="space-y-4">
                {[
                  { label: 'Arrears and collections risk', severity: 'high' },
                  { label: 'Legal actions, liens, and chargebacks', severity: 'high' },
                  { label: 'Insurance gaps and deductibles', severity: 'medium' },
                  { label: 'Reserve fund concerns and major capex', severity: 'medium' },
                  { label: 'Special assessments (current + hinted)', severity: 'high' },
                  { label: 'Budget variance and fee increases', severity: 'low' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      item.severity === 'high' ? 'bg-red-500' : 
                      item.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    <span className="text-slate-700">{item.label}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-400 mt-6">
                Information extraction and issue spotting only. Not legal advice.
              </p>
            </div>
            
            <div className="card-elevated p-8">
              <div className="space-y-4">
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge-danger">CRITICAL</span>
                    <span className="font-serif font-semibold text-navy-900">Special Assessment</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">$15,000 special assessment approved for roof replacement, due within 12 months of closing.</p>
                  <div className="mt-3 text-xs text-slate-400">Source: Page 23</div>
                </div>
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge-warning">WARNING</span>
                    <span className="font-serif font-semibold text-navy-900">Reserve Fund</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">Reserve fund at 68% of recommended level. Study shows potential shortfall by 2027.</p>
                  <div className="mt-3 text-xs text-slate-400">Source: Page 12</div>
                </div>
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge-success">OK</span>
                    <span className="font-serif font-semibold text-navy-900">Insurance</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">Standard deductible of $25,000. No claims in past 3 years. Coverage adequate.</p>
                  <div className="mt-3 text-xs text-slate-400">Source: Page 8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-headline text-navy-900 mb-4">
              Designed for Ontario real estate workflows
            </h2>
            <p className="text-lg text-slate-600">
              Whether you're buying, advising, or closing—get the clarity you need to move forward with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Buyers & Investors</h3>
              <p className="text-slate-600 leading-relaxed">Know what you're buying before you waive conditions. Get clear visibility into building health and financial risks.</p>
            </div>
            
            <div className="card p-8 hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Agents</h3>
              <p className="text-slate-600 leading-relaxed">Faster guidance for clients, fewer surprises, smoother closes. Stand out with professional due diligence support.</p>
            </div>
            
            <div className="card p-8 hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Lawyers</h3>
              <p className="text-slate-600 leading-relaxed">Structured extraction and issue spotting to speed review. You stay in control with AI handling the heavy lifting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-navy-900">
        <div className="container-narrow text-center">
          <svg className="w-12 h-12 text-brass-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-serif text-2xl md:text-3xl text-cream-100 leading-relaxed mb-8">
            "What used to take me 45 minutes now takes 3. The consistency of the output means I can trust it and focus my time on advising clients, not hunting through pages."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center">
              <span className="text-cream-100 font-serif font-semibold">JM</span>
            </div>
            <div className="text-left">
              <div className="text-cream-100 font-medium">Real Estate Lawyer</div>
              <div className="text-slate-400 text-sm">Toronto, Ontario</div>
            </div>
          </div>
        </div>
      </section>

      {/* Standardized Output */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-headline text-navy-900 mb-4">
              Consistent, repeatable outputs
            </h2>
            <p className="text-lg text-slate-600">
              Unlike ad-hoc AI prompting, CertAnalyzer uses a consistent schema every time. 
              Same sections, same metrics, same definitions—making properties comparable across deals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="font-serif font-semibold text-navy-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                What you get
              </h3>
              <ul className="space-y-4">
                {[
                  'One-page buyer-friendly summary',
                  'Lawyer-grade detail with page citations',
                  'Exportable PDF report',
                  'Shareable link for clients',
                  'Questions to ask the property manager',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card p-8">
              <h3 className="font-serif font-semibold text-navy-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                "What's missing" detection
              </h3>
              <ul className="space-y-4">
                {[
                  'Flags items not disclosed in certificate',
                  'Marks unclear or ambiguous sections',
                  'Checklist: "We reviewed A, B, C; could not verify D"',
                  'Suggests follow-up questions',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-amber-500 mt-0.5">⚠</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security/Privacy */}
      <section className="section-padding bg-navy-950">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-headline text-cream-100 mb-4">
              Your documents are sensitive. We treat them that way.
            </h2>
            <p className="text-slate-400">
              Built with privacy and security at the core—because your clients' data deserves nothing less.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brass-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-cream-100 mb-3">No training on your data</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your documents are never used to train AI models. Period.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brass-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-cream-100 mb-3">Auto-delete in 7 days</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Documents automatically removed. Or delete instantly—you're in control.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brass-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-cream-100 mb-3">Security-first infrastructure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">256-bit encryption in transit and at rest. Enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-cream-50 to-white">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-headline text-navy-900 mb-4">
            Ready to speed up your reviews?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Upload a status certificate and see results in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/analyze"
              className="btn-accent text-base px-8 py-4"
            >
              Analyze Status Certificate
            </Link>
            <Link 
              href="/demo"
              className="text-navy-700 hover:text-navy-900 font-medium transition-colors"
            >
              View Demo Report →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
