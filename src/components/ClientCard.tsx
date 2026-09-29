import type { Client } from '@/types';

export function ClientCard({ client, compact = false }: { client: Client; compact?: boolean }) {
  return (
    <div className={`card ${compact ? 'p-3' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{client.name}</h3>
          <p className="text-sm text-slate-400">{client.company || 'Independent freelancer'}</p>
        </div>
        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-300">
          Active
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>{client.email}</p>
        {!compact ? <p className="text-slate-400">Added {new Date(client.created_at || Date.now()).toLocaleDateString()}</p> : null}
      </div>

      {!compact ? (
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-secondary flex-1">
            View
          </button>
          <button type="button" className="btn-primary flex-1">
            Invoice
          </button>
        </div>
      ) : null}
    </div>
  );
}
