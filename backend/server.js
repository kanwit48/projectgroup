/**
 * Cloud Database Backend (Express + MySQL)
 * Features:
 * - Auth (Sign In, Sign Up, Guest)
 * - Products Inventory & Stock (Categories: Keyboard, Mouse, Headset, Monitor)
 * - Cart & Checkout (Orders, Order Items, Slip Upload, Stock Deduction)
 * - Order Status Tracking (Waiting for Payment -> Payment Verified -> Preparing -> Shipping -> Delivered)
 * - Wishlist Management
 * - Gaming Bundles (ร้านจัดให้) & Custom Sets (ลูกค้าจัดเอง)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3103;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'std6730251417',
  password: process.env.DB_PASSWORD || 't7!s9Wqz',
  database: process.env.DB_NAME || 'ip_std6730251417',
};

let dbPool = null;

// Initial sample products
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Logitech G Pro X Superlight 2', price: 3990, stock: 12, category: 'Mouse', image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', description: 'เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ เซนเซอร์ HERO 2 32,000 DPI' },
  { id: 2, name: 'Razer DeathAdder V3 Pro', price: 2490, stock: 3, category: 'Mouse', image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', description: 'เมาส์สายพันธุ์แชมป์ Ergonomic ออกแบบสำหรับมือขวา น้ำหนัก 63g' },
  { id: 3, name: 'ZOWIE EC2-CW Wireless Mouse', price: 4890, stock: 0, category: 'Mouse', image_url: 'https://images.unsplash.com/photo-1626928308213-176c70817c91?w=600', description: 'เมาส์อีสปอร์ตไร้สายยอดนิยมระดับทัวร์นาเมนต์ ส่งสัญญาณเสถียร' },
  { id: 4, name: 'SteelSeries Apex Pro TKL Wireless', price: 7990, stock: 8, category: 'Keyboard', image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', description: 'คีย์บอร์ดเกมมิ่ง OmniPoint 2.0 ปรับแต่งระยะกดได้ 0.2mm - 3.8mm' },
  { id: 5, name: 'MEZZON Wireless RGB Mechanical Keyboard', price: 1890, stock: 14, category: 'Keyboard', image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', description: 'คีย์บอร์ดไร้สาย Mechanical Full-size ไฟ RGB 18 โหมด' },
  { id: 6, name: 'Logitech G915 LIGHTSPEED Wireless RGB', price: 5490, stock: 2, category: 'Keyboard', image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', description: 'คีย์บอร์ดไร้สายสวิตช์ Low Profile อะลูมิเนียมเกรดอากาศยาน' },
  { id: 7, name: 'HyperX Cloud Alpha Wireless', price: 4590, stock: 15, category: 'Headset', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', description: 'หูฟังเกมมิ่งไร้สาย แบตเตอรี่ใช้งานได้ 300 ชั่วโมง ระบบเสียง DTS' },
  { id: 8, name: 'Razer BlackShark V2 Pro', price: 4290, stock: 3, category: 'Headset', image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', description: 'หูฟังสำหรับนักกีฬาอีสปอร์ต ไมโครโฟน HyperClear ไดรเวอร์ 50mm' },
  { id: 9, name: 'SteelSeries Arctis Nova Pro Wireless', price: 9990, stock: 5, category: 'Headset', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', description: 'หูฟังระดับท็อป Hi-Res Audio ตัดเสียงรบกวน Active Noise Cancelling' },
  { id: 10, name: 'ASUS ROG Swift 360Hz PG259QN', price: 19900, stock: 4, category: 'Monitor', image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', description: 'จอเกมมิ่งระดับโปร 24.5 นิ้ว Fast IPS 360Hz 1ms รองรับ NVIDIA G-SYNC' },
  { id: 11, name: 'BenQ ZOWIE XL2546K 240Hz 24.5"', price: 14900, stock: 1, category: 'Monitor', image_url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600', description: 'จอเกมมิ่งแข่งขันอีสปอร์ต เทคโนโลยี DyAc+ ลดภาพเบลอจากการสั่น' },
  { id: 12, name: 'LG UltraGear OLED 27" 240Hz QHD', price: 26900, stock: 0, category: 'Monitor', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', description: 'จอเกมมิ่ง OLED ความละเอียด 2K QHD รีเฟรชเรท 240Hz ความเร็ว 0.03ms' },
  { id: 13, name: 'Razer Huntsman Mini 60% Optical', price: 3490, stock: 10, category: 'Keyboard', image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', description: 'คีย์บอร์ดเกมมิ่ง 60% Optical Switch สวิตช์แสงตอบสนองระดับเสี้ยววินาที สำหรับเกมเมอร์ FPS' },
  { id: 14, name: 'HyperX Cloud III Gaming Headset', price: 2990, stock: 8, category: 'Headset', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', description: 'หูฟังเกมมิ่งระดับตำนาน ปรับปรุงเสียงคมชัด ไมโครโฟนตัดเสียงรบกวน 10mm เมมโมรี่โฟมนุ่มสบาย' },
  { id: 15, name: 'AOC 24G2SP 165Hz IPS Gaming Monitor', price: 5990, stock: 6, category: 'Monitor', image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', description: 'จอเกมมิ่ง IPS 165Hz 1ms MPRT คุ้มค่าที่สุดสำหรับ Valorant และเกม FPS esports' },
  { id: 16, name: 'SteelSeries QcK Heavy Mousepad', price: 690, stock: 25, category: 'Mouse Pad', image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', description: 'แผ่นรองเมาส์ผ้าระดับโปร หนาพิเศษ 6mm ช่วยควบคุมเมาส์ได้อย่างแม่นยำ เหมาะกับเกมยิง Tactical' },
];

async function initDB() {
  try {
    dbPool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+07:00'
    });
    const conn = await dbPool.getConnection();
    console.log(' Connected to MySQL DB: ip_std6730251417');

    // 1. Users Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_guest BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Products Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        stock_text VARCHAR(100),
        category VARCHAR(100),
        location_count INT DEFAULT 1,
        location_text VARCHAR(255) DEFAULT 'Bangkok Store',
        badge_status VARCHAR(50) DEFAULT 'In Stock',
        rating DECIMAL(3, 1) DEFAULT 5.0,
        image_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Orders Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        user_id VARCHAR(50) DEFAULT 'guest',
        recipient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        province VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        slip_url LONGTEXT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Waiting for Payment',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Order Items Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        image_url TEXT
      )
    `);

    // 5. Wishlists Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_product (user_id, product_id)
      )
    `);

    // Seed default products if empty
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM products');
    if (existing[0].count === 0) {
      console.log(' Seeding default gaming gear products...');
      for (const p of INITIAL_PRODUCTS) {
        const badge = p.stock === 0 ? 'Out of Stock' : (p.stock <= 3 ? 'Low in stock' : 'In Stock');
        await conn.query(
          `INSERT INTO products (name, price, stock, stock_text, category, badge_status, image_url, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.price, p.stock, `${p.stock} in stock`, p.category, badge, p.image_url, p.description]
        );
      }
    }

    conn.release();
    console.log(' Database verified & ready.');
  } catch (err) {
    console.error(' MySQL Connection Notice:', err.message);
  }
}

// ----------------------------------------------------------------------------
// 1. Health Check
// ----------------------------------------------------------------------------
app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'Gaming Gear Backend Running', port: PORT });
});

// ----------------------------------------------------------------------------
// 2. Auth Routes
// ----------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, role = 'user' } = req.body || {};
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password and name are required' });
    }
    if (!dbPool) return res.status(500).json({ error: 'Database not connected' });

    const [existing] = await dbPool.query('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const [rs] = await dbPool.query(
      'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
      [username.trim(), password, name.trim(), role]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: String(rs.insertId), username: username.trim(), name: name.trim(), role },
      token: `token_${rs.insertId}_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (!dbPool) return res.status(500).json({ error: 'Database not connected' });

    const [rows] = await dbPool.query(
      'SELECT id, username, name, role, is_guest FROM users WHERE username = ? AND password = ?',
      [username.trim(), password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    return res.json({
      success: true,
      message: 'Login successful',
      user: { id: String(user.id), username: user.username, name: user.name, role: user.role, is_guest: !!user.is_guest },
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
});

// ----------------------------------------------------------------------------
// 3. Products Routes (Catalog, Search, Category Filter)
// ----------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { search, q, category } = req.query;
    const filterText = (search || q || '').trim();

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filterText) {
      sql += ' AND (name LIKE ? OR category LIKE ? OR description LIKE ?)';
      const wild = `%${filterText}%`;
      params.push(wild, wild, wild);
    }

    if (category && category !== 'All' && category !== 'All Products') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await dbPool.query(sql, params);
    const formatted = rows.map(r => ({
      id: String(r.id),
      name: r.name,
      price: Number(r.price),
      stock: Number(r.stock),
      stock_text: r.stock_text || `${r.stock} in stock`,
      category: r.category,
      location_count: Number(r.location_count || 1),
      location_text: r.location_text || 'Bangkok Store',
      badge_status: r.stock === 0 ? 'Out of Stock' : (r.stock <= 3 ? 'Low in stock' : (r.badge_status || 'In Stock')),
      rating: Number(r.rating || 5.0),
      image_url: r.image_url,
      description: r.description
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Product
app.post('/api/products', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const {
      name, price = 0, stock = 0, category = 'Keyboard',
      location_text = 'Bangkok Store', image_url, description = ''
    } = req.body || {};

    const badge = Number(stock) === 0 ? 'Out of Stock' : (Number(stock) <= 3 ? 'Low in stock' : 'In Stock');
    const [rs] = await dbPool.query(
      `INSERT INTO products (name, price, stock, stock_text, category, location_count, location_text, badge_status, rating, image_url, description)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?, 5.0, ?, ?)`,
      [name, Number(price), Number(stock), `${stock} in stock`, category, location_text, badge, image_url, description]
    );

    res.status(201).json({ success: true, productId: rs.insertId, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { id } = req.params;
    const { name, price, stock, category, image_url, description } = req.body || {};

    const [existing] = await dbPool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Product not found' });
    const curr = existing[0];

    const newStock = stock !== undefined ? Number(stock) : curr.stock;
    const badge = newStock === 0 ? 'Out of Stock' : (newStock <= 3 ? 'Low in stock' : 'In Stock');

    await dbPool.query(
      `UPDATE products 
       SET name = ?, price = ?, stock = ?, stock_text = ?, category = ?, badge_status = ?, image_url = ?, description = ?
       WHERE id = ?`,
      [
        name !== undefined ? name : curr.name,
        price !== undefined ? Number(price) : curr.price,
        newStock,
        `${newStock} in stock`,
        category !== undefined ? category : curr.category,
        badge,
        image_url !== undefined ? image_url : curr.image_url,
        description !== undefined ? description : curr.description,
        id
      ]
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { id } = req.params;
    await dbPool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. Orders & Checkout Routes (Stock Reduction & Status Flow)
// ----------------------------------------------------------------------------

// Get all orders (with items)
app.get('/api/orders', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { user_id } = req.query;

    let sql = 'SELECT * FROM orders';
    const params = [];
    if (user_id) {
      sql += ' WHERE user_id = ?';
      params.push(user_id);
    }
    sql += ' ORDER BY id DESC';

    const [orders] = await dbPool.query(sql, params);

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await dbPool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const {
      user_id = 'guest',
      recipient_name,
      phone,
      address,
      province,
      postal_code,
      payment_method,
      slip_url = null,
      items = [],
      total_amount = 0
    } = req.body || {};

    if (!recipient_name || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order details or items' });
    }

    // Verify stock for all items
    for (const item of items) {
      if (item.product_id) {
        const [prod] = await dbPool.query('SELECT id, name, stock FROM products WHERE id = ?', [item.product_id]);
        if (prod.length > 0 && prod[0].stock < item.quantity) {
          return res.status(400).json({
            error: `สินค้า "${prod[0].name}" มีสต็อกไม่เพียงพอ (เหลือ ${prod[0].stock} ชิ้น)`
          });
        }
      }
    }

    // Generate Order Number: ORD-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    const orderNumber = `ORD-${dateStr}-${rand}`;

    const [orderRs] = await dbPool.query(
      `INSERT INTO orders 
        (order_number, user_id, recipient_name, phone, address, province, postal_code, payment_method, slip_url, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Waiting for Payment')`,
      [orderNumber, user_id, recipient_name, phone, address, province, postal_code, payment_method, slip_url, total_amount]
    );

    const orderId = orderRs.insertId;

    // Insert order items & reduce stock in database
    for (const item of items) {
      await dbPool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id || null, item.product_name, Number(item.price), Number(item.quantity), item.image_url || null]
      );

      // Deduct stock
      if (item.product_id) {
        await dbPool.query(
          `UPDATE products 
           SET stock = GREATEST(0, stock - ?),
               stock_text = CONCAT(GREATEST(0, stock - ?), ' in stock'),
               badge_status = CASE 
                 WHEN (stock - ?) <= 0 THEN 'Out of Stock'
                 WHEN (stock - ?) <= 3 THEN 'Low in stock'
                 ELSE 'In Stock'
               END
           WHERE id = ?`,
          [item.quantity, item.quantity, item.quantity, item.quantity, item.product_id]
        );
      }
    }

    res.status(201).json({
      success: true,
      order_id: orderId,
      order_number: orderNumber,
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error(' Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
// Workflow: Waiting for Payment -> Payment Verified -> Preparing -> Shipping -> Delivered
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Waiting for Payment',
      'Payment Verified',
      'Preparing',
      'Shipping',
      'Delivered'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    await dbPool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 5. Wishlist Routes
// ----------------------------------------------------------------------------
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { userId } = req.params;
    const [rows] = await dbPool.query(
      `SELECT p.* FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wishlist/toggle', async (req, res) => {
  try {
    if (!dbPool) return res.status(500).json({ error: 'DB not connected' });
    const { user_id = 'guest', product_id } = req.body;

    const [exists] = await dbPool.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (exists.length > 0) {
      await dbPool.query('DELETE FROM wishlists WHERE id = ?', [exists[0].id]);
      return res.json({ saved: false, message: 'Removed from wishlist' });
    } else {
      await dbPool.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);
      return res.json({ saved: true, message: 'Added to wishlist' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log('========================================');
  console.log(` Gaming Gear Backend Running! Port: ${PORT}`);
  console.log('========================================');
  await initDB();
});
