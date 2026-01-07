'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CA</span>
          </div>
          <span className="font-semibold text-gray-900">CertAnalyzer</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/how-it-works"
            className={`text-sm ${isActive('/how-it-works') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            How it Works
          </Link>
          <Link 
            href="/pricing"
            className={`text-sm ${isActive('/pricing') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Pricing
          </Link>
          <Link 
            href="/about"
            className={`text-sm ${isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            About
          </Link>
          <Link 
            href="/demo"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Demo Report
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link 
            href="/analyze"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Analyze Certificate
          </Link>
        </div>
      </div>
    </header>
  );
}
