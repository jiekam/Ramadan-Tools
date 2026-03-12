import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { Globe, MapPin, Clock, Newspaper, ChevronRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useServerHealth } from '../hooks/useServerHealth';

const CITIES = [
  { name: 'Makkah', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { name: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' }
];

const FUN_FACTS = [
  "Di Mesir, lentera tradisional yang disebut 'Fanous' dinyalakan untuk merayakan datangnya bulan suci Ramadhan.",
  "Di Uni Emirat Arab, tradisi 'Haq Al Laila' dirayakan pada pertengahan bulan Sya'ban, dimana anak-anak berkeliling mengumpulkan manisan.",
  "Di Turki, penabuh drum tradisional akan berkeliling pemukiman saat sahur untuk membangunkan warga.",
  "Di Indonesia, tradisi 'Padusan' dilakukan sehari sebelum Ramadhan untuk menyucikan diri dengan mandi di sumber mata air.",
  "Di Maroko, sirine khusus dibunyikan dari menara masjid untuk menandakan waktu berbuka puasa tiba.",
  "Umat muslim di negara-negara Nordik seperti Islandia kadang berpuasa hingga 22 jam saat Ramadhan jatuh di musim panas."
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loadingTimes, setLoadingTimes] = useState(true);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [randomFact, setRandomFact] = useState('');
  const { isWakingUp, secondsElapsed } = useServerHealth();

  // Fetch Prayer Times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoadingTimes(true);
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.name}&country=${selectedCity.country}&method=2`);
        const data = await response.json();
        
        if (data.code === 200) {
          setPrayerTimes({
            imsak: data.data.timings.Imsak,
            fajr: data.data.timings.Fajr,
            dhuhr: data.data.timings.Dhuhr,
            asar: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isha: data.data.timings.Isha,
          });
        }
      } catch (error) {
        console.error("Error fetching times:", error);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchPrayerTimes();
  }, [selectedCity]);

  // Fetch News and set Random Fact
  useEffect(() => {
    setRandomFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);

    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        // Fetch dari backend internal kita sendiri untuk menghindari CORS / Limit proxy gratis
        let API_BASE = import.meta.env.VITE_API_URL || '';
        if (API_BASE && !API_BASE.startsWith('http')) {
          API_BASE = `https://${API_BASE}`;
        }
        API_BASE = API_BASE.replace(/\/$/, '');
        
        const response = await fetch(`${API_BASE}/api/news`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 5);
        
        if (items.length > 0) {
          const processedNews = items.map(item => {
             const titleFull = item.querySelector("title")?.textContent || '';
             const link = item.querySelector("link")?.textContent || '#';
             const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
             
             const titleParts = titleFull.split(' - ');
             const publisher = titleParts.length > 1 ? titleParts.pop() : 'Google News';
             
             return {
               title: titleParts.join(' - '),
               link: link,
               pubDate: pubDate,
               author: publisher,
               thumbnail: ''
             };
          });
          setNews(processedNews);
        } else {
          throw new Error('No news items found in XML');
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  const handleChangeFact = () => {
    let newFact;
    do {
      newFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    } while (newFact === randomFact && FUN_FACTS.length > 1);
    
    setRandomFact(newFact);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-gold/10 rounded-xl">
              <Globe className="text-accent-gold" size={28} />
            </div>
            <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
              Dunia Ramadhan
            </h1>
          </div>
          <p className="text-text-secondary text-sm mt-2 ml-1">
            Jelajahi jadwal puasa dan berita islami dari seluruh dunia.
          </p>
        </div>

        {/* Jadwal Buka / Sahur Section */}
        <div className="glass-card rounded-3xl p-6 border border-accent-gold/20 mb-8 shadow-sm relative overflow-hidden animate-slide-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2 className="font-heading font-semibold text-lg text-text-primary flex items-center gap-2">
              <Clock className="text-accent-gold" size={20} />
              Waktu Lokal
            </h2>
            
            {/* City Selector */}
            <div className="relative group">
              <select 
                title="Pilih Kota"
                value={selectedCity.name}
                onChange={(e) => {
                  const city = CITIES.find(c => c.name === e.target.value);
                  setSelectedCity(city);
                }}
                className="appearance-none bg-bg-secondary/50 border border-text-secondary/20 text-text-primary text-sm rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:border-accent-gold cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={city.name} value={city.name} className="bg-bg-primary text-text-primary">
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-gold pointer-events-none" />
              <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none rotate-90" />
            </div>
          </div>

          {loadingTimes ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="animate-spin text-accent-gold" size={24} />
            </div>
          ) : prayerTimes ? (
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {/* Sahur/Imsak Card */}
              <div className="bg-gradient-to-br from-bg-secondary/40 to-bg-primary/40 p-4 rounded-2xl border border-text-secondary/10 hover:border-accent-gold/30 transition-colors">
                <div className="text-xs text-text-secondary mb-1">Imsak / Sahur</div>
                <div className="text-2xl font-bold font-heading text-text-primary">{prayerTimes.imsak}</div>
                <div className="text-[10px] sm:text-xs text-text-secondary mt-1">Subuh: {prayerTimes.fajr}</div>
              </div>
              
              {/* Buka/Maghrib Card */}
              <div className="bg-gradient-to-br from-accent-gold/10 to-warning/5 p-4 rounded-2xl border border-accent-gold/20 shadow-[0_4px_15px_rgba(232,185,69,0.05)] hover:border-accent-gold/40 transition-colors">
                 <div className="text-xs text-accent-gold font-medium mb-1">Berbuka Puasa</div>
                <div className="text-2xl font-bold font-heading text-accent-gold drop-shadow-sm">{prayerTimes.maghrib}</div>
                <div className="text-[10px] sm:text-xs text-text-primary/60 mt-1">Isya: {prayerTimes.isha}</div>
              </div>
            </div>
          ) : (
             <div className="text-center py-6 text-sm text-text-secondary flex flex-col items-center gap-2">
                <AlertCircle size={20} className="text-danger/70" />
                Gagal memuat jadwal. Coba lagi nanti.
             </div>
          )}
        </div>

        {/* Fun Facts Section */}
        <div className="glass-card bg-gradient-to-r from-bg-card to-bg-primary rounded-3xl p-6 mb-8 border border-text-secondary/10 relative overflow-hidden animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="font-heading font-semibold text-text-primary">Tahukah Anda?</h3>
          </div>
          <p className="text-sm text-text-primary/80 leading-relaxed italic border-l-2 border-accent-gold pl-3 mb-4">
            "{randomFact}"
          </p>
          <button 
            onClick={handleChangeFact}
            className="text-xs font-medium text-accent-gold hover:text-[#fcd34d] flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} /> Fakta Lainnya
          </button>
        </div>

        {/* Berita Terkini Section */}
        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-heading font-semibold text-lg text-text-primary mb-4 flex items-center gap-2 px-1">
            <Newspaper className="text-accent-gold" size={20} />
            Berita Islami Terkini
          </h2>
          
          <div className="space-y-4">
            {loadingNews ? (
               <div className="flex flex-col gap-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card p-4 rounded-xl flex gap-4 animate-pulse">
                      <div className="w-20 h-20 bg-bg-secondary/50 rounded-lg"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-bg-secondary/50 rounded w-3/4"></div>
                        <div className="h-3 bg-bg-secondary/30 rounded w-full"></div>
                        <div className="h-3 bg-bg-secondary/30 rounded w-1/2"></div>
                      </div>
                    </div>
                 ))}
               </div>
            ) : isWakingUp ? (
                <div className="glass-card p-8 rounded-2xl border border-accent-gold/20 text-center animate-pulse">
                   <div className="relative w-12 h-12 mx-auto mb-4">
                      <RefreshCw className="animate-spin text-accent-gold" size={32} />
                      <Sparkles className="absolute -top-1 -right-1 text-accent-gold" size={16} />
                   </div>
                   <p className="text-sm font-medium text-text-primary">AI sedang bersiap ({secondsElapsed}s)...</p>
                   <p className="text-[10px] text-text-secondary mt-1 italic">Berita akan muncul saat server sudah bangun.</p>
                </div>
              ) : news.length > 0 ? (
              news.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-card p-4 rounded-2xl border border-text-secondary/10 hover:border-accent-gold/40 hover:-translate-y-1 hover:shadow-glow transition-all group"
                >
                  <div className="flex gap-4">
                    {item.thumbnail ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.thumbnail} 
                          alt="Thumbnail Berita" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                       <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-bg-secondary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold/10 transition-colors">
                          <Newspaper size={24} className="text-text-secondary/50" />
                       </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-sm sm:text-base font-medium text-text-primary group-hover:text-accent-gold transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="mt-2 text-[10px] sm:text-xs text-text-secondary flex items-center gap-2">
                         <span>{new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         <span className="w-1 h-1 rounded-full bg-text-secondary/30"></span>
                         <span className="truncate">{item.author || 'CNN'}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="glass-card p-8 rounded-2xl border border-text-secondary/10 text-center">
                 <Newspaper className="mx-auto text-text-secondary/50 mb-3" size={32} />
                 <p className="text-sm text-text-secondary">Tidak dapat memuat berita saat ini.</p>
              </div>
            )}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
