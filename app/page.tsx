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
              <div className="trust-badge mb-6 animate-fade-in">
                <svg className="w-4 h-4 text-brass-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 50+ Ontario law firms
              </div>
              
              <h1 className="font-serif text-display text-navy-900 mb-6 animate-fade-in-up text-balance">
                Catch the surprises
                <span className="block text-brass-600">before you firm up.</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed animate-fade-in-up">
                Turn messy condo status certificates into clear, standardized risk reports. 
                Surface arrears, litigation, reserve fund issues, and special assessments in minutes—not hours.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
                <Link href="/analyze" className="btn-accent text-base px-8 py-4">
                  Analyze a Certificate
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/demo" className="btn-secondary">
                  View Demo Report
                </Link>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-500 animate-fade-in">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No training on your data
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Results in under 2 minutes
                </span>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-br from-brass-100/50 to-navy-100/30 rounded-3xl blur-2xl" />
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
                      <div className="font-serif font-semibold text-navy-900">TSCC No. 1511</div>
                    </div>
                    <span className="badge-success">Low Risk</span>
                  </div>
                  <div className="divider" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-serif font-bold text-navy-900">28</div>
                      <div className="text-xs text-slate-500">Items Analyzed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif font-bold text-emerald-600">22</div>
                      <div className="text-xs text-slate-500">Verified OK</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif font-bold text-amber-600">3</div>
                      <div className="text-xs text-slate-500">Warnings</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700">Reserve fund study expires in 6 months</span>
                      <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">p.12</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700">Insurance deductible above average</span>
                      <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">p.8</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-700">No litigation disclosed</span>
                      <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">p.15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="container-wide">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by leading real estate professionals across Ontario</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            <div className="text-slate-400 font-serif text-lg font-semibold">Cassels LLP</div>
            <div className="text-slate-400 font-serif text-lg font-semibold">Miller Thomson</div>
            <div className="text-slate-400 font-serif text-lg font-semibold">Gardiner Roberts</div>
            <div className="text-slate-400 font-serif text-lg font-semibold">Aird & Berlis</div>
            <div className="text-slate-400 font-serif text-lg font-semibold">Dale & Lessmann</div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-headline text-navy-900 mb-4">
              Minutes, not hours
            </h2>
            <p className="text-lg text-slate-600">
              Stop manually combing through 50+ page documents. Get structured, actionable insights instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: '📋', title: 'Executive summary', desc: 'One-page overview of what matters most' },
              { icon: '🚩', title: 'Red flags surfaced', desc: 'Issues ranked by severity and urgency' },
              { icon: '💰', title: 'Key numbers extracted', desc: 'Fees, reserves, insurance, arrears' },
              { icon: '🔍', title: 'Missing items flagged', desc: 'Know what\'s not disclosed' },
              { icon: '📤', title: 'Exportable reports', desc: 'Share with clients instantly' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
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
              Built for real estate workflows
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
              <div className="text-cream-100 font-medium">Jennifer Morrison</div>
              <div className="text-slate-400 text-sm">Real Estate Lawyer, Toronto</div>
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
                  'Lawyer-grade detail and references',
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
              <h3 className="font-serif font-semibold text-cream-100 mb-3">Data retention controls</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Delete immediately or set your own retention period. You're in control.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brass-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-cream-100 mb-3">Enterprise-grade security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">256-bit encryption in transit and at rest. SOC 2 compliant infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-cream-50 to-white">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-headline text-navy-900 mb-4">
            Ready to speed up your review process?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Upload a status certificate and see results in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyze" className="btn-accent text-base px-8 py-4">
              Get Started Free
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/pricing" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
              View Pricing →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
