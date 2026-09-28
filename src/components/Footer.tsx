import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import LegalModal from './LegalModal';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleFooterClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      setShowPasswordDialog(true);
      setClickCount(0);
    } else {
      setClickCount(nextCount);
    }
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin' || adminPasswordInput === 'admin123') {
      localStorage.setItem('mth_show_admin', 'true');
      setShowPasswordDialog(false);
      window.dispatchEvent(new Event('adminStatusUpdated'));
      setCurrentTab('admin');
    } else {
      setPasswordError(true);
    }
  };

  return (
    <>
      <footer className="border-t border-border/50 py-8 relative z-10 mt-auto bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p 
            onClick={handleFooterClick}
            className="text-zinc-500 text-sm cursor-pointer select-none active:text-zinc-400 transition-colors"
            title="Owner Portal"
          >
            © {currentYear} <span className="font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">Male Massager At Your Place</span>. Premium services exclusively for females and single ladies.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm text-zinc-400 font-medium">
            <button
              type="button"
              onClick={() => {
                setCurrentTab('home');
                setTimeout(() => {
                  const guides = document.getElementById('wellness-guides');
                  if (guides) {
                    guides.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-gold transition-colors"
            >
              Wellness Guides
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab('home');
                setTimeout(() => {
                  const faqSection = document.getElementById('faq-section');
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-gold transition-colors"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-gold transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-gold transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('refund')}
              className="hover:text-gold transition-colors"
            >
              Refund Policy
            </button>
            <a
              href="mailto:malemassageratyourplace@gmail.com"
              className="hover:text-gold transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}

      {/* Secret Admin Password Modal */}
      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#181a20] border border-gold/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              👑 Owner Dashboard Login
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter your password to unlock the admin dashboard.
            </p>
            <form onSubmit={handleAdminPasswordSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className="w-full px-4 py-2.5 bg-black/50 border border-border/80 rounded-xl text-white text-sm focus:outline-none focus:border-gold mb-3"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-xs mb-3 font-semibold">
                  Incorrect password. Try again.
                </p>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPasswordError(false);
                    setAdminPasswordInput('');
                  }}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow transition-all"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button with Professional Pre-filled Message */}
      <a
        href="https://wa.me/919101478093?text=Hi..%20I%20need%20a%20relaxing%20and%20refreshing%20massage%20service%20in%20my%20place%2C%20can%20I%20get%20now%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        aria-label="Contact on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-green-500" />
      </a>
    </>
  );
}
