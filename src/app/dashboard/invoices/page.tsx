import { InvoiceBuilder } from '@/components/InvoiceBuilder';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function InvoicesPage() {
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

  const { data: invoices = [] } = await supabase
    .from('invoices')
    .select('*, clients(name,email)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-green-400/80">Invoices</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Issue and track invoices</h1>
      </div>

      <InvoiceBuilder clients={clients} />

      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Invoice list</h2>
          <span className="text-sm text-slate-400">{invoices.length} total</span>
        </div>

        <div className="space-y-3">
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-400">No invoices issued yet.</p>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">
                    {invoice.clients?.name ?? 'Unknown client'} • {invoice.clients?.email ?? 'No email'}
                  </p>
                  <p className="text-sm text-slate-400">Due {invoice.due_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-400">${Number(invoice.amount).toFixed(2)}</span>
                  <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{invoice.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
