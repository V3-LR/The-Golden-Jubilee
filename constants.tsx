
import { Guest, Budget, RoomDetail, Quotation, EventFunction } from './types';

export const EVENT_CONFIG = {
  title: "50th Anniversary",
  subTitle: "Mummy & Papa ki 50vi Saalgira",
  location: "Goa, India",
  theme: "Sunehri Saalgira (Golden Jubilee)",
  fullAccessCode: "18042026",
  guestAccessCode: "000000"
};

export const ITINERARY: EventFunction[] = [
  {
    id: 'evt-1',
    title: 'Welcome Sundowner (Padhariye!)',
    date: 'April 17, 2026',
    time: '5:00 PM onwards',
    location: 'Poolside Veranda, Villa A',
    dressCode: 'Resort Chic / Tropical',
    description: 'A relaxed sunset gathering with Goan appetizers and cocktails to kick off the celebration. Chai, Nashta aur Gupshup!',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-2',
    title: 'Sangeet & Cocktail Night (Raunak-e-Mehfil)',
    date: 'April 17, 2026',
    time: '8:00 PM onwards',
    location: 'Grand Hall, Red Villa',
    dressCode: 'Indo-Western Glitz',
    description: 'Family performances, dancing with DJ Savio, and a gala dinner spread. Nach Gaana aur Thoda Shaur!',
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-3',
    title: 'Jubilee Breakfast (Shubh Prabhat)',
    date: 'April 18, 2026',
    time: '9:00 AM - 11:00 AM',
    location: 'Estate Lawn',
    dressCode: 'Casual White',
    description: 'A traditional Goan breakfast setup under the morning sun. Garam Nashta aur Taazi Hawa.',
    image: 'https://images.unsplash.com/photo-1496044530011-c34f12be85b3?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-4',
    title: 'Golden Gala Dinner (Sunehri Shaam)',
    date: 'April 18, 2026',
    time: '7:30 PM onwards',
    location: 'Marinha Dourada Ballroom',
    dressCode: 'Formal Gold & Ivory',
    description: 'The main anniversary event featuring the milestone film, speeches, and the grand jubilee cake. Shandaar Jashn!',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80'
  }
];

export const INITIAL_GUESTS: Guest[] = Array.from({ length: 45 }, (_, i) => ({
  id: `guest-${i + 1}`,
  name: i < 3 ? ['Mom', 'Dad', 'Nisha'][i] : `Guest ${i + 1}`,
  category: i < 2 ? 'VIP' : (i === 2 ? 'Planner' : 'Family'),
  side: i === 0 || i === 1 || i === 2 ? 'Common' : (i % 2 === 0 ? 'Ladkewale' : 'Ladkiwale'),
  property: i < 10 ? 'Villa-Pool' : (i < 15 ? 'Villa-Hall' : (i < 30 ? 'Resort' : 'TreeHouse')),
  roomNo: (i < 10 ? 101 + i : (i < 15 ? 201 + (i-10) : (i < 30 ? 301 + (i-15) : 401 + (i-30)))).toString(),
  dietaryNote: i === 0 ? 'No Spicy' : (i === 1 ? 'Diabetic' : 'Standard'),
  sangeetAct: i === 0 ? 'Main Dance' : (i === 1 ? 'Speech' : (i === 2 ? 'MC' : 'TBD')),
  pickupScheduled: true,
  status: 'Pending',
  dressCode: 'Gold/Ivory',
  mealPlan: {
    lunch17: 'Goan Buffet',
    dinner18: 'Royal Thali'
  }
}));

export const ROOM_DATABASE: RoomDetail[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    roomNo: (101 + i).toString(),
    property: 'Villa-Pool' as const,
    title: i === 0 ? 'Heritage Master Suite' : `Poolside Suite ${101+i}`,
    type: 'Suite' as const,
    description: 'Breezy white architecture with direct veranda and pool access.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80',
    amenities: ['Pool Access', 'AC', 'Four Poster Bed']
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    roomNo: (201 + i).toString(),
    property: 'Villa-Hall' as const,
    title: i === 0 ? 'Grand Hall Suite' : `Red Villa Room ${201+i}`,
    type: 'Master' as const,
    description: 'Classic red facade heritage villa with massive interior hall and balconies.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    amenities: ['Hall Access', 'Balcony', 'Heritage Decor']
  }))
];

// Fix: Define and export QUOTATIONS which is used in BudgetTracker.tsx
export const QUOTATIONS: Quotation[] = [
  {
    vendorName: 'Divyanshi Catering & Events',
    contactPerson: 'Ms. Divyanshi',
    phoneNumber: '+91 98765 43210',
    breakfast: 450,
    lunch: 850,
    dinner: 1200,
    galaDinner: 2500,
    venueRental: 50000,
    roomRate: 0,
    extraPax: 1500,
    menuHighlights: ['Authentic Goan Thali', 'Live Seafood Counter', 'Heritage Sweets']
  },
  {
    vendorName: 'Marinha Dourada Resort',
    contactPerson: 'Manager Joseph',
    phoneNumber: '+91 832 227 0000',
    breakfast: 600,
    lunch: 1100,
    dinner: 1500,
    galaDinner: 3000,
    venueRental: 150000,
    roomRate: 4500,
    extraPax: 2000,
    menuHighlights: ['Continental Buffet', 'Poolside BBQ', 'Exotic Cocktails']
  },
  {
    vendorName: 'TreeHouse Nova',
    contactPerson: 'Front Desk',
    phoneNumber: '+91 77700 11122',
    breakfast: 350,
    lunch: 700,
    dinner: 1000,
    galaDinner: 2000,
    venueRental: 25000,
    roomRate: 3500,
    extraPax: 1200,
    isAlaCarte: true,
    menuHighlights: ['Boutique Breakfast', 'Local Cafreal', 'Sunset Snacks']
  }
];

export const INITIAL_BUDGET: Budget = {
  totalBudget: 400000,
  villaRate: 18000,
  villaNights: 2,
  djRate: 5000,
  djNights: 2,
  photoRate: 5000,
  decorRate: 30000,
  furnitureRate: 10000,
  bartenderRate: 3000,
  accessoriesRate: 2000,
  finalCateringPax: 45
};
