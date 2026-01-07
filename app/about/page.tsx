import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Built for real estate workflows
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            CertAnalyzer was created to solve a simple problem: reviewing condo status certificates 
            takes too long and it's too easy to miss critical information buried in dense legal documents.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            We built a tool that uses AI to do the heavy lifting—extracting key data points, 
            flagging risks, and presenting information in a consistent, actionable format. 
            The goal isn't to replace professional judgment, but to make the review process 
            faster and more thorough.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our approach</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Precision over speed</h3>
                <p className="text-gray-600">
                  While we process documents quickly, accuracy is the priority. Our AI is trained 
                  specifically on Ontario condo status certificates to ensure reliable extraction.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Consistency matters</h3>
                <p className="text-gray-600">
                  Every report follows the same structure and definitions. This makes it easy to 
                  compare properties and ensures nothing gets missed.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency first</h3>
                <p className="text-gray-600">
                  We clearly mark what was found, what wasn't disclosed, and what needs clarification. 
                  No black boxes—you see exactly what the AI extracted.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy by default</h3>
                <p className="text-gray-600">
                  Status certificates contain sensitive information. We never use your documents 
                  to train AI models, and you control how long we retain your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Who we serve</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Estate Lawyers</h3>
                  <p className="text-gray-600">
                    Speed up your review process without sacrificing thoroughness. Our structured extraction 
                    and issue spotting helps you focus on what matters—providing expert counsel to your clients.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Estate Agents</h3>
                  <p className="text-gray-600">
                    Provide better service to your clients with faster due diligence support. Help buyers 
                    understand what they're getting into before they waive conditions.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Buyers & Investors</h3>
                  <p className="text-gray-600">
                    Understand what you're buying without needing a law degree. Get clear, plain-English 
                    explanations of potential risks before you make one of the biggest purchases of your life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-300 mb-8">
              We'd love to hear from you. Whether you have questions about the product, 
              need help with an analysis, or want to discuss enterprise options.
            </p>
            <a 
              href="mailto:contact@certanalyzer.com"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to speed up your reviews?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Try CertAnalyzer free and see how it can help your workflow.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/analyze"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try It Free
              </Link>
              <Link 
                href="/demo"
                className="text-gray-600 hover:text-gray-900 font-medium"
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
