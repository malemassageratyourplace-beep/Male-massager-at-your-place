import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, HelpCircle as PolicyIcon, ArrowRight, ArrowLeft, CheckCircle2, Home } from 'lucide-react';

interface RefundPageProps {
  onBackToHome?: () => void;
}

export default function RefundPage({ onBackToHome }: RefundPageProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [reason, setReason] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim() || !reason.trim() || !upiId.trim()) {
      alert('All fields are required.');
      return;
    }

    // Format WhatsApp Ticket without Booking ID
    const text = `*MTH Refund Request*

*WhatsApp Number:* ${whatsappNumber.trim()}
*Reason for Cancellation/Refund:* ${reason.trim()}
*UPI ID for Refund:* ${upiId.trim()}`;

    const waUrl = `https://wa.me/919101478093?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  const handleReset = () => {
    setWhatsappNumber('');
    setReason('');
    setUpiId('');
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-16">
      
      {onBackToHome && (
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-border/50 text-xs font-semibold transition-all cursor-pointer"
            id="refund-top-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold" />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
          Refund & Cancellations
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm md:text-base">
          Submit your cancellation tickets and coordinate secure refunds directly with support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cancellation Policy Rules */}
        <div className="md:col-span-5 bg-[#16181d] border border-border/40 p-6 rounded-2xl space-y-4 shadow-lg shadow-black/40">
          <h3 className="text-base font-bold text-white flex items-center gap-1.5 uppercase tracking-wide font-mono text-gold">
            <PolicyIcon className="w-4 h-4 text-gold" />
            Refund Policy Rules
          </h3>
          <ul className="space-y-4 text-xs md:text-sm text-zinc-300 leading-relaxed">
            <li className="flex gap-2.5 items-start">
              <div className="h-5 w-5 rounded-full bg-gold/15 border border-gold/30 text-gold text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
              <span>
                <strong>10% Cancellation Fee:</strong> All user-initiated cancellations are subject to a standard <strong>10% cancellation charge</strong> on the booking amount to cover transaction & administrative costs.
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <div className="h-5 w-5 rounded-full bg-gold/15 border border-gold/30 text-gold text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
              <span>
                <strong>2+ Hours Notice:</strong> Cancellations submitted at least 2 hours prior to the slot are eligible for a <strong>90% refund</strong> (100% minus the 10% fee).
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <div className="h-5 w-5 rounded-full bg-gold/15 border border-gold/30 text-gold text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
              <span>
                <strong>Late Cancellations:</strong> Cancellations made within 2 hours of the appointment qualify for a <strong>40% refund</strong> (50% partial refund minus the 10% fee).
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <div className="h-5 w-5 rounded-full bg-gold/15 border border-gold/30 text-gold text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
              <span>
                <strong>No-Shows:</strong> No-shows or refusing entry once the therapist has arrived at your doorstep are strictly non-refundable.
              </span>
            </li>
          </ul>

          <div className="pt-4 border-t border-border/20 flex items-start gap-2.5 text-xs text-zinc-500 leading-normal">
            <ShieldCheck className="w-4.5 h-4.5 text-gold shrink-0" />
            <span>Refunds are processed back to your original payment UPI ID within 24 business hours.</span>
          </div>
        </div>

        {/* Right: Refund Submission Form */}
        <div className="md:col-span-7 bg-[#16181d] border border-border/40 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-black/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-gold/5 blur-[70px] pointer-events-none" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Refund Claim Form</h3>
              
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase font-mono tracking-wider">
                  WhatsApp Number *
                </label>
                <input
                  required
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#101115] border border-border/60 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase font-mono tracking-wider">
                  Reason for Cancellation / Refund *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide details about why you are requesting a cancellation/refund..."
                  className="w-full bg-[#101115] border border-border/60 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase font-mono tracking-wider">
                  UPI ID for Refund *
                </label>
                <input
                  required
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. name@ybl"
                  className="w-full bg-[#101115] border border-border/60 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center p-3.5 bg-gold hover:bg-gold-hover text-black font-extrabold rounded-xl transition-all border border-amber-300/30 shadow-md shadow-black/40 cursor-pointer active:scale-[0.99]"
              >
                Submit Ticket on WhatsApp
                <ArrowRight className="w-5 h-5 ml-1.5" />
              </button>
            </form>
          ) : (
            <div className="relative z-10 py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center mx-auto text-gold">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Refund Ticket Submitted</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Your ticket details have been forwarded to our support on WhatsApp. Please make sure you sent the WhatsApp message to coordinate your refund.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-[#1b1d24] hover:bg-[#22252e] text-white rounded-xl text-sm transition-colors border border-border/50 cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          )}
        </div>

      </div>

      {onBackToHome && (
        <div className="pt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-border/60 text-xs font-semibold transition-all cursor-pointer shadow-lg"
            id="refund-bottom-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Return to Home</span>
          </button>
        </div>
      )}

    </div>
  );
}
