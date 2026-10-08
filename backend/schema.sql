-- ============================================================================
-- SQL Schema & Sample Data for Cloud MySQL Database
-- Course: Internet Programming (React Native + Cloud DB)
-- Database: ip_std6730251417
-- User: std6730251417
-- ============================================================================

-- 1. Table: users (Authentication - Login, Sign Up, and Guest Login)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `is_guest` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`username`, `password`, `name`, `role`, `is_guest`)
VALUES
('kanwit', '123456', 'Kanwit Voottikulsin', 'admin', FALSE),
('user1', '123456', 'Demo User', 'user', FALSE),
('guest', 'guest', 'Guest Visitor', 'guest', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `role`=VALUES(`role`);

-- 2. Table: products (Inventory & Catalog - Keyboard, Mouse, Headset, Monitor)
CREATE TABLE IF NOT EXISTS `products` (
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

-- Sample Gaming Gear Products across Categories (Keyboard, Mouse, Headset, Monitor)
INSERT INTO `products` (`id`, `name`, `price`, `stock`, `stock_text`, `category`, `location_count`, `location_text`, `badge_status`, `rating`, `image_url`, `description`)
VALUES
-- Mouse
(1, 'Logitech G Pro X Superlight 2', 3990.00, 12, '12 in stock', 'Mouse', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', 'เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ เซนเซอร์ HERO 2 32,000 DPI สวิตช์ LIGHTFORCE ไฮบริด'),
(2, 'Razer DeathAdder V3 Pro', 2490.00, 3, '3 in stock', 'Mouse', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'เมาส์สายพันธุ์แชมป์ Ergonomic ออกแบบสำหรับมือขวา น้ำหนัก 63g เซนเซอร์ Focus Pro 30K Optical'),
(3, 'ZOWIE EC2-CW Wireless Mouse', 4890.00, 0, '0 in stock', 'Mouse', 1, 'Warehouse B', 'Out of Stock', 4.7, 'https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600', 'เมาส์อีสปอร์ตไร้สายยอดนิยมระดับทัวร์นาเมนต์ ส่งสัญญาณเสถียรด้วย Enhanced Receiver'),

-- Keyboard
(4, 'SteelSeries Apex Pro TKL Wireless', 7990.00, 8, '8 in stock', 'Keyboard', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 'คีย์บอร์ดเกมมิ่ง OmniPoint 2.0 ปรับแต่งระยะกดปุ่มได้ตั้งแต่ 0.2mm - 3.8mm พร้อมจอ OLED Smart Display'),
(5, 'MEZZON Wireless RGB Mechanical Keyboard', 1890.00, 14, '14 in stock', 'Keyboard', 1, 'Main Warehouse', 'In Stock', 4.8, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 'คีย์บอร์ดเกมมิ่งไร้สาย Mechanical Full-size ไฟ RGB ปรับแต่งได้ 18 โหมด พร้อมปุ่ม Multi-function Knob'),
(6, 'Logitech G915 LIGHTSPEED Wireless RGB', 5490.00, 2, '2 in stock', 'Keyboard', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', 'คีย์บอร์ดไร้สายสวิตช์ Low Profile อะลูมิเนียมเกรดอากาศยาน บางเฉียบ หรูหราและตอบสนองฉับไว'),

-- Headset
(7, 'HyperX Cloud Alpha Wireless', 4590.00, 15, '15 in stock', 'Headset', 2, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'หูฟังเกมมิ่งไร้สาย แบตเตอรี่ใช้งานได้ยาวนาน 300 ชั่วโมง ระบบเสียง DTS Headphone:X Spatial Audio'),
(8, 'Razer BlackShark V2 Pro', 4290.00, 3, '3 in stock', 'Headset', 1, 'Bangkok Store', 'Low in stock', 4.8, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 'หูฟังสำหรับนักกีฬาอีสปอร์ต ไมโครโฟน HyperClear Super Wideband ไดรเวอร์ TriForce Titanium 50mm'),
(9, 'SteelSeries Arctis Nova Pro Wireless', 9990.00, 5, '5 in stock', 'Headset', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'หูฟังระดับท็อป พรีเมียม Hi-Res Audio พร้อมระบบตัดเสียงรบกวน Active Noise Cancelling (ANC)'),

-- Monitor
(10, 'ASUS ROG Swift 360Hz PG259QN', 19900.00, 4, '4 in stock', 'Monitor', 1, 'Bangkok Store', 'In Stock', 4.9, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', 'จอเกมมิ่งระดับโปร 24.5 นิ้ว Fast IPS 360Hz 1ms รองรับ NVIDIA G-SYNC และ Reflex Latency Analyzer'),
(11, 'BenQ ZOWIE XL2546K 240Hz 24.5"', 14900.00, 1, '1 in stock', 'Monitor', 1, 'Bangkok Store', 'Low in stock', 4.9, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600', 'จอเกมมิ่งแข่งขันอีสปอร์ตระดับโลก เทคโนโลยี DyAc+ ลดภาพเบลอจากการสั่นไหว พร้อมฐานขนาดกะทัดรัด'),
(12, 'LG UltraGear OLED 27" 240Hz QHD', 26900.00, 0, '0 in stock', 'Monitor', 1, 'Warehouse A', 'Out of Stock', 5.0, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', 'จอเกมมิ่ง OLED ความละเอียด 2K QHD รีเฟรชเรท 240Hz ความเร็ว 0.03ms สีดำลึกและคมชัดสูงสุด')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`), `stock`=VALUES(`stock`), `category`=VALUES(`category`);

-- 3. Table: orders (Orders & Checkout)
CREATE TABLE IF NOT EXISTS `orders` (
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

-- 4. Table: order_items (Items inside each order)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` TEXT,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Order Data
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `recipient_name`, `phone`, `address`, `province`, `postal_code`, `payment_method`, `total_amount`, `status`)
VALUES
(1, 'ORD-20261008-001', 'kanwit', 'Kanwit Voottikulsin', '0812345678', '199 หมู่ 6 ต.ทุ่งสุขลา', 'ชลบุรี', '20230', 'QR PromptPay', 6480.00, 'Waiting for Payment')
ON DUPLICATE KEY UPDATE `order_number`=VALUES(`order_number`);

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `image_url`)
VALUES
(1, 1, 'Logitech G Pro X Superlight 2', 3990.00, 1, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600'),
(1, 2, 'Razer DeathAdder V3 Pro', 2490.00, 1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600')
ON DUPLICATE KEY UPDATE `price`=VALUES(`price`);

-- 5. Table: wishlists (Saved Favorites)
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_unique` (`user_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: gaming_sets (Pre-built Gaming Bundles)
CREATE TABLE IF NOT EXISTS `gaming_sets` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `discount_price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NOT NULL,
  `image_url` TEXT,
  `items_json` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `gaming_sets` (`id`, `name`, `description`, `discount_price`, `original_price`, `image_url`, `items_json`)
VALUES
(1, 'Starter Gamer Set', 'เซ็ตเกมมิ่งเริ่มต้นสุดคุ้ม คีย์บอร์ด RGB + เมาส์เกมมิ่ง + หูฟัง 7.1', 5990.00, 7170.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600', '[{"name":"MEZZON Wireless RGB Keyboard","price":1890},{"name":"Razer DeathAdder V3 Pro","price":2490},{"name":"HyperX Cloud Alpha Wireless","price":4590}]'),
(2, 'Pro Esports Beast Set', 'เซ็ตโปรเพลเยอร์สเปกแข่งขันระดับโลก เมาส์เบาพิเศษ + คีย์บอร์ด Rapid Trigger + หูฟังไร้สาย', 14990.00, 16270.00, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', '[{"name":"SteelSeries Apex Pro TKL","price":7990},{"name":"Logitech G Pro X Superlight 2","price":3990},{"name":"Razer BlackShark V2 Pro","price":4290}]'),
(3, 'Ultimate Streamer 360Hz Set', 'เซ็ตสตรีมเมอร์และนักแข่งจัดเต็ม ครบชุดพร้อมจอ 360Hz ภาพลื่นไหลไร้ที่ติ', 39900.00, 44770.00, 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600', '[{"name":"Logitech G915 LIGHTSPEED","price":5490},{"name":"Logitech G Pro X Superlight 2","price":3990},{"name":"SteelSeries Arctis Nova Pro","price":9990},{"name":"ASUS ROG Swift 360Hz","price":19900}]')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);