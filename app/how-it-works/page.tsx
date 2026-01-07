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
        'Secure upload with encryption',
        'Supports all standard status certificate formats',
        'No account required to try',
      ],
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
    },
    {
      number: '03',
      title: 'Risk analysis',
      description: 'Each finding is categorized by severity level, so you know exactly where to focus your attention.',
      details: [
        'HIGH: Issues requiring immediate attention',
        'MEDIUM: Concerns to monitor or clarify',
        'LOW: Standard items with no concerns',
        'UNKNOWN: Items not disclosed in certificate',
      ],
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
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              From PDF chaos to a standardized report
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Consistent outputs for every deal: summary, red flags, missing info, and a questions-to-ask list.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="text-blue-600 font-mono text-sm mb-2">Step {step.number}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-gray-100 rounded-2xl aspect-video flex items-center justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="text-6xl font-bold text-gray-300">{step.number}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What's included in your report
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Executive Summary', desc: 'One-page overview of key findings and risks' },
                { title: 'Financial Analysis', desc: 'Fees, arrears, reserve fund health, assessments' },
                { title: 'Legal Review', desc: 'Liens, lawsuits, compliance issues identified' },
                { title: 'Insurance Check', desc: 'Coverage gaps, deductibles, recent claims' },
                { title: 'Red Flag Alerts', desc: 'Issues categorized by severity level' },
                { title: 'Missing Info List', desc: 'What the certificate didn\'t disclose' },
                { title: 'Questions to Ask', desc: 'Follow-up items for the property manager' },
                { title: 'PDF Export', desc: 'Professional report to share with clients' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Points */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                28+ data points extracted
              </h2>
              <p className="text-gray-600">
                Our AI is trained to find and extract the information that matters most.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">$</span>
                  </span>
                  Financial
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Common expenses / maintenance fees</li>
                  <li>Arrears and collection status</li>
                  <li>Reserve fund balance</li>
                  <li>Reserve fund study date</li>
                  <li>Special assessments (current/planned)</li>
                  <li>Budget surplus/deficit</li>
                  <li>Fee increase history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </span>
                  Legal
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Liens against the unit</li>
                  <li>Pending lawsuits</li>
                  <li>Compliance orders</li>
                  <li>Chargebacks</li>
                  <li>Tarion warranty status</li>
                  <li>Rule violations</li>
                  <li>Governance issues</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  Insurance & Building
                </h3>
                <ul className="space-y-2 text-gray-600">
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
        <section className="bg-blue-600 py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to try it yourself?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Upload a status certificate and see the results in under 2 minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/analyze"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Analyze a Certificate
              </Link>
              <Link 
                href="/demo"
                className="text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
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
