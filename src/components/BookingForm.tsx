import React, { useState, useRef, useEffect } from 'react';
import { Service, Booking } from '../types';
import { User, Users, ShieldAlert, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, ArrowRight, MapPin, Phone, Check, Sparkles, Flame, PenLine, CreditCard, Banknote, Car, AlertCircle, Calendar as CalendarIcon, Clock, Zap, Timer, Sun, Moon, CheckCircle2, Heart, UserCheck, Smile } from 'lucide-react';
import MapPicker from './MapPicker';

interface BookingFormProps {
  selectedService: Service;
  initialWantExtraService?: boolean;
  onBackToHome: () => void;
  onBookingSubmit: (booking: Booking) => void;
}

export default function BookingForm({ selectedService, initialWantExtraService, onBackToHome, onBookingSubmit }: BookingFormProps) {
  const [clientName, setClientName] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Shemale' | string>('Female');
  const [showGenderPicker, setShowGenderPicker] = useState<boolean>(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [showMaritalPicker, setShowMaritalPicker] = useState<boolean>(false);
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');

  // Calendar State
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calMonth, setCalMonth] = useState<number>(today.getMonth());
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Time Slot Selection (Immediately + Serial Chronological Times)
  const [selectedTime, setSelectedTime] = useState<string>('⚡ Immediately (Within 30-45 mins)');
  const [customTimeInput, setCustomTimeInput] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const [wantExtraService, setWantExtraService] = useState(initialWantExtraService || false);
  const [paymentMode, setPaymentMode] = useState<'pay-after-meeting' | 'full-online'>('pay-after-meeting');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');

  const travelChargeAmount = 500;
  const remainingAfterMeeting = Math.max(0, selectedService.price - travelChargeAmount);
  const upfrontPayable = paymentMode === 'pay-after-meeting' ? travelChargeAmount : selectedService.price;

  // Calendar helper calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isPastDay = (d: Date) => {
    const checkDate = new Date(d);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const selectQuickDay = (offsetDays: number) => {
    const target = new Date(today);
    target.setDate(today.getDate() + offsetDays);
    setSelectedDate(target);
    setCalMonth(target.getMonth());
    setCalYear(target.getFullYear());
  };

  const getResolvedDateString = () => {
    const isToday = isSameDay(selectedDate, today);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = isSameDay(selectedDate, tomorrow);

    const formatted = selectedDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (isToday) return `Today (${selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
    if (isTomorrow) return `Tomorrow (${selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
    return formatted;
  };

  const getResolvedTimeString = () => {
    if (selectedTime === 'custom') {
      return customTimeInput.trim() ? `Custom: ${customTimeInput.trim()}` : 'Custom Time';
    }
    return selectedTime;
  };

  // Serial chronological time list
  const serialTimeSlots = [
    { time: '⚡ Immediately (Within 30-45 mins)', note: 'Fastest arrival', isExpress: true, icon: Zap },
    { time: '08:00 AM', note: 'Early Morning', icon: Sun },
    { time: '08:30 AM', note: 'Morning', icon: Sun },
    { time: '09:00 AM', note: 'Morning', icon: Sun },
    { time: '09:30 AM', note: 'Morning', icon: Sun },
    { time: '10:00 AM', note: 'Morning', icon: Sun },
    { time: '10:30 AM', note: 'Morning', icon: Sun },
    { time: '11:00 AM', note: 'Late Morning', icon: Sun },
    { time: '11:30 AM', note: 'Late Morning', icon: Sun },
    { time: '12:00 PM', note: 'Noon Slot', icon: Sun },
    { time: '12:30 PM', note: 'Afternoon', icon: Sun },
    { time: '01:00 PM', note: 'Afternoon', icon: Sun },
    { time: '01:30 PM', note: 'Afternoon', icon: Sun },
    { time: '02:00 PM', note: 'Afternoon', icon: Sun },
    { time: '02:30 PM', note: 'Afternoon', icon: Sun },
    { time: '03:00 PM', note: 'Afternoon', icon: Sun },
    { time: '03:30 PM', note: 'Late Afternoon', icon: Sun },
    { time: '04:00 PM', note: 'Evening Arrival', icon: Moon },
    { time: '04:30 PM', note: 'Evening Arrival', icon: Moon },
    { time: '05:00 PM', note: 'Evening Arrival', icon: Moon },
    { time: '05:30 PM', note: 'Evening Arrival', icon: Moon },
    { time: '06:00 PM', note: 'Prime Evening', icon: Moon },
    { time: '06:30 PM', note: 'Prime Evening', icon: Moon },
    { time: '07:00 PM', note: 'Prime Evening', icon: Moon },
    { time: '07:30 PM', note: 'Prime Evening', icon: Moon },
    { time: '08:00 PM', note: 'Night Slot', icon: Moon },
    { time: '08:30 PM', note: 'Night Slot', icon: Moon },
    { time: '09:00 PM', note: 'Night Slot', icon: Moon },
    { time: '09:30 PM', note: 'Night Slot', icon: Moon },
    { time: '10:00 PM', note: 'Night Slot', icon: Moon },
    { time: '10:30 PM', note: 'Late Night', icon: Moon },
    { time: '11:00 PM', note: 'Late Night / Overnight', icon: Sparkles },
    { time: '11:30 PM', note: 'Late Night / Overnight', icon: Sparkles },
    { time: '12:00 AM (Midnight)', note: 'Midnight VIP Session', icon: Sparkles },
    { time: '01:00 AM', note: 'Late Midnight Outcall', icon: Sparkles },
    { time: '02:00 AM', note: 'Late Night Outcall', icon: Sparkles },
    { time: '03:00 AM', note: 'Overnight Service', icon: Sparkles },
    { time: '04:00 AM', note: 'Overnight Service', icon: Sparkles },
    { time: '05:00 AM', note: 'Early Dawn Outcall', icon: Sparkles }
  ];

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!whatsappNumber.trim()) {
      setError('Please enter your WhatsApp phone number.');
      return;
    }
    if (!clientAge) {
      setError('Please enter your age.');
      return;
    }
    const ageNum = parseInt(clientAge, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setError('You must be 18 years or older to book a session.');
      return;
    }
    if (!maritalStatus) {
      setError('Please select your marital status.');
      return;
    }
    if (!occupation.trim()) {
      setError('Please enter your occupation.');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Exact Outcall Address is required.');
      return;
    }

    // Generate random 4-digit Booking ID (e.g., MTH-5829)
    const bookingId = `MTH-${Math.floor(1000 + Math.random() * 9000)}`;

    const resolvedDate = getResolvedDateString();
    const resolvedTime = getResolvedTimeString();
    const ageNum = parseInt(clientAge, 10) || 25;

    const originalServicePrice = selectedService.originalPrice || (selectedService.price + 1000);
    const newBooking: Booking = {
      id: bookingId,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      originalPrice: originalServicePrice,
      paymentMethod: paymentMode === 'pay-after-meeting' ? 'Pay After Meeting' : 'Full Online Payment',
      advancePaid: paymentMode === 'pay-after-meeting' ? travelChargeAmount : selectedService.price,
      remainingAmount: paymentMode === 'pay-after-meeting' ? remainingAfterMeeting : 0,
      travelCharge: travelChargeAmount,
      discount: 1000,
      discountReason: 'Flat ₹1,000 Limited Time Offer',
      duration: selectedService.duration,
      clientName: clientName.trim(),
      gender: gender,
      whatsappNumber: whatsappNumber.trim(),
      address: address.trim(),
      requestedDate: resolvedDate,
      requestedTimeSlot: resolvedTime,
      customerPreferredTime: `${resolvedDate} • ${resolvedTime}`,
      wantExtraService: wantExtraService,
      extraServiceNote: wantExtraService ? 'Customer requested extra service' : undefined,
      clientAge: ageNum,
      maritalStatus: maritalStatus,
      occupation: occupation.trim(),
      utrNumber: '', // will be provided on the payment step
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    onBookingSubmit(newBooking);
  };

  return (
    <div className="max-w-xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500 pb-16">
      <div className="bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gold/10 blur-[80px] pointer-events-none" />

        {/* Header with Navigation & Visual 2-Step Stepper */}
        <div className="relative z-10 border-b border-border/30 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            {step === 1 ? (
              <button
                type="button"
                onClick={onBackToHome}
                className="text-zinc-400 hover:text-gold flex items-center text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1 text-gold" />
                Back to Services
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-gold hover:underline flex items-center text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1 text-gold" />
                Back to Step 1
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-zinc-900/90 px-3 py-1 rounded-full border border-border/50 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-gold animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-zinc-300 font-semibold">Step {step} of 2</span>
            </div>
          </div>

          {/* Stepper Progress Tabs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setError('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                step === 1
                  ? 'bg-gold/15 border-gold text-gold shadow-sm shadow-gold/10'
                  : 'bg-zinc-900/60 border-border/60 text-zinc-300 hover:border-gold/40 cursor-pointer'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 1 ? 'bg-gold text-black' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {step === 2 ? '✓' : '1'}
              </div>
              <span className="truncate">Profile & Time</span>
            </button>

            <button
              type="button"
              disabled={step === 1}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                step === 2
                  ? 'bg-gold/15 border-gold text-gold shadow-sm shadow-gold/10'
                  : 'bg-zinc-900/30 border-border/30 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 2 ? 'bg-gold text-black' : 'bg-zinc-800 text-zinc-500'
              }`}>
                2
              </div>
              <span className="truncate">Address & Pay</span>
            </button>
          </div>
        </div>

        {/* Dynamic Titles based on Step */}
        <div className="relative z-10 space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">
            {step === 1 ? 'Client & Appointment Details' : 'Outcall Address & Payment'}
          </h1>
          <p className="text-sm text-zinc-400">
            {step === 1 ? (
              <>
                Select your profile preferences and therapist schedule for{' '}
                <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                  {selectedService.name}
                </span>
                .
              </>
            ) : (
              'Pinpoint your doorstep location and select how you would like to pay.'
            )}
          </p>
        </div>

        {/* Selected Service Snippet with Clear Payable Price & Strikethrough */}
        <div className="relative z-10 bg-zinc-950/70 p-4 border border-emerald-500/40 rounded-2xl space-y-2 shadow-lg shadow-emerald-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent text-base sm:text-lg">
                  {selectedService.name}
                </h3>
                <span className="text-[10px] font-mono font-extrabold text-white bg-emerald-600 border border-emerald-400/40 px-2.5 py-0.5 rounded-full shadow-sm">
                  ₹1,000 OFF OFFER
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-white bg-gold/15 border border-gold/30 px-3 py-1.5 rounded-lg shadow-sm">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>{selectedService.duration}</span>
                </span>
                {selectedService.originalPrice && selectedService.originalPrice > selectedService.price && (
                  <span className="line-through text-zinc-400 font-mono text-sm sm:text-base font-semibold">
                    ₹{selectedService.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-sm sm:text-base font-bold text-zinc-300 font-mono">
                  Offer Total: <strong className="text-emerald-400 font-extrabold text-base sm:text-lg">₹{selectedService.price.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
            <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <div className="text-xs text-zinc-400 font-mono">
                {paymentMode === 'pay-after-meeting' ? 'Travel Advance Payable Now' : 'Offer Price Payable'}
              </div>
              <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
                {paymentMode === 'full-online' ? (
                  <span className="text-white bg-emerald-600 px-3.5 py-1 rounded-xl border border-emerald-400/40 font-mono font-black text-2xl sm:text-3xl shadow-sm">
                    ₹{upfrontPayable.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <>
                    <span className="text-gold font-black text-2xl sm:text-3xl font-mono">₹{upfrontPayable.toLocaleString('en-IN')}</span>
                    <span className="text-xs sm:text-sm text-zinc-400 font-mono">
                      (Offer Total: <strong className="text-emerald-400 font-bold text-sm sm:text-base">₹{selectedService.price.toLocaleString('en-IN')}</strong>)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Personal Details & Time */}
        {step === 1 && (
          <form onSubmit={handleNextToStep2} className="relative z-10 space-y-5">
            {error && (
              <p className="text-red-400 text-sm font-semibold p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            {/* SECTION 1: CLIENT PROFILE */}
            <div className="bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950 border border-gold/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                      Client Profile
                    </h2>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Personal preferences for customized therapist care
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% Confidential
                </span>
              </div>

              {/* Inputs: Full Name & WhatsApp Number in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 font-semibold">
                    <User className="w-3.5 h-3.5 text-gold" />
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full bg-zinc-900/90 border border-border/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-zinc-900/90 border border-border/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    For private booking status updates & live tracker link.
                  </span>
                </div>
              </div>

              {/* Inputs: Age & Occupation in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-gold font-bold">#</span>
                    Your Age (18+) *
                  </label>
                  <input
                    required
                    type="number"
                    min="18"
                    max="100"
                    value={clientAge}
                    onChange={(e) => setClientAge(e.target.value)}
                    placeholder="e.g. 26"
                    className="w-full bg-zinc-900/90 border border-border/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-gold font-bold">💼</span>
                    Your Occupation *
                  </label>
                  <input
                    required
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Corporate / IT / Freelance / Homemaker"
                    className="w-full bg-zinc-900/90 border border-border/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                  />
                </div>
              </div>

              {/* 2 Main Action Buttons: Gender Button & Marital Status Button (Pickers open above) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 items-end">
                {/* GENDER COLUMN */}
                <div className="space-y-2">
                  {/* EXPANDABLE SCROLL UP/DOWN TRAY FOR GENDER (ABOVE BUTTON) */}
                  {showGenderPicker && (
                    <div className="bg-zinc-950 p-3 rounded-xl border border-gold/50 shadow-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-border/50 pb-1.5">
                        <span className="text-gold font-bold flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> Scroll Up / Down for Gender
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowGenderPicker(false)}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-gold/40 scrollbar-track-zinc-900">
                        {[
                          { id: 'Male', label: 'Male', badge: 'Gentleman', desc: 'Doorstep Outcall for Male Clients' },
                          { id: 'Female', label: 'Female', badge: 'Most Welcomed', desc: 'Doorstep Outcall for Female Clients' },
                          { id: 'Shemale', label: 'Shemale', badge: 'Private Care', desc: 'Discrete Confidential Outcall' },
                        ].map((item) => {
                          const isSelected = gender === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setGender(item.id);
                                setShowGenderPicker(false);
                              }}
                              className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                isSelected
                                  ? 'bg-gold/20 border-gold text-white font-bold shadow-sm'
                                  : 'bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 border-border/60 hover:border-gold/40'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold">{item.label}</span>
                                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded font-medium">
                                    {item.badge}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUTTON 1: GENDER */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowGenderPicker(!showGenderPicker);
                      if (!showGenderPicker) setShowMaritalPicker(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer group ${
                      showGenderPicker
                        ? 'bg-gold/15 border-gold shadow-md shadow-gold/20 ring-1 ring-gold/50'
                        : 'bg-zinc-900/90 hover:bg-zinc-850 border-border/70 hover:border-gold/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        showGenderPicker ? 'bg-gold text-black' : 'bg-gold/15 text-gold border border-gold/30'
                      }`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Gender Identity
                        </span>
                        <span className="text-sm font-bold text-white font-mono block truncate mt-0.5">
                          {gender}
                        </span>
                        <span className="text-[10px] text-gold/80 font-mono block">
                          {showGenderPicker ? '▲ Open above · Click to close' : '▲ Click to show options above'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-1 rounded-lg border text-xs transition-transform duration-200 shrink-0 ${
                      showGenderPicker ? 'rotate-180 bg-gold text-black border-gold' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>

                {/* MARITAL STATUS COLUMN */}
                <div className="space-y-2">
                  {/* EXPANDABLE SCROLL UP/DOWN TRAY FOR MARITAL STATUS (ABOVE BUTTON) */}
                  {showMaritalPicker && (
                    <div className="bg-zinc-950 p-3 rounded-xl border border-rose-500/50 shadow-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-border/50 pb-1.5">
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" /> Scroll Up / Down for Marital Status
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowMaritalPicker(false)}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-rose-400/40 scrollbar-track-zinc-900">
                        {[
                          { id: 'Single', label: 'Single', badge: 'Independent', desc: 'Unmarried / Single Client' },
                          { id: 'Married', label: 'Married', badge: 'Confidential', desc: 'Strictly Private & Confidential' },
                          { id: 'Divorced', label: 'Divorced', badge: 'Private', desc: 'Private Wellness Outcall' },
                          { id: 'Independent Women', label: 'Independent Women', badge: 'VIP Care', desc: 'Private Session for Independent Women' },
                          { id: 'Single Mom', label: 'Single Mom', badge: 'Special Care', desc: 'Relaxing Rejuvenation Therapy' },
                          { id: 'Single Lady', label: 'Single Lady', badge: 'VIP Lady', desc: 'Private Care for Single Lady' },
                        ].map((item) => {
                          const isSelected = maritalStatus === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setMaritalStatus(item.id);
                                setShowMaritalPicker(false);
                              }}
                              className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold shadow-sm'
                                  : 'bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 border-border/60 hover:border-rose-400/40'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold">{item.label}</span>
                                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded font-medium">
                                    {item.badge}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUTTON 2: MARITAL STATUS */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowMaritalPicker(!showMaritalPicker);
                      if (!showMaritalPicker) setShowGenderPicker(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer group ${
                      showMaritalPicker
                        ? 'bg-rose-500/15 border-rose-400 shadow-md shadow-rose-500/20 ring-1 ring-rose-400/50'
                        : 'bg-zinc-900/90 hover:bg-zinc-850 border-border/70 hover:border-rose-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        showMaritalPicker ? 'bg-rose-400 text-black' : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}>
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Marital Status
                        </span>
                        <span className="text-sm font-bold text-rose-300 font-mono block truncate mt-0.5">
                          {maritalStatus}
                        </span>
                        <span className="text-[10px] text-rose-400/80 font-mono block">
                          {showMaritalPicker ? '▲ Open above · Click to close' : '▲ Click to show options above'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-1 rounded-lg border text-xs transition-transform duration-200 shrink-0 ${
                      showMaritalPicker ? 'rotate-180 bg-rose-400 text-black border-rose-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: DATE & ARRIVAL TIME */}
            <div className="bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950 border border-gold/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                      Appointment Date & Arrival Time
                    </h2>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Fast doorstep dispatch to your hotel or residence
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30 flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3 h-3 text-gold" />
                  Doorstep Service
                </span>
              </div>

              {/* 2 Main Action Buttons: Choose Date Button & Time Schedule Button (Pickers open above) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* DATE COLUMN */}
                <div className="space-y-2">
                  {/* EXPANDABLE CALENDAR (ABOVE CHOOSE DATE BUTTON) */}
                  {showDatePicker && (
                    <div className="bg-zinc-950 p-4 rounded-xl border border-gold/50 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gold" />
                          <span className="text-xs font-mono uppercase text-gold font-bold">
                            Appointment Calendar
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(false)}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick 1-Tap Date Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            selectQuickDay(0);
                            setShowDatePicker(false);
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                            isSameDay(selectedDate, today)
                              ? 'bg-gold text-black border-gold shadow-md shadow-gold/20'
                              : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-border/80 hover:border-gold/40'
                          }`}
                        >
                          Today (ASAP)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            selectQuickDay(1);
                            setShowDatePicker(false);
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                            (() => {
                              const tom = new Date(today);
                              tom.setDate(today.getDate() + 1);
                              return isSameDay(selectedDate, tom);
                            })()
                              ? 'bg-gold text-black border-gold shadow-md shadow-gold/20'
                              : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-border/80 hover:border-gold/40'
                          }`}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            selectQuickDay(2);
                            setShowDatePicker(false);
                          }}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                            (() => {
                              const day2 = new Date(today);
                              day2.setDate(today.getDate() + 2);
                              return isSameDay(selectedDate, day2);
                            })()
                              ? 'bg-gold text-black border-gold shadow-md shadow-gold/20'
                              : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-border/80 hover:border-gold/40'
                          }`}
                        >
                          Day After
                        </button>
                      </div>

                      {/* Month Navigation */}
                      <div className="flex items-center justify-between bg-zinc-900/90 px-3 py-2 rounded-xl border border-border/70">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-white font-mono">
                          {monthNames[calMonth]} {calYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Weekdays */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <div key={d} className="text-[10px] font-mono font-bold text-zinc-400 py-0.5">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                          <div key={`blank-${idx}`} className="h-8" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateObj = new Date(calYear, calMonth, dayNum);
                          dateObj.setHours(0, 0, 0, 0);

                          const isSelected = isSameDay(selectedDate, dateObj);
                          const isCurrentToday = isSameDay(today, dateObj);
                          const isPast = isPastDay(dateObj);

                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              disabled={isPast}
                              onClick={() => {
                                setSelectedDate(dateObj);
                                setShowDatePicker(false);
                              }}
                              className={`h-8 rounded-lg text-xs font-mono font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                                isPast
                                  ? 'text-zinc-600 opacity-30 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-gold text-black font-extrabold shadow-sm shadow-gold/30'
                                  : isCurrentToday
                                  ? 'bg-zinc-850 text-gold border border-gold/40 hover:bg-zinc-800'
                                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                              }`}
                            >
                              <span>{dayNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUTTON 1: CHOOSE DATE */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowDatePicker(!showDatePicker);
                      if (!showDatePicker) setShowTimePicker(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer group ${
                      showDatePicker
                        ? 'bg-gold/15 border-gold shadow-md shadow-gold/20 ring-1 ring-gold/50'
                        : 'bg-zinc-900/90 hover:bg-zinc-850 border-border/70 hover:border-gold/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        showDatePicker ? 'bg-gold text-black' : 'bg-gold/15 text-gold border border-gold/30'
                      }`}>
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Choose Date
                        </span>
                        <span className="text-sm font-bold text-white font-mono block truncate mt-0.5">
                          {getResolvedDateString()}
                        </span>
                        <span className="text-[10px] text-gold/80 font-mono block">
                          {showDatePicker ? '▲ Calendar above · Click to close' : '▲ Click to show calendar above'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-1 rounded-lg border text-xs transition-transform duration-200 shrink-0 ${
                      showDatePicker ? 'rotate-180 bg-gold text-black border-gold' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>

                {/* TIME COLUMN */}
                <div className="space-y-2">
                  {/* EXPANDABLE SCROLL UP/DOWN TRAY FOR TIME SCHEDULE (ABOVE BUTTON) */}
                  {showTimePicker && (
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-emerald-500/50 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                            Scroll Up / Down For Arrival Time
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTimePicker(false)}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Scrollable list */}
                      <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-emerald-500/40 scrollbar-track-zinc-900 border border-border/60 rounded-xl p-2 bg-zinc-900/80">
                        {serialTimeSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          const IconComponent = slot.icon;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => {
                                setSelectedTime(slot.time);
                                setShowTimePicker(false);
                              }}
                              className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-sm'
                                  : 'bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border-border/70 hover:border-emerald-400/40'
                              } ${slot.isExpress ? 'border-amber-500/50 bg-amber-500/10' : ''}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md shrink-0 ${
                                  isSelected ? 'bg-emerald-400 text-black' : 'bg-zinc-800 text-emerald-400'
                                }`}>
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <span className="text-xs font-mono font-bold block leading-tight">
                                    {slot.time}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    {slot.note}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}

                        {/* Custom Specific Time Entry Option at bottom of scroll list */}
                        <div className="pt-1 border-t border-border/40">
                          <button
                            type="button"
                            onClick={() => setSelectedTime('custom')}
                            className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              selectedTime === 'custom'
                                ? 'bg-emerald-500/20 border-emerald-400 shadow-md text-white font-bold'
                                : 'bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border-border/70 hover:border-emerald-400/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-mono font-bold">Custom Specific Time</span>
                            </div>
                            {selectedTime === 'custom' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </button>

                          {selectedTime === 'custom' && (
                            <div className="pt-2 animate-in fade-in duration-200">
                              <input
                                type="text"
                                value={customTimeInput}
                                onChange={(e) => setCustomTimeInput(e.target.value)}
                                placeholder="e.g. 06:45 PM, 01:15 AM"
                                className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BUTTON 2: TIME SCHEDULE */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowTimePicker(!showTimePicker);
                      if (!showTimePicker) setShowDatePicker(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer group ${
                      showTimePicker
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                        : 'bg-zinc-900/90 hover:bg-zinc-850 border-border/70 hover:border-emerald-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        showTimePicker ? 'bg-emerald-400 text-black' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Time Schedule
                        </span>
                        <span className="text-sm font-bold text-emerald-400 font-mono block truncate mt-0.5">
                          {getResolvedTimeString()}
                        </span>
                        <span className="text-[10px] text-emerald-400/80 font-mono block">
                          {showTimePicker ? '▲ Times above · Click to close' : '▲ Click to scroll times above'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-1 rounded-lg border text-xs transition-transform duration-200 shrink-0 ${
                      showTimePicker ? 'rotate-180 bg-emerald-400 text-black border-emerald-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Clean, Refined Single-Line Schedule Summary Bar */}
              <div className="bg-zinc-900/80 border border-border/70 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-zinc-400">Scheduled:</span>
                  <span className="text-white font-bold">{getResolvedDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold truncate max-w-full">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{getResolvedTimeString()}</span>
                </div>
              </div>
            </div>

          {/* Extra Service Tick Option */}
          <div className="space-y-2.5">
            <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
              wantExtraService 
                ? 'bg-amber-500/10 border-gold shadow-lg shadow-gold/15' 
                : 'bg-zinc-950/90 border-gold/40 hover:border-gold'
            }`}>
              <label className="flex items-center gap-3.5 cursor-pointer">
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
                      : 'bg-zinc-900 text-zinc-400 border-border'
                  }`}>
                    {wantExtraService ? 'SELECTED' : 'OPTIONAL'}
                  </span>
                </div>
              </label>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 pl-8">
                Tick this option if you want custom extra service during your massage session.
              </p>
            </div>

            {/* Notice Right Below Extra Service */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-gold/30 flex items-start gap-2.5 text-left shadow-sm">
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

            {/* Step 1 Continue to Address & Payment Button */}
            <button
              type="submit"
              id="booking-step1-next-btn"
              className="w-full flex items-center justify-center p-4 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-gold/20 text-base md:text-lg leading-none mt-2 cursor-pointer"
            >
              <span>Continue to Address & Payment (Step 2/2)</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            {/* Bottom Back Button */}
            <div className="pt-1 flex items-center justify-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-1.5 py-2 px-4 text-xs text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 rounded-xl border border-border/50 transition-all cursor-pointer"
                id="booking-bottom-back-btn"
              >
                <ChevronLeft className="w-4 h-4 text-gold" />
                <span>Back to Services</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Address & Payment Page */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {error && (
              <p className="text-red-400 text-sm font-semibold p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            {/* Selected Service & Booking Details Summary Card */}
            <div className="bg-zinc-950/80 p-4 border border-gold/30 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-gold" />
                    Appointment Summary
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs text-gold hover:underline font-mono font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Edit Details
                </button>
              </div>

              {/* Service Name Title in Step 2 */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 px-3.5 py-2.5 rounded-xl border border-border/50">
                <span className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                  {selectedService.name}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                    {selectedService.duration}
                  </span>
                  <span className="text-sm sm:text-base font-black text-white bg-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-400/40 shadow-sm">
                    ₹{selectedService.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-border/30">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Client Profile</span>
                  <span className="font-semibold text-zinc-200 truncate block">{clientName || 'Client'} ({gender})</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{whatsappNumber}</span>
                </div>
                <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-border/30">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Schedule</span>
                  <span className="font-semibold text-emerald-400 truncate block">{getResolvedTimeString()}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{getResolvedDateString()}</span>
                </div>
              </div>

              {wantExtraService && (
                <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-gold/20 px-3 py-1.5 rounded-xl text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span><span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">Extra service</span> requested (+ custom therapist service)</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                Pinpoint Outcall Location & Address *
              </label>
              
              {/* Live Map & Current Location Helper */}
              <MapPicker 
                address={address} 
                setAddress={setAddress} 
              />

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                  Compiled Address Preview & Extra Access Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Compiled doorstep address will appear here. Feel free to append extra details like hotel room number, floor, gate code, or parking directions."
                  className="w-full bg-zinc-900/50 border border-border rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-all resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 p-4 sm:p-5 bg-zinc-950/90 border-2 border-gold/40 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gold" />
                  Select Payment Option *
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {paymentMode === 'pay-after-meeting' ? 'Pay After Meeting' : 'Full Online UPI'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Option 1: Pay After Meeting */}
                <div
                  onClick={() => setPaymentMode('pay-after-meeting')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2.5 ${
                    paymentMode === 'pay-after-meeting'
                      ? 'bg-amber-500/10 border-gold shadow-lg shadow-gold/15'
                      : 'bg-zinc-900/80 border-border hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${paymentMode === 'pay-after-meeting' ? 'bg-gold text-black' : 'bg-zinc-800 text-gold'}`}>
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          Pay After Meeting
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                          Cash / UPI on session day
                        </span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                      paymentMode === 'pay-after-meeting' ? 'border-gold bg-gold' : 'border-zinc-600'
                    }`}>
                      {paymentMode === 'pay-after-meeting' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-1.5 bg-zinc-950/70 p-2.5 rounded-lg border border-border/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Advance Travel Charge:</span>
                      <strong className="text-gold font-mono font-bold">₹{travelChargeAmount}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Balance After Meeting:</span>
                      <strong className="text-white font-mono">₹{remainingAfterMeeting.toLocaleString('en-IN')}</strong>
                    </div>
                    <p className="text-[10px] text-amber-300/90 leading-tight pt-1 border-t border-border/20">
                      💡 <em>Customer pays minimum ₹500 traveling charge online now. This ₹500 is physically discounted from your total bill after meeting!</em>
                    </p>
                  </div>
                </div>

                {/* Option 2: Full Online Payment */}
                <div
                  onClick={() => setPaymentMode('full-online')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2.5 ${
                    paymentMode === 'full-online'
                      ? 'bg-amber-500/10 border-gold shadow-lg shadow-gold/15'
                      : 'bg-zinc-900/80 border-border hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${paymentMode === 'full-online' ? 'bg-gold text-black' : 'bg-zinc-800 text-gold'}`}>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          Full Online Payment
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-400 block">
                          Instant 1-Tap UPI
                        </span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                      paymentMode === 'full-online' ? 'border-gold bg-gold' : 'border-zinc-600'
                    }`}>
                      {paymentMode === 'full-online' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-1.5 bg-zinc-950/70 p-2.5 rounded-lg border border-border/30">
                    <div className="flex justify-between text-xs items-baseline">
                      <span className="text-zinc-400">Total Online Paid (Offer):</span>
                      <div className="flex items-center gap-1.5">
                        {selectedService.originalPrice && selectedService.originalPrice > selectedService.price && (
                          <span className="line-through text-zinc-400 font-mono text-[11px]">
                            ₹{selectedService.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-white bg-emerald-600 px-2 py-0.5 rounded font-mono font-bold text-xs shadow-sm">
                          ₹{selectedService.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Due After Meeting:</span>
                      <strong className="text-emerald-400 font-mono">₹0 (Fully Paid)</strong>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight pt-1 border-t border-border/20">
                      Pay 100% upfront via GPay, PhonePe, Paytm, or BHIM UPI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Boundary Notice */}
            <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-zinc-400 text-xs space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-wider text-[10px]">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Strict Professional Boundaries
              </div>
              <p>
                By proceeding, you agree that this doorstep service is <strong>strictly professional, therapeutic, and non-sensual</strong>. Any inappropriate request will result in immediate termination of the massage session and full billing.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center p-4 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-gold/20 text-base md:text-lg leading-none mt-2 cursor-pointer"
              id="booking-form-submit-btn"
            >
              <span>
                {paymentMode === 'pay-after-meeting'
                  ? `Proceed to Pay ₹${upfrontPayable.toLocaleString('en-IN')} Travel Advance`
                  : `Proceed to Pay Full ₹${upfrontPayable.toLocaleString('en-IN')}`}
              </span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            {/* Navigation Buttons on Step 2 */}
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 py-2 px-4 text-xs text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 rounded-xl border border-border/50 transition-all cursor-pointer"
                id="booking-step2-back-to-step1-btn"
              >
                <ChevronLeft className="w-4 h-4 text-gold" />
                <span>Back to Step 1 (Edit Details)</span>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-1.5 py-2 px-4 text-xs text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
                id="booking-step2-cancel-btn"
              >
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
