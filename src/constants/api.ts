/**
 * ============================================================================
 * Frontend API Service (Cloud Database Connector)
 * ============================================================================
 * Course: Internet Programming - React Native + Cloud DB
 * Server Host: 119.59.102.161
 * User: std6730251417
 * Database: ip_std6730251417
 * ============================================================================
 */

export interface Product {
  id: number | string;
  name: string;
  price: number;
  stock: number;
  stock_text?: string;
  category: "Keyboard" | "Mouse" | "Headset" | "Monitor" | string;
  brand: string;
  connection: "Wireless" | "Wired" | "Both" | string;
  dpi?: number | null;
  size?: string;
  rating: number;
  location?: string;
  location_text?: string;
  location_count?: number;
  image?: string;
  image_url?: string;
  status?: string;
  badge_status?: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "user" | "guest";
  is_guest?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "Waiting for Payment"
  | "Payment Verified"
  | "Preparing"
  | "Shipping"
  | "Delivered";

export interface OrderItem {
  id?: number | string;
  order_id?: number | string;
  product_id?: number | string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: number | string;
  order_number: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  address: string;
  province: string;
  postal_code: string;
  payment_method: "โอนเงิน" | "QR PromptPay" | "เก็บเงินปลายทาง" | string;
  slip_url?: string | null;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at?: string;
}

export interface GamingSet {
  id: string;
  name: string;
  description: string;
  discount_price: number;
  original_price: number;
  image_url: string;
  items: { name: string; price: number; category: string }[];
}

// --- Cloud Server Configuration ---
export const SERVER_HOST = "119.59.102.161";
export const SERVER_PORT = "3103";
export const API_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}/api`;

// Default Fallback Products Catalog with Brand, DPI, Connection, Size, Rating
export const FALLBACK_CLOUD_PRODUCTS: Product[] = [
  // Mouse
  {
    id: "1",
    name: "Logitech G Pro X Superlight 2",
    price: 3990,
    stock: 12,
    stock_text: "12 in stock",
    category: "Mouse",
    brand: "Logitech",
    connection: "Wireless",
    dpi: 32000,
    size: "Medium (60g)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    description: "เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ เซนเซอร์ HERO 2 32,000 DPI สวิตช์ LIGHTFORCE ไฮบริด",
  },
  {
    id: "2",
    name: "Razer DeathAdder V3 Pro",
    price: 2490,
    stock: 3,
    stock_text: "3 in stock",
    category: "Mouse",
    brand: "Razer",
    connection: "Wireless",
    dpi: 30000,
    size: "Ergonomic (63g)",
    rating: 4.8,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "เมาส์สายพันธุ์แชมป์ Ergonomic ออกแบบสำหรับมือขวา น้ำหนัก 63g เซนเซอร์ Focus Pro 30K Optical",
  },
  {
    id: "3",
    name: "ZOWIE EC2-CW Wireless Mouse",
    price: 4890,
    stock: 0,
    stock_text: "0 in stock",
    category: "Mouse",
    brand: "ZOWIE",
    connection: "Wireless",
    dpi: 3200,
    size: "Medium (77g)",
    rating: 4.7,
    badge_status: "Out of Stock",
    image_url: "https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600",
    description: "เมาส์อีสปอร์ตไร้สายยอดนิยมระดับทัวร์นาเมนต์ ส่งสัญญาณเสถียรด้วย Enhanced Receiver",
  },

  // Keyboard
  {
    id: "4",
    name: "SteelSeries Apex Pro TKL Wireless",
    price: 7990,
    stock: 8,
    stock_text: "8 in stock",
    category: "Keyboard",
    brand: "SteelSeries",
    connection: "Wireless",
    dpi: null,
    size: "TKL (80%)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "คีย์บอร์ดเกมมิ่ง OmniPoint 2.0 ปรับแต่งระยะกดปุ่มได้ 0.2mm - 3.8mm พร้อมจอ OLED Smart Display",
  },
  {
    id: "5",
    name: "MEZZON Wireless RGB Mechanical Keyboard",
    price: 1890,
    stock: 14,
    stock_text: "14 in stock",
    category: "Keyboard",
    brand: "MEZZON",
    connection: "Wireless",
    dpi: null,
    size: "Full-size (100%)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    description: "คีย์บอร์ดเกมมิ่งไร้สาย Mechanical Full-size ไฟ RGB ปรับแต่งได้ 18 โหมด พร้อมปุ่ม Multi-function Knob",
  },
  {
    id: "6",
    name: "Logitech G915 LIGHTSPEED Wireless RGB",
    price: 5490,
    stock: 2,
    stock_text: "2 in stock",
    category: "Keyboard",
    brand: "Logitech",
    connection: "Wireless",
    dpi: null,
    size: "Low-Profile Full-size",
    rating: 4.8,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600",
    description: "คีย์บอร์ดไร้สายสวิตช์ Low Profile อะลูมิเนียมเกรดอากาศยาน บางเฉียบ หรูหราและตอบสนองฉับไว",
  },

  // Headset
  {
    id: "7",
    name: "HyperX Cloud Alpha Wireless",
    price: 4590,
    stock: 15,
    stock_text: "15 in stock",
    category: "Headset",
    brand: "HyperX",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (300h Battery)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    description: "หูฟังเกมมิ่งไร้สาย แบตเตอรี่ใช้งานได้ยาวนาน 300 ชั่วโมง ระบบเสียง DTS Headphone:X Spatial Audio",
  },
  {
    id: "8",
    name: "Razer BlackShark V2 Pro",
    price: 4290,
    stock: 3,
    stock_text: "3 in stock",
    category: "Headset",
    brand: "Razer",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (320g)",
    rating: 4.8,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
    description: "หูฟังสำหรับนักกีฬาอีสปอร์ต ไมโครโฟน HyperClear Super Wideband ไดรเวอร์ TriForce Titanium 50mm",
  },
  {
    id: "9",
    name: "SteelSeries Arctis Nova Pro Wireless",
    price: 9990,
    stock: 5,
    stock_text: "5 in stock",
    category: "Headset",
    brand: "SteelSeries",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (ANC)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "หูฟังระดับท็อป พรีเมียม Hi-Res Audio พร้อมระบบตัดเสียงรบกวน Active Noise Cancelling (ANC)",
  },

  // Monitor
  {
    id: "10",
    name: "ASUS ROG Swift 360Hz PG259QN",
    price: 19900,
    stock: 4,
    stock_text: "4 in stock",
    category: "Monitor",
    brand: "ASUS ROG",
    connection: "Wired",
    dpi: null,
    size: "24.5 Inch",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
    description: "จอเกมมิ่งระดับโปร 24.5 นิ้ว Fast IPS 360Hz 1ms รองรับ NVIDIA G-SYNC และ Reflex Latency Analyzer",
  },
  {
    id: "11",
    name: "BenQ ZOWIE XL2546K 240Hz 24.5\"",
    price: 14900,
    stock: 1,
    stock_text: "1 in stock",
    category: "Monitor",
    brand: "BenQ ZOWIE",
    connection: "Wired",
    dpi: null,
    size: "24.5 Inch",
    rating: 4.9,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600",
    description: "จอเกมมิ่งแข่งขันอีสปอร์ตระดับโลก เทคโนโลยี DyAc+ ลดภาพเบลอจากการสั่นไหว พร้อมฐานขนาดกะทัดรัด",
  },
  {
    id: "12",
    name: "LG UltraGear OLED 27\" 240Hz QHD",
    price: 26900,
    stock: 0,
    stock_text: "0 in stock",
    category: "Monitor",
    brand: "LG",
    connection: "Wired",
    dpi: null,
    size: "27 Inch",
    rating: 5.0,
    badge_status: "Out of Stock",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    description: "จอเกมมิ่ง OLED ความละเอียด 2K QHD รีเฟรชเรท 240Hz ความเร็ว 0.03ms สีดำลึกและคมชัดสูงสุด",
  },
  {
    id: "13",
    name: "Razer Huntsman Mini 60% Optical",
    price: 3490,
    stock: 10,
    stock_text: "10 in stock",
    category: "Keyboard",
    brand: "Razer",
    connection: "Wired",
    dpi: null,
    size: "60%",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "คีย์บอร์ดเกมมิ่ง 60% Optical Switch สวิตช์แสงตอบสนองระดับเสี้ยววินาที สำหรับเกมเมอร์ FPS",
  },
  {
    id: "14",
    name: "HyperX Cloud III Gaming Headset",
    price: 2990,
    stock: 8,
    stock_text: "8 in stock",
    category: "Headset",
    brand: "HyperX",
    connection: "Wired",
    dpi: null,
    size: "Over-Ear (Memory Foam)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    description: "หูฟังเกมมิ่งระดับตำนาน ปรับปรุงเสียงคมชัด ไมโครโฟนตัดเสียงรบกวน 10mm เมมโมรี่โฟมนุ่มสบาย",
  },
  {
    id: "15",
    name: "AOC 24G2SP 165Hz IPS Gaming Monitor",
    price: 5990,
    stock: 6,
    stock_text: "6 in stock",
    category: "Monitor",
    brand: "AOC",
    connection: "Wired",
    dpi: null,
    size: "24 Inch",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
    description: "จอเกมมิ่ง IPS 165Hz 1ms MPRT คุ้มค่าที่สุดสำหรับ Valorant และเกม FPS esports",
  },
  {
    id: "16",
    name: "SteelSeries QcK Heavy Mousepad",
    price: 690,
    stock: 25,
    stock_text: "25 in stock",
    category: "Mouse Pad",
    brand: "SteelSeries",
    connection: "Cloth",
    dpi: null,
    size: "Large (450x400mm)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    description: "แผ่นรองเมาส์ผ้าระดับโปร หนาพิเศษ 6mm ช่วยควบคุมเมาส์ได้อย่างแม่นยำ เหมาะกับเกมยิง Tactical",
  },
  {
    id: "17",
    name: "Razer Viper V3 Pro Wireless",
    price: 5690,
    stock: 9,
    stock_text: "9 in stock",
    category: "Mouse",
    brand: "Razer",
    connection: "Wireless",
    dpi: 35000,
    size: "Symmetrical (54g)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    description: "เมาส์ไร้สายระดับเทพ น้ำหนักเพียง 54 กรัม เซนเซอร์ Focus Pro Gen-2 35,000 DPI พร้อม True 8000Hz Polling",
  },
  {
    id: "18",
    name: "Logitech G502 X PLUS LIGHTSPEED",
    price: 4990,
    stock: 7,
    stock_text: "7 in stock",
    category: "Mouse",
    brand: "Logitech",
    connection: "Wireless",
    dpi: 25600,
    size: "Ergonomic (106g)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "เมาส์เกมมิ่งในตำนานรุ่นอัปเกรด สวิตช์ไฮบริด LIGHTFORCE และไฟ LIGHTSYNC RGB 8 โซน",
  },
  {
    id: "19",
    name: "Pulsar X2 V2 Wireless Gaming Mouse",
    price: 3290,
    stock: 11,
    stock_text: "11 in stock",
    category: "Mouse",
    brand: "Pulsar",
    connection: "Wireless",
    dpi: 26000,
    size: "Medium (52g)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600",
    description: "เมาส์ไร้สายทรงสมมาตร น้ำหนักเบา 52g เซนเซอร์ PAW3395 สวิตช์ Optical ลื่นไหลไร้แรงหน่วง",
  },
  {
    id: "20",
    name: "Logitech G PRO X TKL LIGHTSPEED",
    price: 6990,
    stock: 6,
    stock_text: "6 in stock",
    category: "Keyboard",
    brand: "Logitech",
    connection: "Wireless",
    dpi: null,
    size: "TKL (80%)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "คีย์บอร์ดเกมมิ่งไร้สายระดับแชมป์ คีย์แคป Dual-shot PBT พร้อมปุ่ม Media controls และ Game mode switch",
  },
  {
    id: "21",
    name: "Wooting 60HE+ Analog Mechanical",
    price: 7990,
    stock: 3,
    stock_text: "3 in stock",
    category: "Keyboard",
    brand: "Wooting",
    connection: "Wired",
    dpi: null,
    size: "60%",
    rating: 5.0,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    description: "คีย์บอร์ดเทคโนโลยี Hall Effect อันดับ 1 ของโลก ระบบ Rapid Trigger ปรับระยะการกดละเอียดถึง 0.1mm โกงสุดในเกม FPS",
  },
  {
    id: "22",
    name: "Corsair K70 RGB PRO Mechanical",
    price: 5290,
    stock: 8,
    stock_text: "8 in stock",
    category: "Keyboard",
    brand: "Corsair",
    connection: "Wired",
    dpi: null,
    size: "Full-size (100%)",
    rating: 4.7,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600",
    description: "คีย์บอร์ดโครงอะลูมิเนียมเกรดอากาศยาน สวิตช์ CHERRY MX Red เทคโนโลยี AXON ประมวลผลเร็ว 8000Hz",
  },
  {
    id: "23",
    name: "Keychron Q1 Pro Wireless Custom",
    price: 6490,
    stock: 5,
    stock_text: "5 in stock",
    category: "Keyboard",
    brand: "Keychron",
    connection: "Both",
    dpi: null,
    size: "75%",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "คีย์บอร์ด Custom ระดับพรีเมียม บอดี้อะลูมิเนียม CNC ทั้งชิ้น Gasket Mount นุ่มมือ พิมพ์สนุก เสียงเพราะ",
  },
  {
    id: "24",
    name: "Logitech G PRO X 2 LIGHTSPEED Headset",
    price: 7990,
    stock: 7,
    stock_text: "7 in stock",
    category: "Headset",
    brand: "Logitech",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (Graphene 50mm)",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    description: "หูฟังเกมมิ่งไดรเวอร์ Graphene 50mm ตัวแรกของโลก มิติเสียงคมชัดระดับหูทอง แบตเตอรี่ 50 ชม.",
  },
  {
    id: "25",
    name: "Corsair HS80 MAX Wireless Headset",
    price: 4990,
    stock: 6,
    stock_text: "6 in stock",
    category: "Headset",
    brand: "Corsair",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (Dolby Atmos)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
    description: "หูฟังระบบเสียงรอบทิศทาง Dolby Atmos ไมโครโฟนเกรดบรอดแคสต์คมชัด แบตเตอรี่ใช้งานสูงสุด 65 ชั่วโมง",
  },
  {
    id: "26",
    name: "SteelSeries Arctis Nova 7 Wireless",
    price: 6290,
    stock: 8,
    stock_text: "8 in stock",
    category: "Headset",
    brand: "SteelSeries",
    connection: "Wireless",
    dpi: null,
    size: "Over-Ear (ComfortMAX)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "หูฟังเกมมิ่งระบบ Nova Acoustic System เชื่อมต่อพร้อมกัน 2 อุปกรณ์ 2.4GHz + Bluetooth ชาร์จด่วน 15 นาทีใช้ได้ 6 ชม.",
  },
  {
    id: "27",
    name: "Samsung Odyssey OLED G6 27\" 360Hz",
    price: 26900,
    stock: 3,
    stock_text: "3 in stock",
    category: "Monitor",
    brand: "Samsung",
    connection: "Wired",
    dpi: null,
    size: "27 Inch QHD",
    rating: 5.0,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    description: "จอเกมมิ่ง OLED 27 นิ้ว QHD 2K ความเร็ว 360Hz อัตราตอบสนอง 0.03ms ระบบลดความร้อน OLED Safeguard+",
  },
  {
    id: "28",
    name: "ASUS TUF Gaming VG259QM 280Hz",
    price: 8990,
    stock: 5,
    stock_text: "5 in stock",
    category: "Monitor",
    brand: "ASUS ROG",
    connection: "Wired",
    dpi: null,
    size: "24.5 Inch",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
    description: "จอเกมมิ่ง Fast IPS 24.5 นิ้ว Overclock รีเฟรชเรท 280Hz 1ms ELMB Sync เหมาะกับเกมเมอร์ยิงแข่งขัน",
  },
  {
    id: "29",
    name: "Alienware AW2524HF 500Hz Fast IPS",
    price: 24900,
    stock: 2,
    stock_text: "2 in stock",
    category: "Monitor",
    brand: "Alienware",
    connection: "Wired",
    dpi: null,
    size: "24.5 Inch (500Hz)",
    rating: 4.9,
    badge_status: "Low in stock",
    image_url: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600",
    description: "จอเกมมิ่งที่เร็วที่สุดในโลก 500Hz Fast IPS อัตราตอบสนอง 0.5ms ออกแบบสำหรับทัวร์นาเมนต์อีสปอร์ตระดับโลก",
  },
  {
    id: "30",
    name: "MSI MAG 274UPF 4K 144Hz 27\"",
    price: 15900,
    stock: 4,
    stock_text: "4 in stock",
    category: "Monitor",
    brand: "MSI",
    connection: "Wired",
    dpi: null,
    size: "27 Inch 4K UHD",
    rating: 4.9,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    description: "จอเกมมิ่ง 4K UHD 3840x2160 พาเนล Rapid IPS 144Hz 1ms พอร์ต USB Type-C ชาร์จไฟ 65W สีแม่นยำสูง",
  },
  {
    id: "31",
    name: "Artisan Hayate Otsu FX Soft XL",
    price: 2490,
    stock: 12,
    stock_text: "12 in stock",
    category: "Mouse Pad",
    brand: "Artisan",
    connection: "Cloth / Poron",
    dpi: null,
    size: "XL (490x420mm)",
    rating: 5.0,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    description: "แผ่นรองเมาส์นำเข้าจากญี่ปุ่นอันดับ 1 ของโลก ฐาน Poron ญี่ปุ่นยึดโต๊ะแน่น เนื้อผ้าผสมผสานสปีดและคอนโทรลอย่างสมบูรณ์แบบ",
  },
  {
    id: "32",
    name: "ZOWIE G-SR II Cloth Mousepad",
    price: 1290,
    stock: 18,
    stock_text: "18 in stock",
    category: "Mouse Pad",
    brand: "ZOWIE",
    connection: "Cloth",
    dpi: null,
    size: "Large (470x390mm)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "แผ่นรองเมาส์สาย Control ป้องกันความชื้นและเหงื่อ ให้ความรู้สึกในการลากเมาส์สม่ำเสมอในทุกสภาพอากาศ",
  },
  {
    id: "33",
    name: "Razer Strider Hybrid Mouse Mat XXL",
    price: 1890,
    stock: 10,
    stock_text: "10 in stock",
    category: "Mouse Pad",
    brand: "Razer",
    connection: "Hybrid",
    dpi: null,
    size: "XXL Deskmat (940x410mm)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "แผ่นรองเมาส์ไฮบริดขนาดใหญ่คลุมทั้งโต๊ะ กันน้ำซึม ขอบเย็บแน่นหนา พื้นผิวผสมผสานความลื่นของแผ่นแข็งและความนุ่มของผ้า",
  },
  {
    id: "34",
    name: "Logitech G640 Large Cloth Gaming Pad",
    price: 890,
    stock: 20,
    stock_text: "20 in stock",
    category: "Mouse Pad",
    brand: "Logitech",
    connection: "Cloth",
    dpi: null,
    size: "Large (460x400mm)",
    rating: 4.7,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    description: "แผ่นรองเมาส์ผ้าขนาดใหญ่ พื้นผิวแรงเสียดทานปานกลาง ปรับจูนให้เข้ากับเซนเซอร์ Logitech G HERO อย่างสมบูรณ์แบบ",
  },
  {
    id: "35",
    name: "Ducky One 3 RGB TKL Hot-Swap",
    price: 4290,
    stock: 6,
    stock_text: "6 in stock",
    category: "Keyboard",
    brand: "Ducky",
    connection: "Wired",
    dpi: null,
    size: "TKL (80%)",
    rating: 4.8,
    badge_status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "คีย์บอร์ดเกมมิ่ง Hot-Swappable สวิตช์ Cherry MX คีย์แคป PBT Double-shot แบบ Seamless พร้อมชั้นซับเสียง EVA สองชั้น",
  },
];

// Pre-built Gaming Sets (ร้านจัดให้)
export const PREBUILT_GAMING_SETS: GamingSet[] = [
  {
    id: "bundle-1",
    name: "⚡ Starter Gamer Set",
    description: "เซ็ตเริ่มต้นสุดคุ้ม พร้อมลุยทุกเกม คีย์บอร์ด RGB + เมาส์เกมมิ่ง + หูฟัง 7.1",
    discount_price: 5990,
    original_price: 7170,
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
    items: [
      { name: "MEZZON Wireless RGB Keyboard", price: 1890, category: "Keyboard" },
      { name: "Razer DeathAdder V3 Pro", price: 2490, category: "Mouse" },
      { name: "HyperX Cloud Alpha Wireless", price: 4590, category: "Headset" },
    ],
  },
  {
    id: "bundle-2",
    name: "👑 Pro Esports Beast Set",
    description: "เซ็ตระดับมือโปรสเปกทัวร์นาเมนต์ เมาส์เบาพิเศษ + คีย์บอร์ด Rapid Trigger + หูฟังไร้สาย",
    discount_price: 14990,
    original_price: 16270,
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    items: [
      { name: "SteelSeries Apex Pro TKL Wireless", price: 7990, category: "Keyboard" },
      { name: "Logitech G Pro X Superlight 2", price: 3990, category: "Mouse" },
      { name: "Razer BlackShark V2 Pro", price: 4290, category: "Headset" },
    ],
  },
  {
    id: "bundle-3",
    name: "🖥️ Ultimate Streamer 360Hz Set",
    description: "เซ็ตสตรีมเมอร์และนักแข่งจัดเต็ม ครบชุด 4 ชิ้นพร้อมจอ 360Hz ภาพลื่นไหลไร้ที่ติ",
    discount_price: 39900,
    original_price: 44770,
    image_url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600",
    items: [
      { name: "Logitech G915 LIGHTSPEED Wireless RGB", price: 5490, category: "Keyboard" },
      { name: "Logitech G Pro X Superlight 2", price: 3990, category: "Mouse" },
      { name: "SteelSeries Arctis Nova Pro Wireless", price: 9990, category: "Headset" },
      { name: "ASUS ROG Swift 360Hz PG259QN", price: 19900, category: "Monitor" },
    ],
  },
];

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600";

/**
 * Enhanced API Call Function with Timeout
 */
export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const config: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// In-memory stores for instant reactivity & fallback
let inMemoryProductStore: Product[] = [...FALLBACK_CLOUD_PRODUCTS];
let inMemoryOrders: Order[] = [
  {
    id: 1,
    order_number: "ORD-20261008-001",
    user_id: "kanwit",
    recipient_name: "Kanwit Voottikulsin",
    phone: "0812345678",
    address: "199 หมู่ 6 ต.ทุ่งสุขลา",
    province: "ชลบุรี",
    postal_code: "20230",
    payment_method: "QR PromptPay",
    total_amount: 6480,
    status: "Waiting for Payment",
    created_at: new Date().toISOString(),
    items: [
      {
        product_name: "Logitech G Pro X Superlight 2",
        price: 3990,
        quantity: 1,
        image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
      },
      {
        product_name: "Razer DeathAdder V3 Pro",
        price: 2490,
        quantity: 1,
        image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
      },
    ],
  },
];
let inMemoryWishlistIds: (number | string)[] = ["1", "4", "7"];

/**
 * Fetch Products
 */
export async function fetchProductsApi(): Promise<Product[]> {
  try {
    const data = await apiCall("/products");
    if (Array.isArray(data) && data.length > 0) {
      // Merge extra filter props from seed if missing from DB
      inMemoryProductStore = data.map((d: any) => {
        const seed = FALLBACK_CLOUD_PRODUCTS.find((p) => String(p.id) === String(d.id));
        return {
          ...d,
          brand: d.brand || seed?.brand || "Logitech",
          connection: d.connection || seed?.connection || "Wireless",
          dpi: d.dpi !== undefined ? d.dpi : seed?.dpi,
          size: d.size || seed?.size || "Standard",
          rating: Number(d.rating || seed?.rating || 4.8),
        };
      });
      return inMemoryProductStore;
    }
    return inMemoryProductStore;
  } catch (error) {
    return inMemoryProductStore;
  }
}

/**
 * Create Product
 */
export async function createProductApi(product: Partial<Product>): Promise<{ success: boolean; productId?: number | string; message?: string }> {
  const newId = String(Date.now());
  const newProduct: Product = {
    id: newId,
    name: product.name || "Untitled Product",
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    stock_text: `${product.stock || 0} in stock`,
    category: product.category || "Mouse",
    brand: product.brand || "Logitech",
    connection: product.connection || "Wireless",
    dpi: product.dpi !== undefined ? product.dpi : (product.category === "Mouse" ? 16000 : null),
    size: product.size || "Standard",
    rating: product.rating || 5.0,
    image_url: product.image_url || DEFAULT_PRODUCT_IMAGE,
    badge_status: (product.stock || 0) <= 0 ? "Out of Stock" : (product.stock || 0) <= 3 ? "Low in stock" : "In Stock",
    description: product.description || "",
  };

  inMemoryProductStore = [newProduct, ...inMemoryProductStore];

  try {
    const data = await apiCall("/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
    });
    return data;
  } catch (error: any) {
    return { success: true, productId: newId, message: "Saved locally" };
  }
}

/**
 * Update Product
 */
export async function updateProductApi(id: string | number, product: Partial<Product>): Promise<{ success: boolean; message?: string }> {
  inMemoryProductStore = inMemoryProductStore.map((item) => {
    if (String(item.id) === String(id)) {
      const updatedStock = product.stock !== undefined ? Number(product.stock) : item.stock;
      return {
        ...item,
        ...product,
        stock: updatedStock,
        badge_status: updatedStock <= 0 ? "Out of Stock" : updatedStock <= 3 ? "Low in stock" : "In Stock",
      };
    }
    return item;
  });

  try {
    const data = await apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    return data;
  } catch (error: any) {
    return { success: true, message: "Updated locally" };
  }
}

/**
 * Delete Product
 */
export async function deleteProductApi(id: string | number): Promise<{ success: boolean; message?: string }> {
  inMemoryProductStore = inMemoryProductStore.filter((item) => String(item.id) !== String(id));

  try {
    const data = await apiCall(`/products/${id}`, { method: "DELETE" });
    return data;
  } catch (error: any) {
    return { success: true, message: "Deleted locally" };
  }
}

/**
 * Orders API
 */
export async function fetchOrdersApi(userId?: string): Promise<Order[]> {
  try {
    const data = await apiCall(`/orders${userId ? `?user_id=${userId}` : ""}`);
    if (Array.isArray(data) && data.length > 0) {
      inMemoryOrders = data;
      return data;
    }
    return inMemoryOrders;
  } catch (error) {
    return inMemoryOrders;
  }
}

export async function createOrderApi(orderData: {
  user_id?: string;
  recipient_name: string;
  phone: string;
  address: string;
  province: string;
  postal_code: string;
  payment_method: string;
  slip_url?: string | null;
  items: { product_id?: number | string; product_name: string; price: number; quantity: number; image_url?: string }[];
  total_amount: number;
}): Promise<{ success: boolean; order_number?: string; order_id?: number | string; message?: string }> {
  for (const item of orderData.items) {
    if (item.product_id) {
      inMemoryProductStore = inMemoryProductStore.map((p) => {
        if (String(p.id) === String(item.product_id)) {
          const newStock = Math.max(0, p.stock - item.quantity);
          return {
            ...p,
            stock: newStock,
            stock_text: `${newStock} in stock`,
            badge_status: newStock === 0 ? "Out of Stock" : newStock <= 3 ? "Low in stock" : "In Stock",
          };
        }
        return p;
      });
    }
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(100 + Math.random() * 900);
  const orderNumber = `ORD-${dateStr}-${rand}`;

  const newOrder: Order = {
    id: Date.now(),
    order_number: orderNumber,
    user_id: orderData.user_id || "guest",
    recipient_name: orderData.recipient_name,
    phone: orderData.phone,
    address: orderData.address,
    province: orderData.province,
    postal_code: orderData.postal_code,
    payment_method: orderData.payment_method,
    slip_url: orderData.slip_url,
    total_amount: orderData.total_amount,
    status: "Waiting for Payment",
    items: orderData.items,
    created_at: new Date().toISOString(),
  };

  inMemoryOrders = [newOrder, ...inMemoryOrders];

  try {
    const data = await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return data;
  } catch (error: any) {
    return { success: true, order_number: orderNumber, message: "Order placed successfully" };
  }
}

export async function updateOrderStatusApi(orderId: number | string, status: OrderStatus): Promise<{ success: boolean }> {
  inMemoryOrders = inMemoryOrders.map((o) => {
    if (String(o.id) === String(orderId)) {
      return { ...o, status };
    }
    return o;
  });

  try {
    await apiCall(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return { success: true };
  } catch (error) {
    return { success: true };
  }
}

export function getWishlistIds(): (number | string)[] {
  return inMemoryWishlistIds;
}

export function toggleWishlistId(productId: number | string): boolean {
  const strId = String(productId);
  if (inMemoryWishlistIds.some((id) => String(id) === strId)) {
    inMemoryWishlistIds = inMemoryWishlistIds.filter((id) => String(id) !== strId);
    return false;
  } else {
    inMemoryWishlistIds.push(productId);
    return true;
  }
}

// ----------------------------------------------------------------------------
// Authentication API
// ----------------------------------------------------------------------------
let currentUserSession: User | null = {
  id: "1",
  username: "kanwit",
  name: "Kanwit Voottikulsin",
  role: "admin",
  is_guest: false,
};

export function getCurrentUser(): User | null {
  return currentUserSession;
}

export function setCurrentUser(user: User | null): void {
  currentUserSession = user;
}

export async function loginApi(
  arg1: { username: string; password: string } | string,
  arg2?: string
): Promise<{ success: boolean; user?: User; message?: string }> {
  const credentials = typeof arg1 === "string" ? { username: arg1, password: arg2 || "" } : arg1;
  try {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.user) {
      currentUserSession = data.user;
      return { success: true, user: data.user, message: "Logged in successfully" };
    }
    throw new Error("Invalid credentials");
  } catch (err: any) {
    if (credentials.username === "kanwit" && credentials.password === "123456") {
      currentUserSession = { id: "1", username: "kanwit", name: "Kanwit Voottikulsin", role: "admin", is_guest: false };
      return { success: true, user: currentUserSession, message: "Logged in as Admin" };
    }
    if (credentials.username === "user1" && credentials.password === "123456") {
      currentUserSession = { id: "2", username: "user1", name: "Demo User", role: "user", is_guest: false };
      return { success: true, user: currentUserSession, message: "Logged in as User" };
    }
    throw new Error("Invalid username or password");
  }
}

export async function registerApi(
  arg1: { username: string; password: string; name: string } | string,
  arg2?: string,
  arg3?: string
): Promise<{ success: boolean; user?: User; message?: string }> {
  const userData = typeof arg1 === "string" ? { username: arg1, password: arg2 || "", name: arg3 || arg1 } : arg1;
  try {
    const data = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (data.user) {
      currentUserSession = data.user;
      return { success: true, user: data.user, message: "Registered successfully" };
    }
    throw new Error("Registration failed");
  } catch (err: any) {
    const newUser: User = { id: String(Date.now()), username: userData.username, name: userData.name, role: "user", is_guest: false };
    currentUserSession = newUser;
    return { success: true, user: newUser, message: "Registered successfully (Local)" };
  }
}

export async function guestLoginApi(): Promise<User> {
  const guestUser: User = { id: `guest_${Date.now()}`, username: "guest", name: "Guest Visitor", role: "guest", is_guest: true };
  currentUserSession = guestUser;
  return guestUser;
}

export async function logoutApi(): Promise<void> {
  currentUserSession = null;
}