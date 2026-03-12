import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRamadhanData } from '../hooks/useRamadhanData';
import BottomNav from '../components/BottomNav';
import { generateRamadhanTodo } from '../utils/ai';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Import,
  Square,
  Info,
} from 'lucide-react';
import { useServerHealth } from '../hooks/useServerHealth';
import ServerStatusOverlay from '../components/ServerStatusOverlay';

export default function AITodoPage() {
  const navigate = useNavigate();
  const { todayLog, updateTodayLog, addCustomTracker } = useRamadhanData();
  const [prompt, setPrompt] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isReady, isWakingUp, secondsElapsed } = useServerHealth();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Masukkan prompt terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedTodos = await generateRamadhanTodo(prompt);
      setTodos(generatedTodos);
    } catch (err) {
      setError(err.message || 'Gagal menghasilkan todo list');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (todos.length === 0) return;

    const updates = {
      puasa: false,
      sholat: false,
      tarawih: false,
      tadarus: false,
      sedekah: false,
      dzikir: false,
    };

    const newCustomTrackers = [];

    todos.forEach((todo) => {
      const lowerTodo = todo.toLowerCase();
      
      // Map AI tasks to ibadah keys
      if (lowerTodo.includes('puasa') || lowerTodo.includes('shaum')) {
        updates.puasa = true;
      } else if (
        lowerTodo.includes('sholat') ||
        lowerTodo.includes('shalat') ||
        lowerTodo.includes('subuh') ||
        lowerTodo.includes('dzuhur') ||
        lowerTodo.includes('ashar') ||
        lowerTodo.includes('maghrib') ||
        lowerTodo.includes('isya')
      ) {
        updates.sholat = true;
      } else if (lowerTodo.includes('tarawih')) {
        updates.tarawih = true;
      } else if (
        lowerTodo.includes('tadarus') ||
        lowerTodo.includes('quran') ||
        lowerTodo.includes('qur\'an') ||
        lowerTodo.includes('baca qur')
      ) {
        updates.tadarus = true;
      } else if (
        lowerTodo.includes('sedekah') ||
        lowerTodo.includes('infaq')
      ) {
        updates.sedekah = true;
      } else if (lowerTodo.includes('dzikir') || lowerTodo.includes('zikir')) {
        updates.dzikir = true;
      } else {
        // Other tasks go to Custom Trackers
        newCustomTrackers.push(todo);
      }
    });

    updateTodayLog(updates);
    
    // Create new Custom Trackers for unmatched todos
    newCustomTrackers.forEach((todoTitle) => {
      addCustomTracker(todoTitle, 30);
    });

    try {
      sessionStorage.setItem(
        'ramadhan_last_ai_import',
        JSON.stringify({ count: todos.length, at: Date.now() })
      );
    } catch {
      // ignore sessionStorage failures
    }
    setTodos([]);
    setPrompt('');
    navigate('/tracker');
  };

  const examplePrompts = [
    'Buatkan saya todo Ramadhan hari ini',
    'Buatkan todo ibadah untuk siswa',
    'Buatkan todo jualan takjil',
    'Buatkan rutinitas sahur sehat',
    'Buatkan saya todo'
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 relative overflow-hidden transition-all duration-300">
      {isWakingUp && loading && (
        <ServerStatusOverlay secondsElapsed={secondsElapsed} />
      )}
      <div className="max-w-2xl mx-auto">
        {/* Header Enhancement */}
        <div className="mb-12 animate-fade-in relative text-center md:text-left">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
            <div className="p-4 bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 rounded-2xl animate-float shadow-glow-gold">
              <Sparkles className="text-accent-gold" size={40} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#fcd34d] to-accent-gold drop-shadow-sm">
                AI Todo Generator
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-accent-gold to-transparent rounded-full mt-2 md:mx-0 mx-auto"></div>
            </div>
          </div>
          <p className="text-text-secondary text-lg max-w-xl">
            Asisten cerdas bertenaga AI untuk merancang rutinitas Ramadhan yang dipersonalisasi sesuai kebutuhanmu.
          </p>
        </div>

        {/* Recommended Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pulse-slow">
           <div className="glass-card hover:bg-accent-gold/5 p-4 rounded-2xl border border-accent-gold/10 transition-all cursor-pointer group" onClick={() => setPrompt('Buatkan rutinitas ibadah Ramadhan produktif untuk siswa')}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                    <Info size={18} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-text-primary">Edisi Produktivitas</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Fokus pada belajar & ibadah seimbang.</p>
                 </div>
              </div>
           </div>
           <div className="glass-card hover:bg-accent-gold/5 p-4 rounded-2xl border border-accent-gold/10 transition-all cursor-pointer group" onClick={() => setPrompt('Buatkan rencana sahur sehat dan persiapan tarawih')}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-success/10 rounded-lg text-success group-hover:scale-110 transition-transform">
                    <RefreshCw size={18} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-text-primary">Edisi Sahur Sehat</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Menu praktis & ibadah malam.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Input Section */}
        <div className="glass-card rounded-3xl p-8 border border-accent-gold/30 mb-8 shadow-glass-gold relative overflow-hidden group">
          <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent-gold/20 transition-all duration-700"></div>
          <label className="block mb-4 font-semibold text-text-primary text-xl tracking-tight">
            Tuliskan tujuanmu hari ini...
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Misal: Saya ingin tetap fit saat puasa sambil menyelesaikan tugas sekolah..."
              className="w-full px-6 py-5 bg-bg-secondary/40 border-2 border-accent-gold/20 rounded-2xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-gold/60 focus:bg-bg-secondary/80 focus:shadow-[0_0_30px_rgba(232,185,69,0.1)] resize-none transition-all duration-300 relative z-10 text-lg"
              rows={4}
              disabled={loading}
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-text-secondary/50 z-20">Ditenagai oleh Groq AI</div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full mt-6 px-6 py-5 bg-gradient-to-r from-accent-gold via-[#fcd34d] to-accent-gold bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-bg-primary rounded-2xl font-bold text-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 shadow-[0_8px_25px_rgba(232,185,69,0.3)] hover:shadow-[0_12px_35px_rgba(232,185,69,0.5)] relative z-10"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Menghitung Strategi...
              </>
            ) : (
              <>
                <Sparkles size={24} className="animate-pulse" />
                Generate Rencana Cerdas
              </>
            )}
          </button>
        </div>

        {/* Example Prompts */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold/60 mb-4 pl-1">Butuh Inspirasi?</p>
          <div className="flex flex-wrap gap-2.5">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="px-5 py-2.5 glass-card bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-medium text-text-primary/70 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card bg-danger/10 border border-danger/40 rounded-2xl p-5 mb-8 flex items-center gap-3 animate-fade-in shadow-sm">
             <Info className="text-danger flex-shrink-0" size={24} />
             <span className="text-danger font-medium">{error}</span>
          </div>
        )}

        {/* Generated Todos */}
        {todos.length > 0 && (
          <div className="glass-card rounded-3xl p-8 border border-accent-gold/30 mb-8 animate-fade-in shadow-[0_10px_40px_rgba(232,185,69,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-accent-gold/10 pb-4">
              <h2 className="text-2xl font-heading font-bold text-accent-gold flex items-center gap-2">
                <Sparkles size={22} /> Rencana Ibadahmu
              </h2>
              <button
                onClick={() => setTodos([])}
                className="text-text-secondary hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Hapus Daftar"
              >
                <RefreshCw size={16} /> Batal
              </button>
            </div>
            <ul className="space-y-4 mb-8">
              {todos.map((todo, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 glass-card bg-bg-secondary/40 border border-accent-gold/10 rounded-2xl hover:border-accent-gold/30 transition-all hover:-translate-y-0.5"
                >
                  <Square className="text-accent-gold mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-text-primary/90 leading-relaxed">{todo}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleImport}
                className="flex-[2] px-6 py-4 bg-gradient-to-r from-accent-gold to-[#fcd34d] text-bg-primary rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(232,185,69,0.3)]"
              >
                <Import size={22} />
                Terapkan ke Tracker
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 px-6 py-4 glass-card border-none bg-bg-secondary/80 text-text-primary rounded-2xl font-bold hover:bg-bg-secondary hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Generate Ulang
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="glass-card bg-bg-secondary/20 rounded-2xl p-5 border border-text-secondary/10 flex items-start gap-3">
          <Info size={20} className="mt-0.5 text-accent-gold flex-shrink-0" />
          <p className="text-sm font-medium text-text-secondary leading-relaxed">
            Sistem AI akan mendeteksi dan mengaktifkan ibadah wajib secara otomatis. 
            Rutinitas lainnya yang dihasilkan oleh AI akan otomatis dimasukkan sebagai <strong className="text-accent-gold font-semibold">Tracker Kustom</strong> baru.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

