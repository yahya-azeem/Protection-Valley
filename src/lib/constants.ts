// ─── Centralized Business Constants ──────────────────────────
// All hardcoded business values live here for easy updates.

export const BUSINESS = {
  name: 'Protection Valley',
  tagline: 'Premium Workgear',
  established: 2025,
  address: {
    street: '11456 Harry Hines Blvd #103',
    city: 'Dallas',
    state: 'TX',
    zip: '75229',
    full: '11456 Harry Hines Blvd #103, Dallas, TX 75229',
  },
  phone: '(469) 305-1119',
  email: 'HQ@PROTECTIONVALLEY.COM',
  hours: 'Mon – Fri, 08:00 – 18:00 CST',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3351.3!2d-96.8903!3d32.8738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9f032b4a6c7b%3A0x1234567890abcdef!2s11456+Harry+Hines+Blvd+%23103%2C+Dallas%2C+TX+75229!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
} as const;

export const CATEGORIES = [
  'All',
  'Tool Belts & Pouches',
  'Work Gloves',
  'Boxing & MMA',
  'Welding Gear',
  'Outdoor & Equestrian',
  'Tools & Hardware',
  'Suspenders',
  'Safety & Workwear',
  'Accessories',
  'Fitness & Lifting',
  'Other'
];

export const NAV_ITEMS = [
  { name: 'Home', id: 'home' },
  {
    name: 'Catalog',
    id: 'catalog',
    children: [
      { name: 'All Products', category: 'All' },
      { name: 'Tool Belts & Pouches', category: 'Tool Belts & Pouches' },
      { name: 'Work Gloves', category: 'Work Gloves' },
      { name: 'Safety & Workwear', category: 'Safety & Workwear' },
    ],
  },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
] as const;

export const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: '$200+', min: 200, max: Infinity },
] as const;

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '9', '10', '50'] as const;

export const LEATHER_TYPES = [
  'Full Grain Cowhide',
  'Top Grain Cowhide',
  'Goatskin',
  'Buffalo',
  'Canvas',
  'Ballistic Nylon',
] as const;

export const WHOLESALE_DISCOUNT = 0.30; // 30% off retail
