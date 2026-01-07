import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Catch the surprises
            <br />
            <span className="text-blue-600">before you firm up.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Instantly surface arrears, litigation, reserve fund issues, insurance gaps, 
            and special-assessment risk from Ontario condo status certificates.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link 
              href="/analyze"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Analyze a Certificate
            </Link>
            <Link 
              href="/demo"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Demo Report
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Privacy-first handling of sensitive documents. Your data is never used for training.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Minutes, not hours
          </h2>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { title: 'Instant executive summary', desc: 'of what matters' },
              { title: 'Red flags + severity', desc: 'so you know where to dig' },
              { title: 'Key numbers extracted', desc: 'fees, reserve fund, insurance, arrears' },
              { title: 'Missing disclosure detection', desc: 'to avoid blind spots' },
              { title: 'Exportable report', desc: 'share with clients and team' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Automatic risk detection
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI scans for the issues that matter most, surfacing concerns before they become surprises.
              </p>
              <ul className="space-y-4">
                {[
                  'Arrears and collections risk',
                  'Legal actions, liens, and chargebacks',
                  'Insurance gaps and deductibles',
                  'Reserve fund concerns and major capex',
                  'Special assessments (current + hinted)',
                  'Budget variance and fee increases',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">HIGH</span>
                    <span className="font-medium text-gray-900">Special Assessment</span>
                  </div>
                  <p className="text-sm text-gray-600">$15,000 special assessment approved for roof replacement, due within 12 months.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">MEDIUM</span>
                    <span className="font-medium text-gray-900">Reserve Fund</span>
                  </div>
                  <p className="text-sm text-gray-600">Reserve fund at 68% of recommended level. Study shows shortfall by 2027.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">LOW</span>
                    <span className="font-medium text-gray-900">Insurance</span>
                  </div>
                  <p className="text-sm text-gray-600">Standard deductible of $25,000. No claims in past 3 years.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for real estate workflows
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Buyers & Investors</h3>
              <p className="text-gray-600">Know what you're buying before you waive conditions. Get clear visibility into building health and financial risks.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Agents</h3>
              <p className="text-gray-600">Faster guidance for clients, fewer surprises, smoother closes. Stand out with professional due diligence support.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lawyers</h3>
              <p className="text-gray-600">Structured extraction and issue spotting to speed review. You stay in control with AI handling the heavy lifting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Standardized Output */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Consistent, repeatable outputs
            </h2>
            <p className="text-lg text-gray-600">
              Unlike ad-hoc AI prompting, CertAnalyzer uses a consistent schema every time. 
              Same sections, same metrics, same definitions—making properties comparable across deals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you get</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-gray-700">One-page buyer-friendly summary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Lawyer-grade detail and references</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Exportable PDF report</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Shareable link for clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Questions to ask the property manager</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">"What's missing" detection</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">⚠</span>
                  <span className="text-gray-700">Flags items not disclosed in certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">⚠</span>
                  <span className="text-gray-700">Marks unclear or ambiguous sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">⚠</span>
                  <span className="text-gray-700">Checklist: "We reviewed A, B, C; could not verify D"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">⚠</span>
                  <span className="text-gray-700">Suggests follow-up questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security/Privacy */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Your documents are sensitive. We treat them that way.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No training on your data</h3>
                <p className="text-gray-400 text-sm">Your documents are never used to train AI models.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Data retention controls</h3>
                <p className="text-gray-400 text-sm">Delete immediately or set retention period.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Enterprise-grade security</h3>
                <p className="text-gray-400 text-sm">Encrypted in transit and at rest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to speed up your review process?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload a status certificate and see results in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/analyze"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
