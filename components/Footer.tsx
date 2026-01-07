import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-navy-700 to-navy-800 rounded-lg flex items-center justify-center">
                <span className="text-cream-100 font-serif font-bold text-sm">CA</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-cream-100 leading-none">CertAnalyzer</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              AI-powered status certificate analysis for Ontario real estate professionals.
            </p>
            <div className="flex items-center gap-3">
              <span className="trust-badge text-xs bg-navy-900 border-navy-700">
                <svg className="w-3.5 h-3.5 text-brass-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold text-cream-100 mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-cream-100 transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-cream-100 transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="text-slate-400 hover:text-cream-100 transition-colors">Demo Report</Link></li>
              <li><Link href="/analyze" className="text-slate-400 hover:text-cream-100 transition-colors">Analyze Certificate</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold text-cream-100 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-cream-100 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-cream-100 transition-colors">Contact</Link></li>
              <li><a href="mailto:support@certanalyzer.ca" className="text-slate-400 hover:text-cream-100 transition-colors">support@certanalyzer.ca</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold text-cream-100 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-slate-400 hover:text-cream-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-cream-100 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>This tool assists with information extraction only. It does not constitute legal advice.</p>
            <p>© {new Date().getFullYear()} CertAnalyzer. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
