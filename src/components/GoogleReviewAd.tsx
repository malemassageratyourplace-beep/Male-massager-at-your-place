import React, { useState } from 'react';
import { Star, Gift, ExternalLink, Copy, Check, Sparkles, Tag, ArrowRight, MessageSquareHeart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface GoogleReviewAdProps {
  variant?: 'banner' | 'card' | 'compact';
}

export default function GoogleReviewAd({ variant = 'banner' }: GoogleReviewAdProps) {
  const reviewUrl = "https://g.page/r/CbX4mweMFKrTEBI/review";

  const handleOpenGoogleReview = () => {
    window.open(reviewUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[#14161a] border border-gold/30 p-4 shadow-md shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gold/15 border border-gold/30 text-gold shrink-0">
              <Gift className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-gold text-black font-bold px-2 py-0.5 rounded-full">
                  ₹500 OFF OFFER
                </span>
                <div className="flex items-center text-gold text-xs font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                Post a 5-Star Google Review & Get Flat ₹500 Physical Cash Discount!
              </p>
              <p className="text-xs text-zinc-300">
                Show your 5-Star review to the therapist at your session to receive ₹500 directly in cash/in-person.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenGoogleReview}
              className="px-4 py-2 bg-gold hover:bg-gold-hover text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border border-amber-300/30 shadow-sm cursor-pointer"
            >
              <span>Write Review on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-gold/30 bg-[#14161a] p-6 sm:p-8 shadow-xl shadow-black/50 my-8">
      {/* Decorative Golden Ambient Backlight - soft matte glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Ad Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Exclusive Google Business Reward
          </span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-border/50">
            PHYSICAL CASH DISCOUNT
          </span>
        </div>

        {/* 5-Star Rating Indicator */}
        <div className="flex items-center gap-2 bg-[#0f1013] px-3 py-1.5 rounded-full border border-gold/30">
          <span className="text-xs font-bold text-white">5.0</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
            ))}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Google Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left column: Ad headline and value proposition */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">Get </span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent underline decoration-pink-500/50 underline-offset-4">₹500 Physical Cash Discount</span>
              <span className="text-white"> After Giving 5-Star Review!</span>
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              <strong className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">Male massager at your place</strong> would love your feedback. Post a 5-Star review with your comments to our Google profile, and show it to the therapist during your session to receive Flat ₹500 physical discount directly in-person.
            </p>
          </div>

          {/* 2 Step Micro-Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#101115] border border-border/50 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-gold/15 text-gold font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-gold/30">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Post 5-Star Google Review</span>
                <span className="text-zinc-400 text-[11px]">Give 5-star rating & feedback</span>
              </div>
            </div>

            <div className="bg-[#101115] border border-border/50 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">Show Therapist & Get ₹500</span>
                <span className="text-zinc-400 text-[11px]">Handed physically in cash on session day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Direct Review Action Card */}
        <div className="lg:col-span-5 bg-[#16181d] border border-gold/30 p-5 sm:p-6 rounded-2xl text-center space-y-4 shadow-xl shadow-black/40">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              In-Person Review Reward
            </span>
            <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <span>FLAT ₹500 CASH OFF</span>
            </div>
            <p className="text-xs text-zinc-400">
              Handed over physically in-person after showing 5-Star rating
            </p>
          </div>

          {/* Direct CTA Button */}
          <div className="space-y-2.5 pt-1">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-gold hover:bg-gold-hover text-black font-extrabold rounded-xl transition-all border border-amber-300/30 flex items-center justify-center gap-2 shadow-md shadow-black/40 text-sm uppercase tracking-wide cursor-pointer active:scale-98"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Post Google Review Now</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Direct Link: g.page/r/CbX4mweMFKrTEBI/review</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
