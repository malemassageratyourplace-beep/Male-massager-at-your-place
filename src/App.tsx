import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import BookingForm from './components/BookingForm';
import PaymentPage from './components/PaymentPage';
import TrackerPage from './components/TrackerPage';
import RefundPage from './components/RefundPage';
import AdminPage from './components/AdminPage';
import BottomBackBar from './components/BottomBackBar';
import { Service, Booking } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [wantExtraService, setWantExtraService] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Navigate to tab with history tracking & smooth scroll
  const navigateToTab = useCallback((tab: string, replace = false) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setHistoryStack(prev => {
      if (replace) {
        const next = [...prev];
        next[next.length - 1] = tab;
        return next;
      }
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });

    try {
      window.history.pushState({ tab }, '', window.location.pathname);
    } catch {
      // safe fallback if history api constrained
    }
  }, []);

  // Go back handler for back button system
  const handleGoBack = useCallback(() => {
    if (currentTab === 'complete-payment') {
      if (selectedService) {
        navigateToTab('book-service', true);
      } else {
        navigateToTab('home', true);
      }
      return;
    }

    if (currentTab === 'book-service') {
      navigateToTab('home', true);
      return;
    }

    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // Remove current
      const prevTab = newStack[newStack.length - 1] || 'home';
      setHistoryStack(newStack);
      setCurrentTab(prevTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateToTab('home', true);
    }
  }, [currentTab, selectedService, historyStack, navigateToTab]);

  // Handle hardware & browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setCurrentTab(e.state.tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentTab !== 'home') {
        handleGoBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentTab, handleGoBack]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || urlParams.has('owner')) {
      localStorage.setItem('mth_show_admin', 'true');
      // Dispatch event to make sure header updates
      window.dispatchEvent(new Event('adminStatusUpdated'));
      navigateToTab('admin');
    }
  }, [navigateToTab]);

  const handleBookService = (service: Service, wantExtra?: boolean) => {
    setSelectedService(service);
    setWantExtraService(!!wantExtra);
    navigateToTab('book-service');
  };

  const handleBookingSubmit = (booking: Booking) => {
    try {
      // Retrieve existing bookings
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
      
      // Append new booking
      const updated = [booking, ...allBookings];
      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      
      // Sync State
      setActiveBooking(booking);
      
      // Dispatch update events to other views
      window.dispatchEvent(new Event('bookingsUpdated'));
      
      // Proceed to Payment Page
      navigateToTab('complete-payment');
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const handlePaymentComplete = (utrNumber: string, updatedFields?: Partial<Booking>) => {
    if (!activeBooking) return;

    try {
      // Retrieve existing bookings
      const stored = localStorage.getItem('mth_bookings');
      const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

      // Update the active booking with the UTR number and any mode adjustments
      const updated = allBookings.map(b => {
        if (b.id === activeBooking.id) {
          return { ...b, utrNumber, ...(updatedFields || {}) };
        }
        return b;
      });

      localStorage.setItem('mth_bookings', JSON.stringify(updated));
      
      // Dispatch event to sync tracker lists
      window.dispatchEvent(new Event('bookingsUpdated'));

      // Move to Tracker tab
      navigateToTab('tracker');
    } catch (err) {
      console.error('Error completing payment:', err);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeSection onBookService={handleBookService} />;
      
      case 'book-service':
        if (!selectedService) {
          navigateToTab('home');
          return null;
        }
        return (
          <BookingForm
            selectedService={selectedService}
            initialWantExtraService={wantExtraService}
            onBackToHome={() => navigateToTab('home')}
            onBookingSubmit={handleBookingSubmit}
          />
        );

      case 'complete-payment':
        if (!activeBooking) {
          navigateToTab('home');
          return null;
        }
        return (
          <PaymentPage
            booking={activeBooking}
            onPaymentComplete={handlePaymentComplete}
            onBackToBooking={() => selectedService ? navigateToTab('book-service') : navigateToTab('home')}
            onBackToHome={() => navigateToTab('home')}
          />
        );

      case 'tracker':
        return <TrackerPage onBackToHome={() => navigateToTab('home')} />;

      case 'refund':
        return <RefundPage onBackToHome={() => navigateToTab('home')} />;

      case 'admin':
        if (localStorage.getItem('mth_show_admin') === 'true') {
          return <AdminPage />;
        }
        return <HomeSection onBookService={handleBookService} />;

      default:
        return <HomeSection onBookService={handleBookService} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-gold/20 selection:text-gold font-sans relative pb-12">
      <Header currentTab={currentTab} setCurrentTab={navigateToTab} />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl relative z-10">
        {renderContent()}
      </main>

      <Footer setCurrentTab={navigateToTab} />

      {/* Floating Bottom Back & Navigation System */}
      <BottomBackBar
        currentTab={currentTab}
        onGoBack={handleGoBack}
        onGoHome={() => navigateToTab('home')}
        onGoTracker={() => navigateToTab('tracker')}
      />
    </div>
  );
}

