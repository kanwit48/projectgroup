/**
 * ============================================================================
 * ProductCompareModal.tsx - Side-by-Side Comparison Modal with NEXORA AI
 * ============================================================================
 * Features:
 * - Direct Side-by-Side comparison of 2 products (specs, DPI, weight, price, rating)
 * - "🤖 ให้ AI ช่วยเลือก" (AI Recommendation Button)
 * - Intelligent gamer-centric verdict (FPS vs Battery life, ergonomic vs symmetrical)
 * - Direct "Add to Cart" for either product
 * ============================================================================
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/api";
import { compareProductsWithAi, AiComparisonResult } from "@/services/nexoraAi";

const COLORS = {
  primary: "#7C3AED",
  primaryDark: "#5B21B6",
  accent: "#EC4899",
  background: "#0F172A",
  surface: "#1E293B",
  surfaceLight: "#334155",
  border: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  badgeInStock: "#10B981",
  gold: "#F59E0B",
  cyan: "#06B6D4",
};

interface ProductCompareModalProps {
  visible: boolean;
  productA: Product | null;
  productB: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAskAiInChat?: (prompt: string) => void;
  onClearComparison?: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  visible,
  productA,
  productB,
  onClose,
  onAddToCart,
  onAskAiInChat,
  onClearComparison,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<AiComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Trigger AI Analysis
  const handleAskAiToChoose = () => {
    if (!productA || !productB) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = compareProductsWithAi(productA, productB);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }, 400);
  };

  if (!productA || !productB) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBadge}>
                <Ionicons name="git-compare-outline" size={20} color="#C084FC" />
              </View>
              <View>
                <Text style={styles.headerTitle}>เปรียบเทียบสินค้า</Text>
                <Text style={styles.headerSubtitle}>Product Comparison & AI Recommendation</Text>
              </View>
            </View>
            <View style={styles.headerRightActions}>
              {onClearComparison && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => {
                    setAiAnalysis(null);
                    onClearComparison();
                  }}
                >
                  <Ionicons name="refresh-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.clearBtnText}>ล้าง</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  setAiAnalysis(null);
                  onClose();
                }}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Products Top Card Comparison */}
            <View style={styles.productsRow}>
              {/* Product A */}
              <View style={[styles.productColumn, styles.productColumnA]}>
                <View style={styles.columnBadgeA}>
                  <Text style={styles.columnBadgeText}>ตัวเลือก 1</Text>
                </View>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{
                      uri: productA.image_url || "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.productBrandText}>{productA.brand}</Text>
                <Text style={styles.productNameText} numberOfLines={2}>
                  {productA.name}
                </Text>
                <Text style={styles.productPriceText}>฿{productA.price.toLocaleString()}</Text>

                <TouchableOpacity
                  style={styles.addToCartColumnBtn}
                  onPress={() => onAddToCart(productA, 1)}
                  disabled={productA.stock === 0}
                >
                  <Ionicons name="cart" size={16} color="#FFF" />
                  <Text style={styles.addToCartColumnBtnText}>
                    {productA.stock > 0 ? "เพิ่มลงตะกร้า" : "สินค้าหมด"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* VS Divider Badge */}
              <View style={styles.vsBadgeContainer}>
                <View style={styles.vsBadge}>
                  <Text style={styles.vsText}>VS</Text>
                </View>
              </View>

              {/* Product B */}
              <View style={[styles.productColumn, styles.productColumnB]}>
                <View style={styles.columnBadgeB}>
                  <Text style={styles.columnBadgeText}>ตัวเลือก 2</Text>
                </View>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{
                      uri: productB.image_url || "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.productBrandText}>{productB.brand}</Text>
                <Text style={styles.productNameText} numberOfLines={2}>
                  {productB.name}
                </Text>
                <Text style={styles.productPriceText}>฿{productB.price.toLocaleString()}</Text>

                <TouchableOpacity
                  style={styles.addToCartColumnBtn}
                  onPress={() => onAddToCart(productB, 1)}
                  disabled={productB.stock === 0}
                >
                  <Ionicons name="cart" size={16} color="#FFF" />
                  <Text style={styles.addToCartColumnBtnText}>
                    {productB.stock > 0 ? "เพิ่มลงตะกร้า" : "สินค้าหมด"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI DECISION BUTTON */}
            <View style={styles.aiButtonSection}>
              <TouchableOpacity
                style={styles.aiChooseBtn}
                onPress={handleAskAiToChoose}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#FDE047" />
                    <Text style={styles.aiChooseBtnText}>🤖 ให้ AI ช่วยเลือก (Ask NEXORA AI)</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.aiButtonHint}>
                คลิกเพื่อให้ AI คำนวณความคุ้มค่า สเปก และแนะนำรุ่นที่เหมาะกับแนวเกมของคุณที่สุด
              </Text>
            </View>

            {/* AI RECOMMENDATION RESULT BOX */}
            {aiAnalysis && (
              <View style={styles.aiResultCard}>
                <View style={styles.aiResultHeader}>
                  <View style={styles.aiResultBadge}>
                    <Ionicons name="hardware-chip" size={16} color="#10B981" />
                    <Text style={styles.aiResultBadgeText}>NEXORA AI VERDICT</Text>
                  </View>
                  <Text style={styles.aiResultTime}>วิเคราะห์แบบเรียลไทม์</Text>
                </View>

                {/* Verdict text */}
                <View style={styles.verdictBox}>
                  <Text style={styles.verdictTitle}>💡 สรุปผลการวิเคราะห์:</Text>
                  <Text style={styles.verdictContent}>{aiAnalysis.verdict}</Text>
                </View>

                {/* Pros Breakdown */}
                <View style={styles.prosComparisonRow}>
                  {/* Pros A */}
                  <View style={styles.prosColumn}>
                    <Text style={styles.prosColumnHeader} numberOfLines={1}>
                      🔹 {productA.name}
                    </Text>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{aiAnalysis.bestChoiceTagA}</Text>
                    </View>
                    {aiAnalysis.prosA.map((pro, idx) => (
                      <View key={idx} style={styles.proItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.proText}>{pro}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.chooseThisBtn}
                      onPress={() => onAddToCart(productA, 1)}
                    >
                      <Text style={styles.chooseThisBtnText}>เลือกชิ้นนี้</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Pros B */}
                  <View style={styles.prosColumn}>
                    <Text style={styles.prosColumnHeader} numberOfLines={1}>
                      🔸 {productB.name}
                    </Text>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{aiAnalysis.bestChoiceTagB}</Text>
                    </View>
                    {aiAnalysis.prosB.map((pro, idx) => (
                      <View key={idx} style={styles.proItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.proText}>{pro}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.chooseThisBtn}
                      onPress={() => onAddToCart(productB, 1)}
                    >
                      <Text style={styles.chooseThisBtnText}>เลือกชิ้นนี้</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Chat follow-up link */}
                {onAskAiInChat && (
                  <TouchableOpacity
                    style={styles.chatFollowUpBtn}
                    onPress={() => {
                      onClose();
                      onAskAiInChat(
                        `ช่วยเปรียบเทียบสเปกอย่างละเอียดระหว่าง ${productA.name} กับ ${productB.name} และแนะนำว่าตัวไหนคุ้มกว่า`
                      );
                    }}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#A78BFA" />
                    <Text style={styles.chatFollowUpText}>
                      ต้องการสอบถามข้อสงสัยเพิ่มเติมกับ AI ในแชต? คลิกที่นี่
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* SIDE-BY-SIDE SPEC TABLE */}
            <View style={styles.specsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>📊 ตารางเปรียบเทียบสเปก (Specs Comparison)</Text>
              </View>

              {/* Row: Category */}
              <View style={styles.tableRow}>
                <Text style={styles.rowLabel}>🏷️ ประเภท</Text>
                <View style={styles.rowValues}>
                  <Text style={styles.rowValA}>{productA.category}</Text>
                  <View style={styles.rowDivider} />
                  <Text style={styles.rowValB}>{productB.category}</Text>
                </View>
              </View>

              {/* Row: Brand */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={styles.rowLabel}>🏢 แบรนด์</Text>
                <View style={styles.rowValues}>
                  <Text style={styles.rowValA}>{productA.brand}</Text>
                  <View style={styles.rowDivider} />
                  <Text style={styles.rowValB}>{productB.brand}</Text>
                </View>
              </View>

              {/* Row: Price */}
              <View style={styles.tableRow}>
                <Text style={styles.rowLabel}>💰 ราคา</Text>
                <View style={styles.rowValues}>
                  <Text
                    style={[
                      styles.rowValA,
                      productA.price < productB.price ? styles.rowHighlightPrice : {},
                    ]}
                  >
                    ฿{productA.price.toLocaleString()}
                    {productA.price < productB.price && " (ถูกกว่า)"}
                  </Text>
                  <View style={styles.rowDivider} />
                  <Text
                    style={[
                      styles.rowValB,
                      productB.price < productA.price ? styles.rowHighlightPrice : {},
                    ]}
                  >
                    ฿{productB.price.toLocaleString()}
                    {productB.price < productA.price && " (ถูกกว่า)"}
                  </Text>
                </View>
              </View>

              {/* Row: Connection */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={styles.rowLabel}>📡 การเชื่อมต่อ</Text>
                <View style={styles.rowValues}>
                  <Text style={styles.rowValA}>{productA.connection}</Text>
                  <View style={styles.rowDivider} />
                  <Text style={styles.rowValB}>{productB.connection}</Text>
                </View>
              </View>

              {/* Row: DPI (if applicable) */}
              {(productA.dpi || productB.dpi) && (
                <View style={styles.tableRow}>
                  <Text style={styles.rowLabel}>🎯 DPI สูงสุด</Text>
                  <View style={styles.rowValues}>
                    <Text
                      style={[
                        styles.rowValA,
                        (productA.dpi || 0) > (productB.dpi || 0) ? styles.rowHighlightSpec : {},
                      ]}
                    >
                      {productA.dpi ? `${productA.dpi.toLocaleString()} DPI` : "-"}
                      {(productA.dpi || 0) > (productB.dpi || 0) && " ⚡"}
                    </Text>
                    <View style={styles.rowDivider} />
                    <Text
                      style={[
                        styles.rowValB,
                        (productB.dpi || 0) > (productA.dpi || 0) ? styles.rowHighlightSpec : {},
                      ]}
                    >
                      {productB.dpi ? `${productB.dpi.toLocaleString()} DPI` : "-"}
                      {(productB.dpi || 0) > (productA.dpi || 0) && " ⚡"}
                    </Text>
                  </View>
                </View>
              )}

              {/* Row: Size & Weight */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={styles.rowLabel}>⚖️ ขนาด / น้ำหนัก</Text>
                <View style={styles.rowValues}>
                  <Text style={styles.rowValA}>{productA.size || "มาตรฐาน"}</Text>
                  <View style={styles.rowDivider} />
                  <Text style={styles.rowValB}>{productB.size || "มาตรฐาน"}</Text>
                </View>
              </View>

              {/* Row: Rating */}
              <View style={styles.tableRow}>
                <Text style={styles.rowLabel}>⭐ คะแนนรีวิว</Text>
                <View style={styles.rowValues}>
                  <Text style={styles.rowValA}>⭐ {productA.rating} / 5.0</Text>
                  <View style={styles.rowDivider} />
                  <Text style={styles.rowValB}>⭐ {productB.rating} / 5.0</Text>
                </View>
              </View>

              {/* Row: Stock */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={styles.rowLabel}>📦 สถานะสต็อก</Text>
                <View style={styles.rowValues}>
                  <Text
                    style={[
                      styles.rowValA,
                      { color: productA.stock > 0 ? COLORS.badgeInStock : "#EF4444" },
                    ]}
                  >
                    {productA.stock > 0 ? `พร้อมส่ง (${productA.stock} ชิ้น)` : "สินค้าหมด"}
                  </Text>
                  <View style={styles.rowDivider} />
                  <Text
                    style={[
                      styles.rowValB,
                      { color: productB.stock > 0 ? COLORS.badgeInStock : "#EF4444" },
                    ]}
                  >
                    {productB.stock > 0 ? `พร้อมส่ง (${productB.stock} ชิ้น)` : "สินค้าหมด"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: Platform.OS === "web" ? 20 : 10,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    width: "100%",
    maxWidth: 880,
    maxHeight: "92%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.4)",
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#161F30",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  modalBody: {
    padding: 18,
  },

  // Products Top Row
  productsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 16,
  },
  productColumn: {
    flex: 1,
    backgroundColor: "#131B2E",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: "center",
  },
  productColumnA: {
    marginRight: 6,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  productColumnB: {
    marginLeft: 6,
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  columnBadgeA: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  columnBadgeB: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  columnBadgeText: {
    color: "#E2E8F0",
    fontSize: 10,
    fontWeight: "bold",
  },
  productImageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#0A0F1D",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productBrandText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  productNameText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    minHeight: 36,
    marginTop: 4,
    lineHeight: 18,
  },
  productPriceText: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.gold,
    marginTop: 6,
    marginBottom: 12,
  },
  addToCartColumnBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartColumnBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // VS Badge in between
  vsBadgeContainer: {
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 10,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    borderWidth: 2,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  vsText: {
    color: "#EC4899",
    fontSize: 11,
    fontWeight: "900",
  },

  // AI Choose Button
  aiButtonSection: {
    marginVertical: 12,
    alignItems: "center",
  },
  aiChooseBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#6D28D9",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#A78BFA",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  aiChooseBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  aiButtonHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },

  // AI Result Card
  aiResultCard: {
    backgroundColor: "#111827",
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
    marginBottom: 20,
  },
  aiResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  aiResultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiResultBadgeText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  aiResultTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  verdictBox: {
    backgroundColor: "rgba(124, 58, 237, 0.12)",
    borderLeftWidth: 3,
    borderLeftColor: "#8B5CF6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  verdictTitle: {
    color: "#C084FC",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
  },
  verdictContent: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 20,
  },
  prosComparisonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  prosColumn: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },
  prosColumnHeader: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 6,
  },
  tagBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagBadgeText: {
    color: "#F59E0B",
    fontSize: 10,
    fontWeight: "bold",
  },
  proItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  proText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 11,
    lineHeight: 16,
  },
  chooseThisBtn: {
    backgroundColor: "rgba(124, 58, 237, 0.25)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  chooseThisBtnText: {
    color: "#E9D5FF",
    fontSize: 11,
    fontWeight: "bold",
  },
  chatFollowUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  chatFollowUpText: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Specs Table
  specsTable: {
    backgroundColor: "#131B2E",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginTop: 6,
  },
  tableHeader: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  tableHeaderText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableRowAlt: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  rowLabel: {
    width: 120,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  rowValues: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rowValA: {
    flex: 1,
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
  rowDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  rowValB: {
    flex: 1,
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
  rowHighlightPrice: {
    color: COLORS.badgeInStock,
    fontWeight: "bold",
  },
  rowHighlightSpec: {
    color: "#06B6D4",
    fontWeight: "bold",
  },
});
