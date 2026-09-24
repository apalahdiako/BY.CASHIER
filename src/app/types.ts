export type Page =
  | "dashboard"
  | "order"
  | "detail"
  | "favorites"
  | "history"
  | "checkout"
  | "tracking"
  | "wallet"
  | "settings"
  | "profile"
  | "cctv"
  | "closing"
  | "reports"
  | "settlement";

export type Food = {
  id: number;
  name: string;
  restaurant: string;
  category: string;
  price: number;
  originalPrice?: number;
  time: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  discount?: string;
  description: string;
  ingredients: string[];
  caption?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  sizes?: { name: "Regular" | "Large" | "Double"; extra: number }[];
  toppings?: { label: string; price: number }[];
  active?: boolean;
};

export type CartItem = {
  food: Food;
  qty: number;
  size: string;
  extras: string[];
};

export type Voucher = {
  id: string;
  name: string;
  type: "percent" | "nominal";
  value: number;
  minimum: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
};

export type BannerSlide = {
  id: string;
  image: string;
  title: string;
  caption: string;
  createdAt: string;
};

export type StaffMessage = {
  id: string;
  body: string;
  sender: "admin" | "cashier" | "supervisor";
  senderId?: string;
  senderName?: string;
  senderPhoto?: string;
  audioUrl?: string;
  audioDuration?: number;
  createdAt: string;
};

export type StaffNotification = { id: string; body: string; createdAt: string; read: boolean };
export type CctvOutlet = { id: string; name: string; address?: string };
export type CctvCamera = { id: string; outletId: string; name: string; protocol: "RTSP" | "ONVIF"; zone?: string; status: "online" | "offline" | "reconnecting"; recording: boolean; resolution?: string; fps?: number; latencyMs?: number; bandwidthMbps?: number; storageUsedBytes?: number; storageCapacityBytes?: number; retentionDays?: number; streamUrl?: string; lastSeenAt?: string; };
export type CctvEvent = { id: string; outletId: string; cameraId: string; type: string; occurredAt: string; message?: string; recordingUrl?: string; confidence?: number; active?: boolean; };
export type MenuCategory = { id: string; name: string; icon: string; productIds: number[] };
export const defaultCategories: MenuCategory[] = [{id:"all",name:"All",icon:"🍽️",productIds:[]},{id:"burgers",name:"Burgers",icon:"🍔",productIds:[1]},{id:"pizza",name:"Pizza",icon:"🍕",productIds:[2]},{id:"sushi",name:"Sushi",icon:"🍣",productIds:[3]},{id:"ramen",name:"Ramen",icon:"🍜",productIds:[4]}];

export type StaffRole = "Admin Owner" | "Manager Dashboard" | "Supervisor" | "Kasir" | "Kitchen Display";
export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  shift: string;
  hourlyRate: number;
  permissions: string[];
  attendance: "Hadir" | "Belum check-in" | "Selesai shift";
  lastAttendanceAt?: string;
  photo?: string;
};

export type StoreSettings = {
  storeName: string;
  address: string;
  logo: string;
  taxRate: number;
  receiptFooter: string;
  paymentMethods: { CASH: boolean; QRIS: boolean; Online: boolean; EDC: boolean; Split: boolean };
  menuFilters: { bestseller: boolean; discount: boolean; popular: boolean };
};

export type Transaction = {
  id: string;
  invoice: string;
  customer: string;
  items: { name: string; qty: number; total: number }[];
  total: number;
  discount: number;
  tax: number;
  payment: string;
  orderType: string;
  status: "Processing" | "Completed" | "Cancelled";
  cashier: string;
  createdAt: string;
};

export const defaultStoreSettings: StoreSettings = {
  storeName: "BY.CASHIER UMKM",
  address: "Jakarta Selatan",
  logo: "",
  taxRate: 11,
  receiptFooter: "Terima kasih sudah berbelanja.",
  paymentMethods: { CASH: true, QRIS: true, Online: true, EDC: true, Split: true },
  menuFilters: { bestseller: true, discount: true, popular: true },
};

export const rupiah = (price: number) => `Rp ${Math.round(price * 15000).toLocaleString("id-ID")}`;

export const dishes: Food[] = [
  {
    id: 1,
    name: "Classic Truffle Burger",
    restaurant: "The Burger Joint",
    category: "American · Burgers · Fast Food",
    price: 12.99,
    originalPrice: 16.99,
    time: "20–30 min",
    rating: 4.8,
    reviews: 2840,
    image:
      "https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=600&h=400&fit=crop&auto=format",
    badge: "Best Seller",
    discount: "20%",
    description:
      "Indulge in our signature Wagyu beef patty, perfectly seared and topped with melted aged cheddar, crisp local greens, and house-made truffle aioli on a toasted brioche bun.",
    ingredients: ["Wagyu Beef", "Aged Cheddar", "Brioche Bun", "Truffle Oil", "Crisp Lettuce"],
  },
  {
    id: 2,
    name: "Bella Napoli Margherita",
    restaurant: "Bella Napoli Pizza",
    category: "Italian · Pizza · Authentic",
    price: 18.5,
    time: "35–45 min",
    rating: 4.9,
    reviews: 3120,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format",
    badge: "Top Rated",
    description:
      "Authentic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, and fragrant basil, baked in our wood-fired oven at 900°F.",
    ingredients: ["San Marzano Tomatoes", "Mozzarella di Bufala", "Fresh Basil", "Olive Oil", "Sea Salt"],
  },
  {
    id: 3,
    name: "Salmon Poke Bowl",
    restaurant: "Okinawa Sushi & Poke",
    category: "Japanese · Poke · Healthy",
    price: 15.2,
    time: "25–40 min",
    rating: 4.7,
    reviews: 1876,
    image:
      "https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?w=600&h=400&fit=crop&auto=format",
    description:
      "Fresh Atlantic salmon over seasoned sushi rice, topped with edamame, cucumber, avocado, pickled ginger, and our signature yuzu ponzu sauce.",
    ingredients: ["Atlantic Salmon", "Sushi Rice", "Avocado", "Edamame", "Yuzu Ponzu"],
  },
  {
    id: 4,
    name: "Spicy Tonkotsu Ramen",
    restaurant: "Thai Spice Kitchen",
    category: "Japanese · Ramen · Comfort Food",
    price: 14.5,
    time: "30–45 min",
    rating: 4.6,
    reviews: 2103,
    image:
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&h=400&fit=crop&auto=format",
    badge: "Spicy 🌶",
    description:
      "Rich pork bone broth simmered for 18 hours, served with tender chashu pork, soft-boiled egg, nori, bamboo shoots, and green onion.",
    ingredients: ["Pork Broth", "Chashu Pork", "Ramen Noodles", "Soft-boiled Egg", "Nori"],
  },
];
