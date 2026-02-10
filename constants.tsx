
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
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80'
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

export const QUOTATIONS: Quotation[] = [
  {
    vendorName: 'Divyanshi Hospitality',
    contactPerson: 'Rahul Sharma',
    phoneNumber: '+91 98765 43210',
    breakfast: 450,
    lunch: 900,
    dinner: 900,
    galaDinner: 1250,
    venueRental: 0,
    roomRate: 0,
    extraPax: 45,
    menuHighlights: ['Authentic Goan Fish Curry', 'Royal Veg Thali', 'Live Jalebi Counter']
  },
  {
    vendorName: 'Resorte Marinha Dourada',
    contactPerson: 'Maria Fernandes',
    phoneNumber: '+91 88888 77777',
    breakfast: 400,
    lunch: 800,
    dinner: 800,
    galaDinner: 2300,
    venueRental: 200000,
    roomRate: 3000,
    extraPax: 45,
    menuHighlights: ['Continental Buffet', 'Italian Pasta Station', 'Premium Bar Setup']
  }
];

export const ROOM_DATABASE: RoomDetail[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    roomNo: (101 + i).toString(),
    property: 'Villa-Pool' as const,
    title: i === 0 ? 'Heritage Master Suite' : `Poolside Suite ${101+i}`,
    type: 'Suite' as const,
    description: 'Breezy white architecture with direct veranda and pool access.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80',
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

export const COLORS = {
  gold: '#D4AF37',
  goldDeep: '#B8860B',
  sand: '#FEF9E7',
  sandDark: '#F3E5AB',
  text: '#2D2926',
  accent: '#7C2D12'
};
