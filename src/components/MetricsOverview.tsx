'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import type { Client } from '@/types';

export function InvoiceBuilder({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [amount, setAmount] = useState('450.00');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        amount,
        due_date: dueDate
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error || 'Unable to create invoice.');
      setLoading(false);
      return;
    }

    setMessage('Invoice created successfully.');
    setLoading(false);
    router.refresh();
  };

  return (
    <section className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create invoice</h2>
        <span className="text-sm text-slate-400">Fast mode</span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">Client</label>
          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="input"
            required
          >
            {clients.length === 0 ? (
              <option value="">No clients available</option>
            ) : (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Amount</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="input"
            required
          />
        </div>

        <div className="md:col-span-4 flex items-center justify-between gap-4">
          <button type="submit" disabled={loading || clients.length === 0} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Saving...' : 'Issue invoice'}
          </button>
          {message ? <p className="text-sm text-green-400">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}
