import type {
  BudgetItem,
  CalendarEvent,
  Idea,
  ItineraryItem,
  Member,
  Memory,
  PackingItem,
  Task,
  Trip,
} from "./types";

const globalStore = globalThis as unknown as { __dadtrip_trips?: Trip[] };

const defaultTrips: Trip[] = [
  {
    id: "yosemite-2026",
    title: "Dad’s Birthday Road Trip",
    destination: "Yosemite National Park",
    description:
      "A family road trip to celebrate Dad’s birthday with hikes, scenic drives, good food, and time together.",
    startDate: "2026-06-12",
    endDate: "2026-06-16",
    tripType: "National Park",
    estimatedBudget: 2400,
    coverEmoji: "🏞️",
    accent: "forest",
    status: "planning",
  },
  {
    id: "tahoe-2026",
    title: "Tahoe Cabin Weekend",
    destination: "Lake Tahoe, CA",
    description: "Cabin weekend with the cousins. Boat day on Saturday.",
    startDate: "2026-08-21",
    endDate: "2026-08-23",
    tripType: "Cabin",
    estimatedBudget: 1100,
    coverEmoji: "🌲",
    accent: "forest",
    status: "idea",
  },
  {
    id: "sandiego-2026",
    title: "Family Reunion",
    destination: "San Diego, CA",
    description: "First reunion in 4 years. Beach BBQ Saturday.",
    startDate: "2026-09-04",
    endDate: "2026-09-07",
    tripType: "Family Visit",
    estimatedBudget: 1800,
    coverEmoji: "🏖️",
    accent: "sunset",
    status: "booked",
  },
  {
    id: "joshuatree-2025",
    title: "Joshua Tree Camping",
    destination: "Joshua Tree, CA",
    description: "Stargazing weekend. Already in the books.",
    startDate: "2025-11-08",
    endDate: "2025-11-10",
    tripType: "Camping",
    estimatedBudget: 600,
    coverEmoji: "🏜️",
    accent: "sunset",
    status: "completed",
  },
];

const DEFAULT_IDS = new Set(defaultTrips.map((t) => t.id));

function loadDynamicTrips(): Trip[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", "dynamic-trips.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    // Client-side or file missing — fall through
  }
  return [];
}

function saveDynamicTrips(allTrips: Trip[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dynamic = allTrips.filter((t) => !DEFAULT_IDS.has(t.id));
    fs.writeFileSync(
      path.join(dir, "dynamic-trips.json"),
      JSON.stringify(dynamic, null, 2)
    );
  } catch {
    // Client-side — ignore
  }
}

if (!globalStore.__dadtrip_trips) {
  const persisted = loadDynamicTrips();
  globalStore.__dadtrip_trips = [...defaultTrips, ...persisted];
}
export const trips: Trip[] = globalStore.__dadtrip_trips;

export const members: Record<string, Member[]> = {
  "yosemite-2026": [
    { id: "m-dad", name: "Dad", role: "owner", rsvp: "going", notes: "Loves scenic drives, short hikes, good breakfast.", avatarColor: "#2F5D50", partyRole: "Driver", favoriteStyle: "Scenic drives & pancakes" },
    { id: "m-me", name: "Me", role: "planner", rsvp: "going", avatarColor: "#C99A3D", partyRole: "Planner", favoriteStyle: "Anything outdoors" },
    { id: "m-mom", name: "Mom", role: "planner", rsvp: "going", dietary: "Vegetarian", avatarColor: "#9EC3D6", partyRole: "Quartermaster", favoriteStyle: "Cozy cabin nights" },
    { id: "m-gio", name: "Gio", role: "guest", rsvp: "going", avatarColor: "#7DA797", partyRole: "Photographer", favoriteStyle: "Hikes with a view" },
    { id: "m-grandma", name: "Grandma", role: "guest", rsvp: "maybe", notes: "Knee — easy walks only.", avatarColor: "#E07A2F", partyRole: "Storyteller", favoriteStyle: "Easy strolls" },
    { id: "m-grandpa", name: "Grandpa", role: "guest", rsvp: "going", notes: "Wants to fish.", avatarColor: "#558974", partyRole: "Scout", favoriteStyle: "Quiet mornings & fishing" },
    { id: "m-aunt", name: "Aunt Lisa", role: "guest", rsvp: "no_response", avatarColor: "#A57746", partyRole: "Snack Captain", favoriteStyle: "Local diners" },
    { id: "m-uncle", name: "Uncle Ray", role: "guest", rsvp: "not_going", avatarColor: "#7A6A55", partyRole: "Navigator", favoriteStyle: "Maps & detours" },
  ],
  "tahoe-2026": [
    { id: "m-me", name: "Me", role: "owner", rsvp: "going", avatarColor: "#D98236" },
    { id: "m-cousin1", name: "Cousin Ana", role: "guest", rsvp: "maybe", avatarColor: "#7DA797" },
  ],
  "sandiego-2026": [
    { id: "m-me", name: "Me", role: "planner", rsvp: "going", avatarColor: "#D98236" },
    { id: "m-mom", name: "Mom", role: "owner", rsvp: "going", avatarColor: "#A7C7D7" },
  ],
  "joshuatree-2025": [
    { id: "m-me", name: "Me", role: "owner", rsvp: "going", avatarColor: "#D98236" },
  ],
};

export const calendarEvents: Record<string, CalendarEvent[]> = {
  "yosemite-2026": [
    { id: "e1", date: "2026-06-12", startTime: "08:00", endTime: "13:00", title: "Drive to Yosemite", category: "travel", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio"], location: "LA → Yosemite Valley", isConfirmed: true },
    { id: "e2", date: "2026-06-12", startTime: "13:30", endTime: "14:15", title: "Grocery stop", category: "reservation", assignedPeople: ["m-mom"], location: "Mariposa Safeway" },
    { id: "e3", date: "2026-06-12", startTime: "15:00", endTime: "16:00", title: "Check into cabin", category: "lodging", assignedPeople: ["m-dad"], location: "Wawona Cabin #14", isConfirmed: true, confirmationNumber: "YOS-44819" },
    { id: "e4", date: "2026-06-12", startTime: "18:30", endTime: "20:30", title: "Family dinner", category: "meal", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio", "m-grandma", "m-grandpa"], location: "Cabin", cost: 80 },
    { id: "e5", date: "2026-06-13", startTime: "08:00", endTime: "13:00", title: "Mist Trail hike", category: "activity", assignedPeople: ["m-me", "m-gio", "m-mom"], location: "Mist Trail trailhead", isConfirmed: true },
    { id: "e6", date: "2026-06-13", startTime: "13:30", endTime: "14:30", title: "Lunch at picnic area", category: "meal", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio"], location: "Sentinel Beach Picnic Area" },
    { id: "e7", date: "2026-06-13", startTime: "19:30", endTime: "21:00", title: "Sunset at Glacier Point", category: "activity", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio", "m-grandpa"], location: "Glacier Point", isOptional: true },
    { id: "e8", date: "2026-06-14", startTime: "10:00", endTime: "11:30", title: "Free morning", category: "free_time", assignedPeople: [] },
    { id: "e9", date: "2026-06-14", startTime: "12:00", endTime: "12:30", title: "Group photo", category: "family_event", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio", "m-grandma", "m-grandpa"], location: "Tunnel View" },
    { id: "e10", date: "2026-06-14", startTime: "18:00", endTime: "20:00", title: "Birthday BBQ dinner", category: "meal", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio", "m-grandma", "m-grandpa"], location: "Cabin", cost: 120, isConfirmed: true },
    { id: "e11", date: "2026-06-15", startTime: "09:00", endTime: "12:00", title: "Scenic drive — Tioga Road", category: "activity", assignedPeople: ["m-dad", "m-mom", "m-grandpa"], location: "Tioga Road", isOptional: true },
    { id: "e12", date: "2026-06-15", startTime: "19:00", endTime: "20:00", title: "Dinner reservation", category: "reservation", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio", "m-grandma", "m-grandpa"], location: "Wawona Hotel Dining Room", isConfirmed: true, confirmationNumber: "WHD-9921", cost: 220 },
    { id: "e13", date: "2026-06-16", startTime: "09:00", endTime: "10:00", title: "Pack up & checkout", category: "reminder", assignedPeople: ["m-dad", "m-me"] },
    { id: "e14", date: "2026-06-16", startTime: "10:30", endTime: "16:00", title: "Drive home", category: "travel", assignedPeople: ["m-dad", "m-me", "m-mom", "m-gio"] },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const itinerary: Record<string, ItineraryItem[]> = {
  "yosemite-2026": [
    { id: "i1", date: "2026-06-12", slot: "morning", title: "Pack and leave LA", details: "Aim for 8 AM rollout. Coffee for the road." },
    { id: "i2", date: "2026-06-12", slot: "afternoon", title: "Drive to Yosemite", location: "LA → Wawona", isConfirmed: true },
    { id: "i3", date: "2026-06-12", slot: "evening", title: "Check in, dinner, relax", location: "Wawona Cabin #14" },
    { id: "i4", date: "2026-06-13", slot: "morning", title: "Mist Trail hike", location: "Mist Trail trailhead", cost: 0, isConfirmed: true },
    { id: "i5", date: "2026-06-13", slot: "afternoon", title: "Picnic lunch + nap", location: "Sentinel Beach", isFlexible: true },
    { id: "i6", date: "2026-06-13", slot: "evening", title: "Sunset at Glacier Point", isFlexible: true },
    { id: "i7", date: "2026-06-14", slot: "morning", title: "Slow start, breakfast at the cabin" },
    { id: "i8", date: "2026-06-14", slot: "afternoon", title: "Group photo at Tunnel View" },
    { id: "i9", date: "2026-06-14", slot: "evening", title: "Birthday BBQ", isConfirmed: true, cost: 120 },
    { id: "i10", date: "2026-06-15", slot: "morning", title: "Tioga Road scenic drive", isFlexible: true },
    { id: "i11", date: "2026-06-15", slot: "afternoon", title: "Free time / fishing with Grandpa" },
    { id: "i12", date: "2026-06-15", slot: "evening", title: "Wawona Hotel dinner", isConfirmed: true, cost: 220 },
    { id: "i13", date: "2026-06-16", slot: "morning", title: "Pack & checkout" },
    { id: "i14", date: "2026-06-16", slot: "afternoon", title: "Drive home" },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const ideas: Record<string, Idea[]> = {
  "yosemite-2026": [
    {
      id: "id1",
      title: "Mist Trail hike",
      description: "Classic Yosemite hike to Vernal Falls. About 3 hours round trip.",
      category: "hike",
      estimatedCost: 0,
      estimatedTime: "3h",
      location: "Mist Trail trailhead",
      submittedBy: "m-me",
      votes: [
        { memberId: "m-me", type: "must_do" },
        { memberId: "m-gio", type: "must_do" },
        { memberId: "m-mom", type: "in" },
        { memberId: "m-dad", type: "in" },
        { memberId: "m-grandma", type: "not_for_me" },
      ],
    },
    {
      id: "id2",
      title: "Scenic drive through Yosemite Valley",
      description: "Easy on the knees, big views, good for photos.",
      category: "scenic",
      estimatedTime: "2h",
      location: "Yosemite Valley loop",
      submittedBy: "m-dad",
      votes: [
        { memberId: "m-dad", type: "dad_approved" },
        { memberId: "m-grandma", type: "must_do" },
        { memberId: "m-grandpa", type: "in" },
        { memberId: "m-mom", type: "in" },
      ],
    },
    {
      id: "id3",
      title: "Birthday dinner at Wawona Hotel",
      description: "Reserve the round table by the window.",
      category: "food",
      estimatedCost: 220,
      estimatedTime: "2h",
      location: "Wawona Hotel Dining Room",
      submittedBy: "m-mom",
      votes: [
        { memberId: "m-dad", type: "dad_approved" },
        { memberId: "m-mom", type: "must_do" },
        { memberId: "m-me", type: "in" },
        { memberId: "m-gio", type: "in" },
        { memberId: "m-grandma", type: "in" },
        { memberId: "m-grandpa", type: "in" },
      ],
    },
    {
      id: "id4",
      title: "Sunset at Glacier Point",
      description: "Bring jackets — it gets cold up there.",
      category: "scenic",
      estimatedTime: "1.5h",
      location: "Glacier Point",
      submittedBy: "m-gio",
      votes: [
        { memberId: "m-gio", type: "must_do" },
        { memberId: "m-me", type: "in" },
        { memberId: "m-dad", type: "in" },
        { memberId: "m-mom", type: "maybe" },
      ],
    },
    {
      id: "id5",
      title: "Picnic by the river",
      description: "Lazy afternoon, good for Grandma.",
      category: "relaxing",
      estimatedTime: "2h",
      location: "Sentinel Beach Picnic Area",
      submittedBy: "m-grandma",
      votes: [
        { memberId: "m-grandma", type: "must_do" },
        { memberId: "m-mom", type: "in" },
        { memberId: "m-dad", type: "in" },
      ],
    },
    {
      id: "id6",
      title: "Family photo session",
      description: "Tunnel View at golden hour. 20 minutes max — Dad gets antsy.",
      category: "kid_friendly",
      estimatedTime: "30m",
      location: "Tunnel View",
      submittedBy: "m-mom",
      votes: [
        { memberId: "m-mom", type: "must_do" },
        { memberId: "m-grandma", type: "must_do" },
        { memberId: "m-me", type: "in" },
        { memberId: "m-dad", type: "maybe" },
      ],
    },
    {
      id: "id7",
      title: "Breakfast at a local diner",
      description: "Dad-approved pancakes.",
      category: "food",
      estimatedCost: 60,
      estimatedTime: "1h",
      location: "Mariposa",
      submittedBy: "m-dad",
      votes: [
        { memberId: "m-dad", type: "must_do" },
        { memberId: "m-grandpa", type: "in" },
        { memberId: "m-me", type: "in" },
      ],
    },
    {
      id: "id8",
      title: "Fishing at Wawona pond",
      description: "Quiet morning with Grandpa.",
      category: "relaxing",
      estimatedTime: "2h",
      location: "Wawona",
      submittedBy: "m-grandpa",
      votes: [
        { memberId: "m-grandpa", type: "must_do" },
        { memberId: "m-dad", type: "in" },
        { memberId: "m-gio", type: "maybe" },
      ],
    },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const tasks: Record<string, Task[]> = {
  "yosemite-2026": [
    { id: "t1", title: "Book lodging", assignedTo: "m-dad", dueDate: "2026-04-15", status: "done", priority: "high" },
    { id: "t2", title: "Reserve birthday dinner", assignedTo: "m-mom", dueDate: "2026-05-20", status: "done", priority: "high" },
    { id: "t3", title: "Check car tires", assignedTo: "m-dad", dueDate: "2026-06-08", status: "not_started", priority: "medium" },
    { id: "t4", title: "Buy snacks for the road", assignedTo: "m-me", dueDate: "2026-06-10", status: "not_started", priority: "low" },
    { id: "t5", title: "Pack cooler", assignedTo: "m-mom", dueDate: "2026-06-11", status: "not_started", priority: "low" },
    { id: "t6", title: "Print park pass", assignedTo: "m-me", dueDate: "2026-06-09", status: "in_progress", priority: "high" },
    { id: "t7", title: "Confirm who is going", assignedTo: "m-me", dueDate: "2026-05-15", status: "in_progress", priority: "high" },
    { id: "t8", title: "Bring camera + chargers", assignedTo: "m-gio", dueDate: "2026-06-11", status: "not_started", priority: "medium" },
    { id: "t9", title: "Send itinerary to Grandma", assignedTo: "m-mom", dueDate: "2026-05-25", status: "not_started", priority: "medium" },
    { id: "t10", title: "Order birthday cake", assignedTo: "m-mom", dueDate: "2026-06-10", status: "not_started", priority: "high" },
    { id: "t11", title: "Confirm cabin parking", assignedTo: "m-dad", status: "not_started", priority: "low" },
    { id: "t12", title: "Download offline maps", assignedTo: "m-me", status: "not_started", priority: "low" },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const budget: Record<string, BudgetItem[]> = {
  "yosemite-2026": [
    { id: "b1", category: "Lodging", description: "Wawona cabin (4 nights)", estimatedCost: 880, actualCost: 920, paidBy: "m-dad", splitBetween: ["m-dad", "m-mom", "m-me", "m-gio"] },
    { id: "b2", category: "Gas", description: "Round trip", estimatedCost: 220, splitBetween: ["m-dad", "m-me"] },
    { id: "b3", category: "Food", description: "Groceries + meals out", estimatedCost: 650, splitBetween: ["m-dad", "m-mom", "m-me", "m-gio"] },
    { id: "b4", category: "Activities", description: "Park pass + parking", estimatedCost: 70, actualCost: 70, paidBy: "m-me", splitBetween: ["m-dad", "m-mom", "m-me", "m-gio"] },
    { id: "b5", category: "Activities", description: "Birthday dinner — Wawona Hotel", estimatedCost: 220, splitBetween: ["m-dad", "m-mom", "m-me", "m-gio", "m-grandma", "m-grandpa"] },
    { id: "b6", category: "Gear", description: "New cooler", estimatedCost: 80, actualCost: 75, paidBy: "m-mom", splitBetween: ["m-mom"] },
    { id: "b7", category: "Emergency/Misc", description: "Buffer", estimatedCost: 200, splitBetween: ["m-dad", "m-mom", "m-me", "m-gio"] },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const packing: Record<string, PackingItem[]> = {
  "yosemite-2026": [
    { id: "p1", title: "Hiking shoes", category: "Clothes", assignedTo: "m-me", isPacked: true },
    { id: "p2", title: "Sunscreen", category: "Toiletries", assignedTo: "m-mom", isPacked: false },
    { id: "p3", title: "Water bottles (6)", category: "Camping", assignedTo: "m-dad", isPacked: false },
    { id: "p4", title: "Phone chargers", category: "Electronics", assignedTo: "m-me", isPacked: false },
    { id: "p5", title: "Cooler", category: "Car/RV", assignedTo: "m-mom", isPacked: true },
    { id: "p6", title: "Snacks", category: "Food", assignedTo: "m-gio", isPacked: false },
    { id: "p7", title: "Camera", category: "Electronics", assignedTo: "m-gio", isPacked: false },
    { id: "p8", title: "First-aid kit", category: "Medicine", assignedTo: "m-dad", isPacked: true },
    { id: "p9", title: "Sweatshirt (everyone)", category: "Clothes", isPacked: false },
    { id: "p10", title: "Park pass", category: "Documents", assignedTo: "m-me", isPacked: false },
    { id: "p11", title: "Jumper cables", category: "Car/RV", assignedTo: "m-dad", isPacked: true },
    { id: "p12", title: "Birthday candles", category: "Miscellaneous", assignedTo: "m-mom", isPacked: false },
  ],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [],
};

export const memories: Record<string, Memory[]> = {
  "yosemite-2026": [],
  "tahoe-2026": [],
  "sandiego-2026": [],
  "joshuatree-2025": [
    { id: "mm1", type: "favorite_moment", content: "Stargazing at 2 AM, wrapped in every blanket we owned.", submittedBy: "m-me", createdAt: "2025-11-11" },
    { id: "mm2", type: "quote", content: "“We didn't even need a fire — the stars did the work.” — Dad", submittedBy: "m-me", createdAt: "2025-11-11" },
    { id: "mm3", type: "story", content: "Got lost on the Hidden Valley loop and ended up at a way better viewpoint. Pure accident, total win.", submittedBy: "m-me", createdAt: "2025-11-12" },
  ],
};

export function getTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

export function addTrip(trip: Trip): void {
  trips.push(trip);
  saveDynamicTrips(trips);
}

export function updateTrip(id: string, updates: Partial<Omit<Trip, "id">>): boolean {
  const trip = trips.find((t) => t.id === id);
  if (!trip) return false;
  Object.assign(trip, updates);
  saveDynamicTrips(trips);
  return true;
}

export function deleteTrip(id: string): boolean {
  const idx = trips.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  trips.splice(idx, 1);
  saveDynamicTrips(trips);
  return true;
}

export function getTripState(id: string) {
  return {
    members: members[id] ?? [],
    ideas: ideas[id] ?? [],
    events: calendarEvents[id] ?? [],
    tasks: tasks[id] ?? [],
    budget: budget[id] ?? [],
    packing: packing[id] ?? [],
    memories: memories[id] ?? [],
  };
}
