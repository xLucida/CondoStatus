'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const scrollToHero = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const heroSection = document.getElementById('hero-cta');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
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
            onClick={scrollToHero}
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
  );
}
