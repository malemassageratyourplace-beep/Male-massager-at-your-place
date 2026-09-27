import React, { useState, useEffect } from 'react';
import { SERVICES, MOCK_REVIEWS, FAQS } from '../data';
import { Review, Service } from '../types';
import { Star, Clock, ChevronDown, ChevronUp, User, ExternalLink, Gift, Sparkles, MessageSquareHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GoogleReviewAd from './GoogleReviewAd';
import GoaServiceSection from './GoaServiceSection';
import heroHomeImg from '../assets/images/hero_home_massage_1783022009442.jpg';

interface HomeSectionProps {
  onBookService: (service: Service, wantExtra?: boolean) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const hoverScaleImage = {
  hover: { scale: 1.06, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

export default function HomeSection({ onBookService }: HomeSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Load reviews from local storage, or fall back to mock ones
  useEffect(() => {
    const loadReviews = () => {
      try {
        const stored = localStorage.getItem('mth_reviews');
        if (stored) {
          setReviews(JSON.parse(stored));
        } else {
          localStorage.setItem('mth_reviews', JSON.stringify(MOCK_REVIEWS));
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
        setReviews(MOCK_REVIEWS);
      }
    };

    loadReviews();
    window.addEventListener('reviewsUpdated', loadReviews);
    return () => window.removeEventListener('reviewsUpdated', loadReviews);
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    localStorage.setItem('mth_reviews', JSON.stringify(updated));
    setReviews(updated);
    
    // Dispatch event to keep other instances in sync (if any)
    window.dispatchEvent(new Event('reviewsUpdated'));

    // Reset form
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setShowReviewForm(false);
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const renderWithServiceHighlights = (text: string) => {
    const addedText = "If you book the full-night service, you get a golden opportunity to enjoy the service three times throughout the night; so, what are you waiting for? Book the full-night service now and enjoy the experience all night long.";
    if (text.includes(addedText)) {
      const parts = text.split(addedText);
      return (
        <>
          {parts[0]}
          <span className="font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent box-decoration-clone">
            {addedText}
          </span>
          {parts.slice(1).join(addedText)}
        </>
      );
    }
    const regex = /('Luxury Full Body Massage'|'Special Full Night VIP Service'|'Special Full Night VIP'|Luxury Full Body massage|Luxury Full Body Massage|Luxury Full Body|Special Full Night VIP Service|Special Full Night VIP|VIP Full Night|Head Massage|Premium Thai Massage|Premium Thai|Targeted Shoulder massage|Targeted Shoulder Massage|targeted shoulder massage|Targeted Shoulder|Deep Back Massage|Deep Back|deep tissue massages|Premium Deep Tissue massage|deep tissue|male massager at your place|male massager|extra services|extra service|full[- ]night service|full[- ]body massage)/gi;
    const testRegex = /('Luxury Full Body Massage'|'Special Full Night VIP Service'|'Special Full Night VIP'|Luxury Full Body massage|Luxury Full Body Massage|Luxury Full Body|Special Full Night VIP Service|Special Full Night VIP|VIP Full Night|Head Massage|Premium Thai Massage|Premium Thai|Targeted Shoulder massage|Targeted Shoulder Massage|targeted shoulder massage|Targeted Shoulder|Deep Back Massage|Deep Back|deep tissue massages|Premium Deep Tissue massage|deep tissue|male massager at your place|male massager|extra services|extra service|full[- ]night service|full[- ]body massage)/i;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (testRegex.test(part)) {
        return (
          <span key={i} className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden text-center py-16 md:py-28 mb-16 border border-gold/25 bg-[#14151a] shadow-xl shadow-black/50">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            src={heroHomeImg}
            alt="Exclusive Doorstep Massage Therapy"
            className="w-full h-full object-cover filter brightness-[0.38] contrast-[0.98]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0e0f12]/60" />
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 space-y-6 flex flex-col items-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center leading-tight"
          >
            Welcome to Exclusive Relaxation. <br />
            <motion.span 
              variants={fadeInUp}
              className="bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent font-serif italic text-2xl md:text-4xl lg:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-2 inline-block"
            >
              Male massager at your place.
            </motion.span>
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-base md:text-lg lg:text-xl text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-4"
          >
            Premium doorstep massage therapy curated exclusively for females and single ladies. Experience ultimate tranquility in the comfort of your own space.
          </motion.p>
          <motion.div variants={fadeInUp} className="pt-4">
            <button
              onClick={() => {
                const servicesSec = document.getElementById('services-section');
                if (servicesSec) {
                  servicesSec.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black font-bold rounded-full transition-all border border-amber-300/30 shadow-md shadow-black/40 text-sm md:text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore modalities
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Services Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="services-section" 
        className="space-y-10 scroll-mt-20"
      >
        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4"
        >
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
              Our Premium Services
            </h2>
            <p className="text-xs text-zinc-400">
              Doorstep professional therapy with certified male therapists
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-white text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300">Special Offer:</span>
            <span className="bg-emerald-700 text-white px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide border border-emerald-400/30">
              Flat ₹1,000 OFF
            </span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeInUp}
              whileHover="hover"
              className="rounded-2xl border border-border/50 hover:border-gold/40 transition-all group flex flex-col overflow-hidden bg-card shadow-lg shadow-black/40"
            >
              <div className="h-64 relative overflow-hidden bg-zinc-900">
                <motion.img
                  variants={hoverScaleImage}
                  src={service.image}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[0.98]"
                  referrerPolicy="no-referrer"
                />
                {/* 1000 OFF floating badge - matte green & white offer styling */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md shadow-black/60 uppercase tracking-tight border border-emerald-400/40">
                    <Sparkles className="w-3 h-3 text-white" />
                    ₹1,000 OFF
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="space-y-4 mb-6 flex-1">
                  <h3 className="text-2xl font-extrabold w-fit inline-block bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-yellow-200 transition-all tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                    {renderWithServiceHighlights(service.description)}
                  </p>

                  {/* Included Extra Service Available Badge */}
                  {service.includesExtraService && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 bg-amber-950/30 border border-gold/30 text-gold text-xs px-3 py-1.5 rounded-full font-bold tracking-wide shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                        {service.id === 'vip-full-night' ? (
                          <>
                            <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                              Extra Service
                            </span>{' '}
                            Included (As You Want • 100% Full Satisfaction)
                          </>
                        ) : (
                          <>
                            Included{' '}
                            <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
                              Extra Service
                            </span>{' '}
                            Available
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <div className="flex items-center text-sm md:text-base font-bold text-white bg-gold/15 px-4 py-2 rounded-full border border-gold/30 shadow-sm">
                      <Clock className="w-4.5 h-4.5 mr-2 text-gold shrink-0" />
                      <span>{service.duration}</span>
                    </div>
                    
                    {/* Price Tag with Struck-Through Original Price & Green/White Offer Price */}
                    <div className="flex items-center gap-2.5 bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/50 font-mono shadow-md">
                      {service.originalPrice && service.originalPrice > service.price && (
                        <span className="line-through text-zinc-400 text-sm md:text-base font-semibold">
                          ₹{service.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-base md:text-xl font-black text-white bg-emerald-600 px-3.5 py-1 rounded-full border border-emerald-400/40 shadow-sm">
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 shrink-0">
                  <button
                    onClick={() => onBookService(service)}
                    className="w-full flex items-center justify-center p-3.5 text-base bg-gold hover:bg-gold-hover text-black font-bold rounded-xl transition-all border border-amber-300/30 shadow-md shadow-black/40 cursor-pointer active:scale-[0.98]"
                  >
                    Book Now (Save ₹1,000)
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2.2 Goa Specialized Outcall & Custom Extra Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        id="goa-section"
      >
        <GoaServiceSection onBookService={onBookService} />
      </motion.section>

      {/* 2.5 Google Business Review Advertisement & ₹500 Discount Banner */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
      >
        <GoogleReviewAd />
      </motion.section>

      {/* 3. Reviews Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="space-y-10 pt-12 border-t border-border/50"
      >
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-zinc-800 shrink-0"
                    style={{ zIndex: 10 - idx }}
                  >
                    <User className="w-4 h-4 text-gold" />
                  </div>
                ))}
              </div>
              <span className="text-zinc-300 font-medium ml-2 bg-gold/10 px-3 py-1 rounded-full border border-gold/20 text-sm">
                <strong className="text-gold">1,000+</strong> 5-Star Reviews
              </span>
              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                Google 5-Star Offer: ₹500 OFF
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
              Trusted by over 1,000+ happy clients
            </h2>
            <p className="text-sm text-zinc-400">
              Massage therapist at your place would love your feedback. Post a review to our Google profile for ₹500 discount!
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Google Business Direct Link */}
            <a
              href="https://g.page/r/CbX4mweMFKrTEBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-black font-extrabold rounded-xl border border-amber-300/30 shadow-md shadow-black/40 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Review on Google (Get ₹500)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium rounded-xl transition-all border border-border/50 text-xs cursor-pointer"
            >
              {showReviewForm ? 'Cancel' : 'Write Quick Feedback'}
            </button>
          </div>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 bg-card border border-border/50 rounded-2xl overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Name / Initials</label>
                  <input
                    required
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Anjali S."
                    className="w-full bg-zinc-900/50 border border-border p-3 rounded-xl focus:outline-none focus:border-gold/50 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        className="focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            val <= reviewRating ? 'fill-gold text-gold' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Your Review</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How was your massage experience?"
                    className="w-full bg-zinc-900/50 border border-border p-3 rounded-xl focus:outline-none focus:border-gold/50 text-white resize-none h-24 placeholder:text-zinc-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 9).map((rev) => (
            <motion.div
              key={rev.id}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card border border-border/50 p-6 rounded-2xl hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-4 h-4 ${
                      starIdx < rev.rating ? 'fill-gold text-gold' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4 italic">
                "{renderWithServiceHighlights(rev.comment)}"
              </p>
              <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{rev.name}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(rev.date).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. Accordion FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="faq-section" 
        className="space-y-10 pt-12 border-t border-border/50 scroll-mt-20"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Common questions about our therapy services, areas covered, and booking process.
          </p>
        </motion.div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {FAQS.map((faq, i) => {
            const isOpen = activeFaqIndex === i;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="border border-border/50 rounded-xl bg-card overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-gold transition-colors">
                    {renderWithServiceHighlights(faq.question)}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gold" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400 group-hover:text-gold transition-colors" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-border/20 text-sm md:text-base text-zinc-300 leading-relaxed bg-zinc-950/20">
                        {renderWithServiceHighlights(faq.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

    </div>
  );
}
