import { ClientCard } from '@/components/ClientCard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ClientsPage() {
  const supabase = createServerSupabaseClient(cookies());
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: clients = [] } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-green-400/80">Clients</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Your client roster</h1>
        </div>
        <button className="btn-primary" type="button">
          Add client
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.length === 0 ? (
          <div className="card md:col-span-2 xl:col-span-3">
            <p className="text-slate-300">No clients yet. Add your first client and start invoicing.</p>
          </div>
        ) : (
          clients.map((client) => <ClientCard key={client.id} client={client} />)
        )}
      </div>
    </main>
  );
}
