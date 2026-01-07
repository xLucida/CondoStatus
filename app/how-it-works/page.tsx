import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Upload your certificate',
      description: 'Drag and drop your Ontario condo status certificate PDF. We accept documents up to 20MB.',
      details: [
        'Secure upload with 256-bit encryption',
        'Supports all standard status certificate formats',
        'No account required to try',
      ],
      icon: '📤',
    },
    {
      number: '02',
      title: 'AI extracts key data',
      description: 'Our AI reads through the entire document, identifying and extracting 28+ critical data points.',
      details: [
        'Financial information (fees, arrears, reserve fund)',
        'Legal matters (liens, lawsuits, special assessments)',
        'Insurance details (coverage, deductibles, claims)',
        'Building information and governance',
      ],
      icon: '🔍',
    },
    {
      number: '03',
      title: 'Risk analysis',
      description: 'Each finding is categorized by severity level, so you know exactly where to focus your attention.',
      details: [
        'CRITICAL: Issues requiring immediate attention',
        'WARNING: Concerns to monitor or clarify',
        'OK: Standard items with no concerns',
        'MISSING: Items not disclosed in certificate',
      ],
      icon: '🚩',
    },
    {
      number: '04',
      title: 'Get your report',
      description: 'Receive a comprehensive report in under 2 minutes, ready to share with clients or keep for your records.',
      details: [
        'Executive summary for quick decisions',
        'Detailed breakdown for due diligence',
        'Exportable PDF report',
        'Shareable link for clients',
      ],
      icon: '📋',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="container-wide section-padding">
          <div className="text-center mb-20">
            <span className="badge-info mb-4">How It Works</span>
            <h1 className="font-serif text-headline text-navy-900 mb-4">
              From PDF chaos to standardized report
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Consistent outputs for every deal: summary, red flags, missing info, and a questions-to-ask list.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-brass-600 font-mono text-sm font-semibold tracking-wide">STEP {step.number}</span>
                  </div>
                  <h2 className="font-serif text-title text-navy-900 mb-4">{step.title}</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`card-elevated rounded-2xl aspect-video flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="text-center">
                    <div className="text-8xl font-serif font-bold text-navy-100">{step.number}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="bg-gradient-to-b from-slate-50 to-white section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="font-serif text-headline text-navy-900 mb-4">
                What's included in your report
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Executive Summary', desc: 'One-page overview of key findings and risks', icon: '📄' },
                { title: 'Financial Analysis', desc: 'Fees, arrears, reserve fund health, assessments', icon: '💰' },
                { title: 'Legal Review', desc: 'Liens, lawsuits, compliance issues identified', icon: '⚖️' },
                { title: 'Insurance Check', desc: 'Coverage gaps, deductibles, recent claims', icon: '🛡️' },
                { title: 'Red Flag Alerts', desc: 'Issues categorized by severity level', icon: '🚩' },
                { title: 'Missing Info List', desc: 'What the certificate didn\'t disclose', icon: '🔍' },
                { title: 'Questions to Ask', desc: 'Follow-up items for the property manager', icon: '❓' },
                { title: 'PDF Export', desc: 'Professional report to share with clients', icon: '📤' },
              ].map((item) => (
                <div key={item.title} className="card p-6 hover:shadow-medium transition-shadow">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Points */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="font-serif text-headline text-navy-900 mb-4">
                28+ data points extracted
              </h2>
              <p className="text-slate-600">
                Our AI is trained to find and extract the information that matters most.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-8">
                <h3 className="font-serif font-semibold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <span className="text-brass-600 font-serif font-bold">$</span>
                  </span>
                  Financial
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>Common expenses / maintenance fees</li>
                  <li>Arrears and collection status</li>
                  <li>Reserve fund balance</li>
                  <li>Reserve fund study date</li>
                  <li>Special assessments (current/planned)</li>
                  <li>Budget surplus/deficit</li>
                  <li>Fee increase history</li>
                </ul>
              </div>
              <div className="card p-8">
                <h3 className="font-serif font-semibold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </span>
                  Legal
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>Liens against the unit</li>
                  <li>Pending lawsuits</li>
                  <li>Compliance orders</li>
                  <li>Chargebacks</li>
                  <li>Tarion warranty status</li>
                  <li>Rule violations</li>
                  <li>Governance issues</li>
                </ul>
              </div>
              <div className="card p-8">
                <h3 className="font-serif font-semibold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  Insurance & Building
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>Insurance coverage amount</li>
                  <li>Deductible amount</li>
                  <li>Recent claims</li>
                  <li>Building age and type</li>
                  <li>Number of units</li>
                  <li>Parking/locker details</li>
                  <li>Major repairs planned</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-900 section-padding">
          <div className="container-narrow text-center">
            <h2 className="font-serif text-headline text-cream-100 mb-4">
              Ready to try it yourself?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Upload a status certificate and see the results in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/analyze"
                className="btn-accent text-base px-8 py-4"
              >
                Analyze a Certificate
              </Link>
              <Link 
                href="/demo"
                className="text-cream-100 border border-slate-600 px-8 py-4 rounded-lg font-medium hover:bg-white/5 transition-colors"
              >
                View Demo Report
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
