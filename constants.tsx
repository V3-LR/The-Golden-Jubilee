import { Guest, Budget, RoomDetail, Quotation, EventFunction, Task, DietaryPreference } from './types';

export const EVENT_CONFIG = {
  title: "50th Anniversary of Mummy & Papa",
  subTitle: "Mummy & Papa ki 50vi Saalgira",
  location: "Arossim, Goa",
  theme: "Sunehri Saalgira (Golden Jubilee)",
  fullAccessCode: "18042026",
  guestAccessCode: "000000"
};

export const MEAL_CONFIG = {
  lunch17: "Arrival Lunch",
  dinner17: "Sangeet Dinner",
  lunch18: "Anniversary Lunch",
  gala18: "Gala Dinner"
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
  },
  {
    id: 'evt-3',
    title: 'Anniversary Lunch',
    date: 'April 18, 2026',
    time: '1:00 PM',
    location: 'Garden Lawns',
    dressCode: 'Pastel Formals',
    description: 'A traditional sit-down lunch to honor the journey.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-4',
    title: 'Gala Dinner',
    date: 'April 18, 2026',
    time: '8:00 PM',
    location: 'AC Ballroom, Resort',
    dressCode: 'Black Tie / Tuxedos',
    description: 'The grand finale celebration of 50 golden years.',
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
    dietaryPreference: 'Veg',
    welcomeDrinkPreference: 'Soft Beverage',
    sangeetAct: 'Guest of Honor',
    pickupScheduled: true,
    status: 'Confirmed',
    dressCode: 'Golden Saree',
    mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }
  },
  {
    id: 'guest-papa',
    name: 'Papa',
    category: 'VIP',
    side: 'Common',
    property: 'Villa-Pool',
    roomNo: '101',
    dietaryNote: 'Standard Veg',
    dietaryPreference: 'Veg',
    welcomeDrinkPreference: 'Soft Beverage',
    sangeetAct: 'Guest of Honor',
    pickupScheduled: true,
    status: 'Confirmed',
    dressCode: 'Bandhgala',
    mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }
  },
  ...Array.from({ length: 43 }, (_, i) => ({
    id: `guest-${i + 1}`,
    name: i === 0 ? 'Nisha' : `Guest ${i + 1}`,
    category: i === 0 ? 'Planner' : 'Friend' as any,
    side: i % 2 === 0 ? 'Ladkewale' : 'Ladkiwale' as any,
    property: 'Villa-Pool' as any,
    roomNo: '102',
    dietaryNote: 'Standard Veg',
    dietaryPreference: 'Veg' as DietaryPreference,
    welcomeDrinkPreference: 'Soft Beverage' as any,
    sangeetAct: 'TBD',
    pickupScheduled: false,
    status: 'Pending' as any,
    dressCode: 'Glitz',
    mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }
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
  finalCateringKidsPax: 0,
  barInventory: {
    urakLitres: 0,
    beerCases: 0,
    mixersCrates: 0
  },
  inventory: [
    { id: 'i-1', label: 'Bottled Water (250ml)', currentQuantity: 20, unit: 'Cases', category: 'Consumable', source: 'Vasco Wholesaler', cost: 6000, isPurchased: false },
    { id: 'i-2', label: 'Ice Blocks', currentQuantity: 200, unit: 'kg', category: 'Consumable', source: 'Local Delivery', cost: 4000, isPurchased: false }
  ],
  cateringBreakdown: {
    lunch17: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    dinner17: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    lunch18: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    gala18: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 }
  },
  finalizedVendors: [],
  committedSpend: 0,
  wishlistItems: [],
  selectedPath: 'TBD'
};

export const QUOTATIONS: Quotation[] = [
  {
    vendorName: "Rustic Roofs (Villa Path)",
    contactPerson: "Divyanshi",
    phoneNumber: "+91 98765 43210",
    breakfast: 450,
    lunch: 800,
    dinner: 1200,
    galaDinner: 1800,
    venueRental: 40000,
    roomRate: 15000,
    extraPax: 1500,
    menuHighlights: ["Prawn Balchao", "Mutton Rogan Josh", "Bebinca"],
    effortScore: "High"
  },
  {
    vendorName: "Marinha Dourada (Resort Path)",
    contactPerson: "Resort Manager",
    phoneNumber: "+91 91234 56789",
    breakfast: 650,
    lunch: 1200,
    dinner: 1800,
    galaDinner: 2500,
    venueRental: 200000,
    roomRate: 8000,
    extraPax: 2000,
    menuHighlights: ["Continental Buffet", "Thai Curry", "Live Pasta Station"],
    effortScore: "Low"
  }
];

export const VILLA_TASKS: Task[] = [
  {
    id: 'task-garnish',
    title: 'Welcome Bar Garnish Prep',
    description: 'Ensure fresh chilies, rock salt, and lemons are sliced and ready at the Urak station by 11:00 AM on the 17th.',
    owner: 'Brother',
    status: 'Pending',
    category: 'Catering',
    cost: 3000
  },
  {
    id: 'task-1',
    title: 'Dabolim Pickup Sync',
    description: 'Coordinate with husband for early morning arrivals.',
    owner: 'Husband',
    status: 'Pending',
    category: 'Logistics',
    cost: 5000
  },
  {
    id: 'task-2',
    title: 'DJ Savio Soundcheck',
    description: 'Check acoustics in the Red Hall.',
    owner: 'Brother',
    status: 'Pending',
    category: 'Ceremony'
  }
];