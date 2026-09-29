import type { DashboardMetric } from '@/types';

export function MetricsOverview({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="card">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{metric.label}</span>
            <span className={metric.positive ? 'text-green-400' : 'text-red-400'}>{metric.change}</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{metric.value}</div>
        </div>
      ))}
    </section>
  );
}
