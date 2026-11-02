import type { Metadata } from 'next';
import './globals.css';
import { AicteProvider } from '@/context/AicteContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export const metadata: Metadata = {
  title: 'AICTE Approval Monitor | Tracking & Compliance Portal',
  description:
    'Portal for tracking AICTE approval applications, EVC queue, undertakings, and compliance reports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 font-sans text-slate-900 antialiased">
        <AicteProvider>
          <div className="min-h-screen flex flex-col">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-200">
              {/* Sticky Top Bar */}
              <TopBar />

              {/* Page Content */}
              <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
                {children}
              </main>

              {/* Clean Minimal Footer */}
              <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-center sm:text-left text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p>
                    AICTE Approval Monitor • All India Council for Technical Education (Approval Process AY 2026-27)
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Browser Storage (No Backend)
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </AicteProvider>
      </body>
    </html>
  );
}
