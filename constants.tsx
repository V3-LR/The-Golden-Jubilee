
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
  },
  TREE_HOTEL: {
    name: "The Tree House Hotel",
    address: "Arossim Heritage Zone, Goa",
    mapLink: "https://maps.app.goo.gl/JxgefAuSutBzo5hb7"
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

// Expanded Room Database to include 30 rooms: 5 in each Villa, 15 in Tree Hotel, 5 in Resort
// Fixed type incompatibility error by explicitly casting room 'type' property
export const ROOM_DATABASE: RoomDetail[] = [
  // VILLA A: POOLSIDE (5 Rooms)
  ...[101, 102, 103, 104, 105].map(num => ({
    roomNo: String(num),
    property: "Villa-Pool" as const,
    title: num === 101 ? "Heritage Master Suite" : `Luxury Room ${num}`,
    description: "Elegant pool-facing room in Villa A with heritage Goan architecture.",
    image: "https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80",
    type: (num === 101 ? "Master" : "Standard") as RoomDetail['type'],
    amenities: ["AC", "En-suite Bath", "Pool Access"]
  })),

  // VILLA B: RED HALL (5 Rooms)
  ...[201, 202, 203, 204, 205].map(num => ({
    roomNo: String(num),
    property: "Villa-Hall" as const,
    title: num === 201 ? "Royal Red Suite" : `Heritage Room ${num}`,
    description: "Grand room in the Red Villa B, close to the central celebration hall.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
    type: (num === 201 ? "Suite" : "Standard") as RoomDetail['type'],
    amenities: ["AC", "Balcony", "WiFi"]
  })),

  // RESORT (5 Rooms)
  ...[301, 302, 303, 304, 305].map(num => ({
    roomNo: String(num),
    property: "Resort" as const,
    title: `Lagoon Deluxe ${num}`,
    description: "Modern room with serene lagoon views at Marinha Dourada.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
    type: "Standard" as const,
    amenities: ["AC", "Lagoon View", "TV"]
  })),

  // TREE HOUSE / HOTEL (15 Rooms)
  ...[401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415].map(num => ({
    roomNo: String(num),
    property: "TreeHouse" as const,
    title: `Canopy Room ${num}`,
    description: "Unique elevated room nestled in nature, offering a peaceful Goan retreat.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    type: "Standard" as const,
    amenities: ["AC", "Forest View", "Eco-Design"]
  }))
];

export const INITIAL_GUESTS: Guest[] = Array.from({ length: 45 }, (_, i) => {
  let property: any = 'Resort';
  let roomNo = '301';

  if (i < 5) { property = 'Villa-Pool'; roomNo = String(101 + i); }
  else if (i < 10) { property = 'Villa-Hall'; roomNo = String(201 + (i - 5)); }
  else if (i < 25) { property = 'TreeHouse'; roomNo = String(401 + (i - 10)); }
  else { property = 'Resort'; roomNo = String(301 + (i % 5)); }

  return {
    id: `guest-${i + 1}`,
    name: i < 3 ? ['Mom', 'Dad', 'Nisha'][i] : `Guest ${i + 1}`,
    category: i < 3 ? 'Family' : i < 15 ? 'VIP' : 'Friend',
    side: i % 2 === 0 ? 'Ladkewale' : 'Ladkiwale',
    property: property,
    roomNo: roomNo,
    dietaryNote: i % 5 === 0 ? 'Vegan' : 'Standard Veg',
    sangeetAct: i % 4 === 0 ? 'Solo Dance' : 'TBD',
    pickupScheduled: i < 5,
    status: 'Pending',
    dressCode: 'Indo-Western Glitz',
    mealPlan: {
      lunch17: 'Goan Coastal Buffet',
      dinner18: 'Royal Thali'
    }
  };
});

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
