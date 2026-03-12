import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRamadhanData } from '../hooks/useRamadhanData';
import BottomNav from '../components/BottomNav';
import IbadahCard from '../components/IbadahCard';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { Calendar, ListChecks, ArrowLeft, Sparkles, Plus, Edit2, Trash2, X, CheckCircle2, Circle } from 'lucide-react';

const ibadahKeys = ['puasa', 'sholat', 'tarawih', 'tadarus', 'sedekah', 'dzikir'];

export default function TrackerPage() {
  const navigate = useNavigate();
  const { 
    todayLog, 
    updateTodayLog, 
    ramadhanDay,
    customTrackers,
    addCustomTracker,
    editCustomTracker,
    deleteCustomTracker
  } = useRamadhanData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTracker, setEditingTracker] = useState(null);
  const [trackerTitle, setTrackerTitle] = useState('');
  const [trackerTarget, setTrackerTarget] = useState(30);

  const imported = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('ramadhan_last_ai_import');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const handleToggle = (key) => {
    updateTodayLog({ [key]: !todayLog[key] });
  };

  const handleCustomToggle = (id) => {
    const currentCustomLogs = todayLog.customLogs || {};
    updateTodayLog({
      customLogs: {
        ...currentCustomLogs,
        [id]: !currentCustomLogs[id],
      },
    });
  };

  const completedCount = ibadahKeys.filter((key) => todayLog[key]).length;

  const openAddModal = () => {
    setEditingTracker(null);
    setTrackerTitle('');
    setTrackerTarget(30);
    setIsModalOpen(true);
  };

  const openEditModal = (tracker) => {
    setEditingTracker(tracker);
    setTrackerTitle(tracker.title);
    setTrackerTarget(tracker.target);
    setIsModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteTracker = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteCustomTracker(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleSaveTracker = () => {
    if (!trackerTitle.trim()) return;
    
    if (editingTracker) {
      editCustomTracker(editingTracker.id, trackerTitle, trackerTarget);
    } else {
      addCustomTracker(trackerTitle, trackerTarget);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent-gold/10 rounded-xl">
                  <ListChecks className="text-accent-gold" size={24} />
                </div>
                <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
                  Tracker Hari Ini
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-3 px-3 py-1.5 glass-card rounded-full text-text-secondary w-fit shadow-sm border-none">
                <Calendar size={14} className="text-accent-gold" />
                <span className="text-xs font-medium">
                  {format(new Date(), 'd MMMM yyyy', { locale: id })}
                </span>
                {ramadhanDay > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="text-xs font-bold text-accent-gold">Day {ramadhanDay}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 glass-card rounded-xl text-text-primary/80 hover:bg-bg-secondary hover:-translate-x-1 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Kembali</span>
            </button>
          </div>
        </div>

        {imported && (
          <div className="bg-gradient-to-r from-accent-gold/10 to-success/10 rounded-2xl p-5 mb-8 border border-accent-gold/30 shadow-[0_4px_20px_rgba(232,185,69,0.1)] animate-slide-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2 bg-accent-gold/20 rounded-xl">
                <Sparkles className="text-accent-gold" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-heading font-semibold text-lg text-accent-gold mb-1">
                  Import dari AI berhasil
                </div>
                <div className="text-sm text-text-primary/80 leading-relaxed">
                  <strong className="text-text-primary">{imported.count ?? 0}</strong> item diproses. Ibadah terdeteksi otomatis
                  dan sisanya dimasukkan ke <span className="text-accent-gold font-medium">Tracker Kustom</span>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wajib Trackers */}
        <div className="glass-card rounded-3xl p-7 border border-accent-gold/20 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-text-secondary font-medium tracking-wide uppercase mb-1">Ibadah Wajib & Sunnah</div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold font-heading text-accent-gold">{completedCount}</div>
                <div className="text-lg text-text-secondary font-medium">/ {ibadahKeys.length}</div>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-bg-secondary flex items-center justify-center relative shadow-inner">
              <div className="absolute inset-0 rounded-full bg-accent-gold/10"></div>
              <span className="text-lg font-bold text-accent-gold relative z-10">{Math.round((completedCount/ibadahKeys.length)*100)}%</span>
            </div>
          </div>

          <div className="space-y-3">
            {ibadahKeys.map((key) => (
              <IbadahCard
                key={key}
                ibadahKey={key}
                completed={todayLog[key]}
                onToggle={() => handleToggle(key)}
              />
            ))}
          </div>
        </div>

        {/* Custom Trackers */}
        <div className="glass-card rounded-3xl p-7 border border-accent-gold/20 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
             <h2 className="font-heading font-semibold text-lg text-text-primary flex items-center gap-2">
              <Sparkles className="text-accent-gold" size={20} /> Tracker Kustom
            </h2>
            <button 
              onClick={openAddModal}
              className="text-sm font-medium text-accent-gold bg-accent-gold/10 hover:bg-accent-gold/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Tambah Baru
            </button>
          </div>

          {customTrackers.length > 0 ? (
            <div className="space-y-3">
              {customTrackers.map((tracker) => {
                const isCompleted = todayLog.customLogs && todayLog.customLogs[tracker.id];
                return (
                  <div 
                    key={tracker.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isCompleted ? 'bg-success/5 border-success/30 shadow-[0_4px_15px_rgba(52,211,153,0.1)]' : 'glass-card border-text-secondary/10 hover:border-accent-gold/30 hover:bg-bg-secondary/40'}`}
                  >
                    <button 
                      onClick={() => handleCustomToggle(tracker.id)}
                      className="flex-1 flex items-center gap-4 text-left group"
                    >
                      <div className={`transition-transform duration-300 group-hover:scale-110 ${isCompleted ? 'scale-110' : ''}`}>
                         {isCompleted ? (
                           <CheckCircle2 size={24} className="text-success drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                         ) : (
                           <Circle size={24} className="text-text-primary/30 group-hover:text-accent-gold/70 transition-colors" />
                         )}
                      </div>
                      <span className={`font-medium transition-colors ${isCompleted ? 'text-success/90 line-through' : 'text-text-primary/90 group-hover:text-accent-gold'}`}>
                        {tracker.title}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 pl-4">
                      <button 
                        onClick={() => openEditModal(tracker)}
                        className="p-2 text-text-primary/40 hover:text-bg-primary hover:bg-accent-gold rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTracker(tracker.id)}
                        className="p-2 text-text-primary/40 hover:text-white hover:bg-danger rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-sm text-text-secondary bg-bg-secondary/30 p-4 rounded-xl text-center border border-text-secondary/10">
              Belum ada tracker kustom. Klik "Tambah Baru" atau gunakan <strong className="text-accent-gold">AI Todo Generator</strong>.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit Tracker */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-bg-primary border border-accent-gold/30 rounded-3xl p-6 w-full max-w-sm animate-fade-in shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
                {editingTracker ? 'Edit Tracker' : 'Tracker Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-accent-gold transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nama Tracker</label>
                <input 
                  type="text" 
                  value={trackerTitle}
                  onChange={(e) => setTrackerTitle(e.target.value)}
                  placeholder="Misal: Olahraga, Membaca Buku..."
                  className="w-full px-4 py-3 bg-bg-secondary/50 border border-text-secondary/20 rounded-xl text-text-primary focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Target Hari (Default: 30)</label>
                <input 
                  type="number" 
                  value={trackerTarget}
                  onChange={(e) => setTrackerTarget(e.target.value)}
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 bg-bg-secondary/50 border border-text-secondary/20 rounded-xl text-text-primary focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-text-primary bg-bg-secondary/80 hover:bg-bg-secondary transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveTracker}
                disabled={!trackerTitle.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-bg-primary bg-gradient-to-r from-accent-gold to-[#fcd34d] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <div className="bg-bg-primary border border-danger/30 rounded-3xl p-6 w-full max-w-sm animate-fade-in shadow-[0_10px_40px_rgba(220,38,38,0.2)]">
            <div className="flex items-center gap-4 mb-6 text-danger">
              <div className="p-3 bg-danger/10 rounded-2xl">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold">Hapus Tracker?</h2>
            </div>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Seluruh data riwayat untuk tracker ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-text-primary bg-bg-secondary/80 hover:bg-bg-secondary transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-danger hover:bg-danger/90 transition-colors shadow-lg shadow-danger/20"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
