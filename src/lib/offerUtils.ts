export interface Offer {
  id: string;
  enabled: boolean;
  title: string;
  subtitle?: string;
  description: string;
  discount?: string;
  price: number;
  oldPrice?: number;
  image: string;
  startDate: string; // ISO format or YYYY-MM-DD
  endDate: string;   // ISO format or YYYY-MM-DDTHH:mm:ss
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  features?: string[];
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSecondsLeft: number;
}

export function isOfferActive(offer: Offer, currentDate: Date = new Date()): boolean {
  if (!offer.enabled) return false;

  const start = new Date(offer.startDate).getTime();
  const end = new Date(offer.endDate).getTime();
  const now = currentDate.getTime();

  if (isNaN(start) || isNaN(end)) return false;

  return now >= start && now <= end;
}

export function calculateTimeLeft(endDateStr: string, currentDate: Date = new Date()): CountdownTime {
  const target = new Date(endDateStr).getTime();
  const now = currentDate.getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      totalSecondsLeft: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSecondsLeft: Math.floor(diff / 1000),
  };
}

export function getActiveOffers(offers: Offer[], currentDate: Date = new Date()): Offer[] {
  return offers.filter((offer) => isOfferActive(offer, currentDate));
}
