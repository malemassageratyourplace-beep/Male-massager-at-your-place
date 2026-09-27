export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  duration: string;
  image: string;
  includesExtraService?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  duration: string;
  clientName: string;
  whatsappNumber: string;
  address: string;
  clientAge?: number;
  gender?: 'Female' | 'Male' | 'Single Lady' | 'Single Mom' | 'Shemale' | string;
  maritalStatus?: string;
  occupation?: string;
  paymentMethod: string;
  advancePaid?: number;
  remainingAmount?: number;
  travelCharge?: number;
  utrNumber: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  createdAt: string;
  cancelReason?: string;
  cancelUpiId?: string;
  discount?: number;
  discountReason?: string;
  originalPrice?: number;
  googleReviewClaimed?: boolean;
  googleReviewName?: string;
  requestedDate?: string;
  requestedTimeSlot?: string;
  customerPreferredTime?: string;
  scheduledTime?: string;
  confirmedDate?: string;
  confirmedTimeSlot?: string;
  wantExtraService?: boolean;
  extraServiceNote?: string;
  adminDeleted?: boolean;
  customerDeleted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
