import { ClientCard } from '@/components/ClientCard';
import { MetricsOverview } from '@/components/MetricsOverview';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
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
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: invoices = [] } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const paidCount = invoices.filter((invoice) => invoice.status === 'Paid').length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  const metrics = [
    { label: 'Clients', value: String(clients.length), change: '+12%', positive: true },
    { label: 'Invoices', value: String(invoices.length), change: '+8%', positive: true },
    { label: 'Paid', value: String(paidCount), change: '+4%', positive: true },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+18%', positive: true }
  ];

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-green-400/80">Overview</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
        </div>
        <a href="/dashboard/invoices" className="btn-primary">
          Create invoice
        </a>
      </div>

      <MetricsOverview metrics={metrics} />

      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent invoices</h2>
            <a href="/dashboard/invoices" className="text-sm text-green-400 hover:text-green-300">
              View all
            </a>
          </div>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-400">No invoices yet. Create your first invoice in under 60 seconds.</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div>
                    <p className="font-medium text-white">Invoice #{invoice.id.slice(0, 8)}</p>
                    <p className="text-sm text-slate-400">Due {invoice.due_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">${Number(invoice.amount).toFixed(2)}</p>
                    <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top clients</h2>
            <a href="/dashboard/clients" className="text-sm text-green-400 hover:text-green-300">
              Manage
            </a>
          </div>

          <div className="space-y-3">
            {clients.length === 0 ? (
              <p className="text-sm text-slate-400">Add your first client to get started.</p>
            ) : (
              clients.map((client) => (
                <ClientCard key={client.id} client={client} compact />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
