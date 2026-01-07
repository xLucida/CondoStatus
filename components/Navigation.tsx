'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="bg-navy-950 text-cream-100 text-xs py-2">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brass-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SOC 2 Compliant</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brass-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>256-bit Encryption</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span className="text-navy-600">|</span>
            <a href="mailto:support@certanalyzer.ca" className="hover:text-white transition-colors">
              support@certanalyzer.ca
            </a>
          </div>
        </div>
      </div>
      
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container-wide py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-navy-800 to-navy-950 rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-cream-100 font-serif font-bold text-sm">CA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-navy-900 text-lg leading-none">CertAnalyzer</span>
              <span className="text-[10px] text-slate-500 tracking-wide uppercase">Status Certificate Analysis</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/how-it-works"
              className={`text-sm transition-colors ${isActive('/how-it-works') ? 'text-navy-900 font-medium' : 'text-slate-600 hover:text-navy-900'}`}
            >
              How it Works
            </Link>
            <Link 
              href="/pricing"
              className={`text-sm transition-colors ${isActive('/pricing') ? 'text-navy-900 font-medium' : 'text-slate-600 hover:text-navy-900'}`}
            >
              Pricing
            </Link>
            <Link 
              href="/about"
              className={`text-sm transition-colors ${isActive('/about') ? 'text-navy-900 font-medium' : 'text-slate-600 hover:text-navy-900'}`}
            >
              About
            </Link>
            <Link 
              href="/demo"
              className="text-sm text-slate-600 hover:text-navy-900 transition-colors"
            >
              Demo Report
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/analyze"
              className="btn-primary"
            >
              Analyze Certificate
            </Link>
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4">
            <nav className="flex flex-col gap-3">
              <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-navy-900 py-2">How it Works</Link>
              <Link href="/pricing" className="text-sm text-slate-600 hover:text-navy-900 py-2">Pricing</Link>
              <Link href="/about" className="text-sm text-slate-600 hover:text-navy-900 py-2">About</Link>
              <Link href="/demo" className="text-sm text-slate-600 hover:text-navy-900 py-2">Demo Report</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
