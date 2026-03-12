import { BookOpen, Check, Coins, Landmark, MoonStar, Sparkles, Sparkle } from 'lucide-react';

const ibadahConfig = {
  puasa: { icon: MoonStar, label: 'Puasa', color: 'text-accent-gold' },
  sholat: { icon: Landmark, label: 'Sholat 5 Waktu', color: 'text-success' },
  tarawih: { icon: Sparkles, label: 'Tarawih', color: 'text-accent-gold' },
  tadarus: { icon: BookOpen, label: 'Tadarus', color: 'text-success' },
  sedekah: { icon: Coins, label: 'Sedekah', color: 'text-warning' },
  dzikir: { icon: Sparkle, label: 'Dzikir', color: 'text-success' },
};

export default function IbadahCard({ ibadahKey, completed, onToggle }) {
  const config = ibadahConfig[ibadahKey];
  const Icon = config?.icon;

  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-2xl glass-card transition-all duration-300 transform hover:-translate-y-1 ${
        completed
          ? 'border-accent-gold/50 bg-accent-gold/10 shadow-[0_0_15px_rgba(232,185,69,0.15)]'
          : 'border-transparent hover:border-accent-gold/30 hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors duration-300 ${completed ? 'bg-accent-gold/20' : 'bg-bg-secondary/50'}`}>
            {Icon && <Icon size={24} className={completed ? 'text-accent-gold' : 'text-text-secondary'} />}
          </div>
          <span className={`font-semibold text-lg transition-colors duration-300 ${completed ? 'text-accent-gold' : 'text-text-primary'}`}>
            {config.label}
          </span>
        </div>
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
            completed
              ? 'bg-accent-gold border-accent-gold scale-110'
              : 'border-text-secondary/50 bg-bg-card'
          }`}
        >
          {completed && (
            <Check size={16} strokeWidth={3} className="text-bg-primary checkmark-animate" />
          )}
        </div>
      </div>
    </button>
  );
}

