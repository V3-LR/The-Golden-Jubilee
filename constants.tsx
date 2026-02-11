import { Guest, Budget, RoomDetail, Quotation, EventFunction, Task } from './types';

export const EVENT_CONFIG = {
  title: "50th Anniversary of Mummy & Papa",
  subTitle: "Mummy & Papa ki 50vi Saalgira",
  location: "Arossim, Goa",
  theme: "Sunehri Saalgira (Golden Jubilee)",
  fullAccessCode: "18042026",
  guestAccessCode: "000000"
};

export const PROPERTY_LOCATIONS = {
  FAMILY_ESTATE: {
    name: "Lilia by Rustic Roofs",
    address: "8VQX+WVJ, Arossim, Goa 403712",
    mapLink: "https://maps.app.goo.gl/JxgefAuSutBzo5hb7"
  },
  RESORT: {
    name: "Marinha Dourada Resort",
    address: "Arpora, Goa 403509",
    mapLink: "https://maps.app.goo.gl/H8YvM6XvN2C2"
  }
};

export const ITINERARY: EventFunction[] = [
  {
    id: 'evt-1',
    title: 'Welcome Sundowner',
    date: 'April 17, 2026',
    time: '5:00 PM',
    location: 'Poolside Veranda',
    dressCode: 'Resort Chic',
    description: 'A relaxed sunset gathering with Goan appetizers.',
    image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-2',
    title: 'Sangeet Night',
    date: 'April 17, 2026',
    time: '8:00 PM',
    location: 'Grand Hall, Red Villa',
    dressCode: 'Indo-Western Glitz',
    description: 'Family performances and DJ Savio.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'
  }
];

export const ROOM_DATABASE: RoomDetail[] = [
  ...[101, 102, 103, 104, 105].map(num => ({
    roomNo: String(num),
    property: "Villa-Pool" as const,
    title: num === 101 ? "Heritage Master Suite" : `Luxury Room ${num}`,
    description: "Elegant pool-facing room in Villa A.",
    image: "https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80",
    type: (num === 101 ? "Master" : "Standard") as RoomDetail['type'],
    amenities: ["AC", "En-suite Bath"]
  }))
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'guest-mom',
    name: 'Mummy',
    category: 'VIP',
    side: 'Common',
    property: 'Villa-Pool',
    roomNo: '101',
    dietaryNote: 'Pure Veg',
    sangeetAct: 'Guest of Honor',
    pickupScheduled: true,
    status: 'Confirmed',
    dressCode: 'Golden Saree',
    mealPlan: { lunch17: 'Special Thali', dinner18: 'Royal Gala' }
  },
  {
    id: 'guest-papa',
    name: 'Papa',
    category: 'VIP',
    side: 'Common',
    property: 'Villa-Pool',
    roomNo: '101',
    dietaryNote: 'Standard Veg',
    sangeetAct: 'Guest of Honor',
    pickupScheduled: true,
    status: 'Confirmed',
    dressCode: 'Bandhgala',
    mealPlan: { lunch17: 'Special Thali', dinner18: 'Royal Gala' }
  },
  ...Array.from({ length: 43 }, (_, i) => ({
    id: `guest-${i + 1}`,
    name: i === 0 ? 'Nisha' : `Guest ${i + 1}`,
    category: i === 0 ? 'Planner' : 'Friend' as any,
    side: i % 2 === 0 ? 'Ladkewale' : 'Ladkiwale' as any,
    property: 'Villa-Pool' as any,
    roomNo: '102',
    dietaryNote: 'Standard Veg',
    sangeetAct: 'TBD',
    pickupScheduled: false,
    status: 'Pending' as any,
    dressCode: 'Glitz',
    mealPlan: { lunch17: 'Goan Buffet', dinner18: 'Royal Thali' }
  }))
];

export const INITIAL_BUDGET: Budget = {
  totalBudget: 400000,
  villaRate: 65000,
  villaNights: 2,
  djRate: 35000,
  djNights: 1,
  photoRate: 45000,
  decorRate: 50000,
  furnitureRate: 15000,
  bartenderRate: 10000,
  accessoriesRate: 5000,
  finalCateringPax: 0,
  finalizedVendors: [],
  committedSpend: 0,
  selectedPath: 'TBD',
  wishlistItems: [
    { id: 'w-1', label: 'Extra LED Flooring (Sisters\' Request)', cost: 25000, category: 'Wishlist', lead: 'Brother' },
    { id: 'w-2', label: 'Bollywood Props Pkg', cost: 12000, category: 'Wishlist', lead: 'Planner' },
    { id: 'w-3', label: 'Imported Flower Upgrade', cost: 45000, category: 'Wishlist', lead: 'Brother' }
  ]
};

export const QUOTATIONS: Quotation[] = [
  {
    vendorName: "Bespoke Villa Catering",
    contactPerson: "Divyanshi Sharma",
    phoneNumber: "+91 9876543210",
    breakfast: 450,
    lunch: 850,
    dinner: 1250,
    galaDinner: 2200,
    venueRental: 40000,
    roomRate: 0,
    extraPax: 1500,
    menuHighlights: ["Lobster Thermidor", "Heritage Bebinca"],
    effortScore: 'High'
  },
  {
    vendorName: "Full-Resort Package",
    contactPerson: "Xavier D'Souza",
    phoneNumber: "+91 9123456789",
    breakfast: 850,
    lunch: 1500,
    dinner: 2500,
    galaDinner: 4500,
    venueRental: 150000,
    roomRate: 8500,
    extraPax: 3000,
    menuHighlights: ["Serradura", "Chicken Xacuti"],
    effortScore: 'Low'
  }
];

export const VILLA_TASKS: Task[] = [
  {
    id: 'vt-1',
    title: 'Power Backup & DJ Supply Check',
    description: 'Verify if Lilia has sufficient phase power for Savio\'s sound rig. Rent 15kva generator if needed.',
    owner: 'Brother',
    status: 'Pending',
    category: 'Logistics'
  },
  {
    id: 'vt-2',
    title: 'Caterer Water & Prep Space Audit',
    description: 'Ensure Villa prep area has running water and drainage for the catering team.',
    owner: 'Brother',
    status: 'Pending',
    category: 'Catering'
  },
  {
    id: 'vt-3',
    title: 'Google Map Pin Verification',
    description: 'Check if the "Lilia" pin is accurate for all 45 guests. Send voice-note with entrance directions.',
    owner: 'Planner',
    status: 'Pending',
    category: 'Logistics'
  },
  {
    id: 'vt-4',
    title: 'Extra Helper/Runner Hiring',
    description: 'Hire 2 local boys to help with table movements and guest concierge on 18th morning.',
    owner: 'Husband',
    status: 'Pending',
    category: 'Logistics'
  },
  {
    id: 'vt-5',
    title: 'Edison Bulb & Fairy Light Upgrade',
    description: 'Finalize the layout for the sunset vows. Reinvesting ₹30k from savings into "Rich" lighting.',
    owner: 'Brother',
    status: 'Pending',
    category: 'Decor'
  },
  {
    id: 'vt-6',
    title: 'Elder Preference Briefing',
    description: 'Brief catering on specific tea timings and less-spice preferences for Mummy and Papa.',
    owner: 'Planner',
    status: 'Pending',
    category: 'Catering'
  }
];