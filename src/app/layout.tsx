import './globals.css';
import { Navbar } from '@/components/Navbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'J&D Sync',
  description: 'Official Workspace Solution by JD Groups'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <div className="min-h-screen">
          <Navbar isAuthenticated={Boolean(session)} />
          {children}
        </div>
      </body>
    </html>
  );
}
