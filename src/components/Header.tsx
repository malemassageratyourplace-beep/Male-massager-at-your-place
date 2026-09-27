import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Search, HelpCircle, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/images/male_therapist_logo_1783021969670.jpg';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({ currentTab, setCurrentTab }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(() => {
    return localStorage.getItem('mth_show_admin') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleAdminSync = () => {
      setShowAdmin(localStorage.getItem('mth_show_admin') === 'true');
    };
    window.addEventListener('adminStatusUpdated', handleAdminSync);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || urlParams.has('owner')) {
      localStorage.setItem('mth_show_admin', 'true');
      setShowAdmin(true);
    }

    return () => {
      window.removeEventListener('adminStatusUpdated', handleAdminSync);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;
    const currentCount = clickCountRef.current;

    // Reset counter if inactive for 3 seconds
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);

    if (currentCount >= 5) {
      // 5th click: Unlock and Open Admin Panel
      clickCountRef.current = 0;
      localStorage.setItem('mth_show_admin', 'true');
      setShowAdmin(true);
      window.dispatchEvent(new Event('adminStatusUpdated'));
      
      setToastMessage('👑 Admin Panel Unlocked & Opened');
      setTimeout(() => setToastMessage(null), 3500);

      setCurrentTab('admin');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Normal single click: go home if on another page
      if (currentTab !== 'home') {
        setCurrentTab('home');
        setIsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Standard public menu items (never showing Admin in the 3-line mobile menu)
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tracker', label: 'Tracker', icon: Search },
    { id: 'refund', label: 'Refund Request', icon: HelpCircle },
  ];

  // Mobile 3-line drawer strictly contains public user options only
  const mobileMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tracker', label: 'Tracker', icon: Search },
    { id: 'refund', label: 'Refund Request', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[#0f1013]/90 backdrop-blur-md">
      {/* Toast Notification for Secret Admin Unlock */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <div className="flex items-center gap-2 bg-[#16181d] text-gold border border-gold/40 px-5 py-3 rounded-2xl shadow-xl shadow-black/60 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-gold animate-spin" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo with 5-Click Secret Admin Access */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-left group transition-transform duration-300 active:scale-95 cursor-pointer select-none"
          id="nav-logo-btn"
          title="Male Massager At Your Place"
        >
          <img
            src={logoImg}
            alt="Male Massager at Your Place Logo"
            className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-zinc-900/80 group-hover:border-gold transition-all"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-sans text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
              Male Massager
            </span>
            <span className="text-xs font-bold bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent">
              At your place
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isItemAdmin = item.id === 'admin';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  currentTab === item.id || (item.id === 'home' && currentTab === 'book-service')
                    ? 'text-gold'
                    : isItemAdmin
                    ? 'text-amber-300 hover:text-gold bg-amber-950/30 px-2.5 py-1 rounded-lg border border-gold/30'
                    : 'text-zinc-400 hover:text-gold'
                }`}
                id={`nav-btn-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:text-gold focus:outline-none"
            aria-expanded="false"
            id="mobile-menu-toggle"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6 text-gold" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (3 lines menu on top right) */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 p-4 bg-[#16181d] border-b border-border/40 animate-in slide-in-from-top-2 duration-200">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                  currentTab === item.id || (item.id === 'home' && currentTab === 'book-service')
                    ? 'bg-gold/15 text-gold'
                    : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-gold'
                }`}
                id={`mobile-nav-btn-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
