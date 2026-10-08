-- ============================================================================
-- SQL Schema for Database: ip_std6730251417
-- Course: Internet Programming, Kasetsart University Sriracha Campus
-- Student: std6730251417 (Kanwit Voottikulsin)
-- 
-- 1. ส่วนงานเดี่ยว (Individual Assignment): ตาราง `products` (3 ชิ้นเดิม) & `users`
-- 2. ส่วนงานกลุ่ม (Group Project - mono Gaming): ตาราง `group_...` (35 ชิ้นใหม่ + AI + Orders)
-- ============================================================================

-- ============================================================================
-- PART 1: งานเดี่ยว (INDIVIDUAL ASSIGNMENT)
-- ============================================================================

-- 1.1 ตาราง users (งานเดี่ยว)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`username`, `password`, `name`, `role`)
VALUES
('kanwit', '123456', 'Kanwit Voottikulsin', 'admin'),
('user1', '123456', 'Demo User', 'user');

-- 1.2 ตาราง products (งานเดี่ยว: 3 สินค้าดั้งเดิม)
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `stock_text` VARCHAR(100),
  `category` VARCHAR(100),
  `location_count` INT DEFAULT 1,
  `location_text` VARCHAR(255) DEFAULT 'Bangkok Store',
  `badge_status` VARCHAR(50) DEFAULT 'In Stock',
  `rating` DECIMAL(3, 1) DEFAULT 5.0,
  `image_url` TEXT,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `name`, `price`, `stock`, `stock_text`, `category`, `location_count`, `location_text`, `badge_status`, `rating`, `image_url`, `description`)
VALUES
(1, 'HyperX Cloud Alpha Wireless Gaming Headset', 4590.00, 25, '25 in stock', 'Gaming Headset', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_alpha_2_wireless_aj5c7aa_angle_4.jpg?v=1783627902', 'หูฟังเกมมิ่งไร้สาย ไดรเวอร์ Dual Chamber แบตเตอรี่ใช้งานได้ยาวนานถึง 300 ชั่วโมง พร้อมระบบเสียง DTS Spatial Audio'),
(2, 'MEZZON Wireless RGB Mechanical Keyboard', 1890.00, 14, '14 in stock', 'Gaming Keyboard', 1, 'Main Warehouse', 'In Stock', 4.8, 'https://media.sbdesignsquare.com/media/catalog/product/3/9/39023754-1.jpg', 'คีย์บอร์ดเกมมิ่งไร้สาย Mechanical Full-size ไฟ RGB ปรับแต่งได้ 18 โหมด พร้อมปุ่ม Multi-function Knob'),
(3, 'Logitech G PRO X SUPERLIGHT Wireless Gaming Mouse', 4290.00, 3, '3 in stock', 'Gaming Mouse', 1, 'Bangkok Store', 'Low in stock', 4.9, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlBLsKuJ2lV6B1njgvLjTtkfApV4rfZusJbGmHKuebsw&s=10', 'เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ เซนเซอร์ HERO 25K ความแม่นยำสูงระดับโปรอีสปอร์ต');


-- ============================================================================
-- PART 2: งานกลุ่ม (GROUP PROJECT - mono Gaming E-Commerce + AI)
-- ============================================================================

-- 2.1 ตาราง group_users (ผู้ใช้งานและสมาชิกงานกลุ่ม)
DROP TABLE IF EXISTS `group_users`;
CREATE TABLE `group_users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `is_guest` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group_users` (`username`, `password`, `name`, `role`, `is_guest`)
VALUES
('kanwit', '123456', 'Kanwit Voottikulsin', 'admin', FALSE),
('user1', '123456', 'Demo User', 'user', FALSE),
('guest', 'guest', 'Guest Visitor', 'guest', TRUE);

-- 2.2 ตาราง group_products (สินค้างานกลุ่ม 35 รายการ พร้อมสเปก)
DROP TABLE IF EXISTS `group_products`;
CREATE TABLE `group_products` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `stock_text` VARCHAR(100),
  `category` VARCHAR(100),
  `brand` VARCHAR(100) DEFAULT 'Logitech',
  `connection` VARCHAR(50) DEFAULT 'Wireless',
  `dpi` INT DEFAULT NULL,
  `size` VARCHAR(100) DEFAULT 'Standard',
  `location_count` INT DEFAULT 1,
  `location_text` VARCHAR(255) DEFAULT 'Bangkok Store',
  `badge_status` VARCHAR(50) DEFAULT 'In Stock',
  `rating` DECIMAL(3, 1) DEFAULT 5.0,
  `image_url` TEXT,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group_products` (`id`, `name`, `price`, `stock`, `stock_text`, `category`, `brand`, `connection`, `dpi`, `size`, `location_count`, `location_text`, `badge_status`, `rating`, `image_url`, `description`)
VALUES
-- Mouse
(1, 'Logitech G Pro X Superlight 2', 3990.00, 12, '12 in stock', 'Mouse', 'Logitech', 'Wireless', 32000, 'Medium (60g)', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ เซนเซอร์ HERO 2 32,000 DPI สวิตช์ LIGHTFORCE ไฮบริด'),
(2, 'Razer DeathAdder V3 Pro', 2490.00, 3, '3 in stock', 'Mouse', 'Razer', 'Wireless', 30000, 'Ergonomic (63g)', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'เมาส์สายพันธุ์แชมป์ Ergonomic ออกแบบสำหรับมือขวา น้ำหนัก 63g เซนเซอร์ Focus Pro 30K Optical'),
(3, 'ZOWIE EC2-CW Wireless Mouse', 4890.00, 0, '0 in stock', 'Mouse', 'ZOWIE', 'Wireless', 3200, 'Medium (77g)', 1, 'Warehouse B', 'Out of Stock', 4.7, 'https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600', 'เมาส์อีสปอร์ตไร้สายยอดนิยมระดับทัวร์นาเมนต์ ส่งสัญญาณเสถียรด้วย Enhanced Receiver'),
-- Keyboard
(4, 'SteelSeries Apex Pro TKL Wireless', 7990.00, 8, '8 in stock', 'Keyboard', 'SteelSeries', 'Wireless', NULL, 'TKL (80%)', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ดเกมมิ่ง OmniPoint 2.0 ปรับแต่งระยะกดปุ่มได้ตั้งแต่ 0.2mm - 3.8mm พร้อมจอ OLED Smart Display'),
(5, 'MEZZON Wireless RGB Mechanical Keyboard', 1890.00, 14, '14 in stock', 'Keyboard', 'MEZZON', 'Wireless', NULL, 'Full-size (100%)', 1, 'Main Warehouse', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 'คีย์บอร์ดเกมมิ่งไร้สาย Mechanical Full-size ไฟ RGB ปรับแต่งได้ 18 โหมด พร้อมปุ่ม Multi-function Knob'),
(6, 'Logitech G915 LIGHTSPEED Wireless RGB', 5490.00, 2, '2 in stock', 'Keyboard', 'Logitech', 'Wireless', NULL, 'Low-Profile Full-size', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', 'คีย์บอร์ดไร้สายสวิตช์ Low Profile อะลูมิเนียมเกรดอากาศยาน บางเฉียบ หรูหราและตอบสนองฉับไว'),
-- Headset
(7, 'HyperX Cloud Alpha Wireless', 4590.00, 15, '15 in stock', 'Headset', 'HyperX', 'Wireless', NULL, 'Over-Ear (300h Battery)', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'หูฟังเกมมิ่งไร้สาย แบตเตอรี่ใช้งานได้ยาวนาน 300 ชั่วโมง ระบบเสียง DTS Headphone:X Spatial Audio'),
(8, 'Razer BlackShark V2 Pro', 4290.00, 3, '3 in stock', 'Headset', 'Razer', 'Wireless', NULL, 'Over-Ear (320g)', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 'หูฟังสำหรับนักกีฬาอีสปอร์ต ไมโครโฟน HyperClear Super Wideband ไดรเวอร์ TriForce Titanium 50mm'),
(9, 'SteelSeries Arctis Nova Pro Wireless', 9990.00, 5, '5 in stock', 'Headset', 'SteelSeries', 'Wireless', NULL, 'Over-Ear (ANC)', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'หูฟังระดับท็อป พรีเมียม Hi-Res Audio พร้อมระบบตัดเสียงรบกวน Active Noise Cancelling (ANC)'),
-- Monitor
(10, 'ASUS ROG Swift 360Hz PG259QN', 19900.00, 4, '4 in stock', 'Monitor', 'ASUS ROG', 'Wired', NULL, '24.5 Inch', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', 'จอเกมมิ่งระดับโปร 24.5 นิ้ว Fast IPS 360Hz 1ms รองรับ NVIDIA G-SYNC และ Reflex Latency Analyzer'),
(11, 'BenQ ZOWIE XL2546K 240Hz 24.5\"', 14900.00, 1, '1 in stock', 'Monitor', 'BenQ ZOWIE', 'Wired', NULL, '24.5 Inch', 1, 'Bangkok Store', 'Low in stock', 4.9, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600', 'จอเกมมิ่งแข่งขันอีสปอร์ตระดับโลก เทคโนโลยี DyAc+ ลดภาพเบลอจากการสั่นไหว พร้อมฐานขนาดกะทัดรัด'),
(12, 'LG UltraGear OLED 27\" 240Hz QHD', 26900.00, 0, '0 in stock', 'Monitor', 'LG', 'Wired', NULL, '27 Inch', 1, 'Warehouse A', 'Out of Stock', 5.0, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', 'จอเกมมิ่ง OLED ความละเอียด 2K QHD รีเฟรชเรท 240Hz ความเร็ว 0.03ms สีดำลึกและคมชัดสูงสุด'),
-- AI Setup Gear
(13, 'Razer Huntsman Mini 60% Optical', 3490.00, 10, '10 in stock', 'Keyboard', 'Razer', 'Wired', NULL, '60%', 2, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ดเกมมิ่ง 60% Optical Switch สวิตช์แสงตอบสนองระดับเสี้ยววินาที สำหรับเกมเมอร์ FPS'),
(14, 'HyperX Cloud III Gaming Headset', 2990.00, 8, '8 in stock', 'Headset', 'HyperX', 'Wired', NULL, 'Over-Ear (Memory Foam)', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'หูฟังเกมมิ่งระดับตำนาน ปรับปรุงเสียงคมชัด ไมโครโฟนตัดเสียงรบกวน 10mm เมมโมรี่โฟมนุ่มสบาย'),
(15, 'AOC 24G2SP 165Hz IPS Gaming Monitor', 5990.00, 6, '6 in stock', 'Monitor', 'AOC', 'Wired', NULL, '24 Inch', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', 'จอเกมมิ่ง IPS 165Hz 1ms MPRT คุ้มค่าที่สุดสำหรับ Valorant และเกม FPS esports'),
(16, 'SteelSeries QcK Heavy Gaming Mousepad', 690.00, 25, '25 in stock', 'Mouse Pad', 'SteelSeries', 'Cloth', NULL, 'Large (450x400mm)', 3, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'แผ่นรองเมาส์ผ้าระดับโปร หนาพิเศษ 6mm ช่วยควบคุมเมาส์ได้อย่างแม่นยำ เหมาะกับเกมยิง Tactical'),
-- Extended Catalog
(17, 'Razer Viper V3 Pro Wireless', 5690.00, 9, '9 in stock', 'Mouse', 'Razer', 'Wireless', 35000, 'Symmetrical (54g)', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'เมาส์ไร้สายระดับเทพ น้ำหนักเพียง 54 กรัม เซนเซอร์ Focus Pro Gen-2 35,000 DPI พร้อม True 8000Hz Polling'),
(18, 'Logitech G502 X PLUS LIGHTSPEED', 4990.00, 7, '7 in stock', 'Mouse', 'Logitech', 'Wireless', 25600, 'Ergonomic (106g)', 2, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'เมาส์เกมมิ่งในตำนานรุ่นอัปเกรด สวิตช์ไฮบริด LIGHTFORCE และไฟ RGB 8 โซน'),
(19, 'Pulsar X2 V2 Wireless Gaming Mouse', 3290.00, 11, '11 in stock', 'Mouse', 'Pulsar', 'Wireless', 26000, 'Symmetrical (52g)', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600', 'เมาส์ไร้สายทรงสมมาตร น้ำหนักเบา 52g เซนเซอร์ PAW3395 สวิตช์ Optical'),
(20, 'Logitech G PRO X TKL LIGHTSPEED', 6990.00, 6, '6 in stock', 'Keyboard', 'Logitech', 'Wireless', NULL, 'TKL (80%)', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ดเกมมิ่งไร้สายระดับแชมป์ คีย์แคป Dual-shot PBT'),
(21, 'Wooting 60HE+ Analog Mechanical', 7990.00, 3, '3 in stock', 'Keyboard', 'Wooting', 'Wired', NULL, '60%', 1, 'Bangkok Store', 'Low in stock', 5.0, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 'คีย์บอร์ด Hall Effect อันดับ 1 ของโลก ระบบ Rapid Trigger ปรับระยะกดได้ 0.1mm'),
(22, 'Corsair K70 RGB PRO Mechanical', 5290.00, 8, '8 in stock', 'Keyboard', 'Corsair', 'Wired', NULL, 'Full-size (100%)', 2, 'Bangkok Store', 'In Stock', 4.7, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', 'คีย์บอร์ดโครงอะลูมิเนียมเกรดอากาศยาน สวิตช์ CHERRY MX Red เทคโนโลยี 8000Hz'),
(23, 'Keychron Q1 Pro Wireless Custom', 6490.00, 5, '5 in stock', 'Keyboard', 'Keychron', 'Wireless', NULL, '75%', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ด Custom ระดับพรีเมียม บอดี้อะลูมิเนียม CNC Gasket Mount นุ่มมือ'),
(24, 'Logitech G PRO X 2 LIGHTSPEED Headset', 7990.00, 7, '7 in stock', 'Headset', 'Logitech', 'Wireless', NULL, 'Over-Ear', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'หูฟังเกมมิ่งไดรเวอร์ Graphene 50mm มิติเสียงคมชัด แบตเตอรี่ 50 ชม.'),
(25, 'Corsair HS80 MAX Wireless Headset', 4990.00, 6, '6 in stock', 'Headset', 'Corsair', 'Wireless', NULL, 'Over-Ear (Dolby)', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 'หูฟังระบบเสียงรอบทิศทาง Dolby Atmos ไมโครโฟนเกรดบรอดแคสต์คมชัด'),
(26, 'SteelSeries Arctis Nova 7 Wireless', 6290.00, 8, '8 in stock', 'Headset', 'SteelSeries', 'Wireless', NULL, 'Over-Ear (Dual Wireless)', 2, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'หูฟังเกมมิ่งระบบ Nova Acoustic System เชื่อมต่อพร้อมกัน 2.4GHz + BT'),
(27, 'Samsung Odyssey OLED G6 27" 360Hz', 26900.00, 3, '3 in stock', 'Monitor', 'Samsung', 'Wired', NULL, '27 Inch QHD', 1, 'Bangkok Store', 'Low in stock', 5.0, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', 'จอเกมมิ่ง OLED 27 นิ้ว QHD 2K ความเร็ว 360Hz ตอบสนอง 0.03ms'),
(28, 'ASUS TUF Gaming VG259QM 280Hz', 8990.00, 5, '5 in stock', 'Monitor', 'ASUS ROG', 'Wired', NULL, '24.5 Inch', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', 'จอเกมมิ่ง Fast IPS 24.5 นิ้ว Overclock รีเฟรชเรท 280Hz 1ms ELMB Sync'),
(29, 'Alienware AW2524HF 500Hz Fast IPS', 24900.00, 2, '2 in stock', 'Monitor', 'Alienware', 'Wired', NULL, '24.5 Inch (500Hz)', 1, 'Bangkok Store', 'Low in stock', 4.9, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600', 'จอเกมมิ่งเร็วที่สุดในโลก 500Hz Fast IPS 0.5ms สำหรับทัวร์นาเมนต์ระดับโลก'),
(30, 'MSI MAG 274UPF 4K 144Hz 27"', 15900.00, 4, '4 in stock', 'Monitor', 'MSI', 'Wired', NULL, '27 Inch 4K UHD', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', 'จอเกมมิ่ง 4K UHD Rapid IPS 144Hz 1ms Type-C 65W สีแม่นยำสูง'),
(31, 'Artisan Hayate Otsu FX Soft XL', 2490.00, 12, '12 in stock', 'Mouse Pad', 'Artisan', 'Cloth / Poron', NULL, 'XL (490x420mm)', 2, 'Bangkok Store', 'In Stock', 5.0, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'แผ่นรองเมาส์ญี่ปุ่นอันดับ 1 ของโลก ฐาน Poron ญี่ปุ่น ยึดโต๊ะแน่น'),
(32, 'ZOWIE G-SR II Cloth Mousepad', 1290.00, 18, '18 in stock', 'Mouse Pad', 'ZOWIE', 'Cloth', NULL, 'Large (470x390mm)', 2, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'แผ่นรองเมาส์สาย Control ป้องกันความชื้นและเหงื่อ ลากเมาส์เสถียร'),
(33, 'Razer Strider Hybrid Mouse Mat XXL', 1890.00, 10, '10 in stock', 'Mouse Pad', 'Razer', 'Hybrid', NULL, 'XXL (940x410mm)', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'แผ่นรองเมาส์ไฮบริด XXL คลุมทั้งโต๊ะ กันน้ำซึม ลื่นนุ่มทนทาน'),
(34, 'Logitech G640 Large Cloth Gaming Pad', 890.00, 20, '20 in stock', 'Mouse Pad', 'Logitech', 'Cloth', NULL, 'Large (460x400mm)', 3, 'Bangkok Store', 'In Stock', 4.7, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'แผ่นรองเมาส์ผ้าขนาดใหญ่ ปรับจูนเข้ากับเซนเซอร์ Logitech HERO สมบูรณ์แบบ'),
(35, 'Ducky One 3 RGB TKL Hot-Swap', 4290.00, 6, '6 in stock', 'Keyboard', 'Ducky', 'Wired', NULL, 'TKL (80%)', 1, 'Bangkok Store', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ด Hot-Swap Cherry MX PBT Double-shot ซับเสียง EVA สองชั้น');

-- 2.3 ตาราง group_orders (คำสั่งซื้อของงานกลุ่ม)
DROP TABLE IF EXISTS `group_orders`;
CREATE TABLE `group_orders` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` VARCHAR(50) DEFAULT 'guest',
  `recipient_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `payment_method` VARCHAR(100) NOT NULL,
  `slip_url` TEXT,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Waiting for Payment',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.4 ตาราง group_order_items (รายการสินค้าในคำสั่งซื้อของงานกลุ่ม)
DROP TABLE IF EXISTS `group_order_items`;
CREATE TABLE `group_order_items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group_orders` (`id`, `order_number`, `user_id`, `recipient_name`, `phone`, `address`, `province`, `postal_code`, `payment_method`, `total_amount`, `status`)
VALUES
(1, 'ORD-20261008-001', 'kanwit', 'Kanwit Voottikulsin', '0812345678', '199 หมู่ 6 ต.ทุ่งสุขลา', 'ชลบุรี', '20230', 'QR PromptPay', 6480.00, 'Waiting for Payment');

INSERT INTO `group_order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `image_url`)
VALUES
(1, 1, 'Logitech G Pro X Superlight 2', 3990.00, 1, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600'),
(1, 2, 'Razer DeathAdder V3 Pro', 2490.00, 1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600');

-- 2.5 ตาราง group_wishlists
DROP TABLE IF EXISTS `group_wishlists`;
CREATE TABLE `group_wishlists` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_unique` (`user_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.6 ตาราง group_gaming_sets
DROP TABLE IF EXISTS `group_gaming_sets`;
CREATE TABLE `group_gaming_sets` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `discount_price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NOT NULL,
  `image_url` TEXT,
  `items_json` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group_gaming_sets` (`id`, `name`, `description`, `discount_price`, `original_price`, `image_url`, `items_json`)
VALUES
(1, 'Starter Gamer Set', 'เซ็ตเกมมิ่งเริ่มต้นสุดคุ้ม คีย์บอร์ด RGB + เมาส์เกมมิ่ง + หูฟัง 7.1', 5990.00, 7170.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600', '[{"name":"MEZZON Wireless RGB Keyboard","price":1890},{"name":"Razer DeathAdder V3 Pro","price":2490},{"name":"HyperX Cloud Alpha Wireless","price":4590}]'),
(2, 'Pro Esports Beast Set', 'เซ็ตโปรเพลเยอร์สเปกแข่งขันระดับโลก เมาส์เบาพิเศษ + คีย์บอร์ด Rapid Trigger + หูฟังไร้สาย', 14990.00, 16270.00, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', '[{"name":"SteelSeries Apex Pro TKL","price":7990},{"name":"Logitech G Pro X Superlight 2","price":3990},{"name":"Razer BlackShark V2 Pro","price":4290}]'),
(3, 'Ultimate Streamer 360Hz Set', 'เซ็ตสตรีมเมอร์และนักแข่งจัดเต็ม ครบชุดพร้อมจอ 360Hz ภาพลื่นไหลไร้ที่ติ', 39900.00, 44770.00, 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600', '[{"name":"Logitech G915 LIGHTSPEED","price":5490},{"name":"Logitech G Pro X Superlight 2","price":3990},{"name":"SteelSeries Arctis Nova Pro","price":9990},{"name":"ASUS ROG Swift 360Hz","price":19900}]');