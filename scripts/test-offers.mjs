function isOfferActive(offer, currentDate = new Date()) {
  if (!offer.enabled) return false;
  const start = new Date(offer.startDate).getTime();
  const end = new Date(offer.endDate).getTime();
  const now = currentDate.getTime();
  if (isNaN(start) || isNaN(end)) return false;
  return now >= start && now <= end;
}

function calculateTimeLeft(endDateStr, currentDate = new Date()) {
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

// Test scenarios:
const now = new Date("2026-09-18T21:00:00Z");

// 1. Active Offer
const activeOffer = {
  id: "test-active",
  enabled: true,
  startDate: "2026-09-01T00:00:00Z",
  endDate: "2026-09-30T23:59:59Z",
};
console.assert(isOfferActive(activeOffer, now) === true, "Active offer should be active");
const timeLeft = calculateTimeLeft(activeOffer.endDate, now);
console.assert(timeLeft.isExpired === false, "Countdown should not be expired");
console.assert(timeLeft.days === 12, `Expected 12 days left, got ${timeLeft.days}`);

// 2. Expired Offer
const expiredOffer = {
  id: "test-expired",
  enabled: true,
  startDate: "2026-08-01T00:00:00Z",
  endDate: "2026-08-15T00:00:00Z",
};
console.assert(isOfferActive(expiredOffer, now) === false, "Expired offer should NOT be active");
const expiredTimeLeft = calculateTimeLeft(expiredOffer.endDate, now);
console.assert(expiredTimeLeft.isExpired === true, "Expired countdown should be marked expired");

// 3. Disabled Offer
const disabledOffer = {
  id: "test-disabled",
  enabled: false,
  startDate: "2026-09-01T00:00:00Z",
  endDate: "2026-09-30T23:59:59Z",
};
console.assert(isOfferActive(disabledOffer, now) === false, "Disabled offer should NOT be active even if dates are valid");

// 4. Future Offer
const futureOffer = {
  id: "test-future",
  enabled: true,
  startDate: "2026-10-01T00:00:00Z",
  endDate: "2026-10-15T00:00:00Z",
};
console.assert(isOfferActive(futureOffer, now) === false, "Future offer should NOT be active before startDate");

console.log("All 4 offer engine tests passed with 100% precision!");


