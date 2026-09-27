import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [footerClicks, setFooterClicks] = React.useState(0);

  const handleFooterClick = () => {
    setFooterClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        const password = window.prompt("Enter Owner Password to unlock the Admin dashboard:");
        if (password === "admin") {
          localStorage.setItem('mth_show_admin', 'true');
          alert("Admin Dashboard unlocked successfully! The 'Admin' tab is now visible in the top header menu.");
          window.location.reload();
        } else if (password !== null) {
          alert("Incorrect password.");
        }
        return 0;
      }
      return next;
    });
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
          <div className="flex justify-center space-x-6 mt-4 text-sm text-zinc-400 font-medium">
            <button
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
            <a
              href="mailto:malemassageratyourplace@gmail.com"
              className="hover:text-gold transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919101478093"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-green-500" />
      </a>
    </>
  );
}
