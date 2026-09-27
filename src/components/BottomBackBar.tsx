import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, Home, Search, ShieldCheck } from 'lucide-react';

interface BottomBackBarProps {
  currentTab: string;
  onGoBack: () => void;
  onGoHome: () => void;
  onGoTracker: () => void;
  backLabel?: string;
}

export default function BottomBackBar({
  currentTab,
  onGoBack,
  onGoHome,
  onGoTracker,
  backLabel
}: BottomBackBarProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = currentTab === 'home';

  // Get human readable back button text
  const getBackText = () => {
    if (backLabel) return backLabel;
    switch (currentTab) {
      case 'book-service':
        return 'Back to Services';
      case 'complete-payment':
        return 'Back to Booking';
      case 'tracker':
        return 'Back to Home';
      case 'refund':
        return 'Back to Home';
      case 'admin':
        return 'Back to Home';
      default:
        return 'Back';
    }
  };

  return (
    <aside aria-label="Scroll Navigation" className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none transition-all duration-300">
      <div className="max-w-md mx-auto flex items-center justify-end">
        {/* Right Side: Scroll to Top Floating Button */}
        {showScrollTop && (
          <div className="pointer-events-auto ml-auto">
            <button
              onClick={scrollToTop}
              className="p-3 bg-zinc-900/90 hover:bg-gold hover:text-black text-gold border border-gold/30 rounded-2xl shadow-xl shadow-black/70 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md flex items-center justify-center group"
              id="bottom-scroll-top-btn"
              title="Back to Top"
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
