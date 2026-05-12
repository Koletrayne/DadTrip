export type TripStatus = "idea" | "planning" | "booked" | "completed";

export type EventCategory =
  | "travel"
  | "lodging"
  | "meal"
  | "activity"
  | "reservation"
  | "free_time"
  | "family_event"
  | "reminder";

export type IdeaCategory =
  | "food"
  | "hike"
  | "museum"
  | "scenic"
  | "relaxing"
  | "adventure"
  | "kid_friendly"
  | "senior_friendly"
  | "rainy_day"
  | "concert"
  | "other";

export type VoteType = "in" | "not_for_me" | "must_do" | "maybe" | "dad_approved";

export type RSVP = "going" | "maybe" | "not_going" | "no_response";
export type Role = "owner" | "planner" | "guest";

export type PartyRole =
  | "Navigator"
  | "Snack Captain"
  | "Driver"
  | "Photographer"
  | "Planner"
  | "Scout"
  | "Storyteller"
  | "Quartermaster";

export type TaskStatus = "not_started" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

export type Trip = {
  id: string;
  title: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
  tripType: string;
  estimatedBudget?: number;
  coverEmoji?: string;
  accent?: string;
  status: TripStatus;
};

export type Member = {
  id: string;
  name: string;
  email?: string;
  role: Role;
  rsvp: RSVP;
  notes?: string;
  dietary?: string;
  avatarColor?: string;
  partyRole?: PartyRole;
  favoriteStyle?: string;
};

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: EventCategory;
  assignedPeople: string[];
  isOptional?: boolean;
  isConfirmed?: boolean;
  cost?: number;
  link?: string;
  confirmationNumber?: string;
};

export type ItineraryItem = {
  id: string;
  date: string;
  slot: "morning" | "afternoon" | "evening" | "notes";
  title: string;
  time?: string;
  details?: string;
  location?: string;
  cost?: number;
  isConfirmed?: boolean;
  isFlexible?: boolean;
};

export type Idea = {
  id: string;
  title: string;
  description?: string;
  category: IdeaCategory;
  estimatedCost?: number;
  estimatedTime?: string;
  location?: string;
  link?: string;
  submittedBy: string;
  votes: { memberId: string; type: VoteType }[];
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: Priority;
};

export type BudgetItem = {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  paidBy?: string;
  splitBetween: string[];
  notes?: string;
};

export type PackingItem = {
  id: string;
  title: string;
  category: string;
  assignedTo?: string;
  isPacked: boolean;
};

export type Memory = {
  id: string;
  type: "photo" | "quote" | "story" | "favorite_moment";
  content: string;
  imageUrl?: string;
  submittedBy: string;
  createdAt: string;
};
