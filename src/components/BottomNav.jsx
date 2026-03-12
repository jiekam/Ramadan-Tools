import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Calendar, Sparkles, FileText, ListChecks, Globe, Moon, BookOpen } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tracker', icon: ListChecks, label: 'Tracker' },
    { path: '/explore', icon: Globe, label: 'Explore' },
    { path: '/ramadhan-info', icon: BookOpen, label: 'Ramadhan Info' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/ai-todo', icon: Sparkles, label: 'AI Todo' },
    { path: '/summary', icon: FileText, label: 'Summary' },
  ];

  return (
    <nav className="fixed md:top-0 md:left-0 md:h-screen md:w-64 md:flex-col md:border-r md:border-accent-gold/20 md:bg-bg-primary/95 md:backdrop-blur-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.4)] md:rounded-none md:p-6 p-2 rounded-2xl glass-nav bottom-4 left-4 right-4 z-50 flex items-center shadow-glass border-none transition-all duration-300 overflow-y-auto overflow-x-hidden">
      
      {/* App Logo/Header (Desktop Only) */}
      <div className="hidden md:flex items-center gap-3 mb-10 w-full animate-fade-in pl-2">
        <div className="p-2 bg-accent-gold/10 rounded-xl">
          <Moon className="text-accent-gold" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-[#fcd34d]">
            Ramadhan
          </h1>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold">Ibadah Tracker</p>
        </div>
      </div>

      <div className="flex md:flex-col justify-around md:justify-start items-center md:items-stretch w-full md:gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-4 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-300 md:w-full group relative ${
                isActive
                  ? 'text-accent-gold md:bg-accent-gold/10 bg-accent-gold/10 md:transform-none transform -translate-y-1 md:border-l-4 md:border-accent-gold md:rounded-l-none'
                  : 'text-text-primary/60 hover:text-accent-gold hover:bg-accent-gold/5 border-l-4 border-transparent'
              }`}
            >
              <div className="relative">
                <Icon 
                  size={isActive ? 22 : 20} 
                  className="transition-all duration-300 flex-shrink-0 group-hover:scale-110" 
                />
              </div>
              <span className={`text-[10px] md:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? 'opacity-100 text-accent-gold' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

