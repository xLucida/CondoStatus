import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="container-narrow section-padding">
          <span className="badge-info mb-4">About Us</span>
          <h1 className="font-serif text-headline text-navy-900 mb-6">
            Built for real estate workflows
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            CertAnalyzer was created to solve a simple problem: reviewing condo status certificates 
            takes too long and it's too easy to miss critical information buried in dense legal documents.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            We built a tool that uses AI to do the heavy lifting—extracting key data points, 
            flagging risks, and presenting information in a consistent, actionable format. 
            The goal isn't to replace professional judgment, but to make the review process 
            faster and more thorough.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-gradient-to-b from-slate-50 to-white section-padding">
          <div className="container-narrow">
            <h2 className="font-serif text-title text-navy-900 mb-8">Our approach</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-8 hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Precision over speed</h3>
                <p className="text-slate-600 leading-relaxed">
                  While we process documents quickly, accuracy is the priority. Our AI is trained 
                  specifically on Ontario condo status certificates to ensure reliable extraction.
                </p>
              </div>
              <div className="card p-8 hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Consistency matters</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every report follows the same structure and definitions. This makes it easy to 
                  compare properties and ensures nothing gets missed.
                </p>
              </div>
              <div className="card p-8 hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">👁️</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Transparency first</h3>
                <p className="text-slate-600 leading-relaxed">
                  We clearly mark what was found, what wasn't disclosed, and what needs clarification. 
                  No black boxes—you see exactly what the AI extracted.
                </p>
              </div>
              <div className="card p-8 hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Privacy by default</h3>
                <p className="text-slate-600 leading-relaxed">
                  Status certificates contain sensitive information. We never use your documents 
                  to train AI models, and you control how long we retain your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="section-padding">
          <div className="container-narrow">
            <h2 className="font-serif text-title text-navy-900 mb-12">Who we serve</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">Real Estate Lawyers</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Speed up your review process without sacrificing thoroughness. Our structured extraction 
                    and issue spotting helps you focus on what matters—providing expert counsel to your clients.
                  </p>
                </div>
              </div>
              <div className="divider" />
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">Real Estate Agents</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Provide better service to your clients with faster due diligence support. Help buyers 
                    understand what they're getting into before they waive conditions.
                  </p>
                </div>
              </div>
              <div className="divider" />
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-brass-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">Buyers & Investors</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Understand what you're buying without needing a law degree. Get clear, plain-English 
                    explanations of potential risks before you make one of the biggest purchases of your life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-navy-950 section-padding">
          <div className="container-narrow text-center">
            <h2 className="font-serif text-headline text-cream-100 mb-4">Questions?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We'd love to hear from you. Whether you have questions about the product, 
              need help with an analysis, or want to discuss enterprise options.
            </p>
            <a 
              href="mailto:support@certanalyzer.ca"
              className="btn-accent text-base px-8 py-4"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-gradient-to-b from-cream-50 to-white">
          <div className="container-narrow text-center">
            <h2 className="font-serif text-title text-navy-900 mb-4">
              Ready to speed up your reviews?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Try CertAnalyzer free and see how it can help your workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/analyze"
                className="btn-accent text-base px-8 py-4"
              >
                Try It Free
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
      </main>

      <Footer />
    </div>
  );
}
