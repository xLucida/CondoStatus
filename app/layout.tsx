import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'CertAnalyzer - Status Certificate Analysis for Lawyers',
  description: 'AI-powered Ontario condo status certificate analysis tool for real estate lawyers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
