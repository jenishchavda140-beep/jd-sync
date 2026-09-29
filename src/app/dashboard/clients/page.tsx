'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AddClientForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Please sign in to add a client.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company })
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error || 'Failed to create client');
      setLoading(false);
      return;
    }

    setMessage('Client added successfully.');
    setName('');
    setEmail('');
    setCompany('');
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Add client</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Smith" required />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="jane@client.com" required />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="input" placeholder="Acme Studio" />
        </div>
      </div>

      {message ? <p className="text-sm text-green-400">{message}</p> : null}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save client'}
      </button>
    </form>
  );
}
