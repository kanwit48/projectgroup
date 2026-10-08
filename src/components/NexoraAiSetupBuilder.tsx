/**
 * ============================================================================
 * NEXORA AI - Gaming Setup Assistant & Budget Analyzer Component
 * ============================================================================
 * Allows customers to specify budget, game, and play level to get an
 * AI-engineered gaming setup connected to real database inventory.
 * ============================================================================
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/api";
import { buildAiGamingSetup, AiSetupResult } from "@/services/nexoraAi";

const COLORS = {
  primary: "#7C3AED",
  primaryDark: "#5B21B6",
  primaryLight: "#EDE9FE",
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

interface NexoraAiSetupBuilderProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenAiChatWithPrompt?: (prompt: string) => void;
}

export const NexoraAiSetupBuilder: React.FC<NexoraAiSetupBuilderProps> = ({
  products,
  onAddToCart,
  onOpenAiChatWithPrompt,
}) => {
  const [budgetStr, setBudgetStr] = useState("20000");
  const [selectedGame, setSelectedGame] = useState("Valorant");
  const [selectedLevel, setSelectedLevel] = useState("Competitive");
  const [isBuilding, setIsBuilding] = useState(false);
  const [setupResult, setSetupResult] = useState<AiSetupResult | null>(() => {
    // Default initial build for 20,000 Valorant
    return buildAiGamingSetup(20000, "Valorant", "Competitive", products);
  });

  const BUDGET_PRESETS = [15000, 20000, 25000, 35000, 50000];
  const GAMES = [
    { id: "Valorant", name: "Valorant (FPS)", icon: "🎯" },
    { id: "Counter-Strike 2", name: "CS2 (Tactical FPS)", icon: "🔫" },
    { id: "Apex Legends", name: "Apex Legends (Fast FPS)", icon: "⚡" },
    { id: "Dota 2", name: "Dota 2 / MOBA", icon: "⚔️" },
    { id: "AAA Gaming", name: "AAA Story / Casual", icon: "🎮" },
  ];
  const LEVELS = [
    { id: "Beginner", label: "Beginner (เริ่มต้น)" },
    { id: "Competitive", label: "Competitive (ไต่แรงค์)" },
    { id: "Esports Pro", label: "Esports Pro (ระดับแข่ง)" },
  ];

  const handleBuildSetup = () => {
    const budgetNum = parseInt(budgetStr.replace(/,/g, ""), 10);
    if (isNaN(budgetNum) || budgetNum < 3000) {
      Alert.alert("งบประมาณไม่ถูกต้อง", "กรุณาระบุงบประมาณอย่างน้อย ฿3,000 บาทขึ้นไป");
      return;
    }

    setIsBuilding(true);
    setTimeout(() => {
      const res = buildAiGamingSetup(budgetNum, selectedGame, selectedLevel, products);
      setSetupResult(res);
      setIsBuilding(false);
    }, 400);
  };

  const handleAddAllToCart = () => {
    if (!setupResult || setupResult.items.length === 0) return;

    let addedCount = 0;
    for (const item of setupResult.items) {
      if (item.product.stock > 0) {
        onAddToCart(item.product, 1);
        addedCount++;
      }
    }

    Alert.alert(
      "🎉 เพิ่มเซ็ตลงตะกร้าสำเร็จ!",
      `เพิ่มอุปกรณ์เซ็ต ${setupResult.game} จำนวน ${addedCount} รายการลงในตะกร้าเรียบร้อยแล้ว\nรวม ฿${setupResult.totalPrice.toLocaleString()}`
    );
  };

  return (
    <View style={styles.container}>
      {/* AI BANNER HEADER */}
      <View style={styles.aiHeader}>
        <View style={styles.aiHeaderIconBadge}>
          <Text style={{ fontSize: 24 }}>🤖</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.aiHeaderTitle}>NEXORA AI Setup Assistant</Text>
          <Text style={styles.aiHeaderSubtitle}>
            ระบบ AI วิเคราะห์สเปก จัดชุด Gaming Gear อัตโนมัติจากสต็อกจริง
          </Text>
        </View>
      </View>

      {/* INPUT FORM CARD */}
      <View style={styles.inputCard}>
        {/* 1. Budget Input */}
        <Text style={styles.inputLabel}>💰 งบประมาณของคุณ (Budget):</Text>
        <View style={styles.budgetInputRow}>
          <Text style={styles.currencySymbol}>฿</Text>
          <TextInput
            style={styles.budgetInput}
            value={budgetStr}
            onChangeText={(text) => setBudgetStr(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            placeholder="เช่น 20000"
            placeholderTextColor={COLORS.textSecondary}
          />
          <Text style={styles.currencyUnit}>บาท</Text>
        </View>

        {/* Quick Budget Pills */}
        <View style={styles.pillRow}>
          {BUDGET_PRESETS.map((p) => {
            const active = budgetStr === String(p);
            return (
              <TouchableOpacity
                key={p}
                style={[styles.budgetPill, active && styles.budgetPillActive]}
                onPress={() => setBudgetStr(String(p))}
              >
                <Text style={[styles.budgetPillText, active && styles.budgetPillTextActive]}>
                  ฿{p.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. Game Selection */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>🎮 เกมที่เล่น (Game):</Text>
        <View style={styles.choiceGrid}>
          {GAMES.map((g) => {
            const active = selectedGame === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.choicePill, active && styles.choicePillActive]}
                onPress={() => setSelectedGame(g.id)}
              >
                <Text style={styles.choiceIcon}>{g.icon}</Text>
                <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
                  {g.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Level Selection */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>🏆 ระดับการเล่น (Level):</Text>
        <View style={styles.levelRow}>
          {LEVELS.map((lvl) => {
            const active = selectedLevel === lvl.id;
            return (
              <TouchableOpacity
                key={lvl.id}
                style={[styles.levelBtn, active && styles.levelBtnActive]}
                onPress={() => setSelectedLevel(lvl.id)}
              >
                <Text style={[styles.levelBtnText, active && styles.levelBtnTextActive]}>
                  {lvl.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* BUILD BUTTON */}
        <TouchableOpacity
          style={styles.buildBtn}
          onPress={handleBuildSetup}
          disabled={isBuilding}
          activeOpacity={0.85}
        >
          {isBuilding ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.buildBtnIcon}>🤖</Text>
              <Text style={styles.buildBtnText}>BUILD WITH AI (วิเคราะห์และจัดเซ็ต)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* SETUP RESULT DISPLAY CARD */}
      {setupResult && (
        <View style={styles.resultCard}>
          {/* Header */}
          <View style={styles.resultHeader}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.resultBadgeTag}>🎮 YOUR AI GAMING SET</Text>
                <View style={styles.resultAiBadge}>
                  <Text style={styles.resultAiBadgeText}>🤖 NEXORA AI</Text>
                </View>
              </View>
              <Text style={styles.resultSubHeader}>
                งบประมาณ: ฿{setupResult.budget.toLocaleString()} • เกม: {setupResult.game} • {setupResult.genre}
              </Text>
            </View>
          </View>

          {/* AI Analysis Summary */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryIcon}>💡</Text>
            <Text style={styles.summaryText}>{setupResult.summary}</Text>
          </View>

          {/* Itemized List */}
          <View style={styles.itemList}>
            <Text style={styles.itemSectionTitle}>แนะนำ Gaming Setup:</Text>
            {setupResult.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Image
                  source={{ uri: item.product.image_url }}
                  style={styles.itemThumbnail}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.itemCatIcon}>{item.icon}</Text>
                    <Text style={styles.itemCatLabel}>{item.category}</Text>
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemSpec}>
                    {item.product.brand} • {item.product.connection}
                    {item.product.dpi ? ` • ${item.product.dpi.toLocaleString()} DPI` : ""}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.itemPrice}>฿{item.product.price.toLocaleString()}</Text>
                  <Text style={styles.itemStockText}>
                    {item.product.stock > 0 ? `มีของ (${item.product.stock})` : "หมด"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.divider} />
          <View style={styles.priceSummaryRow}>
            <Text style={styles.totalLabel}>รวมทั้งหมด ({setupResult.items.length} ชิ้น):</Text>
            <Text style={styles.totalValue}>฿{setupResult.totalPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.remainingBudgetRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="wallet-outline" size={18} color={COLORS.badgeInStock} style={{ marginRight: 6 }} />
              <Text style={styles.remainingLabel}>เหลืองบประมาณ:</Text>
            </View>
            <Text style={styles.remainingValue}>
              ฿{setupResult.remainingBudget.toLocaleString()}
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.addAllBtn}
            onPress={handleAddAllToCart}
            activeOpacity={0.85}
          >
            <Ionicons name="cart" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.addAllBtnText}>เพิ่มทั้งหมดลงตะกร้า (Add All to Cart)</Text>
          </TouchableOpacity>

          {onOpenAiChatWithPrompt && (
            <TouchableOpacity
              style={styles.askAiMoreBtn}
              onPress={() =>
                onOpenAiChatWithPrompt(
                  `ผมอยากปรับแต่งเซ็ตงบ ฿${setupResult.budget.toLocaleString()} สำหรับ ${setupResult.game} เพิ่มเติม`
                )
              }
            >
              <Ionicons name="chatbubbles-outline" size={16} color={COLORS.cyan} style={{ marginRight: 6 }} />
              <Text style={styles.askAiMoreBtnText}>คุยกับ NEXORA AI เพื่อปรับแต่งเซ็ตนี้</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E1065", // Deep purple
    borderWidth: 1,
    borderColor: "#7C3AED",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  aiHeaderIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A78BFA",
  },
  aiHeaderTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  aiHeaderSubtitle: {
    color: "#DDD6FE",
    fontSize: 12,
    marginTop: 2,
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  inputLabel: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  budgetInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currencySymbol: {
    color: COLORS.primaryLight,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 6,
  },
  budgetInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  currencyUnit: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  budgetPill: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  budgetPillActive: {
    backgroundColor: "rgba(124, 58, 237, 0.25)",
    borderColor: COLORS.primary,
  },
  budgetPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  budgetPillTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  choiceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choicePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  choicePillActive: {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderColor: COLORS.cyan,
  },
  choiceIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  choiceText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  choiceTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  levelRow: {
    flexDirection: "row",
    gap: 8,
  },
  levelBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  levelBtnActive: {
    backgroundColor: "rgba(236, 72, 153, 0.18)",
    borderColor: COLORS.accent,
  },
  levelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  levelBtnTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  buildBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  buildBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buildBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4C1D95",
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultBadgeTag: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  resultAiBadge: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  resultAiBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  resultSubHeader: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  summaryBox: {
    flexDirection: "row",
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: "center",
  },
  summaryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  summaryText: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 12,
    lineHeight: 17,
  },
  itemList: {
    marginBottom: 10,
  },
  itemSectionTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#0F172A",
  },
  itemCatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  itemCatLabel: {
    color: COLORS.cyan,
    fontSize: 11,
    fontWeight: "bold",
  },
  itemName: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 1,
  },
  itemSpec: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  itemPrice: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "bold",
  },
  itemStockText: {
    color: COLORS.badgeInStock,
    fontSize: 10,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  priceSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  totalValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  remainingBudgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  remainingLabel: {
    color: COLORS.badgeInStock,
    fontSize: 13,
    fontWeight: "bold",
  },
  remainingValue: {
    color: COLORS.badgeInStock,
    fontSize: 16,
    fontWeight: "bold",
  },
  addAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addAllBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  askAiMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 8,
  },
  askAiMoreBtnText: {
    color: COLORS.cyan,
    fontSize: 12,
    fontWeight: "600",
  },
});
