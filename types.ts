export type PropertyType = 'Villa-Pool' | 'Villa-Hall' | 'Resort' | 'TreeHouse';
export type UserRole = 'planner' | 'guest' | null;
export type FamilySide = 'Ladkiwale' | 'Ladkewale' | 'Common';
export type TaskOwner = 'Husband' | 'Brother' | 'Planner' | 'TBD';
export type EffortLevel = 'Low' | 'Medium' | 'High';

export interface EventFunction {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  dressCode: string;
  description: string;
  image: string;
}

export interface FamilyMember {
  name: string;
  age: number;
  relation: string;
}

export interface Guest {
  id: string;
  name: string;
  category: 'VIP' | 'Family' | 'Friend' | 'Planner';
  side: FamilySide;
  property: PropertyType;
  roomNo: string;
  dietaryNote: string;
  sangeetAct: string;
  pickupScheduled: boolean;
  status: 'Confirmed' | 'Pending' | 'Declined';
  dressCode: string;
  mealPlan: {
    lunch17: string;
    dinner18: string;
  };
  paxCount?: number;
  familyMembers?: FamilyMember[];
  allergies?: string;
  drinksPreference?: 'Alcohol' | 'Non-Alcohol' | 'Both';
  arrivalDateTime?: string;
  arrivalFlight?: string;
  departureDateTime?: string;
  departureFlight?: string;
  songRequest?: string;
  personalMessage?: string;
  rsvpTimestamp?: string;
}

export interface RoomDetail {
  roomNo: string;
  property: PropertyType;
  title: string;
  description: string;
  image: string;
  type: 'Master' | 'Twin' | 'Suite' | 'Standard';
  amenities: string[];
}

export interface BudgetItem {
  id: string;
  label: string;
  cost: number;
  category: 'Committed' | 'Wishlist';
  lead: TaskOwner;
}

export interface Budget {
  totalBudget: number;
  villaRate: number;
  villaNights: number;
  djRate: number;
  djNights: number;
  photoRate: number;
  decorRate: number;
  furnitureRate: number;
  bartenderRate: number;
  accessoriesRate: number;
  finalCateringPax: number;
  finalizedVendors: string[];
  committedSpend: number;
  wishlistItems: BudgetItem[];
  selectedPath: 'Villa' | 'Resort' | 'TBD';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: TaskOwner;
  status: 'Pending' | 'In Progress' | 'Completed';
  category: 'Catering' | 'Decor' | 'Logistics' | 'Ceremony';
  vendorRef?: string;
  cost?: number;
}

export interface Quotation {
  vendorName: string;
  contactPerson: string;
  phoneNumber: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  galaDinner: number;
  venueRental: number;
  roomRate: number;
  extraPax: number;
  menuHighlights: string[];
  effortScore: EffortLevel;
}

export type AppTab = 'master' | 'venue' | 'rooms' | 'meals' | 'tasks' | 'tree' | 'budget' | 'ai' | 'rsvp-manager' | 'portal';