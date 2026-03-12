export default function ProgressBar({ label, completed, target, percentage }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-medium text-text-primary/90">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-accent-gold">{completed}</span>
          <span className="text-sm text-text-secondary">/ {target}</span>
        </div>
      </div>
      <div className="w-full h-4 bg-bg-primary/50 rounded-full overflow-hidden border border-text-secondary/10 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-accent-gold to-[#fcd34d] progress-fill transition-all duration-700 ease-out shadow-[0_0_10px_rgba(232,185,69,0.5)] rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-text-secondary text-right px-1 font-medium">
        {percentage}% tercapai
      </div>
    </div>
  );
}

