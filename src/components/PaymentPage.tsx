import React, { useState } from 'react';
import { Booking } from '../types';
import { 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Star, 
  ExternalLink, 
  Gift, 
  Sparkles,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Zap,
  CreditCard,
  Banknote,
  Car,
  Calendar,
  Clock,
  Info
} from 'lucide-react';

interface PaymentPageProps {
  booking: Booking;
  onPaymentComplete: (utrNumber: string, updatedFields?: Partial<Booking>) => void;
  onBackToBooking?: () => void;
  onBackToHome?: () => void;
}

export default function PaymentPage({ booking, onPaymentComplete, onBackToBooking, onBackToHome }: PaymentPageProps) {
  const [selectedMode, setSelectedMode] = useState<'pay-after-meeting' | 'full-online'>(
    booking.paymentMethod === 'Full Online Payment' ? 'full-online' : 'pay-after-meeting'
  );
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [activeAppTriggered, setActiveAppTriggered] = useState<string | null>(null);

  const travelCharge = 500;
  const amountToPay = selectedMode === 'pay-after-meeting' ? travelCharge : booking.price;
  const balanceDueAfterMeeting = selectedMode === 'pay-after-meeting' ? Math.max(0, booking.price - travelCharge) : 0;

  const upiId = "9101478093@ptsbi";
  const payeeName = "Male Therapist at Home";
  const googleReviewUrl = "https://g.page/r/CbX4mweMFKrTEBI/review";

  // Build high-compatibility universal UPI URL
  const getUpiUrl = (appType: string) => {
    const note = selectedMode === 'pay-after-meeting' 
      ? `MTH Travel Advance ${booking.id}` 
      : `MTH Full Booking ${booking.id}`;
    const params = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amountToPay}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    switch (appType) {
      case 'phonepe':
        return `phonepe://pay?${params}`;
      case 'gpay':
        // Primary Google Pay URI scheme on Android & iOS
        return `tez://upi/pay?${params}`;
      case 'paytm':
        return `paytmmp://pay?${params}`;
      case 'bhim':
        return `bhim://pay?${params}`;
      case 'cred':
      default:
        // Universal standard UPI intent handled by any UPI app
        return `upi://pay?${params}`;
    }
  };

  const handleLaunchUpi = (appType: string, appLabel: string) => {
    setActiveAppTriggered(appLabel);
    const url = getUpiUrl(appType);
    
    // Attempt opening specific URI
    window.location.href = url;

    // Fallback reset
    setTimeout(() => {
      setActiveAppTriggered(null);
    }, 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUtr = utr.trim();
    if (!trimmedUtr) {
      setError('Please enter the 12-digit UTR/Reference number from your UPI app.');
      return;
    }
    if (trimmedUtr.length < 8) {
      setError('Please enter a valid Reference/UTR number (at least 8-12 digits).');
      return;
    }

    const updatedBookingData: Partial<Booking> = {
      paymentMethod: selectedMode === 'pay-after-meeting' ? 'Pay After Meeting' : 'Full Online Payment',
      advancePaid: amountToPay,
      remainingAmount: balanceDueAfterMeeting,
      travelCharge: travelCharge
    };

    // Trigger parent callback to persist booking in LocalStorage with UTR and updated fields
    onPaymentComplete(trimmedUtr, updatedBookingData);

    // Prepare WhatsApp Message
    const reviewRewardLine = booking.googleReviewClaimed 
      ? `\n*5-Star Google Review Reward:* Eligible for ₹500 Physical Cash Discount on session day (Profile: ${booking.googleReviewName || booking.clientName})`
      : '';
    const extraServiceLine = (booking.wantExtraService || booking.extraServiceNote)
      ? `\n*Extra Service:* Yes (I want extra service)`
      : '';
    const timingLine = `\n*Requested Service Timing:* ${booking.requestedDate || 'Today'} • ${booking.requestedTimeSlot || 'Immediately / ASAP'}`;

    const modeText = selectedMode === 'pay-after-meeting'
      ? `Pay After Meeting (₹500 Traveling Charge Paid Online)`
      : `Full Online Payment (100% Paid Online)`;

    const text = `*New Doorstep Booking Request*

*Booking ID:* ${booking.id}
*Service:* ${booking.serviceName}${timingLine}${extraServiceLine}${reviewRewardLine}
*Total Service Price:* ₹${booking.price.toLocaleString('en-IN')}
*Payment Mode:* ${modeText}
*Advance Travel Charge Paid:* ₹${amountToPay.toLocaleString('en-IN')}
*Balance to Pay After Meeting:* ₹${balanceDueAfterMeeting.toLocaleString('en-IN')}${selectedMode === 'pay-after-meeting' ? ' (Note: ₹500 travel advance is physically discounted from your final bill)' : ''}

*Client Name:* ${booking.clientName}
*Gender:* ${booking.gender || 'Female'}
*Age:* ${booking.clientAge || 'N/A'}
*Marital Status:* ${booking.maritalStatus || 'N/A'}
*Occupation:* ${booking.occupation || 'N/A'}
*WhatsApp:* ${booking.whatsappNumber}
*Address:* ${booking.address}
*Status:* Pending Admin Confirmation
*UPI ID Paid:* ${upiId}
*UTR/Ref Number:* ${trimmedUtr}`;

    const waUrl = `https://wa.me/919101478093?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-md mx-auto w-full animate-in fade-in zoom-in-95 duration-500 pb-16">
      <div className="bg-[#16181d] border border-border/40 p-5 md:p-8 rounded-3xl shadow-xl shadow-black/50 space-y-5 text-center relative overflow-hidden">
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gold/5 blur-[90px] pointer-events-none" />

        {/* Top Back Action Bar */}
        {(onBackToBooking || onBackToHome) && (
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-border/30">
            {onBackToBooking ? (
              <button
                type="button"
                onClick={onBackToBooking}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101115] hover:bg-[#1a1c22] text-zinc-300 hover:text-white rounded-xl border border-border/50 text-xs font-semibold transition-all cursor-pointer"
                id="payment-top-back-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                <span>Back to Booking</span>
              </button>
            ) : <div />}

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-gold text-xs transition-colors cursor-pointer"
                id="payment-top-home-btn"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>
        )}

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            Payment Checkout
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">Complete Payment</h1>
          <p className="text-xs text-zinc-400 font-mono">
            Booking ID: <span className="text-white font-bold">{booking.id}</span> • Service:{' '}
            <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
              {booking.serviceName}
            </span>
          </p>
        </div>

        {/* Payment Mode Selector */}
        <div className="relative z-10 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 uppercase font-semibold">Choose Payment Mode:</span>
            <span className="text-gold font-bold">{selectedMode === 'pay-after-meeting' ? 'Pay After Meeting' : 'Full Online'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Pay After Meeting Option */}
            <button
              type="button"
              onClick={() => setSelectedMode('pay-after-meeting')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedMode === 'pay-after-meeting'
                  ? 'bg-[#181a20] border-gold shadow-md'
                  : 'bg-[#101115] border-border/50 hover:border-gold/40 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-white">Pay After Meeting</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedMode === 'pay-after-meeting' ? 'border-gold bg-gold' : 'border-zinc-600'
                }`}>
                  {selectedMode === 'pay-after-meeting' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>
              <div className="mt-2 font-mono">
                <div className="text-[10px] text-zinc-400">Pay Online Now:</div>
                <div className="text-gold font-black text-base">₹{travelCharge}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Travel Charge</div>
              </div>
            </button>

            {/* Full Online Payment Option */}
            <button
              type="button"
              onClick={() => setSelectedMode('full-online')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedMode === 'full-online'
                  ? 'bg-[#181a20] border-gold shadow-md'
                  : 'bg-[#101115] border-border/50 hover:border-gold/40 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-white">Full Online</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedMode === 'full-online' ? 'border-gold bg-gold' : 'border-zinc-600'
                }`}>
                  {selectedMode === 'full-online' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>
              <div className="mt-2 font-mono">
                <div className="text-[10px] text-zinc-400">Pay Full Amount:</div>
                <div className="text-gold font-black text-base">₹{booking.price.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">100% Upfront</div>
              </div>
            </button>
          </div>
        </div>

        {/* Current Payable Summary Card */}
        <div className="relative z-10 bg-[#121318] border border-gold/30 p-4 rounded-2xl space-y-2 text-left shadow-lg shadow-black/40">
          <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
            <div>
              <div className="text-xs text-zinc-400 font-mono">
                {selectedMode === 'pay-after-meeting' ? 'Advance Travel Charge Payable Now' : 'Total Payable Amount'}
              </div>
              <div className="text-gold font-black text-3xl tracking-tight mt-0.5">
                ₹{amountToPay.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent block">
                {booking.serviceName}
              </span>
              <div className="flex items-center justify-end gap-1.5 font-mono text-[11px] mt-0.5">
                {booking.originalPrice && booking.originalPrice > booking.price && (
                  <span className="line-through text-zinc-400">₹{booking.originalPrice.toLocaleString('en-IN')}</span>
                )}
                <span className="text-white bg-emerald-600 px-2 py-0.5 rounded font-bold">Offer: ₹{booking.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Service Requested Schedule */}
          {(booking.requestedDate || booking.requestedTimeSlot) && (
            <div className="bg-[#0e0f12] border border-gold/25 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shadow-inner">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-gold/15 text-gold border border-gold/30">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-400 block font-semibold">
                    Scheduled Appointment:
                  </span>
                  <span className="text-white font-bold">
                    {booking.requestedDate || 'Today'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">{booking.requestedTimeSlot || 'Immediately / ASAP'}</span>
              </div>
            </div>
          )}

          {selectedMode === 'pay-after-meeting' ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Remaining due after meeting:</span>
                <span className="text-white font-bold font-mono">₹{balanceDueAfterMeeting.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#15171d] border border-gold/25 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Travel Charge Rule:</strong> When choosing <em>Pay after meeting</em>, you pay a minimum <strong>₹500 traveling charge</strong> online now to dispatch the therapist. <strong>This ₹500 amount is physically discounted/deducted from your total bill after the meeting</strong> (you will only pay ₹{balanceDueAfterMeeting.toLocaleString('en-IN')} after the session).
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full service fee paid upfront. ₹0 remaining due after session.</span>
            </div>
          )}
        </div>

        {/* Google Review In-Person Physical Discount Banner */}
        {booking.googleReviewClaimed && (
          <div className="relative z-10 bg-[#14161a] border border-gold/30 p-3.5 rounded-2xl text-left space-y-2 text-xs shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-gold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                ₹500 Physical Cash Discount
              </span>
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold" />
                ))}
              </div>
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed">
              Show your 5-Star review on Google to the therapist during your session to receive <strong className="text-gold">₹500 physical cash discount</strong> handed over directly in person.
            </p>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline pt-1"
            >
              <span>Post your Google 5-Star review now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Step 1: Direct 1-Tap UPI Launch Button */}
        <div className="relative z-10 space-y-4 text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-gold" />
                1-Tap Instant Payment
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">Instant Redirect</span>
            </div>
            
            {/* Primary Universal UPI Button */}
            <button
              type="button"
              onClick={() => handleLaunchUpi('universal', 'UPI App')}
              className="w-full py-4 px-5 bg-gold hover:bg-gold-hover text-black font-extrabold rounded-2xl transition-all border border-amber-300/30 shadow-md shadow-black/40 flex items-center justify-center gap-3 text-base active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-5 h-5 fill-black" />
              <span>Pay ₹{amountToPay.toLocaleString('en-IN')} via any UPI App</span>
            </button>
          </div>

          {/* Quick Pay App Grid */}
          <div className="space-y-2 pt-1">
            <p className="text-xs text-zinc-400 font-medium">Or choose your specific UPI app:</p>
            <div className="grid grid-cols-4 gap-2.5">
              {/* Google Pay */}
              <button
                type="button"
                onClick={() => handleLaunchUpi('gpay', 'Google Pay')}
                className="flex flex-col items-center justify-center p-3 bg-[#111216] hover:bg-[#1a1c22] border border-border/60 hover:border-gold/50 rounded-2xl transition-all group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-900 font-bold text-xs mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <span className="text-blue-500 font-black">G</span>Pay
                </div>
                <span className="text-[11px] text-zinc-300 font-bold">GPay</span>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                onClick={() => handleLaunchUpi('phonepe', 'PhonePe')}
                className="flex flex-col items-center justify-center p-3 bg-[#111216] hover:bg-[#1a1c22] border border-border/60 hover:border-gold/50 rounded-2xl transition-all group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-base mb-1.5 shadow group-hover:scale-105 transition-transform">
                  पे
                </div>
                <span className="text-[11px] text-zinc-300 font-bold">PhonePe</span>
              </button>

              {/* Paytm */}
              <button
                type="button"
                onClick={() => handleLaunchUpi('paytm', 'Paytm')}
                className="flex flex-col items-center justify-center p-3 bg-[#111216] hover:bg-[#1a1c22] border border-border/60 hover:border-gold/50 rounded-2xl transition-all group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00baf2] font-black text-[10px] mb-1.5 shadow group-hover:scale-105 transition-transform">
                  Paytm
                </div>
                <span className="text-[11px] text-zinc-300 font-bold">Paytm</span>
              </button>

              {/* BHIM / Any UPI */}
              <button
                type="button"
                onClick={() => handleLaunchUpi('bhim', 'BHIM / Any UPI')}
                className="flex flex-col items-center justify-center p-3 bg-[#111216] hover:bg-[#1a1c22] border border-border/60 hover:border-gold/50 rounded-2xl transition-all group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-gold/90 text-black flex items-center justify-center font-black text-[11px] mb-1.5 shadow group-hover:scale-105 transition-transform">
                  UPI
                </div>
                <span className="text-[11px] text-zinc-300 font-bold">BHIM / All</span>
              </button>
            </div>
          </div>

          {/* Official UPI ID Copy Box */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-zinc-400">
                Official Business UPI ID:
              </label>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Merchant
              </span>
            </div>
            
            <div 
              onClick={handleCopy}
              className="bg-[#0f1013] border border-gold/30 hover:border-gold/60 p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all shadow-inner"
            >
              <div className="space-y-0.5 truncate">
                <div className="text-sm font-mono font-bold text-gold tracking-wide select-all truncate">
                  {upiId}
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  Account Name: <strong className="text-zinc-200">{payeeName}</strong>
                </div>
              </div>

              <button
                type="button"
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                  copied 
                    ? 'bg-emerald-500 text-black shadow-sm' 
                    : 'bg-gold hover:bg-gold-hover text-black shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" />
                    <span>COPY ID</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* UTR / Ref Number Confirmation Form */}
        <form onSubmit={handleSubmit} className="relative z-10 border-t border-border/40 pt-6 space-y-4 text-left">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              Enter 12-Digit UTR / Reference Number *
            </label>
            <p className="text-xs text-zinc-400">
              After paying ₹{amountToPay.toLocaleString('en-IN')} in your UPI app, copy the 12-digit UTR/Transaction ID and paste it below.
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-semibold p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="space-y-2">
            <input
              required
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. 423589123456 or 312345678901"
              className="w-full bg-[#101115] border border-border/60 focus:border-gold/60 focus:ring-1 focus:ring-gold/20 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none transition-all font-mono text-base tracking-wider"
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono px-1">
              <span>UPI ID: <strong className="text-gold">{upiId}</strong></span>
              <span>100% Secure & Encrypted</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center p-4 bg-gold hover:bg-gold-hover text-black font-black rounded-2xl transition-all border border-amber-300/30 shadow-md shadow-black/40 text-base uppercase tracking-wider cursor-pointer active:scale-[0.99]"
            id="payment-submit-btn"
          >
            <span>Submit UTR & Confirm Booking</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          {/* Bottom Back & Return Buttons */}
          {(onBackToBooking || onBackToHome) && (
            <div className="pt-2 flex items-center justify-center gap-3 text-xs">
              {onBackToBooking && (
                <button
                  type="button"
                  onClick={onBackToBooking}
                  className="flex items-center gap-1.5 py-2 px-3 text-zinc-400 hover:text-white bg-[#101115] hover:bg-[#1a1c22] rounded-xl border border-border/50 transition-all cursor-pointer"
                  id="payment-bottom-back-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Booking Details</span>
                </button>
              )}

              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="flex items-center gap-1.5 py-2 px-3 text-zinc-400 hover:text-gold bg-[#101115] hover:bg-[#1a1c22] rounded-xl border border-border/50 transition-all cursor-pointer"
                  id="payment-bottom-home-btn"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
