import { Flame } from 'lucide-react';

export default function StreakBadge({ streak }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 glass-card bg-gradient-to-r from-accent-gold/10 to-accent-gold/5 rounded-2xl border border-accent-gold/30 shadow-[0_4px_20px_rgba(232,185,69,0.1)] transition-transform hover:scale-105 duration-300">
      <div className="bg-accent-gold/20 p-2 rounded-xl">
        <Flame className="text-accent-gold" size={24} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary mb-0.5">Beruntun</div>
        <div className="text-xl font-bold text-accent-gold drop-shadow-sm">{streak} <span className="text-sm font-medium text-text-primary/80">hari</span></div>
      </div>
    </div>
  );
}

