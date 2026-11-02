import type { ReportView } from "./reportDefs";

export function Bars({ bars }: { bars: NonNullable<ReportView["bars"]> }) {
  const max = Math.max(1, ...bars.items.map((i) => i.value));
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 mb-2">{bars.title}</div>
      <div className="space-y-1.5">
        {bars.items.map((i) => (
          <div key={i.label} className="flex items-center gap-2 text-xs">
            <div className="w-40 truncate text-gray-600">{i.label}</div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-brand" style={{ width: `${(i.value / max) * 100}%`, background: i.colour }} /></div>
            <div className="w-8 text-right font-medium">{i.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
