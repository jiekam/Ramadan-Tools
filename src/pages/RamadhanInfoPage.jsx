import React from 'react';
import BottomNav from '../components/BottomNav';
import { BookOpen, CheckCircle2, Moon, Sun, Heart, Info, Clipboard } from 'lucide-react';

const INFO_SECTIONS = [
  {
    id: 'niat-puasa',
    title: 'Niat Puasa',
    icon: <Moon className="text-accent-gold" size={24} />,
    content: [
      {
        subtitle: 'Niat Puasa Ramadhan',
        arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى',
        latin: 'Nawaitu shauma ghadin \'an adaa\'i fardhi syahri ramadhaana haadzihis sanati lillaahi ta\'aalaa.',
        translation: 'Aku niat berpuasa esok hari untuk menunaikan kewajipan bulan Ramadhan tahun ini kerana Allah Ta\'ala.'
      }
    ]
  },
  {
    id: 'doa-berbuka',
    title: 'Doa Berbuka',
    icon: <Sun className="text-warning" size={24} />,
    content: [
      {
        subtitle: 'Doa Berbuka',
        arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        latin: 'Allahumma laka shumtu wa bika aamantu wa \'ala rizqika afthartu.',
        translation: 'Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.'
      },
      {
        subtitle: 'Doa Berbuka (Sesuai Hadits Shahih)',
        arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        latin: 'Dzahabaz zhama\'u wabtallatil \'uruuqu wa tsabatal ajru in syaa\' Allaah.',
        translation: 'Telah hilang rasa haus dan urat-urat telah basah, serta pahala telah ditetapkan, insya Allah.'
      }
    ]
  },
  {
    id: 'zakat-fitrah',
    title: 'Zakat Fitrah',
    icon: <Heart className="text-danger" size={24} />,
    content: [
      {
        subtitle: 'Tentang Zakat Fitrah',
        text: 'Zakat fitrah adalah zakat yang wajib dikeluarkan setiap jiwa mukmin di bulan Ramadhan sebagai pembersih bagi orang yang berpuasa dari perbuatan sia-sia dan ucapan kotor.'
      },
      {
        subtitle: 'Besaran Zakat',
        text: 'Besaran zakat fitrah adalah 1 sha\' (sekitar 2.5 kg atau 3.5 liter) bahan makanan pokok (beras di Indonesia) atau setara dengan nilai uang yang ditetapkan pemerintah.'
      },
      {
        subtitle: 'Niat Zakat Fitrah (Untuk Diri Sendiri)',
        arabic: 'نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِيْ فَرْضًا لِلّٰهِ تَعَالَى',
        latin: 'Nawaitu an ukhrija zakaatal fithri \'an nafsii fardhan lillaahi ta\'aalaa.',
        translation: 'Aku niat mengeluarkan zakat fitrah untuk diriku sendiri, fardu karena Allah Ta\'ala.'
      }
    ]
  },
  {
    id: 'shalat-idul-fitri',
    title: 'Shalat Idul Fitri',
    icon: <CheckCircle2 className="text-success" size={24} />,
    content: [
      {
        subtitle: 'Tata Cara Singkat',
        text: 'Shalat Id dilakukan dua rakaat secara berjamaah. Rakaat pertama terdapat 7 takbir tambahan, dan rakaat kedua terdapat 5 takbir tambahan di luar takbiratul ihram dan takbir intiqal.'
      },
      {
        subtitle: 'Niat Shalat Idul Fitri (Makmum)',
        arabic: 'أُصَلِّي سُنَّةً لِعِيْدِ الْفِطْرِ رَكْعَتَيْنِ مَأْمُوْمًا لِلّٰهِ تَعَالَى',
        latin: 'Ushallii sunnatal li\'iidil fithri rak\'ataini ma\'muuman lillaahi ta\'aalaa.',
        translation: 'Aku niat shalat sunnah Idul Fitri dua rakaat menjadi makmum karena Allah Ta\'ala.'
      }
    ]
  },
  {
    id: 'adab-berpuasa',
    title: 'Adab Berpuasa',
    icon: <Info className="text-blue-400" size={24} />,
    list: [
      'Mengakhiri sahur (mendekati waktu imsak).',
      'Menyegerakan berbuka saat waktu maghrib tiba.',
      'Menjaga lisan dari perkataan dusta, ghibah, dan emosi.',
      'Memperbanyak sedekah dan membaca Al-Qur\'an.',
      'Menghindari hal-hal yang mengurangi pahala puasa.'
    ]
  }
];

export default function RamadhanInfoPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification here if available
  };

  return (
    <div className="min-h-screen pt-20 pb-8 md:pl-72 px-4 transition-all duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-3 bg-accent-gold/10 rounded-2xl">
              <BookOpen className="text-accent-gold" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
              Panduan Ramadhan
            </h1>
          </div>
          <p className="text-text-secondary text-sm md:text-base mt-2 ml-1">
            Informasi penting, niat, dan adab untuk memaksimalkan ibadah di bulan suci.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {INFO_SECTIONS.map((section, idx) => (
            <div
              key={section.id}
              className="glass-card rounded-3xl p-6 border border-white/5 shadow-glass animate-slide-in relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -z-10"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-text-primary/5 rounded-xl">
                  {section.icon}
                </div>
                <h2 className="text-xl font-heading font-bold text-text-primary">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content?.map((item, i) => (
                  <div key={i} className="space-y-3">
                    {item.subtitle && (
                      <h3 className="text-sm font-semibold text-accent-gold/80 uppercase tracking-wider">
                        {item.subtitle}
                      </h3>
                    )}

                    {item.arabic && (
                      <div className="relative group p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-gold/30 transition-all">
                        <p className="text-2xl md:text-3xl font-arabic text-right leading-loose text-text-primary mb-4" dir="rtl">
                          {item.arabic}
                        </p>
                        <button
                          onClick={() => copyToClipboard(item.arabic)}
                          className="absolute bottom-4 left-4 p-2 rounded-lg bg-text-primary/5 text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Salin Arab"
                        >
                          <Clipboard size={16} />
                        </button>
                      </div>
                    )}

                    {item.latin && (
                      <p className="text-sm italic text-text-primary/70 leading-relaxed pl-4 border-l-2 border-accent-gold/30">
                        "{item.latin}"
                      </p>
                    )}

                    {item.translation && (
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-accent-gold italic flex-shrink-0">Artinya:</span>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item.translation}
                        </p>
                      </div>
                    )}

                    {item.text && (
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.text}
                      </p>
                    )}
                  </div>
                ))}

                {section.list && (
                  <ul className="space-y-3">
                    {section.list.map((li, i) => (
                      <li key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-gold/20 transition-all">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0"></div>
                        <span className="text-sm text-text-secondary leading-tight">{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-3xl bg-accent-gold/5 border border-accent-gold/10 text-center animate-fade-in">
          <p className="text-xs text-text-secondary italic">
            "Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap pahala dari Allah, maka diampuni dosa-dosanya yang telah lalu." (HR. Bukhari & Muslim)
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
