import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Search, Loader2, Trash2, X, AlertTriangle, ArrowRight, ArrowLeft, Home, CornerDownRight, MapPin, Star, ExternalLink, Gift, Sparkles, Banknote, CreditCard, Calendar, Clock, CheckCircle2, Zap } from 'lucide-react';
import { getCleanAddress, extractMapsUrl } from '../utils';

interface TrackerPageProps {
  onBackToHome?: () => void;
}

export default function TrackerPage({ onBackToHome }: TrackerPageProps) {
  const [whatsappSearch, setWhatsappSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeCancelBooking, setActiveCancelBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelUpiId, setCancelUpiId] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadBookings = (showSpinner = true) => {
    if (showSpinner) setLoading(true);

    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      const searchVal = whatsappSearch.trim().toLowerCase();
      
      // If search query is provided, match by phone or ID; otherwise show all active customer bookings on this device
      const filtered = allBookings
        .filter(b => {
          if (b.customerDeleted || b.adminDeleted) return false;
          if (!searchVal) return true;
          return (
            b.whatsappNumber.toLowerCase().includes(searchVal) ||
            b.id.toLowerCase().includes(searchVal) ||
            (b.clientName && b.clientName.toLowerCase().includes(searchVal))
          );
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(filtered);
    } catch (err) {
      console.error('Error loading tracker bookings:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(false);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      loadBookings(false);
    };

    window.addEventListener('bookingsUpdated', handleUpdate);
    return () => window.removeEventListener('bookingsUpdated', handleUpdate);
  }, [whatsappSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBookings(true);
  };

  const handleConfirmClearHistory = () => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      const searchVal = whatsappSearch.trim().toLowerCase();
      
      const updated = allBookings.map(b => {
        if (!searchVal) {
          return { ...b, customerDeleted: true };
        }
        if (
          b.whatsappNumber.toLowerCase().includes(searchVal) ||
          b.id.toLowerCase().includes(searchVal) ||
          (b.clientName && b.clientName.toLowerCase().includes(searchVal))
        ) {
          return { ...b, customerDeleted: true };
        }
        return b;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      setBookings([]);
      setShowClearModal(false);
      window.dispatchEvent(new Event('bookingsUpdated'));
      showToast('✓ Tracking history cleared successfully');
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const handleDeleteSingleBooking = (bookingId: string) => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      const updated = allBookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, customerDeleted: true };
        }
        return b;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      window.dispatchEvent(new Event('bookingsUpdated'));
      showToast(`✓ Removed ${bookingId} from tracking history`);
    } catch (err) {
      console.error('Error removing single booking:', err);
    }
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCancelBooking) return;

    if (!cancelReason.trim()) {
      showToast('Please specify a reason for cancellation');
      return;
    }
    if (activeCancelBooking.paymentMethod === 'Online Payment' && !cancelUpiId.trim()) {
      showToast('Please specify your UPI ID for the refund transaction');
      return;
    }

    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      const updated = allBookings.map(b => {
        if (b.id === activeCancelBooking.id) {
          return {
            ...b,
            status: 'Cancelled' as const,
            cancelReason: cancelReason.trim(),
            cancelUpiId: cancelUpiId.trim()
          };
        }
        return b;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookingsUpdated'));

      // Launch WhatsApp Refund Request
      const cancellationCharge = Math.round(activeCancelBooking.price * 0.1);
      const refundableAmount = Math.round(activeCancelBooking.price * 0.9);
      
      const text = `*Booking Cancellation Request*

*ID:* ${activeCancelBooking.id}
*Service:* ${activeCancelBooking.serviceName}
*Original Price:* ₹${activeCancelBooking.price.toLocaleString('en-IN')}
*10% Cancellation Charge:* ₹${cancellationCharge.toLocaleString('en-IN')}
*Eligible Refund (90%):* ₹${refundableAmount.toLocaleString('en-IN')}
*Customer:* ${activeCancelBooking.clientName}
*Phone:* ${activeCancelBooking.whatsappNumber}
*Reason:* ${cancelReason.trim()}
${activeCancelBooking.paymentMethod === 'Online Payment' ? `*UPI ID for Refund:* ${cancelUpiId.trim()}` : ''}`;

      const waUrl = `https://wa.me/919101478093?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');

      setActiveCancelBooking(null);
      setCancelReason('');
      setCancelUpiId('');
      loadBookings(false);
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const getStatusBadgeClass = (status: Booking['status']) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Cancelled':
        return 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
          <div className="bg-zinc-950 text-gold border border-gold/50 px-4 py-2.5 rounded-xl shadow-2xl shadow-black text-xs font-mono font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {onBackToHome && (
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-border/50 text-xs font-semibold transition-all cursor-pointer"
            id="tracker-top-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold" />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
          Track Your Booking
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm md:text-base">
          Enter your WhatsApp number or Booking ID to check live appointment status and therapist schedules.
        </p>
      </div>

      {/* Tracker Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-md mx-auto">
        <input
          type="tel"
          value={whatsappSearch}
          onChange={(e) => setWhatsappSearch(e.target.value)}
          placeholder="Search by WhatsApp number or ID..."
          className="w-full bg-[#121318] border border-border/50 rounded-full py-4 pl-6 pr-24 text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all shadow-md shadow-black/40 text-sm font-mono"
        />
        {whatsappSearch && (
          <button
            type="button"
            onClick={() => {
              setWhatsappSearch('');
            }}
            className="absolute right-14 p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 p-3 bg-gold hover:bg-gold-hover text-black rounded-full border border-amber-300/30 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer shadow-sm"
          title="Search Booking"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      {/* Tracked Bookings Container */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-border/20 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-300 font-mono">
              {whatsappSearch.trim() ? `Search Results (${bookings.length})` : `Your Bookings (${bookings.length})`}
            </h3>
            {bookings.length > 0 && !whatsappSearch.trim() && (
              <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                On this device
              </span>
            )}
          </div>
          {bookings.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="flex items-center space-x-1.5 text-xs text-red-400 hover:text-white transition-all bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-full border border-red-500/30 hover:border-red-500 font-semibold cursor-pointer shadow-sm active:scale-95"
              id="tracker-clear-history-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="text-center p-8 bg-[#16181d] border border-border/40 rounded-2xl space-y-2 shadow-lg shadow-black/40">
            <p className="text-zinc-400 text-sm font-medium">
              {whatsappSearch.trim()
                ? `No active booking requests registered for "${whatsappSearch}".`
                : 'No saved bookings found on this device.'}
            </p>
            <p className="text-zinc-600 text-xs font-mono">
              If you placed a booking with a different phone number, enter it above to view tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#16181d] border border-border/40 rounded-2xl p-6 hover:border-gold/30 transition-all flex flex-col space-y-4 relative overflow-hidden group shadow-lg shadow-black/40"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/30">
                        ID: {b.id}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(b.status)}`}>
                        {b.status}
                      </span>
                      {/* Delete individual booking icon */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSingleBooking(b.id)}
                        className="ml-auto md:ml-2 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove this booking from tracker view"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                      {b.serviceName}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Client: <strong className="text-zinc-200">{b.clientName}</strong> ({b.whatsappNumber}) • Placed on {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="flex items-center md:justify-end gap-1.5 font-mono">
                      {b.originalPrice && b.originalPrice > b.price && (
                        <span className="line-through text-zinc-500 text-xs font-semibold">
                          ₹{b.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-white bg-emerald-600 px-2.5 py-0.5 rounded-lg border border-emerald-400/30 font-bold text-base shadow-sm">
                        ₹{b.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{b.duration}</p>
                  </div>
                </div>

                  {/* Google Review Claimed Tag */}
                  {b.googleReviewClaimed && (
                    <div className="bg-amber-500/10 border border-gold/30 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gold font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>5-Star Google Review Reward: ₹500 Physical Cash Discount on session day</span>
                        <span className="text-zinc-400 text-[11px]">({b.googleReviewName || b.clientName})</span>
                      </div>
                      <a
                        href="https://g.page/r/CbX4mweMFKrTEBI/review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-white hover:text-gold flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>Google Review Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Scheduled & Requested Service Timing Banner */}
                  {b.status === 'Accepted' ? (
                    <div className="bg-emerald-950/40 border-2 border-emerald-500/40 p-4 rounded-xl space-y-2 text-left shadow-lg shadow-emerald-950/20">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Clock className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                              Confirmed Service Arrival Time:
                            </span>
                            <span className="text-emerald-300 font-black font-mono text-base tracking-tight">
                              {b.scheduledTime || 'Confirmed Promptly'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-zinc-400 block uppercase">You Requested:</span>
                          <span className="text-xs text-zinc-300 font-mono">
                            {b.requestedDate || 'Today'} • {b.requestedTimeSlot || 'Immediately / ASAP'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300/90 font-medium pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>The therapist has accepted your booking and is scheduled to reach your outcall address at the confirmed arrival time above.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-950/80 border border-gold/30 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">
                            Your Requested Timing:
                          </span>
                          <span className="text-white font-bold font-mono">
                            {b.requestedDate || 'Today'} • {b.requestedTimeSlot || 'Immediately / ASAP'}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-amber-400/90 font-mono">
                        {b.status === 'Pending' ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                            Awaiting admin schedule confirmation
                          </span>
                        ) : (
                          <span>Status: {b.status}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Booking Metadata details */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4 border-t border-border/20 text-sm text-zinc-300">
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Client Name</span>
                      <span className="font-medium text-white">{b.clientName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Gender</span>
                      <span className="font-medium text-gold">{b.gender || 'Female'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Age</span>
                      <span className="font-medium text-white">{b.clientAge ? `${b.clientAge} Yrs` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Marital Status</span>
                      <span className="font-medium text-white">{b.maritalStatus || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Occupation</span>
                      <span className="font-medium text-white">{b.occupation || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block uppercase font-mono tracking-wider font-semibold">Outcall Address</span>
                      <div className="space-y-1.5 mt-1">
                        <span className="font-mono text-xs leading-relaxed text-zinc-300 block">{getCleanAddress(b.address)}</span>
                        {extractMapsUrl(b.address) && (
                          <a
                            href={extractMapsUrl(b.address)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 fill-amber-400/20" />
                            Open GPS Map
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Extra Service Requirement Note if present */}
                  {(b.wantExtraService || b.extraServiceNote) && (
                    <div className="bg-gold/10 border border-gold/40 p-3 rounded-xl flex items-center gap-2.5 text-sm">
                      <span className="font-mono text-gold font-bold uppercase shrink-0 bg-gold/20 px-2 py-0.5 rounded text-xs">Extra Service:</span>
                      <span className="text-zinc-100 font-medium">I want extra service (Included)</span>
                    </div>
                  )}

                  {/* Payment Method & Travel Charge Breakdown */}
                  <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-border/40 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        {b.paymentMethod === 'Pay After Meeting' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-gold border border-gold/30 font-mono flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5" />
                            Pay After Meeting Mode
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            Full Online Payment
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-right">
                        {b.paymentMethod === 'Pay After Meeting' ? (
                          <div className="space-x-2">
                            <span className="text-zinc-400">Advance Paid: <strong className="text-gold">₹{b.advancePaid || 500}</strong></span>
                            <span className="text-zinc-400">• Balance Due: <strong className="text-white">₹{(b.remainingAmount !== undefined ? b.remainingAmount : Math.max(0, b.price - 500)).toLocaleString('en-IN')}</strong></span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-bold">Paid 100% Online (₹{b.price.toLocaleString('en-IN')})</span>
                        )}
                      </div>
                    </div>

                    {b.paymentMethod === 'Pay After Meeting' && (
                      <p className="text-[11px] text-amber-300/80 leading-relaxed pt-1 border-t border-border/20">
                        💡 <em>The ₹500 traveling charge paid online is physically discounted/deducted from your total bill after the meeting. You only pay the balance ₹{(b.remainingAmount !== undefined ? b.remainingAmount : Math.max(0, b.price - 500)).toLocaleString('en-IN')} after the session.</em>
                      </p>
                    )}
                  </div>

                  {b.utrNumber && (
                    <div className="bg-zinc-950/40 p-3 rounded-xl border border-border/20 flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>UPI Reference / UTR</span>
                      <span className="text-white font-semibold">{b.utrNumber}</span>
                    </div>
                  )}

                  {/* Cancel Button */}
                  {b.status === 'Pending' && !activeCancelBooking && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setActiveCancelBooking(b)}
                        className="px-4 py-2 text-xs font-bold text-red-400 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Google Review Ad Banner on Tracker */}
          <div className="bg-gradient-to-r from-amber-500/10 via-zinc-950 to-yellow-500/10 border border-gold/40 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase bg-gold text-black font-bold px-2 py-0.5 rounded">
                  GOOGLE REVIEW
                </span>
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold" />
                  ))}
                </div>
              </div>
              <h4 className="text-sm font-bold text-white">
                Share Your Experience on Google & Save ₹500
              </h4>
              <p className="text-xs text-zinc-400">
                Massage therapist at your place would love your feedback. Post a review to our profile.
              </p>
            </div>
            <a
              href="https://g.page/r/CbX4mweMFKrTEBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gold hover:bg-gold-hover text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-gold/20"
            >
              <span>Write 5-Star Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      {/* Cancellation Drawer / Panel Overlay */}
      {activeCancelBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border/50 max-w-md w-full p-6 md:p-8 rounded-3xl shadow-2xl relative space-y-6">
            <button
              onClick={() => setActiveCancelBooking(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Cancel Session
              </div>
              <h3 className="text-xl font-bold text-white">
                Cancel{' '}
                <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                  {activeCancelBooking.serviceName}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Booking ID: {activeCancelBooking.id} • Price: ₹{activeCancelBooking.price.toLocaleString('en-IN')}
              </p>
            </div>

            {/* 10% Cancellation Charges Alert */}
            <div className="bg-red-500/5 border border-red-500/25 p-4 rounded-xl space-y-2 text-left font-mono">
              <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold block">
                Cancellation Fee Notice
              </span>
              <div className="text-xs text-zinc-300 space-y-1.5 leading-normal">
                <p>
                  This session is subject to standard <span className="text-red-400 font-bold">10% cancellation charges</span> (₹{Math.round(activeCancelBooking.price * 0.1).toLocaleString('en-IN')}) to cover transaction processing and support coordination.
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Eligible Refund: <span className="text-emerald-400 font-semibold">₹{Math.round(activeCancelBooking.price * 0.9).toLocaleString('en-IN')}</span> (if cancelled 2+ hours prior) or <span className="text-yellow-500 font-semibold">₹{Math.round(activeCancelBooking.price * 0.4).toLocaleString('en-IN')}</span> (if cancelled late, within 2 hours).
                </p>
              </div>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-zinc-400 block uppercase font-mono tracking-wider">
                  Cancellation Reason *
                </label>
                <textarea
                  required
                  rows={2.5}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you need to cancel this appointment..."
                  className="w-full bg-zinc-900 border border-border rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 text-sm resize-none"
                />
              </div>

              {activeCancelBooking.paymentMethod === 'Online Payment' && (
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-zinc-400 block uppercase font-mono tracking-wider">
                    UPI ID for Refund *
                  </label>
                  <input
                    required
                    type="text"
                    value={cancelUpiId}
                    onChange={(e) => setCancelUpiId(e.target.value)}
                    placeholder="e.g. name@upi"
                    className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 text-sm font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Since you paid online, your refund will be processed directly to this UPI ID within 24 hours.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCancelBooking(null)}
                  className="flex-1 py-3 border border-border hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all"
                >
                  Confirm & Cancel via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Tracking History Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-red-500/30 max-w-md w-full p-6 md:p-8 rounded-3xl shadow-2xl relative space-y-5 text-left">
            <button
              onClick={() => setShowClearModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Clear Tracking History?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This will remove all saved booking entries from your tracker screen on this device.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-border/60 text-xs text-zinc-300 font-mono space-y-1">
              <span className="text-[10px] text-gold uppercase font-bold block">Notice</span>
              <p className="text-[11px] text-zinc-400">
                Any scheduled outcall appointments with therapists will remain active in the system.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-3 border border-border hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearHistory}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Back Button */}
      {onBackToHome && (
        <div className="pt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-border/60 text-xs font-semibold transition-all cursor-pointer shadow-lg"
            id="tracker-bottom-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Return to Home</span>
          </button>
        </div>
      )}

    </div>
  );
}
