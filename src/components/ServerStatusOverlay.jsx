import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function ServerStatusOverlay({ secondsElapsed, message = "AI sedang bersiap..." }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-sm w-full mx-4">
        <div className="glass-card rounded-3xl p-8 border border-accent-gold/30 shadow-glow-gold relative overflow-hidden text-center">
          {/* Animated Background Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-gold/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-accent-gold/20 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-br from-accent-gold to-[#fcd34d] p-5 rounded-full shadow-lg">
                <Loader2 className="text-bg-primary animate-spin" size={40} strokeWidth={2.5} />
              </div>
            </div>

            <h3 className="text-2xl font-heading font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-accent-gold" size={20} />
              {message}
            </h3>
            
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Server sedang bangun dari tidurnya (Koyeb free plan). <br/>
              Mohon tunggu sebentar ya...
            </p>

            <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent-gold/10 rounded-full border border-accent-gold/20">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
              <span className="text-accent-gold font-mono font-bold text-lg">
                {secondsElapsed} <small className="text-[10px] font-sans uppercase tracking-widest ml-1">detik</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
