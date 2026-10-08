/**
 * ============================================================================
 * Gaming Gear E-Commerce Platform
 * ============================================================================
 * Features:
 * 1. 🛒 Cart System (+ / - quantity, remove, total calculation, stock check, Cart badge)
 * 2. 💳 Checkout System (Name, Phone, Address, Province, Zip, Bank/PromptPay/COD, Slip Upload)
 * 3. 📦 Order System (Order #ORD-..., Items, Total, Status workflow)
 * 4. 🔍 Multi-Criteria Product Filter (Category, Price, Brand, DPI, Connection, Size, Rating)
 * 5. ❤️ Wishlist System (♡ / ♥ toggle, My Wishlist page, Add to Cart)
 * 6. 📦 Stock System (Stock count, ⚠️ Only X left, ❌ Out of Stock, disable button)
 * 7. 🏷️ Categories (All Products, ⌨️ Keyboard, 🖱️ Mouse, 🎧 Headset, 🖥️ Monitor)
 * 8. 🎮 Gaming Sets: ร้านจัดให้ (Bundles) & ลูกค้าจัดเอง (Custom Builder)
 * 9. ➕✏️🗑️ Product Management: Add, Edit, Delete Product with Modal & Cloud DB
 * 10. 🔐 Authentication System: Sign In, Sign Up, Guest Login, Logout, Demo Accounts
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Product,
  User,
  Order,
  CartItem,
  GamingSet,
  OrderStatus,
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchOrdersApi,
  createOrderApi,
  updateOrderStatusApi,
  getWishlistIds,
  toggleWishlistId,
  loginApi,
  registerApi,
  guestLoginApi,
  logoutApi,
  getCurrentUser,
  PREBUILT_GAMING_SETS,
  DEFAULT_PRODUCT_IMAGE,
} from "@/constants/api";
import { NexoraAiSetupBuilder } from "@/components/NexoraAiSetupBuilder";
import { NexoraAiChatModal } from "@/components/NexoraAiChatModal";
import { ProductCompareModal } from "@/components/ProductCompareModal";

const COLORS = {
  primary: "#7C3AED",       // Purple
  primaryDark: "#5B21B6",
  primaryLight: "#EDE9FE",
  accent: "#EC4899",        // Pink
  background: "#0F172A",    // Dark Slate Gamer Theme
  surface: "#1E293B",       // Slate Card
  surfaceLight: "#334155",
  border: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  badgeInStock: "#10B981",  // Green
  badgeLow: "#F59E0B",      // Amber
  badgeOut: "#EF4444",      // Red
  gold: "#FBBF24",
  cyan: "#06B6D4",
};

const CATEGORIES = [
  { id: "All", label: "All Products" },
  { id: "Keyboard", label: "⌨️ Keyboard" },
  { id: "Mouse", label: "🖱️ Mouse" },
  { id: "Headset", label: "🎧 Headset" },
  { id: "Monitor", label: "🖥️ Monitor" },
  { id: "Mouse Pad", label: "🖱️ Mouse Pad" },
];

const BRANDS = [
  "All",
  "Logitech",
  "Razer",
  "SteelSeries",
  "HyperX",
  "ZOWIE",
  "BenQ ZOWIE",
  "ASUS ROG",
  "LG",
  "MEZZON",
  "AOC",
  "Corsair",
  "Wooting",
  "Keychron",
  "Samsung",
  "Alienware",
  "Pulsar",
  "Artisan",
  "Ducky",
  "MSI",
];

const PRICE_RANGES = [
  { id: "all", label: "ทุกช่วงราคา" },
  { id: "under-3000", label: "ต่ำกว่า ฿3,000", min: 0, max: 3000 },
  { id: "3000-6000", label: "฿3,000 - ฿6,000", min: 3000, max: 6000 },
  { id: "6000-15000", label: "฿6,000 - ฿15,000", min: 6000, max: 15000 },
  { id: "over-15000", label: "มากกว่า ฿15,000", min: 15000, max: Infinity },
];

const DPI_OPTIONS = [
  { id: "all", label: "ทุกความละเอียด" },
  { id: "over-30k", label: "30,000+ DPI (Pro Spec)", min: 30000, max: Infinity },
  { id: "16k-30k", label: "16,000 - 30,000 DPI", min: 16000, max: 30000 },
  { id: "under-16k", label: "ต่ำกว่า 16,000 DPI", min: 0, max: 16000 },
];

const CONNECTIONS = [
  { id: "all", label: "ทุกการเชื่อมต่อ" },
  { id: "Wireless", label: "📶 ไร้สาย (Wireless)" },
  { id: "Wired", label: "🔌 มีสาย (Wired)" },
];

const SIZE_OPTIONS = [
  { id: "all", label: "ทุกขนาด" },
  { id: "TKL", label: "TKL (80%)" },
  { id: "Full-size", label: "Full-size (100%)" },
  { id: "24.5", label: "24.5 นิ้ว" },
  { id: "27", label: "27 นิ้ว" },
  { id: "Over-Ear", label: "Over-Ear" },
];

const RATING_OPTIONS = [
  { id: "all", label: "ทุกคะแนน" },
  { id: "4.9", label: "4.9★ ขึ้นไป", min: 4.9 },
  { id: "4.8", label: "4.8★ ขึ้นไป", min: 4.8 },
  { id: "4.5", label: "4.5★ ขึ้นไป", min: 4.5 },
];

export default function GamingStoreScreen() {
  // Navigation Tabs: 'catalog' | 'sets' | 'wishlist' | 'orders' | 'account'
  const [activeTab, setActiveTab] = useState<"catalog" | "sets" | "wishlist" | "orders" | "account">("catalog");

  // Responsive Grid Dimensions for Desktop Web & Mobile
  const { width: windowWidth } = useWindowDimensions();
  const numColumns = useMemo(() => {
    if (windowWidth >= 1200) return 4;
    if (windowWidth >= 768) return 3;
    return 2;
  }, [windowWidth]);

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedDpi, setSelectedDpi] = useState("all");
  const [selectedConnection, setSelectedConnection] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  // Checkout State
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [recipientName, setRecipientName] = useState("กานต์วิชญ์ วุฒิกุลศิลป์");
  const [phone, setPhone] = useState("081-234-5678");
  const [address, setAddress] = useState("199 หมู่ 6 ต.ทุ่งสุขลา อ.ศรีราชา");
  const [province, setProvince] = useState("ชลบุรี");
  const [postalCode, setPostalCode] = useState("20230");
  const [paymentMethod, setPaymentMethod] = useState<"โอนเงิน" | "QR PromptPay" | "เก็บเงินปลายทาง">("QR PromptPay");
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<(string | number)[]>(getWishlistIds());

  // User & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [authUsername, setAuthUsername] = useState("kanwit");
  const [authPassword, setAuthPassword] = useState("123456");
  const [authName, setAuthName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Product Add / Edit Modal State
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("Keyboard");
  const [formBrand, setFormBrand] = useState("Logitech");
  const [formConnection, setFormConnection] = useState("Wireless");
  const [formDpi, setFormDpi] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formRating, setFormRating] = useState("5.0");
  const [formImage, setFormImage] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Gaming Set Custom Builder & AI State
  const [builderKeyboard, setBuilderKeyboard] = useState<Product | null>(null);
  const [builderMouse, setBuilderMouse] = useState<Product | null>(null);
  const [builderHeadset, setBuilderHeadset] = useState<Product | null>(null);
  const [builderMonitor, setBuilderMonitor] = useState<Product | null>(null);
  const [setsSubTab, setSetsSubTab] = useState<"ai" | "bundles" | "builder">("ai");

  // NEXORA AI Assistant State
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [aiFocusedProduct, setAiFocusedProduct] = useState<Product | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>("");

  // Product Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  // Load Initial Data
  const loadData = async () => {
    try {
      const prodList = await fetchProductsApi();
      setProducts(prodList);
      const orderList = await fetchOrdersApi();
      setOrders(orderList);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // --------------------------------------------------------------------------
  // Filter Reset & Active Count
  // --------------------------------------------------------------------------
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedPriceRange !== "all") count++;
    if (selectedBrand !== "All") count++;
    if (selectedDpi !== "all") count++;
    if (selectedConnection !== "all") count++;
    if (selectedSize !== "all") count++;
    if (selectedRating !== "all") count++;
    return count;
  }, [selectedCategory, selectedPriceRange, selectedBrand, selectedDpi, selectedConnection, selectedSize, selectedRating]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setSelectedBrand("All");
    setSelectedDpi("all");
    setSelectedConnection("all");
    setSelectedSize("all");
    setSelectedRating("all");
  };

  // Filtered Products Multi-Criteria
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand && p.brand.toLowerCase().includes(q);
        const matchDesc = p.description && p.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      // 2. Category
      if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Price Range
      if (selectedPriceRange !== "all") {
        const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
        if (range && (p.price < range.min! || p.price > range.max!)) {
          return false;
        }
      }

      // 4. Brand
      if (selectedBrand !== "All" && p.brand !== selectedBrand) {
        return false;
      }

      // 5. DPI (for mice)
      if (selectedDpi !== "all") {
        if (!p.dpi) return false;
        const dpiOpt = DPI_OPTIONS.find((d) => d.id === selectedDpi);
        if (dpiOpt && (p.dpi < dpiOpt.min! || p.dpi > dpiOpt.max!)) {
          return false;
        }
      }

      // 6. Connection
      if (selectedConnection !== "all") {
        if (p.connection !== selectedConnection && p.connection !== "Both") {
          return false;
        }
      }

      // 7. Size
      if (selectedSize !== "all") {
        if (!p.size || !p.size.toLowerCase().includes(selectedSize.toLowerCase())) {
          return false;
        }
      }

      // 8. Rating
      if (selectedRating !== "all") {
        const ratingOpt = RATING_OPTIONS.find((r) => r.id === selectedRating);
        if (ratingOpt && p.rating < ratingOpt.min!) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    selectedBrand,
    selectedDpi,
    selectedConnection,
    selectedSize,
    selectedRating,
  ]);

  // --------------------------------------------------------------------------
  // Auth Handlers
  // --------------------------------------------------------------------------
  const handleLogin = async () => {
    if (!authUsername.trim() || !authPassword) {
      Alert.alert("กรุณากรอกข้อมูล", "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    setIsAuthLoading(true);
    try {
      const res = await loginApi({ username: authUsername.trim(), password: authPassword });
      if (res.user) {
        setCurrentUser(res.user);
        setAuthModalVisible(false);
        Alert.alert("สำเร็จ", `ยินดีต้อนรับคุณ ${res.user.name} (${res.user.role})`);
      }
    } catch (e: any) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", e.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authUsername.trim() || !authPassword || !authName.trim()) {
      Alert.alert("กรุณากรอกข้อมูล", "กรุณากรอกชื่อ-นามสกุล, ชื่อผู้ใช้ และรหัสผ่าน");
      return;
    }
    setIsAuthLoading(true);
    try {
      const res = await registerApi({
        username: authUsername.trim(),
        password: authPassword,
        name: authName.trim(),
      });
      if (res.user) {
        setCurrentUser(res.user);
        setAuthModalVisible(false);
        Alert.alert("สมัครสมาชิกสำเร็จ", `ยินดีต้อนรับคุณ ${res.user.name}`);
      }
    } catch (e: any) {
      Alert.alert("สมัครสมาชิกไม่สำเร็จ", e.message || "ไม่สามารถลงทะเบียนได้");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsAuthLoading(true);
    try {
      const guest = await guestLoginApi();
      setCurrentUser(guest);
      setAuthModalVisible(false);
      Alert.alert("เข้าสู่ระบบสำเร็จ", "เข้าใช้งานในฐานะผู้เยี่ยมชม (Guest)");
    } catch (e: any) {
      console.warn(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutApi();
    setCurrentUser(null);
    Alert.alert("ออกจากระบบแล้ว", "คุณได้ออกจากระบบเรียบร้อยแล้ว");
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setAuthUsername(user);
    setAuthPassword(pass);
  };

  // --------------------------------------------------------------------------
  // Product Add / Edit / Delete Handlers
  // --------------------------------------------------------------------------
  const openAddProductModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setFormName("");
    setFormPrice("");
    setFormStock("10");
    setFormCategory("Keyboard");
    setFormBrand("Logitech");
    setFormConnection("Wireless");
    setFormDpi("");
    setFormSize("Standard");
    setFormRating("4.9");
    setFormImage("");
    setFormDesc("");
    setProductModalVisible(true);
  };

  const openEditProductModal = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormStock(String(product.stock));
    setFormCategory(product.category || "Keyboard");
    setFormBrand(product.brand || "Logitech");
    setFormConnection(product.connection || "Wireless");
    setFormDpi(product.dpi ? String(product.dpi) : "");
    setFormSize(product.size || "");
    setFormRating(String(product.rating || 4.8));
    setFormImage(product.image_url || "");
    setFormDesc(product.description || "");
    setProductModalVisible(true);
  };

  const handleSaveProduct = async () => {
    if (!formName.trim()) {
      Alert.alert("กรุณากรอกข้อมูล", "กรุณาระบุชื่อสินค้า");
      return;
    }
    const priceNum = Number(formPrice) || 0;
    const stockNum = Number(formStock) || 0;
    const dpiNum = formDpi ? Number(formDpi) : null;
    const ratingNum = Number(formRating) || 5.0;

    setIsSavingProduct(true);
    try {
      if (modalMode === "add") {
        await createProductApi({
          name: formName.trim(),
          price: priceNum,
          stock: stockNum,
          category: formCategory,
          brand: formBrand,
          connection: formConnection,
          dpi: dpiNum,
          size: formSize.trim() || "Standard",
          rating: ratingNum,
          image_url: formImage.trim() || DEFAULT_PRODUCT_IMAGE,
          description: formDesc.trim(),
        });
        Alert.alert("สำเร็จ", "เพิ่มสินค้าใหม่เรียบร้อยแล้ว");
      } else if (modalMode === "edit" && selectedProduct) {
        await updateProductApi(selectedProduct.id, {
          name: formName.trim(),
          price: priceNum,
          stock: stockNum,
          category: formCategory,
          brand: formBrand,
          connection: formConnection,
          dpi: dpiNum,
          size: formSize.trim() || selectedProduct.size,
          rating: ratingNum,
          image_url: formImage.trim() || selectedProduct.image_url,
          description: formDesc.trim(),
        });
        Alert.alert("สำเร็จ", "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว");
      }
      setProductModalVisible(false);
      await loadData();
    } catch (e: any) {
      Alert.alert("เกิดข้อผิดพลาด", e.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "ยืนยันการลบสินค้า",
      `คุณต้องการลบ "${product.name}" ออกจากระบบใช่หรือไม่?`,
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบสินค้า",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProductApi(product.id);
              if (selectedProduct?.id === product.id) {
                setProductModalVisible(false);
              }
              await loadData();
              Alert.alert("สำเร็จ", "ลบสินค้าเรียบร้อยแล้ว");
            } catch (e: any) {
              Alert.alert("เกิดข้อผิดพลาด", e.message || "ไม่สามารถลบสินค้าได้");
            }
          },
        },
      ]
    );
  };

  // --------------------------------------------------------------------------
  // Cart Actions
  // --------------------------------------------------------------------------
  const cartTotalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product, quantityToAdd = 1) => {
    if (product.stock <= 0) {
      Alert.alert("สินค้าหมด", `ขออภัย สินค้า "${product.name}" หมดสต็อกแล้ว`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        if (existing.quantity + quantityToAdd > product.stock) {
          Alert.alert("จำนวนเกินสต็อก", `มีสินค้าในสต็อกเพียง ${product.stock} ชิ้น`);
          return prev;
        }
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });

    Alert.alert("สำเร็จ", `เพิ่ม "${product.name}" ลงในตะกร้าเรียบร้อยแล้ว`);
  };

  const updateCartQuantity = (productId: string | number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.product.stock) {
              Alert.alert("เกินสต็อก", `มีสินค้าในสต็อกเพียง ${item.product.stock} ชิ้น`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  };

  // --------------------------------------------------------------------------
  // Wishlist Actions
  // --------------------------------------------------------------------------
  const handleToggleWishlist = (product: Product) => {
    const isAdded = toggleWishlistId(product.id);
    setWishlistIds([...getWishlistIds()]);
    Alert.alert(
      isAdded ? "❤️ บันทึกแล้ว" : "นำออกจาก Wishlist",
      isAdded
        ? `เพิ่ม "${product.name}" ลงใน My Wishlist แล้ว`
        : `นำ "${product.name}" ออกจาก My Wishlist แล้ว`
    );
  };

  const isWishlisted = (productId: string | number) => {
    return wishlistIds.some((id) => String(id) === String(productId));
  };

  // --------------------------------------------------------------------------
  // Product Comparison Handlers
  // --------------------------------------------------------------------------
  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => String(p.id) === String(product.id));
      if (exists) {
        return prev.filter((p) => String(p.id) !== String(product.id));
      }
      if (prev.length >= 2) {
        Alert.alert(
          "⚖️ เปรียบเทียบได้ครั้งละ 2 ชิ้น",
          "คุณเลือกสินค้าครบ 2 ชิ้นแล้ว ต้องการแทนที่ชิ้นที่ 2 หรือเปิดดูผลเปรียบเทียบ?",
          [
            { text: "ยกเลิก", style: "cancel" },
            {
              text: "แทนที่ชิ้นที่ 2",
              onPress: () => {
                setCompareList([prev[0], product]);
                setTimeout(() => setCompareModalVisible(true), 250);
              },
            },
            {
              text: "ดูผลเปรียบเทียบ",
              onPress: () => setCompareModalVisible(true),
            },
          ]
        );
        return prev;
      }
      const next = [...prev, product];
      if (next.length === 2) {
        setTimeout(() => setCompareModalVisible(true), 350);
      }
      return next;
    });
  };

  // --------------------------------------------------------------------------
  // Checkout & Order Actions
  // --------------------------------------------------------------------------
  const handleStartCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("ตะกร้าว่าง", "กรุณาเพิ่มสินค้าลงในตะกร้าก่อนทำรายการ");
      return;
    }
    setCartModalVisible(false);
    setCheckoutModalVisible(true);
  };

  const handleSimulateUploadSlip = () => {
    const sampleSlip = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600";
    setSlipImage(sampleSlip);
    Alert.alert("แนบสลิปสำเร็จ", "อัปโหลดรูปภาพสลิปการโอนเงินเรียบร้อยแล้ว");
  };

  const handleConfirmOrder = async () => {
    if (!recipientName.trim() || !phone.trim() || !address.trim() || !province.trim() || !postalCode.trim()) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลผู้รับและที่อยู่จัดส่งให้ครบถ้วน");
      return;
    }

    if (paymentMethod === "โอนเงิน" && !slipImage) {
      Alert.alert("กรุณาแนบสลิป", "เนื่องจากเลือกชำระแบบโอนเงิน กรุณากดแนบสลิปหลักฐานการโอนเงิน");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url,
      }));

      const res = await createOrderApi({
        user_id: currentUser ? currentUser.username : "guest",
        recipient_name: recipientName,
        phone,
        address,
        province,
        postal_code: postalCode,
        payment_method: paymentMethod,
        slip_url: slipImage,
        items: orderItems,
        total_amount: cartTotalPrice,
      });

      setCart([]);
      setSlipImage(null);
      setCheckoutModalVisible(false);

      await loadData();

      Alert.alert(
        "🎉 สั่งซื้อสำเร็จ!",
        `หมายเลขคำสั่งซื้อ: ${res.order_number}\nสินค้าถูกตัดสต็อกเรียบร้อยแล้ว`,
        [
          {
            text: "ดูสถานะคำสั่งซื้อ",
            onPress: () => setActiveTab("orders"),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert("เกิดข้อผิดพลาด", e.message || "ไม่สามารถทำการสั่งซื้อได้");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleAdvanceOrderStatus = async (order: Order) => {
    const statuses: OrderStatus[] = [
      "Waiting for Payment",
      "Payment Verified",
      "Preparing",
      "Shipping",
      "Delivered",
    ];
    const currentIndex = statuses.indexOf(order.status);
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      await updateOrderStatusApi(order.id, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (String(o.id) === String(order.id) ? { ...o, status: nextStatus } : o))
      );
      Alert.alert("อัปเดตสถานะสำเร็จ", `Order ${order.order_number}\nสถานะเปลี่ยนเป็น: ${nextStatus}`);
    } else {
      Alert.alert("จัดส่งสำเร็จแล้ว", "คำสั่งซื้อนี้จัดส่งเสร็จสิ้นสมบูรณ์แล้ว");
    }
  };

  // --------------------------------------------------------------------------
  // Gaming Sets Handlers
  // --------------------------------------------------------------------------
  const handleAddBundleToCart = (bundle: GamingSet) => {
    for (const item of bundle.items) {
      const prod = products.find((p) => p.name.includes(item.name) || item.name.includes(p.name));
      if (prod && prod.stock > 0) {
        addToCart(prod, 1);
      }
    }
    Alert.alert("🎮 เซ็ตถูกเพิ่มแล้ว", `เพิ่ม "${bundle.name}" ลงในตะกร้าเรียบร้อยแล้ว`);
  };

  const customBuilderTotal = useMemo(() => {
    let sum = 0;
    if (builderKeyboard) sum += builderKeyboard.price;
    if (builderMouse) sum += builderMouse.price;
    if (builderHeadset) sum += builderHeadset.price;
    if (builderMonitor) sum += builderMonitor.price;
    return sum;
  }, [builderKeyboard, builderMouse, builderHeadset, builderMonitor]);

  const handleAddCustomSetToCart = () => {
    const items = [builderKeyboard, builderMouse, builderHeadset, builderMonitor].filter(Boolean) as Product[];
    if (items.length === 0) {
      Alert.alert("ยังไม่ได้เลือกสินค้า", "กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นในชุดเซ็ต");
      return;
    }

    for (const p of items) {
      addToCart(p, 1);
    }
    Alert.alert("🎮 เพิ่มเซ็ตลงตะกร้า", `เพิ่มชิ้นส่วนที่จัดเองทั้งหมด ${items.length} รายการลงในตะกร้าแล้ว`);
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.some((id) => String(id) === String(p.id)));
  }, [products, wishlistIds]);

  // --------------------------------------------------------------------------
  // Render Product Card with Spec Tags
  // --------------------------------------------------------------------------
  const renderProductCard = ({ item }: { item: Product }) => {
    const isOut = item.stock <= 0;
    const isLow = item.stock > 0 && item.stock <= 3;
    const wish = isWishlisted(item.id);
    const isComparing = compareList.some((p) => String(p.id) === String(item.id));

    return (
      <View style={[styles.productCard, isComparing && styles.productCardComparing]}>
        {/* Product Showcase Visual with Contain Mode */}
        <View style={styles.productImageContainer}>
          {/* Top Badges & Action Buttons */}
          <View style={styles.cardHeader}>
            {isOut ? (
              <View style={[styles.badge, styles.badgeOut]}>
                <Text style={styles.badgeText}>❌ หมด</Text>
              </View>
            ) : isLow ? (
              <View style={[styles.badge, styles.badgeLow]}>
                <Text style={styles.badgeText}>⚠️ เหลือ {item.stock}</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeInStock]}>
                <Text style={styles.badgeText}>Stock: {item.stock}</Text>
              </View>
            )}

            {/* Quick Actions: Edit (✏️) & Wishlist (❤️) */}
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity
                style={styles.cardIconBtn}
                onPress={() => openEditProductModal(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={14} color={COLORS.gold} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardIconBtn}
                onPress={() => handleToggleWishlist(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={wish ? "heart" : "heart-outline"}
                  size={16}
                  color={wish ? COLORS.accent : COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Clear Product Showcase */}
          <Image
            source={{ uri: item.image_url || DEFAULT_PRODUCT_IMAGE }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Card Body & Details */}
        <View style={styles.cardBody}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <View style={styles.categoryBadge}>
              <Text style={styles.productCategory}>{item.category}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.productRatingText}>⭐ {item.rating?.toFixed(1) || "5.0"}</Text>
            </View>
          </View>

          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Spec Tags Row: Brand | Connection | DPI / Size */}
          <View style={styles.specTagsContainer}>
            <View style={styles.specTag}>
              <Text style={styles.specTagText}>{item.brand}</Text>
            </View>
            <View style={styles.specTag}>
              <Text style={styles.specTagText}>
                {item.connection === "Wireless" ? "📶 Wireless" : item.connection === "Both" ? "⚡ Dual" : "🔌 Wired"}
              </Text>
            </View>
            {item.dpi ? (
              <View style={[styles.specTag, { backgroundColor: "rgba(6, 182, 212, 0.15)" }]}>
                <Text style={[styles.specTagText, { color: COLORS.cyan }]}>
                  {item.dpi.toLocaleString()} DPI
                </Text>
              </View>
            ) : item.size ? (
              <View style={styles.specTag}>
                <Text style={styles.specTagText}>{item.size}</Text>
              </View>
            ) : null}
          </View>

          {/* Price & Stock info */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>ราคา</Text>
              <Text style={styles.productPrice}>฿{item.price.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.stockLabel}>สถานะคลัง</Text>
              <Text style={[styles.stockValue, isOut && { color: COLORS.badgeOut }, isLow && { color: COLORS.badgeLow }]}>
                {isOut ? "หมดชั่วคราว" : `${item.stock} ชิ้นพร้อมส่ง`}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 10, gap: 6 }}>
            {/* Compare Toggle Button */}
            <TouchableOpacity
              style={[
                styles.compareCardBtn,
                isComparing && styles.compareCardBtnActive,
              ]}
              onPress={() => handleToggleCompare(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isComparing ? "checkbox" : "git-compare-outline"}
                size={14}
                color={isComparing ? "#10B981" : "#38BDF8"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.compareCardBtnText,
                  isComparing && styles.compareCardBtnTextActive,
                ]}
              >
                {isComparing ? "✓ เลือกเปรียบเทียบแล้ว" : "⚖️ Compare (เปรียบเทียบ)"}
              </Text>
            </TouchableOpacity>

            {/* Ask NEXORA AI Advice Button */}
            <TouchableOpacity
              style={styles.askAiCardBtn}
              onPress={() => {
                setAiFocusedProduct(item);
                setAiInitialPrompt("");
                setAiChatVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={13} color="#C084FC" style={{ marginRight: 5 }} />
              <Text style={styles.askAiCardBtnText}>🤖 Ask NEXORA AI</Text>
            </TouchableOpacity>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={[styles.addToCartBtn, isOut && styles.addToCartBtnDisabled]}
              disabled={isOut}
              onPress={() => addToCart(item, 1)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isOut ? "close-circle" : "cart"}
                size={16}
                color="#FFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.addToCartBtnText}>
                {isOut ? "Out of Stock" : "Add to Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // --------------------------------------------------------------------------
  // MAIN SCREEN RENDER
  // --------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* TOP APP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <View>
            <Text style={styles.brandTitle}>⚡ mono Gaming</Text>
            <Text style={styles.brandSubtitle}>High-Performance Gear & Custom Sets</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {/* Top User Status Pill / Login Button */}
            {currentUser ? (
              <TouchableOpacity
                style={styles.userStatusPill}
                onPress={() => setActiveTab("account")}
              >
                <Ionicons
                  name={currentUser.role === "admin" ? "shield-checkmark" : "person-circle"}
                  size={18}
                  color={currentUser.role === "admin" ? COLORS.gold : COLORS.primaryLight}
                />
                <Text style={styles.userStatusText} numberOfLines={1}>
                  {currentUser.username}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.topLoginBtn}
                onPress={() => {
                  setAuthTab("signin");
                  setAuthModalVisible(true);
                }}
              >
                <Ionicons name="log-in-outline" size={18} color="#FFF" />
                <Text style={styles.topLoginBtnText}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>
            )}

            {/* Top Right Cart Badge Button */}
            <TouchableOpacity
              style={styles.cartHeaderBtn}
              onPress={() => setCartModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart" size={20} color="#FFF" />
              <Text style={styles.cartHeaderText}>Cart ({cartTotalQuantity})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* TAB: CATALOG */}
      {activeTab === "catalog" && (
        <View style={{ flex: 1 }}>
          {/* Search Bar & Action Buttons */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="ค้นหาสินค้า หรือ แบรนด์..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")} style={{ padding: 8 }}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Modal Trigger Button */}
            <TouchableOpacity
              style={[styles.filterTriggerBtn, activeFilterCount > 0 && styles.filterTriggerBtnActive]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={18} color="#FFF" />
              <Text style={styles.filterTriggerBtnText}>
                ตัวกรอง {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </Text>
            </TouchableOpacity>

            {/* Quick Compare Trigger Button */}
            {compareList.length > 0 && (
              <TouchableOpacity
                style={styles.topCompareTriggerBtn}
                onPress={() => {
                  if (compareList.length === 2) {
                    setCompareModalVisible(true);
                  } else {
                    Alert.alert(
                      "เปรียบเทียบสินค้า",
                      `เลือกแล้ว 1 ชิ้น (${compareList[0].name})\nกรุณาคลิก Compare สินค้าอีก 1 ชิ้นเพื่อเริ่มเปรียบเทียบ`
                    );
                  }
                }}
              >
                <Ionicons name="git-compare" size={16} color="#38BDF8" />
                <Text style={styles.topCompareTriggerText}>
                  เทียบ ({compareList.length}/2)
                </Text>
              </TouchableOpacity>
            )}

            {/* + Add Product Button */}
            <TouchableOpacity style={styles.addProductBtn} onPress={openAddProductModal}>
              <Ionicons name="add" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Active Filter Chips / Reset Bar */}
          <View style={styles.filterStatusRow}>
            <Text style={styles.filterResultCount}>
              พบ {filteredProducts.length} รายการ (จากทั้งหมด {products.length})
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity style={styles.resetFilterBtn} onPress={handleResetFilters}>
                <Ionicons name="refresh" size={14} color={COLORS.gold} />
                <Text style={styles.resetFilterText}>ล้างตัวกรอง</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Horizontal Pills */}
          <View style={styles.categoriesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Products Grid */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ color: COLORS.textSecondary, marginTop: 12 }}>กำลังโหลดสินค้า...</Text>
            </View>
          ) : (
            <FlatList
              key={`grid-cols-${numColumns}`}
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => String(item.id)}
              numColumns={numColumns}
              contentContainerStyle={styles.productListContent}
              columnWrapperStyle={numColumns > 1 ? styles.productColumnWrapper : undefined}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="filter-circle-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>ไม่พบสินค้าที่ตรงกับเงื่อนไขตัวกรอง</Text>
                  <TouchableOpacity
                    style={[styles.resetFilterBtn, { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8 }]}
                    onPress={handleResetFilters}
                  >
                    <Text style={{ color: COLORS.gold, fontWeight: "bold" }}>กดเพื่อล้างตัวกรองทั้งหมด</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* TAB: GAMING SETS */}
      {activeTab === "sets" && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.subTabRow}>
            <TouchableOpacity
              style={[styles.subTabBtn, setsSubTab === "ai" && styles.subTabBtnActive]}
              onPress={() => setSetsSubTab("ai")}
            >
              <Text style={[styles.subTabText, setsSubTab === "ai" && styles.subTabTextActive]}>
                🤖 AI จัดให้
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, setsSubTab === "bundles" && styles.subTabBtnActive]}
              onPress={() => setSetsSubTab("bundles")}
            >
              <Text style={[styles.subTabText, setsSubTab === "bundles" && styles.subTabTextActive]}>
                ⚡ ร้านจัดให้
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, setsSubTab === "builder" && styles.subTabBtnActive]}
              onPress={() => setSetsSubTab("builder")}
            >
              <Text style={[styles.subTabText, setsSubTab === "builder" && styles.subTabTextActive]}>
                🛠️ จัดเอง
              </Text>
            </TouchableOpacity>
          </View>

          {setsSubTab === "ai" ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              <NexoraAiSetupBuilder
                products={products}
                onAddToCart={addToCart}
                onOpenAiChatWithPrompt={(prompt) => {
                  setAiFocusedProduct(null);
                  setAiInitialPrompt(prompt);
                  setAiChatVisible(true);
                }}
              />
            </ScrollView>
          ) : setsSubTab === "bundles" ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              {PREBUILT_GAMING_SETS.map((bundle) => (
                <View key={bundle.id} style={styles.bundleCard}>
                  <Image source={{ uri: bundle.image_url }} style={styles.bundleImage} />
                  <View style={styles.bundleContent}>
                    <Text style={styles.bundleTitle}>{bundle.name}</Text>
                    <Text style={styles.bundleDesc}>{bundle.description}</Text>

                    <View style={styles.bundleItemList}>
                      {bundle.items.map((item, idx) => (
                        <View key={idx} style={styles.bundleItemRow}>
                          <Ionicons name="checkmark-circle" size={16} color={COLORS.badgeInStock} />
                          <Text style={styles.bundleItemText}>{item.name}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.bundlePriceRow}>
                      <View>
                        <Text style={styles.bundleOriginalPrice}>฿{bundle.original_price.toLocaleString()}</Text>
                        <Text style={styles.bundleDiscountPrice}>฿{bundle.discount_price.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bundleAddBtn}
                        onPress={() => handleAddBundleToCart(bundle)}
                      >
                        <Ionicons name="cart" size={18} color="#FFF" style={{ marginRight: 6 }} />
                        <Text style={styles.bundleAddBtnText}>สั่งซื้อเซ็ตนี้</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.builderHeading}>🛠️ ปรับแต่งเซ็ตเกมมิ่งของคุณเอง</Text>
              <Text style={styles.builderSubheading}>เลือกชิ้นส่วนที่ชอบเพื่อคำนวณราคาและสั่งซื้อพร้อมกัน</Text>

              {/* 1. Keyboard Slot */}
              <View style={styles.slotContainer}>
                <Text style={styles.slotLabel}>⌨️ คีย์บอร์ด (Keyboard)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((p) => p.category === "Keyboard")
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.slotItem, builderKeyboard?.id === item.id && styles.slotItemActive]}
                        onPress={() => setBuilderKeyboard(builderKeyboard?.id === item.id ? null : item)}
                      >
                        <Image source={{ uri: item.image_url }} style={styles.slotItemImg} />
                        <Text style={styles.slotItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.slotItemPrice}>฿{item.price.toLocaleString()}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              {/* 2. Mouse Slot */}
              <View style={styles.slotContainer}>
                <Text style={styles.slotLabel}>🖱️ เมาส์ (Mouse)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((p) => p.category === "Mouse")
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.slotItem, builderMouse?.id === item.id && styles.slotItemActive]}
                        onPress={() => setBuilderMouse(builderMouse?.id === item.id ? null : item)}
                      >
                        <Image source={{ uri: item.image_url }} style={styles.slotItemImg} />
                        <Text style={styles.slotItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.slotItemPrice}>฿{item.price.toLocaleString()}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              {/* 3. Headset Slot */}
              <View style={styles.slotContainer}>
                <Text style={styles.slotLabel}>🎧 หูฟัง (Headset)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((p) => p.category === "Headset")
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.slotItem, builderHeadset?.id === item.id && styles.slotItemActive]}
                        onPress={() => setBuilderHeadset(builderHeadset?.id === item.id ? null : item)}
                      >
                        <Image source={{ uri: item.image_url }} style={styles.slotItemImg} />
                        <Text style={styles.slotItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.slotItemPrice}>฿{item.price.toLocaleString()}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              {/* 4. Monitor Slot */}
              <View style={styles.slotContainer}>
                <Text style={styles.slotLabel}>🖥️ จอภาพ (Monitor)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((p) => p.category === "Monitor")
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.slotItem, builderMonitor?.id === item.id && styles.slotItemActive]}
                        onPress={() => setBuilderMonitor(builderMonitor?.id === item.id ? null : item)}
                      >
                        <Image source={{ uri: item.image_url }} style={styles.slotItemImg} />
                        <Text style={styles.slotItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.slotItemPrice}>฿{item.price.toLocaleString()}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              <View style={styles.builderSummary}>
                <View>
                  <Text style={styles.builderSummaryLabel}>ราคารวมทั้งเซ็ต:</Text>
                  <Text style={styles.builderSummaryPrice}>฿{customBuilderTotal.toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.builderSubmitBtn, customBuilderTotal === 0 && { opacity: 0.5 }]}
                  disabled={customBuilderTotal === 0}
                  onPress={handleAddCustomSetToCart}
                >
                  <Ionicons name="cart" size={20} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.builderSubmitBtnText}>ใส่ตะกร้าทั้งเซ็ต</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* TAB: WISHLIST */}
      {activeTab === "wishlist" && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.screenHeader}>
            <Text style={styles.screenTitle}>❤️ My Wishlist ({wishlistProducts.length})</Text>
            <Text style={styles.screenSubtitle}>รายการอุปกรณ์เกมมิ่งที่คุณบันทึกไว้</Text>
          </View>

          <FlatList
            data={wishlistProducts}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-dislike-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>ยังไม่มีสินค้าใน Wishlist</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.wishlistItemCard}>
                <Image source={{ uri: item.image_url }} style={styles.wishlistImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.wishlistTitle} numberOfLines={1}>♥ {item.name}</Text>
                  <Text style={styles.wishlistPrice}>฿{item.price.toLocaleString()}</Text>
                  <Text style={{ color: item.stock > 0 ? COLORS.badgeInStock : COLORS.badgeOut, fontSize: 12 }}>
                    {item.stock > 0 ? `มีสินค้า (${item.stock} ชิ้น)` : "สินค้าหมด"}
                  </Text>
                </View>
                <View style={{ flexDirection: "column", gap: 6 }}>
                  <TouchableOpacity
                    style={[styles.wishlistAddBtn, item.stock <= 0 && { opacity: 0.5 }]}
                    disabled={item.stock <= 0}
                    onPress={() => addToCart(item, 1)}
                  >
                    <Ionicons name="cart-outline" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.wishlistRemoveBtn}
                    onPress={() => handleToggleWishlist(item)}
                  >
                    <Ionicons name="trash-outline" size={16} color={COLORS.badgeOut} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* TAB: ORDERS */}
      {activeTab === "orders" && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.screenHeader}>
            <Text style={styles.screenTitle}>📦 My Orders ({orders.length})</Text>
            <Text style={styles.screenSubtitle}>ประวัติการสั่งซื้อและติดตามสถานะจัดส่ง</Text>
          </View>

          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>ยังไม่มีคำสั่งซื้อ</Text>
              </View>
            }
            renderItem={({ item }) => {
              let statusBadgeColor = COLORS.badgeLow;
              if (item.status === "Payment Verified") statusBadgeColor = "#3B82F6";
              if (item.status === "Preparing") statusBadgeColor = "#8B5CF6";
              if (item.status === "Shipping") statusBadgeColor = "#06B6D4";
              if (item.status === "Delivered") statusBadgeColor = COLORS.badgeInStock;

              return (
                <View style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
                    <View style={[styles.orderStatusBadge, { backgroundColor: statusBadgeColor }]}>
                      <Text style={styles.orderStatusText}>
                        {item.status === "Waiting for Payment" ? "🟡 " : ""}
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.orderRecipient}>
                    ผู้รับ: {item.recipient_name} | {item.phone}
                  </Text>
                  <Text style={styles.orderAddress} numberOfLines={1}>
                    ที่อยู่: {item.address}, {item.province} {item.postal_code}
                  </Text>
                  <Text style={styles.orderPayment}>
                    วิธีชำระ: {item.payment_method}
                  </Text>

                  <View style={styles.orderDivider} />
                  {item.items?.map((it, idx) => (
                    <View key={idx} style={styles.orderItemRow}>
                      <Text style={styles.orderItemName} numberOfLines={1}>
                        • {it.product_name} (x{it.quantity})
                      </Text>
                      <Text style={styles.orderItemPrice}>
                        ฿{(it.price * it.quantity).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.orderDivider} />

                  <View style={styles.orderTotalRow}>
                    <Text style={styles.orderTotalLabel}>Total:</Text>
                    <Text style={styles.orderTotalPrice}>฿{item.total_amount.toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.advanceStatusBtn}
                    onPress={() => handleAdvanceOrderStatus(item)}
                  >
                    <Ionicons name="arrow-forward-circle-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.advanceStatusText}>
                      จำลองเปลี่ยนสถานะถัดไป (Next Status)
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* TAB: PROFILE / ACCOUNT */}
      {activeTab === "account" && (
        <View style={{ flex: 1, padding: 20 }}>
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name={currentUser ? (currentUser.role === "admin" ? "shield" : "person") : "person-outline"}
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.profileName}>
              {currentUser ? currentUser.name : "ยังไม่ได้เข้าสู่ระบบ"}
            </Text>
            <Text style={styles.profileRole}>
              Role: {currentUser ? currentUser.role.toUpperCase() : "VISITOR"}
            </Text>
            <Text style={styles.profileDbInfo}>
              Cloud DB: ip_std6730251417 (std6730251417)
            </Text>

            {currentUser ? (
              <View style={{ width: "100%", gap: 10, marginTop: 20 }}>
                <TouchableOpacity
                  style={styles.quickAddProductBtn}
                  onPress={() => {
                    setActiveTab("catalog");
                    openAddProductModal();
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>➕ เพิ่มสินค้าใหม่</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>ออกจากระบบ ({currentUser.username})</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: "100%", gap: 10, marginTop: 20 }}>
                <TouchableOpacity
                  style={styles.loginModalBtn}
                  onPress={() => {
                    setAuthTab("signin");
                    setAuthModalVisible(true);
                  }}
                >
                  <Ionicons name="log-in-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}>เข้าสู่ระบบ (Sign In)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signupModalBtn}
                  onPress={() => {
                    setAuthTab("signup");
                    setAuthModalVisible(true);
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 15 }}>สมัครสมาชิก (Sign Up)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={handleGuestLogin}
                >
                  <Text style={{ color: COLORS.textSecondary, fontWeight: "600", fontSize: 13 }}>
                    เข้าสู่ระบบแบบผู้เยี่ยมชม (Guest Login)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* ================================================================== */}
      {/* 🔍 MULTI-CRITERIA FILTER MODAL */}
      {/* ================================================================== */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="options" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>ตัวกรองสินค้าขั้นสูง (Filters)</Text>
              </View>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
              {/* 1. ประเภท (Category) */}
              <Text style={styles.filterGroupTitle}>1. 🏷️ ประเภทสินค้า (Category)</Text>
              <View style={styles.filterOptionGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.filterChoicePill, selectedCategory === cat.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedCategory === cat.id && styles.filterChoiceTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. ช่วงราคา (Price Range) */}
              <Text style={styles.filterGroupTitle}>2. 💰 ช่วงราคา (Price Range)</Text>
              <View style={styles.filterOptionGrid}>
                {PRICE_RANGES.map((pr) => (
                  <TouchableOpacity
                    key={pr.id}
                    style={[styles.filterChoicePill, selectedPriceRange === pr.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedPriceRange(pr.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedPriceRange === pr.id && styles.filterChoiceTextActive]}>
                      {pr.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. แบรนด์ (Brand) */}
              <Text style={styles.filterGroupTitle}>3. 🏢 แบรนด์ (Brand)</Text>
              <View style={styles.filterOptionGrid}>
                {BRANDS.map((br) => (
                  <TouchableOpacity
                    key={br}
                    style={[styles.filterChoicePill, selectedBrand === br && styles.filterChoicePillActive]}
                    onPress={() => setSelectedBrand(br)}
                  >
                    <Text style={[styles.filterChoiceText, selectedBrand === br && styles.filterChoiceTextActive]}>
                      {br}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 4. DPI (สำหรับเมาส์) */}
              <Text style={styles.filterGroupTitle}>4. 🎯 ความละเอียด DPI (Mouse Spec)</Text>
              <View style={styles.filterOptionGrid}>
                {DPI_OPTIONS.map((dpi) => (
                  <TouchableOpacity
                    key={dpi.id}
                    style={[styles.filterChoicePill, selectedDpi === dpi.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedDpi(dpi.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedDpi === dpi.id && styles.filterChoiceTextActive]}>
                      {dpi.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 5. การเชื่อมต่อ (Connection) */}
              <Text style={styles.filterGroupTitle}>5. 📶 การเชื่อมต่อ (Connection)</Text>
              <View style={styles.filterOptionGrid}>
                {CONNECTIONS.map((conn) => (
                  <TouchableOpacity
                    key={conn.id}
                    style={[styles.filterChoicePill, selectedConnection === conn.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedConnection(conn.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedConnection === conn.id && styles.filterChoiceTextActive]}>
                      {conn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 6. ขนาด (Size / Form Factor) */}
              <Text style={styles.filterGroupTitle}>6. 📐 ขนาด / ฟอร์มแฟกเตอร์ (Size)</Text>
              <View style={styles.filterOptionGrid}>
                {SIZE_OPTIONS.map((sz) => (
                  <TouchableOpacity
                    key={sz.id}
                    style={[styles.filterChoicePill, selectedSize === sz.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedSize(sz.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedSize === sz.id && styles.filterChoiceTextActive]}>
                      {sz.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 7. คะแนนรีวิว (Rating) */}
              <Text style={styles.filterGroupTitle}>7. ⭐ คะแนนรีวิว (Rating)</Text>
              <View style={styles.filterOptionGrid}>
                {RATING_OPTIONS.map((rt) => (
                  <TouchableOpacity
                    key={rt.id}
                    style={[styles.filterChoicePill, selectedRating === rt.id && styles.filterChoicePillActive]}
                    onPress={() => setSelectedRating(rt.id)}
                  >
                    <Text style={[styles.filterChoiceText, selectedRating === rt.id && styles.filterChoiceTextActive]}>
                      {rt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Filter Modal Action Buttons */}
              <View style={{ flexDirection: "row", gap: 10, marginVertical: 24 }}>
                <TouchableOpacity
                  style={styles.filterResetActionBtn}
                  onPress={handleResetFilters}
                >
                  <Ionicons name="refresh" size={18} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={{ color: COLORS.textSecondary, fontWeight: "bold" }}>ล้างทั้งหมด</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterApplyActionBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}>
                    ดูผลลัพธ์ ({filteredProducts.length} รายการ)
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================================================================== */}
      {/* 🔐 AUTH MODAL (LOGIN & SIGN UP) */}
      {/* ================================================================== */}
      <Modal visible={authModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.authModalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="lock-closed" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>
                  {authTab === "signin" ? "เข้าสู่ระบบ (Sign In)" : "สมัครสมาชิก (Sign Up)"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAuthModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
              <View style={styles.authTabSwitch}>
                <TouchableOpacity
                  style={[styles.authSwitchBtn, authTab === "signin" && styles.authSwitchBtnActive]}
                  onPress={() => setAuthTab("signin")}
                >
                  <Text style={[styles.authSwitchText, authTab === "signin" && styles.authSwitchTextActive]}>
                    เข้าสู่ระบบ
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authSwitchBtn, authTab === "signup" && styles.authSwitchBtnActive]}
                  onPress={() => setAuthTab("signup")}
                >
                  <Text style={[styles.authSwitchText, authTab === "signup" && styles.authSwitchTextActive]}>
                    สมัครสมาชิก
                  </Text>
                </TouchableOpacity>
              </View>

              {authTab === "signup" && (
                <>
                  <Text style={styles.inputLabel}>ชื่อ-นามสกุล *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={authName}
                    onChangeText={setAuthName}
                    placeholder="เช่น กานต์วิชญ์ วุฒิกุลศิลป์"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </>
              )}

              <Text style={styles.inputLabel}>ชื่อผู้ใช้ (Username) *</Text>
              <TextInput
                style={styles.formInput}
                value={authUsername}
                onChangeText={setAuthUsername}
                autoCapitalize="none"
                placeholder="ระบุชื่อผู้ใช้ เช่น kanwit, user1"
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>รหัสผ่าน (Password) *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  secureTextEntry={!showPassword}
                  placeholder="ระบุรหัสผ่าน"
                  placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.authSubmitBtn, isAuthLoading && { opacity: 0.7 }]}
                disabled={isAuthLoading}
                onPress={authTab === "signin" ? handleLogin : handleRegister}
              >
                {isAuthLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.authSubmitBtnText}>
                    {authTab === "signin" ? "เข้าสู่ระบบ" : "ลงทะเบียนบัญชีใหม่"}
                  </Text>
                )}
              </TouchableOpacity>

              {authTab === "signin" && (
                <View style={styles.demoBox}>
                  <Text style={styles.demoTitle}>บัญชีทดสอบด่วน (Quick Demo Accounts):</Text>
                  <View style={styles.demoBtnRow}>
                    <TouchableOpacity
                      style={styles.demoPill}
                      onPress={() => handleQuickLogin("kanwit", "123456")}
                    >
                      <Text style={styles.demoPillText}>👑 Admin (kanwit)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.demoPill}
                      onPress={() => handleQuickLogin("user1", "123456")}
                    >
                      <Text style={styles.demoPillText}>👤 User (user1)</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.guestLinkBtn}
                    onPress={handleGuestLogin}
                  >
                    <Text style={styles.guestLinkText}>หรือเข้าชมร้านค้าในฐานะ Guest (ไม่ต้องล็อกอิน)</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ================================================================== */}
      {/* ➕✏️ ADD / EDIT PRODUCT MODAL */}
      {/* ================================================================== */}
      <Modal visible={productModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.productFormModalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={modalMode === "add" ? "add-circle" : "pencil"}
                  size={24}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>
                  {modalMode === "add" ? "เพิ่มสินค้าใหม่" : "แก้ไขข้อมูลสินค้า"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              <Text style={styles.inputLabel}>ชื่อสินค้า *</Text>
              <TextInput
                style={styles.formInput}
                value={formName}
                onChangeText={setFormName}
                placeholder="เช่น Logitech G Pro X Superlight 2"
                placeholderTextColor={COLORS.textSecondary}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>ราคา (บาท) *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formPrice}
                    onChangeText={setFormPrice}
                    keyboardType="numeric"
                    placeholder="เช่น 3990"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>สต็อก (Stock) *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formStock}
                    onChangeText={setFormStock}
                    keyboardType="numeric"
                    placeholder="เช่น 12"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>หมวดหมู่สินค้า *</Text>
              <View style={styles.categorySelectRow}>
                {["Keyboard", "Mouse", "Headset", "Monitor"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catSelectBtn, formCategory === cat && styles.catSelectBtnActive]}
                    onPress={() => setFormCategory(cat)}
                  >
                    <Text style={[styles.catSelectText, formCategory === cat && styles.catSelectTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>แบรนด์ (Brand) *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formBrand}
                    onChangeText={setFormBrand}
                    placeholder="เช่น Logitech"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>การเชื่อมต่อ *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formConnection}
                    onChangeText={setFormConnection}
                    placeholder="Wireless / Wired"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>DPI (สำหรับเมาส์)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formDpi}
                    onChangeText={setFormDpi}
                    keyboardType="numeric"
                    placeholder="เช่น 32000"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>ขนาด / ไซส์</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formSize}
                    onChangeText={setFormSize}
                    placeholder="เช่น TKL, 24.5 นิ้ว"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>ลิงก์รูปภาพ (Image URL)</Text>
              <TextInput
                style={styles.formInput}
                value={formImage}
                onChangeText={setFormImage}
                placeholder="https://..."
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>รายละเอียดสินค้า (Description)</Text>
              <TextInput
                style={[styles.formInput, { height: 70 }]}
                value={formDesc}
                onChangeText={setFormDesc}
                multiline
                placeholder="ระบุสเปกหรือคุณสมบัติสินค้า..."
                placeholderTextColor={COLORS.textSecondary}
              />

              <View style={{ marginVertical: 20, gap: 10 }}>
                <TouchableOpacity
                  style={[styles.saveProductBtn, isSavingProduct && { opacity: 0.7 }]}
                  disabled={isSavingProduct}
                  onPress={handleSaveProduct}
                >
                  {isSavingProduct ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.saveProductBtnText}>
                        {modalMode === "add" ? "บันทึกสินค้าใหม่" : "บันทึกการแก้ไข"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {modalMode === "edit" && selectedProduct && (
                  <TouchableOpacity
                    style={styles.deleteProductModalBtn}
                    onPress={() => handleDeleteProduct(selectedProduct)}
                  >
                    <Ionicons name="trash" size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>ลบสินค้านี้ออกจากระบบ</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ================================================================== */}
      {/* 🛒 CART MODAL */}
      {/* ================================================================== */}
      <Modal visible={cartModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.cartModalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="cart" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>ตะกร้าสินค้า ({cartTotalQuantity})</Text>
              </View>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>ไม่มีสินค้าในตะกร้า</Text>
              </View>
            ) : (
              <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                {cart.map((item) => (
                  <View key={item.product.id} style={styles.cartItemCard}>
                    <Image source={{ uri: item.product.image_url }} style={styles.cartItemImg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cartItemTitle} numberOfLines={1}>{item.product.name}</Text>
                      <Text style={styles.cartItemPrice}>฿{item.product.price.toLocaleString()}</Text>
                      <Text style={styles.cartItemStock}>คงเหลือ: {item.product.stock} ชิ้น</Text>

                      <View style={styles.qtyControlRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateCartQuantity(item.product.id, -1)}
                        >
                          <Ionicons name="remove" size={16} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateCartQuantity(item.product.id, 1)}
                        >
                          <Ionicons name="add" size={16} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.cartDeleteBtn}
                      onPress={() => removeFromCart(item.product.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.badgeOut} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.cartFooterTotalRow}>
                  <Text style={styles.cartFooterTotalLabel}>ราคารวมทั้งสิ้น:</Text>
                  <Text style={styles.cartFooterTotalPrice}>฿{cartTotalPrice.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleStartCheckout}>
                  <Ionicons name="card-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.checkoutBtnText}>ดำเนินการชำระเงิน (Checkout)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ================================================================== */}
      {/* 💳 CHECKOUT MODAL */}
      {/* ================================================================== */}
      <Modal visible={checkoutModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.checkoutModalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="card" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>ชำระเงิน (Checkout)</Text>
              </View>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              <Text style={styles.formSectionTitle}>1. ข้อมูลผู้รับและสถานที่จัดส่ง</Text>

              <Text style={styles.inputLabel}>ชื่อผู้รับ *</Text>
              <TextInput
                style={styles.formInput}
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="ระบุชื่อ-นามสกุล"
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>เบอร์โทรศัพท์ *</Text>
              <TextInput
                style={styles.formInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="ระบุเบอร์โทรศัพท์"
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>ที่อยู่ *</Text>
              <TextInput
                style={[styles.formInput, { height: 60 }]}
                value={address}
                onChangeText={setAddress}
                multiline
                placeholder="บ้านเลขที่, ถนน, ซอย..."
                placeholderTextColor={COLORS.textSecondary}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>จังหวัด *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={province}
                    onChangeText={setProvince}
                    placeholder="เช่น ชลบุรี"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>รหัสไปรษณีย์ *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    keyboardType="number-pad"
                    placeholder="เช่น 20230"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
              </View>

              <Text style={styles.formSectionTitle}>2. วิธีการชำระเงิน (Payment Method)</Text>
              <View style={styles.paymentMethodList}>
                {(["QR PromptPay", "โอนเงิน", "เก็บเงินปลายทาง"] as const).map((method) => {
                  const selected = paymentMethod === method;
                  return (
                    <TouchableOpacity
                      key={method}
                      style={[styles.paymentMethodCard, selected && styles.paymentMethodCardActive]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Ionicons
                        name={
                          method === "QR PromptPay"
                            ? "qr-code-outline"
                            : method === "โอนเงิน"
                            ? "business-outline"
                            : "cash-outline"
                        }
                        size={22}
                        color={selected ? COLORS.primary : COLORS.textSecondary}
                        style={{ marginRight: 10 }}
                      />
                      <Text style={[styles.paymentMethodText, selected && styles.paymentMethodTextActive]}>
                        {method}
                      </Text>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {paymentMethod === "โอนเงิน" && (
                <View style={styles.slipUploadContainer}>
                  <Text style={styles.inputLabel}>แนบสลิปการโอนเงิน (Upload Slip) *</Text>
                  <Text style={styles.slipBankInfo}>
                    ธนาคารกสิกรไทย: 123-4-56789-0 (mono Gaming Co., Ltd.)
                  </Text>
                  <TouchableOpacity style={styles.uploadSlipBtn} onPress={handleSimulateUploadSlip}>
                    <Ionicons name="cloud-upload-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.uploadSlipBtnText}>
                      {slipImage ? "✓ เปลี่ยนรูปสลิป" : "เลือกไฟล์ / อัปโหลดสลิป"}
                    </Text>
                  </TouchableOpacity>

                  {slipImage && (
                    <View style={styles.slipPreviewBox}>
                      <Image source={{ uri: slipImage }} style={styles.slipPreviewImg} />
                      <Text style={styles.slipSuccessText}>แนบหลักฐานสลิปเรียบร้อยแล้ว</Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.checkoutSummaryCard}>
                <Text style={styles.checkoutSummaryTitle}>สรุปยอดชำระเงิน</Text>
                <View style={styles.checkoutSummaryRow}>
                  <Text style={styles.checkoutSummaryLabel}>จำนวนสินค้า:</Text>
                  <Text style={styles.checkoutSummaryValue}>{cartTotalQuantity} ชิ้น</Text>
                </View>
                <View style={styles.checkoutSummaryRow}>
                  <Text style={styles.checkoutSummaryLabel}>ค่าจัดส่ง:</Text>
                  <Text style={[styles.checkoutSummaryValue, { color: COLORS.badgeInStock }]}>ฟรี</Text>
                </View>
                <View style={[styles.checkoutSummaryRow, { marginTop: 8, borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 8 }]}>
                  <Text style={[styles.checkoutSummaryLabel, { fontWeight: "bold", color: "#FFF" }]}>ยอดรวมสุทธิ:</Text>
                  <Text style={[styles.checkoutSummaryValue, { fontWeight: "bold", fontSize: 18, color: COLORS.accent }]}>
                    ฿{cartTotalPrice.toLocaleString()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.confirmOrderBtn, isSubmittingOrder && { opacity: 0.7 }]}
                disabled={isSubmittingOrder}
                onPress={handleConfirmOrder}
              >
                {isSubmittingOrder ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.confirmOrderBtnText}>ยืนยันการสั่งซื้อ</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* FLOATING PRODUCT COMPARE BAR */}
      {compareList.length > 0 && (
        <View style={styles.floatingCompareBar}>
          <View style={styles.floatingCompareInner}>
            <View style={styles.compareBarLeft}>
              <View style={styles.compareBarIconBadge}>
                <Ionicons name="git-compare" size={18} color="#38BDF8" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.compareBarTitle}>
                    ⚖️ เปรียบเทียบสินค้า ({compareList.length}/2)
                  </Text>
                  {compareList.length === 2 && (
                    <View style={styles.compareReadyBadge}>
                      <Text style={styles.compareReadyBadgeText}>พร้อมเทียบ</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.compareBarSub} numberOfLines={1}>
                  {compareList.length === 1
                    ? `เลือกแล้ว: ${compareList[0].name} (คลิก Compare สินค้าอีก 1 ชิ้น)`
                    : `${compareList[0].name}  VS  ${compareList[1].name}`}
                </Text>
              </View>
            </View>

            <View style={styles.compareBarRight}>
              <TouchableOpacity
                style={[
                  styles.compareBarActionBtn,
                  compareList.length < 2 && styles.compareBarActionBtnDisabled,
                ]}
                disabled={compareList.length < 2}
                onPress={() => setCompareModalVisible(true)}
              >
                <Ionicons name="sparkles" size={15} color="#FFF" />
                <Text style={styles.compareBarActionBtnText}>
                  {compareList.length === 2 ? "ดูผลเปรียบเทียบ" : "เลือกอีก 1 ชิ้น"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.compareBarClearBtn}
                onPress={() => setCompareList([])}
              >
                <Ionicons name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ================================================================== */}
      {/* BOTTOM NAVIGATION TAB BAR */}
      {/* ================================================================== */}
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavInner}>
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab("catalog")}
          >
            <Ionicons
              name={activeTab === "catalog" ? "storefront" : "storefront-outline"}
              size={22}
              color={activeTab === "catalog" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.navLabel, activeTab === "catalog" && styles.navLabelActive]}>
              สินค้า
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab("sets")}
          >
            <Ionicons
              name={activeTab === "sets" ? "game-controller" : "game-controller-outline"}
              size={22}
              color={activeTab === "sets" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.navLabel, activeTab === "sets" && styles.navLabelActive]}>
              จัดเซ็ต
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab("wishlist")}
          >
            <Ionicons
              name={activeTab === "wishlist" ? "heart" : "heart-outline"}
              size={22}
              color={activeTab === "wishlist" ? COLORS.accent : COLORS.textSecondary}
            />
            <Text style={[styles.navLabel, activeTab === "wishlist" && { color: COLORS.accent }]}>
              Wishlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab("orders")}
          >
            <Ionicons
              name={activeTab === "orders" ? "receipt" : "receipt-outline"}
              size={22}
              color={activeTab === "orders" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.navLabel, activeTab === "orders" && styles.navLabelActive]}>
              Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab("account")}
          >
            <Ionicons
              name={activeTab === "account" ? "person" : "person-outline"}
              size={22}
              color={activeTab === "account" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.navLabel, activeTab === "account" && styles.navLabelActive]}>
              {currentUser ? (currentUser.role === "admin" ? "Admin" : "โปรไฟล์") : "เข้าสู่ระบบ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FLOATING NEXORA AI BUTTON (มุมขวาล่าง) */}
      <TouchableOpacity
        style={styles.floatingAiFab}
        onPress={() => {
          setAiFocusedProduct(null);
          setAiInitialPrompt("");
          setAiChatVisible(true);
        }}
        activeOpacity={0.85}
      >
        <View style={styles.floatingAiFabInner}>
          <Text style={{ fontSize: 20 }}>🤖</Text>
          <View style={styles.floatingFabOnlineDot} />
        </View>
        <View style={styles.floatingFabTextBox}>
          <Text style={styles.floatingFabTitle}>NEXORA AI</Text>
          <Text style={styles.floatingFabSub}>ถาม AI • แนะนำสเปก</Text>
        </View>
      </TouchableOpacity>

      {/* NEXORA AI CHAT MODAL */}
      <NexoraAiChatModal
        visible={aiChatVisible}
        onClose={() => setAiChatVisible(false)}
        products={products}
        onAddToCart={addToCart}
        initialProduct={aiFocusedProduct}
        initialPrompt={aiInitialPrompt}
      />

      {/* PRODUCT COMPARISON MODAL WITH AI */}
      <ProductCompareModal
        visible={compareModalVisible}
        productA={compareList[0] || null}
        productB={compareList[1] || null}
        onClose={() => setCompareModalVisible(false)}
        onAddToCart={(product, quantity) => {
          addToCart(product, quantity);
        }}
        onAskAiInChat={(prompt) => {
          setAiInitialPrompt(prompt);
          setAiFocusedProduct(null);
          setAiChatVisible(true);
        }}
        onClearComparison={() => {
          setCompareList([]);
          setCompareModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    width: "100%",
  },
  topBarInner: {
    maxWidth: 1400,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    maxWidth: 110,
  },
  userStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  topLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  topLoginBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cartHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  cartHeaderText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  filterTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  filterTriggerBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTriggerBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  addProductBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  filterResultCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  resetFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
    gap: 4,
  },
  resetFilterText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "bold",
  },
  categoriesWrapper: {
    marginVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryPillTextActive: {
    color: "#FFF",
  },
  productListContent: {
    maxWidth: 1400,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  productColumnWrapper: {
    justifyContent: "flex-start",
    gap: 16,
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.7)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeInStock: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
  },
  badgeLow: {
    backgroundColor: "rgba(245, 158, 11, 0.95)",
  },
  badgeOut: {
    backgroundColor: "rgba(239, 68, 68, 0.95)",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardIconBtn: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 15,
    padding: 6,
  },
  productImageContainer: {
    width: "100%",
    height: 185,
    backgroundColor: "#0A0F1D",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(51, 65, 85, 0.4)",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 14,
  },
  categoryBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  ratingBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  productCategory: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  productRatingText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 6,
    minHeight: 40,
    lineHeight: 20,
  },
  specTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
  },
  specTag: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specTagText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 65, 85, 0.4)",
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.gold,
    marginTop: 2,
  },
  stockLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  stockValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.badgeInStock,
    marginTop: 2,
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 2,
  },
  addToCartBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.6,
  },
  addToCartBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 12,
  },
  // Sub Tabs
  subTabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginVertical: 12,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  subTabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  subTabText: {
    color: COLORS.textSecondary,
    fontWeight: "bold",
    fontSize: 13,
  },
  subTabTextActive: {
    color: "#FFF",
  },
  // Bundles
  bundleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  bundleImage: {
    width: "100%",
    height: 150,
  },
  bundleContent: {
    padding: 14,
  },
  bundleTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFF",
  },
  bundleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bundleItemList: {
    marginVertical: 10,
    gap: 4,
  },
  bundleItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bundleItemText: {
    color: COLORS.text,
    fontSize: 12,
  },
  bundlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 10,
  },
  bundleOriginalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
  },
  bundleDiscountPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.gold,
  },
  bundleAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bundleAddBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  // Builder
  builderHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 6,
  },
  builderSubheading: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  slotContainer: {
    marginBottom: 16,
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.gold,
    marginBottom: 8,
  },
  slotItem: {
    width: 140,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slotItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderWidth: 2,
  },
  slotItemImg: {
    width: "100%",
    height: 80,
    borderRadius: 8,
  },
  slotItemName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 6,
  },
  slotItemPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.gold,
    marginTop: 2,
  },
  builderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  builderSummaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  builderSummaryPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.gold,
  },
  builderSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  builderSubmitBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  // Screen Header
  screenHeader: {
    marginVertical: 14,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Wishlist
  wishlistItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wishlistImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  wishlistTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  wishlistPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.gold,
    marginVertical: 2,
  },
  wishlistAddBtn: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 8,
  },
  wishlistRemoveBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    padding: 8,
    borderRadius: 8,
  },
  // Orders
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  orderRecipient: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  orderAddress: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  orderPayment: {
    color: COLORS.primaryLight,
    fontSize: 12,
    marginTop: 2,
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  orderItemName: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: "600",
  },
  orderTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  orderTotalPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.gold,
  },
  advanceStatusBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  advanceStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Profile
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileRole: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: "bold",
    marginTop: 4,
  },
  profileDbInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  quickAddProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.badgeOut,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginModalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  signupModalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  guestBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  // Auth Modal
  authModalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "75%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  authTabSwitch: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  authSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  authSwitchBtnActive: {
    backgroundColor: COLORS.primary,
  },
  authSwitchText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 13,
  },
  authSwitchTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFF",
    fontSize: 14,
  },
  eyeBtn: {
    paddingHorizontal: 12,
  },
  authSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 18,
  },
  authSubmitBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  demoBox: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoTitle: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: "bold",
    marginBottom: 8,
  },
  demoBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  demoPill: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  demoPillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  guestLinkBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  guestLinkText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  // Filter Modal Styles
  filterModalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "85%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterGroupTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.gold,
    marginTop: 14,
    marginBottom: 8,
  },
  filterOptionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChoicePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChoicePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChoiceText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  filterChoiceTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  filterResetActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 10,
  },
  filterApplyActionBtn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  // Add / Edit Product Modal
  productFormModalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categorySelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  catSelectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catSelectBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catSelectText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  catSelectTextActive: {
    color: "#FFF",
  },
  saveProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveProductBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  deleteProductModalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.badgeOut,
    paddingVertical: 12,
    borderRadius: 12,
  },
  // Modal Common
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFF",
  },
  // Cart Modal
  cartModalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartItemImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFF",
  },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.gold,
    marginTop: 2,
  },
  cartItemStock: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  qtyControlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  qtyBtn: {
    backgroundColor: COLORS.surfaceLight,
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  cartDeleteBtn: {
    padding: 8,
  },
  cartFooter: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  cartFooterTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cartFooterTotalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  cartFooterTotalPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.gold,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  checkoutBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  // Checkout Modal
  checkoutModalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 14,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFF",
    fontSize: 14,
  },
  paymentMethodList: {
    gap: 8,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentMethodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
  },
  paymentMethodText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  paymentMethodTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  slipUploadContainer: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  slipBankInfo: {
    fontSize: 12,
    color: COLORS.gold,
    marginBottom: 8,
  },
  uploadSlipBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
  },
  uploadSlipBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },
  slipPreviewBox: {
    alignItems: "center",
    marginTop: 10,
  },
  slipPreviewImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  slipSuccessText: {
    color: COLORS.badgeInStock,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  checkoutSummaryCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkoutSummaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  checkoutSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  checkoutSummaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  checkoutSummaryValue: {
    fontSize: 13,
    color: "#FFF",
  },
  confirmOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 30,
  },
  confirmOrderBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  // Bottom Navigation Bar
  bottomNav: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    width: "100%",
  },
  bottomNavInner: {
    flexDirection: "row",
    maxWidth: 1400,
    width: "100%",
    alignSelf: "center",
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: "500",
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  // Ask AI Card Button
  askAiCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.4)",
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  askAiCardBtnText: {
    color: "#C084FC",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Floating NEXORA AI FAB (Bottom Right)
  floatingAiFab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 85 : 75,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1B4B", // Deep Indigo
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
    borderRadius: 28,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  floatingAiFabInner: {
    position: "relative",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingFabOnlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#1E1B4B",
  },
  floatingFabTextBox: {
    marginLeft: 8,
  },
  floatingFabTitle: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  floatingFabSub: {
    color: "#A78BFA",
    fontSize: 9,
    fontWeight: "600",
  },
  // Comparison Styles
  productCardComparing: {
    borderColor: "#38BDF8",
    borderWidth: 2,
    shadowColor: "#38BDF8",
    shadowOpacity: 0.5,
  },
  compareCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.35)",
    paddingVertical: 7,
    borderRadius: 8,
  },
  compareCardBtnActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10B981",
  },
  compareCardBtnText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "bold",
  },
  compareCardBtnTextActive: {
    color: "#10B981",
  },
  topCompareTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderWidth: 1,
    borderColor: "#38BDF8",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  topCompareTriggerText: {
    color: "#38BDF8",
    fontWeight: "bold",
    fontSize: 12,
  },
  floatingCompareBar: {
    backgroundColor: "#0B132B",
    borderTopWidth: 1.5,
    borderTopColor: "#38BDF8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "100%",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 900,
  },
  floatingCompareInner: {
    maxWidth: 1400,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  compareBarLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  compareBarIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    borderWidth: 1,
    borderColor: "#38BDF8",
    alignItems: "center",
    justifyContent: "center",
  },
  compareBarTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  compareReadyBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  compareReadyBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  compareBarSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  compareBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  compareBarActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0284C7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  compareBarActionBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.7,
  },
  compareBarActionBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  compareBarClearBtn: {
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
  },
});