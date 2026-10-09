import React from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck, HeartHandshake, CheckCircle2, Award, FileText } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function AboutPage({ onBackToHome, onNavigateTab }: AboutPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold">
          <Award className="w-4 h-4 text-gold" />
          <span>ABOUT OUR PRACTICE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
          About Male Massager at Your Place
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Pioneering dignified, certified, doorstep therapeutic wellness and somatic recovery delivered directly to your home, apartment, or private retreat.
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-10 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-gold" />
          Our Mission & Ethical Standards
        </h2>
        <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
          Founded with a commitment to pure holistic health, <strong>Male Massager at Your Place</strong> was established to eliminate the unnecessary friction, traffic stress, and lack of privacy associated with commercial wellness centers. We provide certified, professional male therapists who bring therapeutic bodywork right to your doorstep.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
          Our service adheres strictly to professional somatic codes of conduct. Every therapist is background-verified, hygiene-screened, and extensively trained in biomechanical tension relief, traditional Thai joint articulation, and deep tissue acupressure techniques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-border/40 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Discretion & Privacy</h3>
            <p className="text-xs text-zinc-400">Strict client confidentiality protocols with zero third-party disclosure.</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-border/40 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-sm">Certified Practitioners</h3>
            <p className="text-xs text-zinc-400">Expertise in myofascial release, Thai stretching, and herbal aromatics.</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-border/40 space-y-2">
            <Clock className="w-6 h-6 text-pink-400" />
            <h3 className="font-bold text-white text-sm">Doorstep Convenience</h3>
            <p className="text-xs text-zinc-400">Zero commute stress; enjoy uninterrupted post-session recovery at home.</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-gold" />
          Our Wellness Publishing Editorial Policy
        </h2>
        <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
          Our online library and guides provide educational, evidence-grounded literature on somatic health, posture rebalancing, nervous system down-regulation, and botanical oils. We are committed to high-value editorial content that informs readers on ergonomics, stress reduction, and physical recovery.
        </p>
      </div>

      <div className="bg-card border border-gold/30 rounded-3xl p-6 md:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white">Official Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-300">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Official Support Email</p>
              <a href="mailto:malemassageratyourplace@gmail.com" className="text-gold hover:underline">
                malemassageratyourplace@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Direct WhatsApp / Hotline</p>
              <a href="https://wa.me/919101478093" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                +91 9101478093
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Operating Hours</p>
              <p className="text-zinc-400">Available 24/7 for Scheduled In-Home Bookings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Coverage Area</p>
              <p className="text-zinc-400">Doorstep & Hotel Outcall Services Across All Major City Sectors</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-2.5 bg-gold hover:bg-gold-hover text-black text-xs font-bold rounded-xl transition-all"
          >
            Explore Services
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('refund')}
            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-border/60 transition-all"
          >
            Refund & Cancellation Policy
          </button>
        </div>
      </div>
    </div>
  );
}
