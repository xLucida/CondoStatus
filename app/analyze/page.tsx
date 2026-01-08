'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

const DOC_TYPES = [
  { value: 'status_certificate', label: 'Status Certificate' },
  { value: 'budget', label: 'Budget' },
  { value: 'financial_statements', label: 'Financial Statements' },
  { value: 'reserve_fund_study', label: 'Reserve Fund Study' },
  { value: 'insurance_certificate', label: 'Insurance Certificate' },
  { value: 'declaration_bylaws', label: 'Declaration/By-laws/Rules' },
  { value: 'other', label: 'Other' },
];

interface UploadedFile {
  id: string;
  file: File;
  docType: string;
}

const MAX_TOTAL_SIZE = 75 * 1024 * 1024; // 75MB

export default function AnalyzePage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyUnit, setPropertyUnit] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      if (file.type !== 'application/pdf') {
        errors.push(`${file.name}: Not a PDF file`);
        continue;
      }
      validFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        docType: 'other',
      });
    }

    const newTotal = totalSize + validFiles.reduce((sum, f) => sum + f.file.size, 0);
    if (newTotal > MAX_TOTAL_SIZE) {
      setError(`Total file size exceeds 75MB limit. Current: ${(newTotal / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
    } else {
      setError(null);
    }

    setFiles(prev => [...prev, ...validFiles]);
  }, [totalSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setError(null);
  }, []);

  const updateDocType = useCallback((id: string, docType: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, docType } : f));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !propertyAddress.trim()) return;
    
    setAnalyzing(true);
    setProgress(5);
    setProgressMessage('Preparing documents...');
    setError(null);

    try {
      const propertyId = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const fileData = await Promise.all(
        files.map(async (f, index) => {
          setProgressMessage(`Reading ${f.file.name}...`);
          setProgress(5 + (index / files.length) * 25);
          
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(f.file);
          });
          
          return {
            fileName: f.file.name,
            fileType: f.file.type,
            docType: f.docType,
            file: base64,
          };
        })
      );

      setProgress(35);
      setProgressMessage('Sending to analysis engine...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          propertyId,
          propertyAddress: propertyAddress.trim(),
          propertyUnit: propertyUnit.trim() || undefined,
          propertyCity: propertyCity.trim() || undefined,
          files: fileData,
        }),
      });

      setProgress(70);
      setProgressMessage('Generating report...');

      const data = await response.json();

      if (!data.success) {
        const message = data.error || 'Analysis failed';
        setError(message);
        setAnalyzing(false);
        return;
      }

      setProgress(100);
      setProgressMessage('Complete!');

      // Store analysis data (including warnings about failed documents)
      sessionStorage.setItem('currentAnalysis', JSON.stringify(data));
      sessionStorage.setItem('currentProperty', JSON.stringify({
        propertyId,
        address: propertyAddress.trim(),
        unit: propertyUnit.trim(),
        city: propertyCity.trim(),
        files: files.map(f => ({
          name: f.file.name,
          size: f.file.size,
          docType: f.docType,
        })),
        warnings: data.warnings || [],
      }));
      
      // Store first PDF for viewing (can be enhanced later)
      if (files.length > 0) {
        sessionStorage.setItem('currentPdfUrl', URL.createObjectURL(files[0].file));
        sessionStorage.setItem('currentFile', files[0].file.name);
      }

      router.push(`/report/${data.reportId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalyzing(false);
    }
  };

  const canSubmit = files.length > 0 && propertyAddress.trim().length > 0;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-headline text-navy-900 mb-4">
            Generate Property Report
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Upload your condo documents for this property (status certificate + attachments) and get a consolidated risk analysis.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
          {!analyzing ? (
            <div className="p-8">
              {/* Property Information */}
              <div className="mb-8">
                <h2 className="font-serif font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center text-cream-100 text-xs font-bold">1</span>
                  Property Information
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="e.g., 352 Front Street West"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit (optional)
                    </label>
                    <input
                      type="text"
                      value={propertyUnit}
                      onChange={(e) => setPropertyUnit(e.target.value)}
                      placeholder="e.g., 803"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    City, Province (optional)
                  </label>
                  <input
                    type="text"
                    value={propertyCity}
                    onChange={(e) => setPropertyCity(e.target.value)}
                    placeholder="e.g., Toronto, ON"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <h2 className="font-serif font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center text-cream-100 text-xs font-bold">2</span>
                  Upload Documents
                </h2>
                
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragOver 
                      ? 'border-brass-500 bg-brass-50' 
                      : files.length > 0 
                        ? 'border-emerald-300 bg-emerald-50/30' 
                        : 'border-slate-300 hover:border-slate-400 bg-cream-50'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="font-medium text-navy-900">
                    Drop your condo documents here
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Status certificate + attachments (multiple PDFs supported, max 75MB total)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      {files.length} document{files.length !== 1 ? 's' : ''} selected
                    </span>
                    <span className="text-sm text-slate-500">
                      {formatFileSize(totalSize)} / 75 MB
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 p-3 hover:bg-cream-50">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-navy-900 truncate">
                            {f.file.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatFileSize(f.file.size)}
                          </div>
                        </div>
                        <select
                          value={f.docType}
                          onChange={(e) => updateDocType(f.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brass-500"
                        >
                          {DOC_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove file"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className={`w-full py-3.5 px-4 rounded-lg font-medium transition-colors ${
                  canSubmit
                    ? 'bg-brass-500 text-navy-900 hover:bg-brass-600'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {files.length === 0 
                  ? 'Add documents to continue' 
                  : !propertyAddress.trim() 
                    ? 'Enter property address to continue'
                    : `Generate Property Report (${files.length} document${files.length !== 1 ? 's' : ''})`
                }
              </button>
              
              <div className="mt-4 text-center">
                <a href="/demo" className="text-sm text-brass-600 hover:text-brass-700">
                  See an example report first →
                </a>
              </div>
            </div>
          ) : (
            <div className="py-16 px-8 text-center">
              <div className="w-16 h-16 border-4 border-brass-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">
                Analyzing {files.length} Document{files.length !== 1 ? 's' : ''}...
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {progressMessage}
              </p>
              <div className="w-full max-w-md mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brass-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">
                This may take 1-2 minutes for multiple documents
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { icon: '📁', title: 'Multi-PDF', desc: '4-15 documents per property' },
            { icon: '🎯', title: 'Consolidated', desc: 'One report, all documents' },
            { icon: '🔒', title: 'Secure', desc: 'Auto-delete after 7 days' },
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-medium text-navy-900">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-12">
          This tool assists with information extraction only. It does not constitute legal advice. 
          Always verify extracted data against the source documents.
        </p>
      </main>
    </div>
  );
}
