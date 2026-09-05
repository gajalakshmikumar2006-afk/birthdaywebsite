import ContributorForm from '@/components/contributor/ContributorForm';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-8 sm:py-16 px-4 bg-gradient-to-b from-[#fbf8f3] via-[#faf4ea] to-[#f4ebe0]">
      {/* Background soft ambient accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40 scrapbook-texture" />

      {/* Main Contributor Form Container */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto">
        <ContributorForm />
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 text-center mt-12 text-xs text-stone-400 flex items-center justify-center gap-4">
        <span>Birthday Memory Keepsake Portal</span>
        <span>•</span>
        <Link
          href="/admin"
          className="hover:text-stone-700 transition-colors inline-flex items-center gap-1 font-medium"
        >
          <Lock className="w-3 h-3" />
          Admin Area
        </Link>
      </footer>
    </div>
  );
}
