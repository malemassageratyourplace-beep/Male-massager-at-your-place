import React, { useState } from 'react';
import { Service } from '../types';
import { SERVICES } from '../data';
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MessageCircle, 
  ArrowRight, 
  Palmtree, 
  Waves, 
  Flame,
  HeartHandshake,
  PenLine,
  AlertCircle
} from 'lucide-react';

interface GoaServiceSectionProps {
  onBookService: (service: Service, wantExtra?: boolean) => void;
}

export default function GoaServiceSection({ onBookService }: GoaServiceSectionProps) {
  const [wantExtraService, setWantExtraService] = useState(false);

  const goaLocations = [
    'Candolim', 'Calangute', 'Baga', 'Anjuna', 'Vagator', 'Panaji', 
    'Porvorim', 'Morjim', 'Colva', 'Benaulim', 'Margao', 'Cavelossim'
  ];

  const handleBookNow = () => {
    const luxuryService = SERVICES.find(s => s.id === 'luxury-full-body') || SERVICES[0];
    onBookService(luxuryService, wantExtraService);
  };

  const handleWhatsAppCustomBooking = () => {
    const text = encodeURIComponent(
      wantExtraService
        ? `Hello, I would like to book a professional male massager at my place in Goa with Extra Service. Please share therapist availability.`
        : `Hello, I would like to book a professional male massager at my place in Goa. Please share therapist availability.`
    );
    window.open(`https://wa.me/919101478093?text=${text}`, '_blank');
  };

  return (
    <section className="relative rounded-3xl overflow-hidden border border-gold/30 bg-[#14161a] p-6 sm:p-10 shadow-xl shadow-black/50 my-12 text-left">
      {/* Golden & Ocean Glow Backdrop - Soft matte diffusion */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-5 mb-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Palmtree className="w-3.5 h-3.5 text-gold" />
            Goa Doorstep Outcall Specialist
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            Now Live Across North & South Goa
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0f1013] px-3 py-1 rounded-full border border-border/60 text-xs font-mono text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>100% Private, Safe & Verified Male Therapists</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Headline & Value Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">We provide professional </span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent font-black">male massager at your place</span>
              <span className="text-white"> available in </span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent underline decoration-pink-500/40 underline-offset-4">Goa</span>.
            </h2>
            <p className="text-base sm:text-lg text-zinc-200 font-medium leading-relaxed">
              Book your appointment now — also available <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">massage with extra service as you want</span>.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Whether you are staying at a private beach villa, luxury resort, Airbnb, hotel, or your own residence in Goa, our highly trained male therapist arrives directly at your doorstep with premium organic oils, clean therapy linens, and unmatched discretion.
            </p>
          </div>

          {/* Goa Locations Covered Tags */}
          <div className="space-y-2.5 bg-[#0f1013] border border-border/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Doorstep Outcall Available Across Goa:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {goaLocations.map((loc) => (
                <span
                  key={loc}
                  className="text-xs bg-[#16181d] border border-border/60 hover:border-gold/40 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-[#121317] border border-gold/30 p-3.5 rounded-xl flex items-start gap-3 shadow-md shadow-black/40">
              <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-gold block font-bold text-sm tracking-tight">Exclusively for Women & Single Ladies</strong>
                <span className="text-zinc-400">Respectful, discreet, safe, and certified male therapists.</span>
              </div>
            </div>

            <div className="bg-[#121317] border border-border/50 p-3.5 rounded-xl flex items-start gap-3 shadow-md shadow-black/40">
              <div className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/30 shrink-0">
                <Waves className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-white block font-semibold">Villa & Hotel Visits in 45 Mins</strong>
                <span className="text-zinc-400">Fast arrival anywhere in North & South Goa.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Extra Service Selection Section */}
        <div className="lg:col-span-5 bg-[#16181d] border border-gold/40 p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl shadow-black/50">
          <div className="space-y-2 border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-2">
                <Flame className="w-4 h-4 text-gold" />
                Extra Service
              </span>
              <span className="text-xs text-zinc-300 font-mono bg-[#101115] border border-gold/30 px-2.5 py-0.5 rounded-full">Custom As You Want</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">
              Exclusive Extra Service Option
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We provide professional massage with custom extra service tailored to your preference.
            </p>
          </div>

          {/* Customer Tick Option */}
          <div className="space-y-3">
            <div 
              onClick={() => setWantExtraService(!wantExtraService)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                wantExtraService 
                  ? 'bg-amber-950/25 border-gold shadow-md shadow-black/40' 
                  : 'bg-[#101115] border-border/60 hover:border-gold/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={wantExtraService}
                  onChange={(e) => setWantExtraService(e.target.checked)}
                  className="w-5 h-5 text-gold accent-gold rounded cursor-pointer shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gold" />
                    I want <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">extra service</span>
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    wantExtraService 
                      ? 'bg-gold text-black border-gold' 
                      : 'bg-zinc-800 text-zinc-400 border-border/60'
                  }`}>
                    {wantExtraService ? 'INCLUDED' : 'OPTIONAL'}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 pl-8">
                Tick this option to include custom extra service with your doorstep massage session in Goa.
              </p>
            </div>

            {/* Notice Right Below Extra Service */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/20 border border-gold/30 flex items-start gap-2.5 text-left shadow-sm">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <strong className="text-gold font-semibold mr-1">Important Notice:</strong>
                If you require extra services, please choose either the{' '}
                <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                  full-body massage
                </span>{' '}
                or the{' '}
                <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                  full-night service
                </span>
                , as extra services are available only with these two options; if you wish to add extra services to a different package, there will be an additional charge.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleBookNow}
              className="w-full py-3.5 px-5 bg-gold hover:bg-gold-hover text-black font-extrabold rounded-xl transition-all border border-amber-300/30 shadow-md shadow-black/40 flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment in Goa Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleWhatsAppCustomBooking}
              className="w-full py-3.5 px-4 bg-[#101115] hover:bg-[#181a20] text-emerald-400 border border-emerald-500/40 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp {wantExtraService ? 'for Extra Service' : 'Now'}</span>
            </button>

            <p className="text-[11px] text-zinc-400 text-center font-mono pt-1">
              Direct Phone / WhatsApp: <strong className="text-white">+91 91014 78093</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
