import type { Metadata } from 'next';
import './globals.css';
import { CampusProvider } from '@/context/CampusContext';
import { Navbar } from '@/components/layout/Navbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { ToastNotification } from '@/components/ui/ToastNotification';

export const metadata: Metadata = {
  title: 'CampusConnect | Intra-College Professional & Mentorship Network',
  description:
    'Exclusive intra-college social, academic, and mentorship network connecting 1st, 2nd, 3rd, and 4th-year students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <CampusProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            
            <div className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-4 py-4 pb-20 md:pb-8">
              <div className="flex items-start gap-4 lg:gap-5">
                {/* 1. Left Sidebar: Profile & Groups Card */}
                <LeftSidebar />

                {/* 2. Center Feed & Active Route */}
                <main className="flex-1 min-w-0">
                  {children}
                </main>

                {/* 3. Right Sidebar: Campus News & Recommendations */}
                <RightSidebar />
              </div>
            </div>

            <MobileNav />
            <ToastNotification />
          </div>
        </CampusProvider>
      </body>
    </html>
  );
}
