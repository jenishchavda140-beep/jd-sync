'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/clients', label: 'Clients' },
    { href: '/dashboard/invoices', label: 'Invoices' }
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-sm font-bold text-slate-950">J</div>
          <div>
            <div className="text-lg font-bold text-white">J&D Sync</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">JD Groups</div>
          </div>
        </Link>

        {isAuthenticated ? (
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? 'text-green-400' : 'text-slate-300 hover:text-white'}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button type="button" onClick={handleSignOut} className="btn-secondary">
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
