import { useRamadhanData } from '../hooks/useRamadhanData';
import IbadahCard from '../components/IbadahCard';
import BottomNav from '../components/BottomNav';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { Calendar, CheckCircle2, Moon, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ibadahKeys = ['puasa', 'sholat', 'tarawih', 'tadarus', 'sedekah', 'dzikir'];

export default function DashboardPage() {
  const { todayLog, ramadhanDay, updateTodayLog } = useRamadhanData();
  const navigate = useNavigate();

  const handleToggle = (key) => {
    updateTodayLog({ [key]: !todayLog[key] });
  };

  const completedCount = ibadahKeys.filter((key) => todayLog[key]).length;
  const totalCount = ibadahKeys.length;

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 relative overflow-hidden transition-all duration-300">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-40 left-[-20%] w-72 h-72 bg-success/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-full text-text-secondary border-none shadow-sm">
              <Calendar size={16} className="text-accent-gold" />
              <span className="text-xs font-medium">
                {format(new Date(), 'd MMMM yyyy', { locale: id })}
              </span>
            </div>
          </div>
          {ramadhanDay > 0 && (
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold font-medium text-sm shadow-glow">
              <Moon className="w-4 h-4 mr-2" />
              Ramadhan Hari Ke-{ramadhanDay}
            </div>
          )}
        </div>

        {/* Daily Summary */}
        <div className="glass-card bg-gradient-to-br from-bg-card to-bg-primary rounded-3xl p-7 mb-6 border border-accent-gold/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-slide-in relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-gold/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="text-sm text-text-secondary font-medium tracking-wide uppercase mb-2">
                Progress Hari Ini
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-5xl font-bold font-heading text-accent-gold drop-shadow-md">
                  {completedCount}
                </div>
                <div className="text-xl text-text-secondary font-medium">
                  / {totalCount}
                </div>
              </div>
              <div className="text-sm text-text-primary/70 mt-2">Target Ibadah</div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-md"></div>
              <CheckCircle2
                className={`relative z-10 transition-colors duration-500 ${
                  completedCount === totalCount ? 'text-success drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'text-accent-gold'
                }`}
                size={56}
                strokeWidth={1.5}
              />
            </div>
          </div>
          
          <div className="mt-8 w-full h-3 bg-bg-secondary/50 rounded-full overflow-hidden border border-bg-secondary relative z-10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-accent-gold to-[#fcd34d] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(232,185,69,0.5)]"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* AI Highlight CTA */}
        <button 
          onClick={() => navigate('/ai-todo')}
          className="w-full glass-card bg-gradient-to-r from-accent-gold/15 via-accent-gold/5 to-transparent rounded-3xl p-6 mb-8 border border-accent-gold/30 flex items-center justify-between group hover:border-accent-gold/60 transition-all duration-500 animate-slide-in overflow-hidden relative"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-accent-gold/10 to-transparent skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-700"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-3.5 bg-accent-gold rounded-2xl shadow-[0_0_20px_rgba(232,185,69,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="text-bg-primary" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-bold text-text-primary text-xl flex items-center gap-2">
                Asisten AI Pintar
              </h3>
              <p className="text-sm text-text-secondary mt-1">Buat jadwal ibadah personalmu secara otomatis.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-full bg-white/5 text-accent-gold group-hover:bg-accent-gold group-hover:text-bg-primary transition-all duration-300">
            <ChevronRight size={20} />
          </div>
        </button>

        {/* Ibadah Checklist */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-xl font-heading font-bold text-text-primary">Checklist Harian</h2>
            <div className="text-xs font-medium text-accent-gold bg-accent-gold/10 px-2 py-1 rounded-md">Wajib & Sunnah</div>
          </div>
          <div className="space-y-3">
            {ibadahKeys.map((key, index) => (
              <div
                key={key}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IbadahCard
                  ibadahKey={key}
                  completed={todayLog[key]}
                  onToggle={() => handleToggle(key)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
