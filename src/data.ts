import { Service, Review, FAQItem } from './types';

import headMassageImg from './assets/images/head_massage_service_1787650156345.jpg';
import thaiMassageImg from './assets/images/thai_stretching_massage_1783022063967.jpg';
import neckShoulderImg from './assets/images/neck_shoulder_massage_1783022050697.jpg';
import deepTissueImg from './assets/images/deep_tissue_massage_1783022029222.jpg';
import luxuryBodyImg from './assets/images/luxury_full_body_massage_1783022020154.jpg';
import vipOvernightImg from './assets/images/vip_overnight_massage_1783022075561.jpg';

export const SERVICES: Service[] = [
  {
    id: "head-massage",
    name: "Head Massage",
    description: "Therapeutic scalp, temple, and head acupressure using warm herbal oils to relieve stress, headaches, and mental fatigue.",
    price: 2499,
    originalPrice: 3499,
    discountAmount: 1000,
    duration: "40 Min",
    image: headMassageImg
  },
  {
    id: "premium-thai",
    name: "Premium Thai Massage",
    description: "Traditional passive stretching and deep pressure for full body rejuvenation.",
    price: 3499,
    originalPrice: 4499,
    discountAmount: 1000,
    duration: "60 Min",
    image: thaiMassageImg
  },
  {
    id: "targeted-shoulder",
    name: "Targeted Shoulder Massage",
    description: "Focused relief on neck and shoulder tension to melt away daily stress.",
    price: 3499,
    originalPrice: 4499,
    discountAmount: 1000,
    duration: "60 Min",
    image: neckShoulderImg
  },
  {
    id: "deep-back",
    name: "Deep Back Massage",
    description: "Intense tissue manipulation directly targeting chronic back pain and knots.",
    price: 3499,
    originalPrice: 4499,
    discountAmount: 1000,
    duration: "60 Min",
    image: deepTissueImg
  },
  {
    id: "luxury-full-body",
    name: "Luxury Full Body Massage",
    description: "Head-to-toe premium massage using warm aromatic oils for ultimate relaxation. Includes extra service available in this package at no additional cost.",
    price: 5499,
    originalPrice: 6499,
    discountAmount: 1000,
    duration: "60 Min",
    image: luxuryBodyImg,
    includesExtraService: true
  },
  {
    id: "vip-full-night",
    name: "Special Full Night VIP Service",
    description: "Exclusive holistic overnight care with multiple massage sessions, priority service, and extra service included as you want with 100% full satisfaction. If you book the full-night service, you get a golden opportunity to enjoy the service three times throughout the night; so, what are you waiting for? Book the full-night service now and enjoy the experience all night long.",
    price: 9499,
    originalPrice: 10499,
    discountAmount: 1000,
    duration: "Overnight",
    image: vipOvernightImg,
    includesExtraService: true
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-1",
    name: "Sarah M.",
    rating: 5,
    comment: "Absolutely wonderful experience. Very professional and respectful. The targeted shoulder massage relieved weeks of tension.",
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "mock-2",
    name: "Priya K.",
    rating: 5,
    comment: "I booked the Luxury Full Body massage and it was heavenly. Having it in the comfort of my own home was a game changer.",
    date: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "mock-3",
    name: "Neha R.",
    rating: 5,
    comment: "Highly recommended! The therapist was extremely punctual and the pressure was exactly what I asked for. Feeling completely rejuvenated.",
    date: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: "mock-4",
    name: "Anita D.",
    rating: 5,
    comment: "Such a relaxing experience after a long week. Felt completely safe, comfortable, and respected throughout the session. 10/10.",
    date: new Date(Date.now() - 1296000000).toISOString()
  },
  {
    id: "mock-5",
    name: "Pooja S.",
    rating: 5,
    comment: "One of the best deep tissue massages I have ever had. All my lower back pain is gone. Very skillful and therapeutic.",
    date: new Date(Date.now() - 1555200000).toISOString()
  },
  {
    id: "mock-6",
    name: "Sonia T.",
    rating: 5,
    comment: "Excellent service. Very polite, clean, and carrying everything needed. Really felt like a luxury spa experience at home.",
    date: new Date(Date.now() - 1900800000).toISOString()
  },
  {
    id: "mock-7",
    name: "Megha V.",
    rating: 5,
    comment: "Booked the Premium Deep Tissue massage. Incredible attention to detail and so professional. Will be booking again next month!",
    date: new Date(Date.now() - 2419200000).toISOString()
  },
  {
    id: "mock-8",
    name: "Divya C.",
    rating: 5,
    comment: "The booking process was smooth and the actual massage was even better. Truly grateful for such a premium, trustworthy service.",
    date: new Date(Date.now() - 3024000000).toISOString()
  },
  {
    id: "mock-9",
    name: "Radhika N.",
    rating: 5,
    comment: "Five stars across the board! The environment felt incredibly safe and the massage techniques were exquisite. Highly endorse this service.",
    date: new Date(Date.now() - 3456000000).toISOString()
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Is Extra Service available, and which packages include it?",
    answer: "Yes, extra services are available! Please note that extra services are included exclusively with either the 'Luxury Full Body Massage' or the 'Special Full Night VIP' package. If you require extra services with any other package, an additional charge will apply. You can simply tick the 'I want extra service' option during booking."
  },
  {
    question: "How do I select the 'I want extra service' option?",
    answer: "When filling out the appointment booking form or booking via the Goa Doorstep Outcall section, simply tick the checkbox labeled 'I want extra service'. You can also specify any custom preferences or requirements in the Special Requests box."
  },
  {
    question: "How does the ₹500 Google Review discount work?",
    answer: "When you post a genuine 5-Star review with your comments on our official Google profile, you are eligible for Flat ₹500 physical cash discount. This discount is handed over directly to you in-person / in cash by the therapist during your session once you show your 5-Star rating."
  },
  {
    question: "Is doorstep male massager service available in Goa?",
    answer: "Yes, we provide professional doorstep outcall male massage therapy exclusively for women and single ladies across North and South Goa — including Candolim, Calangute, Baga, Anjuna, Vagator, Panaji, Porvorim, Morjim, Colva, and Margao at private villas, luxury resorts, hotels, and Airbnbs."
  },
  {
    question: "What service areas are covered?",
    answer: "We cover Goa (all areas including North & South Goa villas, resorts, and hotels) as well as major metropolitan partner cities. During the booking process, we collect your location and confirm exact therapist arrival time."
  },
  {
    question: "What is the therapist's background?",
    answer: "Our therapist is a certified professional with extensive training in deep tissue, Swedish, and relaxation massage techniques, specializing in providing premium, respectful, and completely professional services in the comfort of your home."
  },
  {
    question: "Is the service strictly professional?",
    answer: "Absolutely. Our services are strictly therapeutic and professional. We maintain the highest standards of decorum and focus entirely on providing a premium relaxation experience."
  },
  {
    question: "How do I ensure my booking is confirmed?",
    answer: "After selecting a service and completing the payment step (by uploading your proof of payment), you will receive a Booking ID. Your booking is confirmed once our admin verifies the payment. You can track your status on the Tracker page."
  },
  {
    question: "Can I shower before or after the massage?",
    answer: "We highly recommend taking a warm shower before the session to relax your muscles and prepare your skin for the massage oils. After the massage, you may prefer to leave the nourishing oils on your skin for an hour before showering."
  },
  {
    question: "What items do I need to provide?",
    answer: "You only need to provide a comfortable space (bed or floor setup) and a couple of soft towels. We bring our own premium massage oils and necessary equipment."
  }
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
  "07:30 PM",
  "09:00 PM"
];
