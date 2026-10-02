import './globals.css';
import { Navbar } from '@/components/Navbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "J&D Syns",
  description: "Lightweight micro-CRM",
  manifest: "/manifest.json",
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient(cookies());
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen">
          <Navbar isAuthenticated={Boolean(session)} />
          {children}
        </div>
      </body>
    </html>
  );
}
