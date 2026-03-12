import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { saveData, getData } from '../utils/storage';
import { ArrowRight, ArrowLeft, BookOpen, Coins, Landmark, MoonStar, Sparkle, Sparkles, Calendar } from 'lucide-react';

const ibadahList = [
  { key: 'puasa', icon: MoonStar, label: 'Puasa', default: 30 },
  { key: 'sholat', icon: Landmark, label: 'Sholat', default: 30 },
  { key: 'tarawih', icon: Sparkles, label: 'Tarawih', default: 30 },
  { key: 'tadarus', icon: BookOpen, label: 'Tadarus', default: 30 },
  { key: 'sedekah', icon: Coins, label: 'Sedekah', default: 15 },
  { key: 'dzikir', icon: Sparkle, label: 'Dzikir', default: 30 },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  });
  const [targets, setTargets] = useState(() => {
    const data = getData();
    return data.targets || ibadahList.reduce((acc, item) => {
      acc[item.key] = item.default;
      return acc;
    }, {});
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const data = {
      setupComplete: true,
      ramadhanStartDate: startDate,
      targets,
      dailyLogs: {},
    };
    saveData(data);
    navigate('/dashboard');
  };

  const updateTarget = (key, value) => {
    setTargets({ ...targets, [key]: parseInt(value) || 0 });
  };

  return (
    <div className="min-h-screen px-6 py-12 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-primary/60">
              Langkah {step} dari 2
            </span>
            <span className="text-sm text-accent-gold">
              {Math.round((step / 2) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-bg-secondary rounded-full">
            <div
              className="h-full bg-accent-gold rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <div className="animate-fade-in text-center mt-10">
            <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d] mb-4 drop-shadow-sm">
              Kapan Ramadhan Dimulai?
            </h1>
            <p className="text-text-secondary mb-10 text-lg">
              Pilih tanggal pertama Ramadhan untuk memulai tracking
            </p>

            <div className="glass-card rounded-3xl p-8 border border-accent-gold/20 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-xl"></div>
              <label className="block mb-4 font-semibold text-lg text-text-primary relative z-10">
                Tanggal Mulai Ramadhan
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-6 py-4 bg-bg-secondary/70 border-2 border-accent-gold/30 rounded-2xl text-text-primary text-lg focus:outline-none focus:border-accent-gold focus:bg-bg-secondary focus:shadow-[0_0_20px_rgba(232,185,69,0.2)] transition-all relative z-10"
              />
              <p className="mt-6 text-sm text-text-secondary relative z-10 bg-bg-primary/50 p-3 rounded-lg inline-block border border-text-secondary/10">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={18} className="text-accent-gold" />
                  Berlangsung selama 30 hari dari tanggal ini
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Targets */}
        {step === 2 && (
          <div className="animate-fade-in text-center">
            <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d] mb-4 drop-shadow-sm">
              Target Ibadah
            </h1>
            <p className="text-text-secondary mb-8 text-lg">
              Tetapkan target untuk setiap ibadah selama Ramadhan
            </p>

            <div className="space-y-4 max-w-lg mx-auto">
              {ibadahList.map((ibadah) => (
                <div
                  key={ibadah.key}
                  className="glass-card rounded-2xl p-5 border border-accent-gold/20 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-accent-gold/10 rounded-xl">
                        {(() => {
                          const Icon = ibadah.icon;
                          return <Icon size={24} className="text-accent-gold" />;
                        })()}
                      </div>
                      <span className="font-semibold text-lg">{ibadah.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={targets[ibadah.key]}
                        onChange={(e) =>
                          updateTarget(ibadah.key, e.target.value)
                        }
                        className="w-20 px-3 py-2 bg-bg-secondary/50 border border-accent-gold/30 rounded-xl text-text-primary text-center font-bold text-lg focus:outline-none focus:border-accent-gold focus:shadow-[0_0_15px_rgba(232,185,69,0.3)] transition-all"
                      />
                      <span className="text-text-secondary font-medium">hari</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 bg-bg-card border border-accent-gold/30 rounded-xl font-medium hover:bg-bg-secondary transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-accent-gold text-bg-primary rounded-xl font-bold hover:bg-accent-gold/90 transition-all flex items-center justify-center gap-2"
          >
            {step === 2 ? 'Selesai' : 'Lanjut'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

