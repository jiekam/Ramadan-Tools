import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Calendar, Sparkles, FileText, ListChecks, Globe, Moon, BookOpen, Menu, X } from 'lucide-react';

export default function BottomNav() {
  const [isOpen, setIsOpen] = useState(false);
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

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-primary/95 backdrop-blur-md border-b border-accent-gold/10 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-accent-gold/10 rounded flex items-center justify-center">
             <Moon className="text-accent-gold" size={18} />
           </div>
           <span className="font-heading font-bold text-lg text-text-primary">Ramadhan</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-text-primary hover:bg-accent-gold/10 rounded-xl transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Container (Sidebar on Desktop, Drawer on Mobile) */}
      <nav className={`
        fixed z-[80] transition-all duration-300 ease-in-out
        /* Desktop */
        md:top-0 md:left-0 md:h-screen md:w-64 md:translate-x-0 md:p-6 md:border-r md:border-accent-gold/20 md:bg-bg-primary/95 md:backdrop-blur-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.4)] md:rounded-none
        /* Mobile Drawer */
        top-0 left-0 h-full w-72 bg-bg-secondary p-8 shadow-2xl border-r border-accent-gold/10
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* App Logo/Header (Sidebar Header) */}
        <div className="flex items-center gap-3 mb-10 w-full pl-2">
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

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-160px)] pr-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full group relative ${
                  isActive
                    ? 'text-accent-gold bg-accent-gold/10 border-l-4 border-accent-gold rounded-l-none'
                    : 'text-text-primary/60 hover:text-accent-gold hover:bg-accent-gold/5 border-l-4 border-transparent'
                }`}
              >
                <div className="relative">
                  <Icon 
                    size={isActive ? 22 : 20} 
                    className="transition-all duration-300 flex-shrink-0 group-hover:scale-110" 
                  />
                </div>
                <span className={`text-[15px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 text-accent-gold' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Footer (Mobile only close button at bottom) */}
        <div className="md:hidden mt-auto pt-8">
           <p className="text-[10px] text-text-secondary/50 text-center italic">© 2026 Ramadhan Tracker</p>
        </div>
      </nav>
    </>
  );
}

