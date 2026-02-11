import { Guest, Budget, RoomDetail, Quotation, EventFunction } from './types';

export const EVENT_CONFIG = {
  title: "50th Anniversary",
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
    title: 'Welcome Sundowner (Padhariye!)',
    date: 'April 17, 2026',
    time: '5:00 PM onwards',
    location: 'Poolside Veranda, Villa A (Lilia)',
    dressCode: 'Resort Chic / Tropical',
    description: 'A relaxed sunset gathering with Goan appetizers and cocktails to kick off the celebration. Chai, Nashta aur Gupshup!',
    image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-2',
    title: 'Sangeet & Cocktail Night (Raunak-e-Mehfil)',
    date: 'April 17, 2026',
    time: '8:00 PM onwards',
    location: 'Grand Hall, Red Villa (Lilia)',
    dressCode: 'Indo-Western Glitz',
    description: 'Family performances, dancing with DJ Savio, and a gala dinner spread. Nach Gaana aur Thoda Shaur!',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-3',
    title: 'Jubilee Breakfast (Shubh Prabhat)',
    date: 'April 18, 2026',
    time: '9:00 AM - 11:00 AM',
    location: 'Estate Lawn (Lilia)',
    dressCode: 'Casual White',
    description: 'A traditional Goan breakfast setup under the morning sun. Garam Nashta aur Taazi Hawa.',
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80'
  },
  {
    id: 'evt-4',
    title: 'Golden Gala Dinner (Sunehri Shaam)',
    date: 'April 18, 2026',
    time: '7:30 PM onwards',
    location: 'Marinha Dourada Ballroom',
    dressCode: 'Formal Gold & Ivory',
    description: 'The main anniversary event featuring the milestone film, speeches, and the grand jubilee cake. Shandaar Jashn!',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'
  }
];

export const INITIAL_GUESTS: Guest[] = Array.from({ length: 45 }, (_, i) => ({
  id: `guest-${i + 1}`,
  name: i < 3 ? ['Mom', 'Dad', 'Nisha'][i] : `Guest ${i + 1}`,
  category: i < 3 ? 'Family' : i < 15 ? 'VIP' : 'Friend',
  side: i % 2 === 0 ? 'Ladkewale' : 'Ladkiwale',
  property: i < 5 ? 'Villa-Pool' : i < 10 ? 'Villa-Hall' : 'Resort',
  roomNo: String(101 + (i % 20)),
  dietaryNote: i % 5 === 0 ? 'Vegan' : 'Standard Veg',
  sangeetAct: i % 4 === 0 ? 'Solo Dance' : 'TBD',
  pickupScheduled: i < 5,
  status: 'Pending',
  dressCode: 'Indo-Western Glitz',
  mealPlan: {
    lunch17: 'Goan Coastal Buffet',
    dinner18: 'Royal Thali'
  }
}));

export const INITIAL_BUDGET: Budget = {
  totalBudget: 1500000,
  villaRate: 65000,
  villaNights: 2,
  djRate: 35000,
  djNights: 1,
  photoRate: 45000,
  decorRate: 180000,
  furnitureRate: 25000,
  bartenderRate: 15000,
  accessoriesRate: 8000,
  finalCateringPax: 45
};

export const QUOTATIONS: Quotation[] = [
  {
    vendorName: "Divyanshi Gourmet",
    contactPerson: "Divyanshi Sharma",
    phoneNumber: "+91 9876543210",
    breakfast: 450,
    lunch: 850,
    dinner: 1250,
    galaDinner: 2800,
    venueRental: 45000,
    roomRate: 0,
    extraPax: 1500,
    menuHighlights: ["Lobster Thermidor", "Goan Prawn Curry", "Heritage Bebinca", "Stuffed Squid"]
  },
  {
    vendorName: "Marinha Dourada Resort",
    contactPerson: "Xavier D'Souza",
    phoneNumber: "+91 9123456789",
    breakfast: 650,
    lunch: 1100,
    dinner: 1850,
    galaDinner: 3500,
    venueRental: 150000,
    roomRate: 4800,
    extraPax: 2500,
    menuHighlights: ["Serradura", "Chicken Xacuti", "Vindaloo Surprise", "Portuguese Pastries"]
  }
];

export const ROOM_DATABASE: RoomDetail[] = [
  {
    roomNo: "101",
    property: "Villa-Pool",
    title: "Heritage Master Suite",
    description: "Grand suite with a private veranda overlooking the pool area at Lilia.",
    image: "https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80",
    type: "Master",
    amenities: ["AC", "En-suite Bath", "Pool Access", "Mini Bar"]
  },
  {
    roomNo: "102",
    property: "Villa-Pool",
    title: "Teak Wood Twin",
    description: "Traditional Goan decor with twin beds and garden views at Lilia.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
    type: "Twin",
    amenities: ["AC", "Garden View", "WiFi"]
  },
  {
    roomNo: "201",
    property: "Villa-Hall",
    title: "Royal Red Suite",
    description: "Elegant room in the heritage wing near the Sangeet hall at Lilia.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
    type: "Suite",
    amenities: ["AC", "Balcony", "Room Service"]
  },
  {
    roomNo: "301",
    property: "Resort",
    title: "Lagoon View Deluxe",
    description: "Modern deluxe room with views of the Arpora salt pans.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
    type: "Standard",
    amenities: ["AC", "Lagoon View", "Flat Screen TV"]
  }
];