export const site = {
  name: "Zaiqa",
  suffix: "Kitchen & Grill",
  tagline: "Charcoal, spice and unhurried time",
  established: 2014,
  blurb:
    "A family-run kitchen serving the food we grew up eating — slow-cooked karahi, dum biryani and bread pulled straight off the tandoor wall.",
  address: {
    line1: "14-C, Bukhari Commercial Lane 6",
    line2: "Khayaban-e-Shahbaz, DHA Phase VI",
    city: "Karachi, Pakistan",
  },
  phone: "+92 300 4451 220",
  whatsapp: "+92 300 4451 220",
  email: "table@zaiqa.pk",
  reservationsEmail: "reservations@zaiqa.pk",
  eventsEmail: "events@zaiqa.pk",
  deliveryFee: 180,
  freeDeliveryOver: 2500,
  deliveryRadius: "Within 9 km of DHA Phase VI",
  hours: [
    { day: "Monday", value: "Closed" },
    { day: "Tuesday – Thursday", value: "12:00 PM – 11:30 PM" },
    { day: "Friday", value: "12:00 PM – 1:00 AM" },
    { day: "Saturday – Sunday", value: "11:00 AM – 1:00 AM" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TripAdvisor", href: "https://tripadvisor.com" },
  ],
  mapQuery:
    "https://www.google.com/maps?q=Khayaban-e-Shahbaz+DHA+Phase+6+Karachi&output=embed",
};

export const occasions = [
  "Just dinner",
  "Birthday",
  "Anniversary",
  "Business meal",
  "Family gathering",
  "Engagement",
];

export const seatingOptions = [
  "No preference",
  "Ground floor",
  "Mezzanine",
  "Terrace",
  "Chef's counter",
  "Private room",
];

export const timeSlots = [
  "12:30 PM",
  "1:30 PM",
  "2:30 PM",
  "6:30 PM",
  "7:30 PM",
  "8:30 PM",
  "9:30 PM",
  "10:30 PM",
];

export const pickupSlots = [
  "As soon as possible",
  "In 30 minutes",
  "In 1 hour",
  "In 2 hours",
  "Tonight after 9 PM",
];

export const reservationPolicies = [
  "Tables are held for 20 minutes past the booking time.",
  "Parties of 9 or more are handled by our events desk — call us directly.",
  "Sheesha-free, family-friendly seating on both floors.",
  "Tell us about allergies in the notes and the kitchen will adapt the dish.",
];

export const orderPolicies = [
  "Delivery available within 9 km of DHA Phase VI.",
  "Free delivery on orders above Rs 2,500.",
  "Naan travels in paper, never foil, so it reaches you warm.",
  "Cash on delivery, card on pickup, or bank transfer.",
];

export const eventTypes = [
  "Nikkah & wedding",
  "Mehndi",
  "Corporate dinner",
  "Birthday",
  "Aqiqa",
  "Kitty party",
  "Outdoor catering",
];

export const budgets = [
  "Rs 1,500 – 2,000 per head",
  "Rs 2,000 – 3,000 per head",
  "Rs 3,000 – 4,500 per head",
  "Rs 4,500+ per head",
  "Not sure yet",
];

export const eventPackages = [
  {
    name: "The Family Table",
    guests: "20 – 60 guests",
    price: "From Rs 2,200 / head",
    includes: [
      "Four mains + two rice dishes",
      "Unlimited bread service",
      "Two starters and one dessert",
      "Soft drinks and chai station",
      "Dedicated server for every 12 guests",
    ],
    featured: false,
  },
  {
    name: "The Daawat",
    guests: "60 – 250 guests",
    price: "From Rs 3,400 / head",
    includes: [
      "Live tandoor counter on site",
      "Six mains including mutton karahi",
      "Three starters and a chaat station",
      "Dessert bar with kulfi and kheer",
      "Full crockery, staffing and setup",
      "Menu tasting for six people",
    ],
    featured: true,
  },
  {
    name: "The Shaadi",
    guests: "250 – 800 guests",
    price: "Talk to us",
    includes: [
      "Full site survey and floor plan",
      "Custom menu designed with Amna",
      "Live karahi, biryani and BBQ counters",
      "Waiter service at 1:8 ratio",
      "Lighting, linens and staging partners",
      "Dedicated event manager on the day",
    ],
    featured: false,
  },
];

export const venueSpaces = [
  {
    name: "The Terrace",
    capacity: "40 seated",
    note: "Open air, string lights, best October to March.",
  },
  {
    name: "Mezzanine Hall",
    capacity: "70 seated",
    note: "Own bar and washroom. Ideal for milestone birthdays.",
  },
  {
    name: "Private Room",
    capacity: "12 seated",
    note: "Closed doors, own service team, no waiting.",
  },
  {
    name: "Full Buyout",
    capacity: "160 standing",
    note: "Both floors plus terrace, exclusively yours.",
  },
];

export function formatPrice(value: number) {
  return `Rs ${value.toLocaleString("en-PK")}`;
}

export function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function todayISO() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
