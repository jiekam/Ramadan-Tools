import { useMemo, useState } from 'react';
import { useRamadhanData } from '../hooks/useRamadhanData';
import BottomNav from '../components/BottomNav';
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';
import {
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Flame,
} from 'lucide-react';

const ibadahLabels = {
  puasa: 'Puasa',
  sholat: 'Sholat',
  tarawih: 'Tarawih',
  tadarus: 'Tadarus',
  sedekah: 'Sedekah',
  dzikir: 'Dzikir',
};

export default function CalendarPage() {
  const { calendar, ramadhanDay, updateLogForDate } = useRamadhanData();
  const [selectedDay, setSelectedDay] = useState(null);
  const [saving, setSaving] = useState(false);

  const monthTitle = useMemo(() => {
    const first = calendar?.[0]?.date;
    if (!first) return 'Kalender Ramadhan';
    try {
      return `Kalender Ramadhan • ${format(parseISO(first), 'MMMM yyyy', { locale: id })}`;
    } catch {
      return 'Kalender Ramadhan';
    }
  }, [calendar]);

  const getDayStyle = (completed) => {
    if (completed >= 5)
      return 'bg-success/15 border-success/60 hover:border-success hover:bg-success/20';
    if (completed >= 3)
      return 'bg-warning/15 border-warning/60 hover:border-warning hover:bg-warning/20';
    if (completed >= 1)
      return 'bg-danger/15 border-danger/60 hover:border-danger hover:bg-danger/20';
    return 'bg-bg-card border-accent-gold/15 hover:border-accent-gold/35 hover:bg-bg-secondary/40';
  };

  const getDayIcon = (completed) => {
    if (completed >= 5) return <CheckCircle2 className="text-success" size={18} />;
    if (completed >= 3) return <Flame className="text-warning" size={18} />;
    if (completed >= 1) return <Circle className="text-danger" size={18} />;
    return <Circle className="text-text-primary/25" size={18} />;
  };

  const isToday = (day) => day?.day === ramadhanDay && ramadhanDay > 0;

  const toggleIbadahForSelectedDay = async (key) => {
    if (!selectedDay) return;
    setSaving(true);
    try {
      const nextValue = !selectedDay.log[key];
      const updated = updateLogForDate(selectedDay.date, { [key]: nextValue });
      setSelectedDay((prev) =>
        prev
          ? {
              ...prev,
              log: { ...prev.log, [key]: updated[key] },
              completed: Object.keys(ibadahLabels).filter((k) => updated[k]).length,
            }
          : prev
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 relative overflow-hidden transition-all duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-success/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Enhancement */}
        <div className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-bg-card to-transparent p-6 md:p-8 rounded-[2.5rem] border border-accent-gold/15 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-accent-gold/10 rounded-2xl shadow-glow-gold relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <CalendarIcon className="text-accent-gold relative z-10 group-hover:text-bg-primary transition-colors duration-500" size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#fcd34d] to-accent-gold drop-shadow-sm">
                  {monthTitle}
                </h1>
                <p className="text-text-secondary text-sm md:text-base mt-2 font-medium opacity-80">
                  Pantau konsistensi ibadahmu selama bulan suci.
                </p>
              </div>
            </div>
            {ramadhanDay > 0 && (
              <div className="inline-flex px-6 py-3 glass-card border border-accent-gold/30 rounded-2xl text-text-primary/90 items-center justify-center whitespace-nowrap shadow-glow-gold/20">
                <span className="text-sm font-semibold opacity-70 mr-2">Status:</span>
                <span className="text-accent-gold font-bold text-xl">Day {ramadhanDay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Legend - More Modern & Visual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          {[
            { icon: <CheckCircle2 size={18} />, label: 'Lengkap (5-6)', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
            { icon: <Flame size={18} />, label: 'Bagus (3-4)', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
            { icon: <Circle size={18} />, label: 'Kurang (1-2)', color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' },
            { icon: <Circle size={18} />, label: 'Belum Ada', color: 'text-text-primary/30', bg: 'bg-bg-secondary/40', border: 'border-white/5' }
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl border ${item.bg} ${item.border} backdrop-blur-sm transition-all hover:scale-[1.02]`}>
              <div className={`${item.color} drop-shadow-sm`}>{item.icon}</div>
              <span className="text-[10px] md:text-xs font-bold text-text-primary/80 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid - Refined */}
        <div className="glass-card rounded-3xl md:rounded-[2.5rem] p-4 md:p-10 border border-accent-gold/20 mb-8 shadow-glass-gold/10">
          <div className="grid grid-cols-7 gap-1.5 md:gap-5">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
              <div key={d} className="text-center text-[10px] md:text-sm font-black text-text-secondary/50 uppercase tracking-widest mb-2 md:mb-4">{d}</div>
            ))}
            {calendar.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl md:rounded-[1.5rem] border md:border-2 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl active:scale-[0.95] group relative overflow-hidden ${getDayStyle(
                  day.completed
                )} ${isToday(day) ? 'ring-2 md:ring-4 ring-accent-gold/30 ring-offset-2 md:ring-offset-4 ring-offset-bg-primary shadow-glow-gold' : ''}`}
              >
                <div className="flex flex-col items-center justify-center h-full relative z-10 p-0.5">
                  <div className={`text-sm md:text-xl font-black mb-0.5 transition-colors ${isToday(day) ? 'text-accent-gold' : 'text-text-primary/90'}`}>
                    {day.day}
                  </div>
                  {/* Icons only on desktop */}
                  <div className="hidden md:block mb-2 scale-75 md:scale-100 transition-transform group-hover:scale-110">{getDayIcon(day.completed)}</div>
                  <div className={`text-[8px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full ${day.completed > 0 ? 'bg-black/10' : 'text-text-secondary/40'}`}>
                    {day.completed}/6
                  </div>
                </div>
                {isToday(day) && (
                  <div className="absolute top-0.5 right-0.5 md:top-2 md:right-2 w-1 h-1 md:w-2 md:h-2 bg-accent-gold rounded-full animate-ping"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Day Detail Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card rounded-xl p-6 border border-accent-gold/20 max-w-md w-full animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-heading font-bold text-accent-gold">
                  Hari {selectedDay.day}
                </h2>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-text-primary/60 hover:text-accent-gold"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-text-primary/60 mb-4">
                {format(parseISO(selectedDay.date), 'd MMMM yyyy', {
                  locale: id,
                })}
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium text-text-primary/80 mb-2">
                  Ibadah (klik untuk toggle):
                </div>
                {Object.keys(ibadahLabels).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleIbadahForSelectedDay(key)}
                    disabled={saving}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                      selectedDay.log[key]
                        ? 'bg-success/15 text-success border-success/40'
                        : 'bg-bg-secondary/40 text-text-primary/70 border-accent-gold/10 hover:border-accent-gold/25'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedDay.log[key] ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Circle size={18} className="text-text-primary/35" />
                      )}
                      <span className="text-sm font-medium">{ibadahLabels[key]}</span>
                    </div>
                    <span className="text-xs text-text-primary/50">
                      {selectedDay.log[key] ? 'Selesai' : 'Belum'}
                    </span>
                  </button>
                ))}
              </div>
              {selectedDay.log.extraTodos &&
                selectedDay.log.extraTodos.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-text-primary/80 mb-2">
                      Todo Tambahan:
                    </div>
                    <ul className="space-y-1">
                      {selectedDay.log.extraTodos.map((todo, index) => (
                        <li
                          key={index}
                          className="text-sm text-text-primary/60 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                          <span>{todo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

