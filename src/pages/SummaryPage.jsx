import { useRamadhanData } from '../hooks/useRamadhanData';
import BottomNav from '../components/BottomNav';
import { getData } from '../utils/storage';
import { Share2, RotateCcw, Trophy, Star, Sparkles, Flame, Sprout, BarChart3, ListChecks } from 'lucide-react';

const ibadahLabels = {
  puasa: 'Puasa',
  sholat: 'Sholat',
  tarawih: 'Tarawih',
  tadarus: 'Tadarus',
  sedekah: 'Sedekah',
  dzikir: 'Dzikir',
};

export default function SummaryPage() {
  const { getIbadahProgress, getCustomProgress, customTrackers, streak, consistency } = useRamadhanData();
  const data = getData();

  const handleShare = async () => {
    let summary = Object.keys(ibadahLabels)
      .map((key) => {
        const progress = getIbadahProgress(key);
        return `${ibadahLabels[key]}: ${progress.completed}/${progress.target}`;
      })
      .join('\n');

    if (customTrackers.length > 0) {
      summary += '\n\nTracker Kustom:\n';
      summary += customTrackers
        .map((tracker) => {
          const progress = getCustomProgress(tracker.id);
          return `${tracker.title}: ${progress.completed}/${progress.target}`;
        })
        .join('\n');
    }

    const text = `Summary Ramadhan Ibadah Tracker\n\n${summary}\n\nStreak: ${streak} hari\nKonsistensi: ${consistency}%`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Summary disalin ke clipboard!');
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Apakah kamu yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan.'
      )
    ) {
      localStorage.removeItem('ramadhan_tracker_data');
      window.location.href = '/setup';
    }
  };

  const getOverallScore = () => {
    let totalCompleted = Object.keys(ibadahLabels).reduce((sum, key) => {
      return sum + getIbadahProgress(key).completed;
    }, 0);
    let totalTarget = Object.keys(ibadahLabels).reduce((sum, key) => {
      return sum + getIbadahProgress(key).target;
    }, 0);

    customTrackers.forEach((tracker) => {
      const p = getCustomProgress(tracker.id);
      totalCompleted += p.completed;
      totalTarget += p.target;
    });

    return totalTarget > 0
      ? Math.round((totalCompleted / totalTarget) * 100)
      : 0;
  };

  const getMotivationalMessage = (score) => {
    if (score >= 90) {
      return {
        icon: Sparkles,
        title: 'Luar Biasa!',
        message: 'Kamu telah menyelesaikan Ramadhan dengan sangat baik. Semoga ibadahmu diterima Allah SWT.',
      };
    } else if (score >= 70) {
      return {
        icon: Sparkles,
        title: 'Bagus Sekali!',
        message: 'Kamu telah berusaha dengan baik. Terus tingkatkan konsistensi di Ramadhan berikutnya.',
      };
    } else if (score >= 50) {
      return {
        icon: Flame,
        title: 'Tetap Semangat!',
        message: 'Setiap langkah kecil menuju kebaikan adalah kemajuan. Terus berusaha!',
      };
    } else {
      return {
        icon: Sprout,
        title: 'Awal yang Baik',
        message: 'Ramadhan adalah perjalanan. Terus tingkatkan ibadahmu setiap hari.',
      };
    }
  };

  const score = getOverallScore();
  const motivation = getMotivationalMessage(score);

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-72 px-4 py-8 relative overflow-hidden transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#fbbf24] to-accent-gold mb-3 drop-shadow-sm">
            Summary Ramadhan
          </h1>
          <p className="text-text-secondary text-lg">
            Laporan akhir perjalanan spiritualmu selama bulan penuh berkah.
          </p>
        </div>

        {/* Overall Score */}
        <div className="glass-card bg-gradient-to-br from-accent-gold/10 to-transparent rounded-3xl p-10 mb-8 border border-accent-gold/30 text-center relative overflow-hidden shadow-[0_10px_40px_rgba(232,185,69,0.1)] hover:shadow-[0_10px_50px_rgba(232,185,69,0.15)] transition-shadow duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <Trophy className="mx-auto text-accent-gold mb-6 drop-shadow-[0_0_15px_rgba(232,185,69,0.5)]" size={64} strokeWidth={1.5} />
          <div className="text-7xl font-bold font-heading text-accent-gold mb-2 drop-shadow-md">
            {score}<span className="text-4xl text-accent-gold/80">%</span>
          </div>
          <div className="text-text-secondary uppercase tracking-widest font-semibold text-sm">Overall Score</div>
        </div>

        {/* Motivational Message */}
        <div className="glass-card rounded-3xl p-8 border border-accent-gold/20 mb-8 relative flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="p-4 bg-accent-gold/10 rounded-2xl flex-shrink-0 animate-float">
            {(() => {
              const Icon = motivation.icon;
              return <Icon className="text-accent-gold" size={48} strokeWidth={1.5} />;
            })()}
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d] mb-2">
              {motivation.title}
            </h2>
            <p className="text-text-primary/90 text-lg leading-relaxed">{motivation.message}</p>
          </div>
        </div>

        {/* Stats Table - Wajib */}
        <div className="glass-card rounded-3xl p-8 border border-accent-gold/20 mb-8 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-accent-gold" size={24} />
            <h2 className="font-heading font-bold text-xl text-text-primary">
              Detail Performa Ibadah Wajib
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-secondary/20">
                  <th className="text-left py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                    Ibadah Ke-
                  </th>
                  <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                    Tercapai
                  </th>
                  <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                    Target
                  </th>
                  <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(ibadahLabels).map((key) => {
                  const progress = getIbadahProgress(key);
                  return (
                    <tr
                      key={key}
                      className="border-b border-text-secondary/10 hover:bg-bg-secondary/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-semibold text-text-primary">{ibadahLabels[key]}</td>
                      <td className="py-4 px-4 text-right text-accent-gold font-bold text-lg">
                        {progress.completed}
                      </td>
                      <td className="py-4 px-4 text-right text-text-secondary font-medium">
                        / {progress.target}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                            progress.percentage >= 80
                              ? 'bg-success/20 text-success border border-success/30'
                              : progress.percentage >= 50
                              ? 'bg-warning/20 text-warning border border-warning/30'
                              : 'bg-danger/20 text-danger border border-danger/30'
                          }`}
                        >
                          {progress.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Table - Custom Trackers */}
        {customTrackers.length > 0 && (
          <div className="glass-card rounded-3xl p-8 border border-success/20 mb-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="text-success" size={24} />
              <h2 className="font-heading font-bold text-xl text-text-primary">
                Detail Performa Tracker Kustom
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-text-secondary/20">
                    <th className="text-left py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                      Tracker Ke-
                    </th>
                    <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                      Tercapai
                    </th>
                    <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                      Target
                    </th>
                    <th className="text-right py-4 px-4 text-text-secondary font-semibold uppercase text-xs tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customTrackers.map((tracker) => {
                    const progress = getCustomProgress(tracker.id);
                    return (
                      <tr
                        key={tracker.id}
                        className="border-b border-text-secondary/10 hover:bg-bg-secondary/40 transition-colors"
                      >
                        <td className="py-4 px-4 font-semibold text-text-primary">{tracker.title}</td>
                        <td className="py-4 px-4 text-right text-success font-bold text-lg">
                          {progress.completed}
                        </td>
                        <td className="py-4 px-4 text-right text-text-secondary font-medium">
                          / {progress.target}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                              progress.percentage >= 80
                                ? 'bg-success/20 text-success border border-success/30'
                                : progress.percentage >= 50
                                ? 'bg-warning/20 text-warning border border-warning/30'
                                : 'bg-danger/20 text-danger border border-danger/30'
                            }`}
                          >
                            {progress.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-accent-gold/20 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-gold/10 rounded-xl">
                <Star className="text-accent-gold" size={28} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary mb-1">Total Streak</div>
                <div className="text-3xl font-bold font-heading text-accent-gold drop-shadow-sm">
                  {streak} <span className="text-base font-body font-medium text-text-primary/70">hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 border border-accent-gold/20 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <Trophy className="text-success" size={28} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary mb-1">Rata-rata Konsistensi</div>
                <div className="text-3xl font-bold font-heading text-success drop-shadow-sm">
                  {consistency}<span className="text-xl">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={handleShare}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-accent-gold to-[#fcd34d] text-bg-primary rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(232,185,69,0.3)] hover:shadow-[0_8px_25px_rgba(232,185,69,0.5)]"
          >
            <Share2 size={22} />
            Bagikan Laporan
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-4 glass-card border border-danger/40 text-danger rounded-2xl font-bold hover:bg-danger/10 hover:border-danger hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Reset Data
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

