'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File too large (max 20MB)');
      return;
    }
    setFile(f);
    setError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setProgress(10);
    setError(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setProgress(30);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file: base64, 
          fileName: file.name,
          fileType: file.type,
        }),
      });

      setProgress(70);

      const data = await response.json();

      if (!data.success) {
        const message = data.error || 'Analysis failed';
        setError(message);
        setAnalyzing(false);
        return;
      }

      setProgress(100);

      sessionStorage.setItem('currentAnalysis', JSON.stringify(data));
      sessionStorage.setItem('currentFile', file.name);
      sessionStorage.setItem('currentPdfUrl', URL.createObjectURL(file));

      router.push(`/report/${data.reportId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyze Your
            <br />
            <span className="text-blue-600">Status Certificate</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upload your Ontario condo status certificate and get a detailed risk analysis in under 2 minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
          {!analyzing ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : file 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {file ? (
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setFile(null)}
                      className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900">
                      Drop your status certificate here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse (PDF only, max 20MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!file}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
                  file
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Analyze Certificate
              </button>
              
              <div className="mt-4 text-center">
                <a href="/demo" className="text-sm text-blue-600 hover:text-blue-700">
                  See an example report first →
                </a>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analyzing Certificate...
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {progress < 30 && 'Reading document...'}
                {progress >= 30 && progress < 70 && 'Extracting data with AI...'}
                {progress >= 70 && 'Generating report...'}
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { icon: '⚡', title: 'Fast', desc: 'Results in under 2 minutes' },
            { icon: '🎯', title: 'Accurate', desc: 'AI extracts 28+ key data points' },
            { icon: '🛡️', title: 'Secure', desc: 'Documents not stored' },
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-medium text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-12">
          This tool assists with information extraction only. It does not constitute legal advice. 
          Always verify extracted data against the source document.
        </p>
      </main>
    </div>
  );
}
