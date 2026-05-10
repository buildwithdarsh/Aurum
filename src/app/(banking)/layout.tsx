import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { MobileNav } from '@/components/MobileNav';
import { PageWrapper } from '@/components/PageWrapper';

export default function BankingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-20 lg:pb-0">
          <PageWrapper>{children}</PageWrapper>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
