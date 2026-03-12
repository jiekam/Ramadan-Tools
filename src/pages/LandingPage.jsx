import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../utils/storage';
import { ArrowRight, Moon, BookOpen, Heart, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const data = getData();
    if (data.setupComplete) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 islamic-pattern bg-bg-primary overflow-hidden relative">
      {/* Decorative blurred background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-success/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl w-full text-center animate-fade-in relative z-10">
        {/* Logo/Icon */}
        <div className="mb-10 inline-block">
          <div className="relative">
            <Moon className="text-accent-gold animate-float" size={80} strokeWidth={1.5} />
            <Sparkles className="absolute -top-2 -right-4 text-accent-gold/60" size={24} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#fbbf24] to-accent-gold mb-6 drop-shadow-sm">
          Perjalanan Ibadah
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-text-secondary mb-14 font-body leading-relaxed max-w-2xl mx-auto">
          Bangun kebiasaan spiritual yang konsisten dengan desain elegan selama 30 hari penuh.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group">
            <div className="bg-bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-gold/20 transition-colors">
              <BookOpen className="text-accent-gold" size={28} />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Track Ibadah</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Pantau puasa, sholat, tarawih, dan berbagai progres amal harianmu.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group">
            <div className="bg-bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-gold/20 transition-colors">
              <Heart className="text-accent-gold" size={28} />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Konsistensi</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Pantau progress, bangun streak harian, dan jaga semangat beribadah.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group">
            <div className="bg-bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-gold/20 transition-colors">
              <Moon className="text-accent-gold" size={28} />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">30 Hari</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Teman perjalanan spiritual terbaikmu selama bulan Ramadhan.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/setup')}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-lg text-bg-primary bg-gradient-to-r from-accent-gold to-[#fcd34d] rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(232,185,69,0.3)] hover:shadow-[0_0_60px_rgba(232,185,69,0.5)]"
        >
          <span className="relative z-10 flex items-center gap-3">
            Mulai Sekarang
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
        </button>
      </div>
    </div>
  );
}

