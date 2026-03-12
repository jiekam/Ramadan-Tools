import { useRamadhanData } from '../hooks/useRamadhanData';
import ProgressBar from '../components/ProgressBar';
import StreakBadge from '../components/StreakBadge';
import BottomNav from '../components/BottomNav';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ibadahLabels = {
  puasa: 'Puasa',
  sholat: 'Sholat',
  tarawih: 'Tarawih',
  tadarus: 'Tadarus',
  sedekah: 'Sedekah',
  dzikir: 'Dzikir',
};

export default function ProgressPage() {
  const { getIbadahProgress, getCustomProgress, customTrackers, streak, consistency } = useRamadhanData();

  const chartData = Object.keys(ibadahLabels).map((key) => {
    const progress = getIbadahProgress(key);
    return {
      name: ibadahLabels[key],
      completed: progress.completed,
      target: progress.target,
    };
  });

  const customChartData = customTrackers.map((tracker) => {
    const progress = getCustomProgress(tracker.id);
    return {
      name: tracker.title,
      completed: progress.completed,
      target: progress.target,
    };
  });

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 relative overflow-hidden transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in relative z-10">
          <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d] mb-3 drop-shadow-sm">
            Progress Ramadhan
          </h1>
          <p className="text-text-secondary text-lg">
            Pantau konsistensi ibadahmu selama Ramadhan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <StreakBadge streak={streak} />
          <div className="glass-card rounded-2xl p-5 border border-accent-gold/20 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full border-4 border-bg-secondary flex items-center justify-center relative shadow-inner flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-success/10"></div>
              <span className="text-success font-bold relative z-10">{Math.round(consistency)}%</span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary mb-0.5">
                Konsistensi Overall
              </div>
              <div className="text-sm text-text-primary/80 font-medium leading-tight">
                Pertahankan ritme ibadahmu!
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars - Wajib */}
        <div className="glass-card rounded-3xl p-7 border border-accent-gold/20 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="font-heading font-semibold text-xl text-accent-gold mb-6 border-b border-accent-gold/10 pb-4">
            Progress Ibadah Wajib
          </h2>
          <div className="space-y-7">
            {Object.keys(ibadahLabels).map((key) => {
              const progress = getIbadahProgress(key);
              return (
                <ProgressBar
                  key={key}
                  label={ibadahLabels[key]}
                  completed={progress.completed}
                  target={progress.target}
                  percentage={progress.percentage}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Bars - Custom Trackers */}
        {customTrackers.length > 0 && (
          <div className="glass-card rounded-3xl p-7 border border-accent-gold/20 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-success/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="font-heading font-semibold text-xl text-success/90 mb-6 border-b border-success/10 pb-4">
              Progress Tracker Kustom
            </h2>
            <div className="space-y-7">
              {customTrackers.map((tracker) => {
                const progress = getCustomProgress(tracker.id);
                return (
                  <ProgressBar
                    key={tracker.id}
                    label={tracker.title}
                    completed={progress.completed}
                    target={progress.target}
                    percentage={progress.percentage}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="glass-card rounded-3xl p-7 border border-accent-gold/20 mb-8 shadow-sm">
          <h2 className="font-heading font-semibold text-xl text-accent-gold mb-6 border-b border-accent-gold/10 pb-4">
            Grafik Progress Wajib
          </h2>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(176, 184, 172, 0.1)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#b0b8ac"
                  tick={{ fill: '#b0b8ac', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#b0b8ac" 
                  tick={{ fill: '#b0b8ac', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(232, 185, 69, 0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(22, 49, 36, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(232, 185, 69, 0.3)',
                    borderRadius: '12px',
                    color: '#f0eedc',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    padding: '12px',
                  }}
                  itemStyle={{ color: '#e8b945', fontWeight: 'bold' }}
                />
                <Bar
                  dataKey="completed"
                  fill="url(#goldGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8b945" />
                    <stop offset="100%" stopColor="#b99026" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Custom Trackers Chart */}
        {customTrackers.length > 0 && (
          <div className="glass-card rounded-3xl p-7 border border-success/20 mb-8 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-success/90 mb-6 border-b border-success/10 pb-4">
              Grafik Progress Kustom
            </h2>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(176, 184, 172, 0.1)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#b0b8ac"
                    tick={{ fill: '#b0b8ac', fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#b0b8ac" 
                    tick={{ fill: '#b0b8ac', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(52, 211, 153, 0.05)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(22, 49, 36, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: '12px',
                      color: '#f0eedc',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      padding: '12px',
                    }}
                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="url(#successGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                  <defs>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}

