import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Lock, Unlock, Search, Check, X, Trash2, Filter, AlertCircle, Phone, MapPin, IndianRupee, BarChart3, TrendingUp, Calendar, DollarSign, RefreshCw, ChevronDown, ChevronUp, Star, ExternalLink, Gift, Sparkles, Banknote, CreditCard, Clock, Zap, Timer } from 'lucide-react';
import { getCleanAddress, extractMapsUrl } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeAcceptingId, setActiveAcceptingId] = useState<string | null>(null);
  const [serviceTime, setServiceTime] = useState('');
  const [adminServiceDate, setAdminServiceDate] = useState('Today');

  // Deletion & Clear history modal states (no blocking window.confirm/alert)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Analytics dashboard state
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [analyticsMetric, setAnalyticsMetric] = useState<'income' | 'bookings'>('income');

  // Compute analytics data structure
  const getAnalyticsData = () => {
    // Only parse active bookings
    const activeBookings = bookings;
    const acceptedBookings = activeBookings.filter(b => b.status === 'Accepted');
    const validBookings = activeBookings.filter(b => b.status === 'Accepted' || b.status === 'Pending');

    // 1. Daily (Last 7 Days)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayBookings = validBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.toDateString() === dateStr;
      });
      
      const acceptedDayBookings = acceptedBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.toDateString() === dateStr;
      });

      const income = acceptedDayBookings.reduce((sum, b) => sum + b.price, 0);
      dailyData.push({
        label,
        bookings: dayBookings.length,
        income,
      });
    }

    // 2. Weekly (Last 6 Weeks)
    const weeklyData = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - (i * 7 + 6));
      const end = new Date();
      end.setDate(end.getDate() - (i * 7));
      
      const label = i === 0 ? 'This Week' : `Wk -${i}`;
      
      const weekBookings = validBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        const bTime = bDate.getTime();
        const startTime = new Date(start.setHours(0,0,0,0)).getTime();
        const endTime = new Date(end.setHours(23,59,59,999)).getTime();
        return bTime >= startTime && bTime <= endTime;
      });

      const acceptedWeekBookings = acceptedBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        const bTime = bDate.getTime();
        const startTime = new Date(start.setHours(0,0,0,0)).getTime();
        const endTime = new Date(end.setHours(23,59,59,999)).getTime();
        return bTime >= startTime && bTime <= endTime;
      });

      const income = acceptedWeekBookings.reduce((sum, b) => sum + b.price, 0);
      weeklyData.push({
        label,
        bookings: weekBookings.length,
        income,
      });
    }

    // 3. Monthly (Last 6 Months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      
      const monthBookings = validBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.getMonth() === monthIndex && bDate.getFullYear() === year;
      });

      const acceptedMonthBookings = acceptedBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.getMonth() === monthIndex && bDate.getFullYear() === year;
      });

      const income = acceptedMonthBookings.reduce((sum, b) => sum + b.price, 0);
      monthlyData.push({
        label: `${label} ${year.toString().slice(-2)}`,
        bookings: monthBookings.length,
        income,
      });
    }

    // 4. Yearly (Last 3 Years)
    const yearlyData = [];
    const currentYear = new Date().getFullYear();
    for (let i = 2; i >= 0; i--) {
      const year = currentYear - i;
      
      const yearBookings = validBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.getFullYear() === year;
      });

      const acceptedYearBookings = acceptedBookings.filter(b => {
        const bDate = new Date(b.createdAt);
        return bDate.getFullYear() === year;
      });

      const income = acceptedYearBookings.reduce((sum, b) => sum + b.price, 0);
      yearlyData.push({
        label: year.toString(),
        bookings: yearBookings.length,
        income,
      });
    }

    return { dailyData, weeklyData, monthlyData, yearlyData };
  };

  const { dailyData, weeklyData, monthlyData, yearlyData } = getAnalyticsData();
  
  const getActiveChartData = () => {
    switch (analyticsPeriod) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return dailyData;
    }
  };

  const activeChartData = getActiveChartData();

  // Compute key stats metrics
  const confirmedBookings = bookings.filter(b => b.status === 'Accepted');
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const rejectedBookings = bookings.filter(b => b.status === 'Rejected');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.price, 0);
  
  const totalBookingsCount = bookings.length;
  const processedCount = confirmedBookings.length + rejectedBookings.length + cancelledBookings.length;
  const completionRate = processedCount > 0 ? Math.round((confirmedBookings.length / processedCount) * 100) : 0;
  const avgTicketSize = confirmedBookings.length > 0 ? Math.round(totalRevenue / confirmedBookings.length) : 0;

  const loadBookings = () => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      // Filter out any booking marked as deleted by admin
      const active = allBookings.filter(b => !b.adminDeleted);
      setBookings(active.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Error loading admin bookings:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleUpdate = () => {
      if (isAuthenticated) loadBookings();
    };
    window.addEventListener('bookingsUpdated', handleUpdate);
    return () => window.removeEventListener('bookingsUpdated', handleUpdate);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin password. Please try again.');
    }
  };

  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

      const updated = allBookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: newStatus };
        }
        return b;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookingsUpdated'));
      loadBookings();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleConfirmAccept = (b: Booking) => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

      const finalScheduledTime = serviceTime.trim();

      const updated = allBookings.map(item => {
        if (item.id === b.id) {
          return { 
            ...item, 
            status: 'Accepted' as const, 
            scheduledTime: finalScheduledTime,
            confirmedDate: adminServiceDate,
            confirmedTimeSlot: finalScheduledTime
          };
        }
        return item;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookingsUpdated'));
      loadBookings();

      const paymentBreakdown = b.paymentMethod === 'Pay After Meeting'
        ? `💰 *Total Service Price:* ₹${b.price.toLocaleString('en-IN')}\n💳 *Advance Traveling Charge Paid:* ₹${(b.advancePaid || 500).toLocaleString('en-IN')}\n💵 *Balance to Pay After Meeting:* ₹${(b.remainingAmount !== undefined ? b.remainingAmount : Math.max(0, b.price - 500)).toLocaleString('en-IN')} (₹500 travel charge physically discounted from final bill)`
        : `💰 *Amount Paid (Full Online):* ₹${b.price.toLocaleString('en-IN')}`;

      const requestedTimeLine = (b.requestedDate || b.requestedTimeSlot)
        ? `\n📅 *Customer Requested Timing:* ${b.requestedDate || 'Today'} • ${b.requestedTimeSlot || 'Immediately / ASAP'}`
        : '';

      // Trigger immediate WhatsApp message
      const text = `*Male Therapist At Home* 💆‍♂️✨\n\nHello *${b.clientName}*,\n\nYour booking for *${b.serviceName}* (ID: ${b.id}) has been *ACCEPTED*! ✅${requestedTimeLine}\n\n🕒 *Confirmed Service Arrival Time:* ${finalScheduledTime}\n📍 *Address:* ${getCleanAddress(b.address)}\n${paymentBreakdown}\n\nOur therapist will arrive promptly at your doorstep. Thank you for choosing our premium service!`;
      const waUrl = `https://wa.me/${b.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');

      // Reset states
      setActiveAcceptingId(null);
      setServiceTime('');
    } catch (err) {
      console.error('Error confirming acceptance:', err);
    }
  };

  // Direct deletion executor (called when confirmed via UI modal)
  const executeDeleteBooking = (bookingId: string) => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

      // Filter out the deleted booking permanently
      const updated = allBookings.filter(b => b.id !== bookingId);

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookingsUpdated'));
      setBookingToDelete(null);
      loadBookings();
      showToast('🗑️ Booking record deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  // Clear Processed Bookings (Accepted, Rejected, Cancelled)
  const executeClearProcessedHistory = () => {
    try {
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

      // Keep only active pending bookings
      const updated = allBookings.filter(b => b.status === 'Pending');

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookingsUpdated'));
      setShowClearHistoryModal(false);
      loadBookings();
      showToast('🧹 Processed history cleared successfully');
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  // Clear All Bookings completely
  const executeClearAllBookings = () => {
    try {
      localStorage.setItem('mth_bookings', JSON.stringify([]));
      window.dispatchEvent(new Event('bookingsUpdated'));
      setShowClearHistoryModal(false);
      loadBookings();
      showToast('✨ All bookings cleared successfully');
    } catch (err) {
      console.error('Error clearing all bookings:', err);
    }
  };

  // Filtered Bookings for display
  const displayedBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.whatsappNumber.includes(searchTerm) ||
      (b.utrNumber && b.utrNumber.includes(searchTerm));

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: Booking['status']) => {
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto w-full animate-in fade-in zoom-in-95 duration-500 pb-16">
        <div className="bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gold/10 blur-[80px] pointer-events-none" />
          
          <div className="text-center space-y-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-zinc-400">
              Provide the security password to view the bookings management system.
            </p>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 space-y-4">
            {error && (
              <p className="text-red-400 text-xs font-semibold p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (e.g., admin123)"
                className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/20 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent flex items-center gap-2">
            <Unlock className="w-6 h-6 text-gold" />
            Admin Bookings Console
          </h1>
          <p className="text-xs text-zinc-400">
            Verify payment reference UTRs, manage schedules, and process cancellation slots.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {bookings.length > 0 && (
            <button
              onClick={() => setShowClearHistoryModal(true)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl text-xs font-bold border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer flex items-center gap-1.5"
              id="admin-clear-history-btn"
              title="Clear old processed history or wipe all bookings"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
          <button
            onClick={() => {
              localStorage.setItem('mth_show_admin', 'false');
              window.dispatchEvent(new Event('adminStatusUpdated'));
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500 hover:text-black text-gold rounded-xl text-xs font-bold border border-gold/30 hover:border-gold/60 transition-all cursor-pointer flex items-center gap-1.5"
            title="Hides the Admin tab from the navigation header until logo is clicked 5 times again"
          >
            <Lock className="w-3.5 h-3.5" />
            Hide & Lock Admin
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold border border-border/50 transition-colors cursor-pointer"
          >
            Lock Console
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-300">
        
        {/* Panel Header */}
        <div 
          onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
          className="flex items-center justify-between p-5 cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/70 border-b border-border/20 transition-all select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-200 font-bold">Analytics & Revenue Dashboard</h2>
              <p className="text-[11px] text-zinc-500">Track and monitor your business performance metrics in real-time.</p>
            </div>
          </div>
          <button 
            type="button"
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/40 hover:text-white text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
          >
            {isAnalyticsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Panel Body */}
        {isAnalyticsOpen && (
          <div className="p-5 space-y-6 animate-in fade-in slide-in-from-top-1 duration-300">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Revenue */}
              <div className="bg-zinc-950 border border-border/40 p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 blur-[30px] rounded-full group-hover:bg-gold/10 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Confirmed Income</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl md:text-2xl font-bold text-white font-mono">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="text-yellow-500 font-bold">₹{pendingRevenue.toLocaleString('en-IN')}</span> pending approval
                  </p>
                </div>
              </div>

              {/* Card 2: Bookings */}
              <div className="bg-zinc-950 border border-border/40 p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 blur-[30px] rounded-full group-hover:bg-gold/10 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">Total Bookings</span>
                  <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl md:text-2xl font-bold text-white font-mono">
                    {totalBookingsCount}
                  </h3>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="text-yellow-500 font-bold">{pendingBookings.length} pending</span> | <span className="text-green-500 font-bold">{confirmedBookings.length} active</span>
                  </p>
                </div>
              </div>

              {/* Card 3: Avg Order value */}
              <div className="bg-zinc-950 border border-border/40 p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 blur-[30px] rounded-full group-hover:bg-gold/10 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold font-bold">Avg Session Price</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl md:text-2xl font-bold text-white font-mono">
                    ₹{avgTicketSize.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[10px] text-zinc-500">Average ticket per booking</p>
                </div>
              </div>

              {/* Card 4: Success rate */}
              <div className="bg-zinc-950 border border-border/40 p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 blur-[30px] rounded-full group-hover:bg-gold/10 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold font-bold">Acceptance Rate</span>
                  <div className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl md:text-2xl font-bold text-white font-mono">
                    {completionRate}%
                  </h3>
                  <p className="text-[10px] text-zinc-500">Accepted vs. processed slots</p>
                </div>
              </div>

            </div>

            {/* Graphs / Charts Section */}
            <div className="bg-zinc-950 border border-border/40 rounded-xl p-4 md:p-6 space-y-4">
              
              {/* Chart Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/10 pb-4">
                
                {/* Metric toggle */}
                <div className="flex bg-zinc-900/60 p-0.5 rounded-lg border border-border/30 w-fit">
                  <button
                    type="button"
                    onClick={() => setAnalyticsMetric('income')}
                    className={`px-3 py-1 text-xs font-bold font-mono uppercase rounded-md transition-all cursor-pointer ${
                      analyticsMetric === 'income'
                        ? 'bg-gold/15 text-gold border border-gold/20 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    Income (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsMetric('bookings')}
                    className={`px-3 py-1 text-xs font-bold font-mono uppercase rounded-md transition-all cursor-pointer ${
                      analyticsMetric === 'bookings'
                        ? 'bg-gold/15 text-gold border border-gold/20 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    Bookings (Qty)
                  </button>
                </div>

                {/* Period selector */}
                <div className="flex bg-zinc-900/60 p-0.5 rounded-lg border border-border/30 w-fit font-mono">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setAnalyticsPeriod(period)}
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all cursor-pointer ${
                        analyticsPeriod === period
                          ? 'bg-zinc-800 text-white border border-border/40 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

              </div>

              {/* Responsive Chart */}
              <div className="h-64 md:h-80 w-full">
                {bookings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
                    <p className="text-zinc-500 font-mono text-xs">No analytics data available to display.</p>
                    <p className="text-zinc-600 text-[11px]">Realized earnings and session quantities will map here in real-time.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {analyticsMetric === 'income' ? (
                      <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0.00}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1c1c1e" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="#52525b" 
                          fontSize={11} 
                          fontFamily="JetBrains Mono, monospace"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#52525b" 
                          fontSize={11} 
                          fontFamily="JetBrains Mono, monospace"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `₹${val}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#09090b', 
                            borderColor: '#27272a', 
                            borderRadius: '12px',
                            color: '#fff',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px'
                          }} 
                          formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Income']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="income" 
                          stroke="#d4af37" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorIncome)" 
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#1c1c1e" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="#52525b" 
                          fontSize={11} 
                          fontFamily="JetBrains Mono, monospace"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#52525b" 
                          fontSize={11} 
                          fontFamily="JetBrains Mono, monospace"
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#09090b', 
                            borderColor: '#27272a', 
                            borderRadius: '12px',
                            color: '#fff',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px'
                          }} 
                          formatter={(value: any) => [`${value} Booking(s)`, 'Quantity']}
                        />
                        <Bar 
                          dataKey="bookings" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]} 
                          maxBarSize={45}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Searching & Status Filtering */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="md:col-span-7 relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Name, WhatsApp, or UTR..."
            className="w-full bg-card border border-border/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5" />
        </div>

        {/* Filter status */}
        <div className="md:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                  statusFilter === status
                    ? 'bg-gold/15 border-gold text-gold'
                    : 'bg-card border-border/50 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bookings Table/Cards Display */}
      {displayedBookings.length === 0 ? (
        <div className="text-center p-12 bg-card border border-border/50 rounded-2xl">
          <p className="text-zinc-500 font-medium">No bookings match the search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-card border border-border/50 rounded-2xl p-6 hover:border-gold/20 transition-all flex flex-col space-y-4"
            >
              
              {/* Row 1: Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/20 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500">Booking ID: {b.id}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusClass(b.status)}`}>
                      {b.status}
                    </span>
                    {b.paymentMethod === 'Pay After Meeting' ? (
                      <span className="text-xs font-mono bg-amber-500/15 text-gold border border-gold/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        Pay After Meeting
                      </span>
                    ) : (
                      <span className="text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        Full Online Paid
                      </span>
                    )}
                    {b.scheduledTime && (
                      <span className="text-xs font-mono bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Scheduled: {b.scheduledTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">{b.serviceName}</h3>
                  <p className="text-xs text-zinc-500">
                    Received: {new Date(b.createdAt).toLocaleString()}
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

              {/* Google Review Verification Details */}
              {b.googleReviewClaimed && (
                <div className="bg-amber-500/10 border border-gold/40 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-gold text-black font-bold text-[10px]">5★ IN-PERSON REWARD</span>
                    <span className="text-zinc-200">
                      Customer opted for ₹500 physical discount under review name: <strong className="text-gold">{b.googleReviewName || b.clientName}</strong> <em>(Hand over ₹500 discount on-site after verifying 5-star rating)</em>
                    </span>
                  </div>
                  <a
                    href="https://g.page/r/CbX4mweMFKrTEBI/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-zinc-900 hover:bg-gold text-gold hover:text-black border border-gold/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Check Google Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Row 2: Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-sm text-zinc-300">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Client Name</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-medium">{b.clientName}</span>
                    {b.gender && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 font-bold">
                        {b.gender}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Gender</span>
                  <span className="text-white font-medium">{b.gender || 'Female'}</span>
                </div>

                <div className="md:col-span-1 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Age</span>
                  <span className="text-white font-medium">{b.clientAge ? `${b.clientAge} Yrs` : 'N/A'}</span>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Marital Status</span>
                  <span className="text-white font-medium">{b.maritalStatus || 'N/A'}</span>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Occupation</span>
                  <span className="text-white font-medium truncate block" title={b.occupation}>{b.occupation || 'N/A'}</span>
                </div>
                
                <div className="md:col-span-2 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">WhatsApp</span>
                  <a
                    href={`https://wa.me/${b.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    {b.whatsappNumber}
                  </a>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Outcall Address</span>
                  <div className="space-y-1.5 mt-1">
                    <span className="text-zinc-300 flex items-start gap-1.5 font-mono text-xs leading-normal">
                      <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      {getCleanAddress(b.address)}
                    </span>
                    {extractMapsUrl(b.address) && (
                      <a
                        href={extractMapsUrl(b.address)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 fill-current" />
                        Navigate on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Requested Schedule Box */}
              <div className="bg-zinc-950/80 border border-gold/30 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">
                      Customer Requested Timing:
                    </span>
                    <span className="text-white font-bold font-mono">
                      {b.requestedDate || 'Today'} • {b.requestedTimeSlot || 'Immediately / ASAP'}
                    </span>
                  </div>
                </div>

                {b.scheduledTime && (
                  <div className="flex items-center gap-1.5 text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>Confirmed by Admin:</strong> {b.scheduledTime}</span>
                  </div>
                )}
              </div>

              {/* Extra Service Custom Requirement from Customer */}
              {(b.wantExtraService || b.extraServiceNote) && (
                <div className="bg-gold/10 border border-gold/40 p-3.5 rounded-xl flex items-center gap-2.5 text-xs">
                  <span className="font-mono text-gold font-bold uppercase shrink-0 bg-gold/20 px-2 py-0.5 rounded border border-gold/30">
                    Extra Service:
                  </span>
                  <span className="text-white font-bold leading-relaxed">Yes — Customer selected "I want extra service"</span>
                </div>
              )}

              {/* Row 3: Verification Reference UTR & Payment Settlement */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border/20 bg-zinc-950/20 p-4 rounded-xl border border-border/10">
                <div className="space-y-1 text-left font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">UTR / Payment Reference</span>
                  <span className="text-white font-bold text-sm tracking-wide">
                    {b.utrNumber ? b.utrNumber : <span className="text-red-400 italic font-medium">None uploaded</span>}
                  </span>
                </div>

                <div className="space-y-1 text-left md:text-right font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Payment Settlement</span>
                  {b.paymentMethod === 'Pay After Meeting' ? (
                    <div className="text-xs space-y-0.5">
                      <div className="text-gold font-bold">
                        Advance Paid: ₹{b.advancePaid || 500} (Travel Charge)
                      </div>
                      <div className="text-white font-semibold">
                        Collect After Meeting: ₹{(b.remainingAmount !== undefined ? b.remainingAmount : Math.max(0, b.price - 500)).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        *₹500 travel charge physically discounted from final bill
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-400 font-bold">
                      Full Online Paid: ₹{b.price.toLocaleString('en-IN')} (₹0 balance due)
                    </div>
                  )}
                </div>

                {b.cancelReason && (
                  <div className="space-y-1.5 text-left md:text-right font-mono max-w-md">
                    <span className="text-[10px] text-red-400 uppercase tracking-widest font-semibold block">Cancellation & Refund Details</span>
                    <p className="text-zinc-300 text-xs leading-snug">
                      Reason: <span className="text-zinc-400">"{b.cancelReason}"</span> {b.cancelUpiId && <>• UPI ID: <span className="text-white select-all">{b.cancelUpiId}</span></>}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Standard 10% Fee: <span className="text-red-400">₹{Math.round(b.price * 0.1).toLocaleString('en-IN')}</span> | Eligible Refund (90%): <span className="text-emerald-400">₹{Math.round(b.price * 0.9).toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Row 4: Controls */}
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Actions for Pending Booking */}
                  {b.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveAcceptingId(b.id);
                          setServiceTime(b.requestedTimeSlot || 'Within 45 minutes');
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-green-500/20"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        Accept & Set Time Slot
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Rejected')}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-white font-bold border border-red-500/30 hover:border-red-500 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                        Reject Slot
                      </button>
                    </div>
                  ) : b.status === 'Accepted' ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-xs text-green-400 font-mono font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Accepted {b.scheduledTime ? `• Scheduled: ${b.scheduledTime}` : ''}
                      </div>
                      <button
                        onClick={() => {
                          const paymentBreakdown = b.paymentMethod === 'Pay After Meeting'
                            ? `💰 *Total Service Price:* ₹${b.price.toLocaleString('en-IN')}\n💳 *Advance Traveling Charge Paid:* ₹${(b.advancePaid || 500).toLocaleString('en-IN')}\n💵 *Balance to Pay After Meeting:* ₹${(b.remainingAmount !== undefined ? b.remainingAmount : Math.max(0, b.price - 500)).toLocaleString('en-IN')} (₹500 travel charge physically discounted from final bill)`
                            : `💰 *Amount Paid (Full Online):* ₹${b.price.toLocaleString('en-IN')}`;

                          const requestedTimeLine = (b.requestedDate || b.requestedTimeSlot)
                            ? `\n📅 *Customer Requested Timing:* ${b.requestedDate || 'Today'} • ${b.requestedTimeSlot || 'Immediately / ASAP'}`
                            : '';

                          const text = `*Male Therapist At Home* 💆‍♂️✨\n\nHello *${b.clientName}*,\n\nYour booking for *${b.serviceName}* (ID: ${b.id}) is *CONFIRMED*! ✅${requestedTimeLine}\n\n🕒 *Scheduled Service Arrival Time:* ${b.scheduledTime || 'Promptly'}\n📍 *Address:* ${getCleanAddress(b.address)}\n${paymentBreakdown}\n\nOur therapist will arrive at your doorstep as scheduled. Thank you for choosing us!`;
                          const waUrl = `https://wa.me/${b.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
                          window.open(waUrl, '_blank');
                        }}
                        className="px-3.5 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/30 text-green-400 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        Send WhatsApp Alert
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 font-mono font-medium">
                      State processed. No pending operations.
                    </div>
                  )}

                  {/* Delete button for any booking */}
                  <button
                    onClick={() => setBookingToDelete(b)}
                    className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900/90 hover:bg-red-500/10 border border-border hover:border-red-500/40 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs"
                    title="Delete booking from records"
                    id={`admin-del-booking-${b.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                    <span className="hidden sm:inline font-mono text-[11px]">Delete</span>
                  </button>

                </div>

                {/* Inline Service/Arrival Date & Time specification form */}
                {activeAcceptingId === b.id && (
                  <div className="bg-zinc-950 border-2 border-gold/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-250 text-left">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                      <div>
                        <span className="text-xs font-mono text-gold uppercase font-bold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold" />
                          Set Confirmed Service Date & Time Slot
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                          Specify to {b.clientName} exactly when the male therapist will arrive
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveAcceptingId(null);
                          setServiceTime('');
                        }}
                        className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg bg-zinc-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customer's Original Request Reminder */}
                    <div className="bg-amber-500/10 border border-gold/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Customer Requested:</span>
                      <strong className="text-gold font-bold">
                        {b.requestedDate || 'Today'} • {b.requestedTimeSlot || 'Immediately / ASAP'}
                      </strong>
                    </div>

                    {/* Match Customer Request 1-Click Button */}
                    {b.requestedTimeSlot && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setServiceTime(b.requestedTimeSlot!)}
                          className="w-full py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Match Customer Requested Slot: "{b.requestedTimeSlot}"</span>
                        </button>
                      </div>
                    )}

                    {/* Date & Time Presets */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                        Quick Arrival Time Presets:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Within 30 mins (Immediate)',
                          'Within 45 mins',
                          'Within 1 hour',
                          'In 2 hours',
                          'Today, 5:00 PM',
                          'Today, 6:30 PM',
                          'Today, 8:00 PM',
                          'Today, 10:00 PM',
                          'Tomorrow, 11:00 AM',
                          'Tomorrow, 4:00 PM',
                          'Tomorrow, 8:00 PM'
                        ].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setServiceTime(p)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                              serviceTime === p
                                ? 'bg-gold text-black border-gold font-bold shadow-sm'
                                : 'bg-zinc-900 hover:bg-zinc-800 border-border/50 text-zinc-300 hover:border-gold/40'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Input for Exact Time */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                        Or Type Exact Confirmed Schedule:
                      </label>
                      <input
                        type="text"
                        value={serviceTime}
                        onChange={(e) => setServiceTime(e.target.value)}
                        placeholder="e.g., Today at 5:30 PM, or In 45 mins, or Tomorrow 11:00 AM"
                        className="w-full bg-zinc-900 border border-gold/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2 border-t border-border/30">
                      <button
                        onClick={() => handleConfirmAccept(b)}
                        disabled={!serviceTime.trim()}
                        className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-green-500/20"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        Confirm Slot & Notify Customer on WhatsApp
                      </button>
                      <button
                        onClick={() => {
                          setActiveAcceptingId(null);
                          setServiceTime('');
                        }}
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-border/60 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div className="bg-zinc-900 text-white border border-gold/40 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono font-bold flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Single Booking Deletion Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Delete Booking Record?</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Are you sure you want to permanently delete this booking from the admin records? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-zinc-950/80 rounded-xl p-3.5 border border-border/40 text-xs font-mono space-y-1.5 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Booking ID:</span>
                <span className="text-white font-bold">{bookingToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Client:</span>
                <span className="text-gold font-semibold">{bookingToDelete.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Service:</span>
                <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">{bookingToDelete.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusClass(bookingToDelete.status)}`}>
                  {bookingToDelete.status}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setBookingToDelete(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeleteBooking(bookingToDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Clear Booking History</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Choose how you would like to clear your admin bookings dashboard.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Clear Processed Bookings */}
              <button
                onClick={executeClearProcessedHistory}
                className="w-full p-3.5 text-left bg-zinc-900 hover:bg-zinc-850 border border-border/80 hover:border-gold/40 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-gold">
                    🧹 Clear Processed History Only
                  </span>
                  <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Clears all <strong>Accepted</strong>, <strong>Rejected</strong>, and <strong>Cancelled</strong> bookings while safely preserving all active <strong>Pending</strong> bookings.
                </p>
              </button>

              {/* Option 2: Clear All Bookings */}
              <button
                onClick={executeClearAllBookings}
                className="w-full p-3.5 text-left bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/60 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 group-hover:text-red-300">
                    ⚠️ Clear All Bookings (Wipe Everything)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Deletes all booking records completely (including pending test bookings).
                </p>
              </button>
            </div>

            {/* Cancel */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
