/**
 * ============================================================================
 * NEXORA AI - Chatbot Assistant Modal Component
 * ============================================================================
 * Features:
 * - Floating chat drawer / modal
 * - Interactive conversation regarding specs, stock, setup, comparison
 * - Embedded Setup Cards & Product Buy Buttons directly in chat bubbles
 * - Quick prompt chips for fast access
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/api";
import {
  askNexoraAi,
  AiChatMessage,
  AiSetupResult,
} from "@/services/nexoraAi";

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

interface NexoraAiChatModalProps {
  visible: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  initialProduct?: Product | null;
  initialPrompt?: string;
}

export const NexoraAiChatModal: React.FC<NexoraAiChatModalProps> = ({
  visible,
  onClose,
  products,
  onAddToCart,
  initialProduct,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Suggested Quick Prompts
  const QUICK_PROMPTS = [
    "🎯 แนะนำเมาส์สำหรับ FPS",
    "💰 จัดเซ็ตงบ 20,000 เล่น Valorant",
    "⌨️ คีย์บอร์ดพิมพ์งาน + เล่นเกม",
    "📦 เช็คสต็อกสินค้า",
    "⚖️ เปรียบเทียบ Logitech vs Razer",
  ];

  // Initialize or reset chat on modal open
  useEffect(() => {
    if (visible) {
      if (initialProduct) {
        // Specific product query
        const userPrompt = `ขอคำแนะนำและวิเคราะห์เกี่ยวกับ ${initialProduct.name}`;
        const userMsg: AiChatMessage = {
          id: String(Date.now()),
          role: "user",
          text: userPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        const aiRes = askNexoraAi(userPrompt, products, initialProduct);
        const aiMsg: AiChatMessage = {
          id: String(Date.now() + 1),
          role: "assistant",
          text: aiRes.reply,
          recommendedProducts: aiRes.recommendedProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([userMsg, aiMsg]);
      } else if (initialPrompt) {
        handleSendMessage(initialPrompt);
      } else if (messages.length === 0) {
        // Default Welcome Message
        const welcomeAi = askNexoraAi("hello", products);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            text: welcomeAi.reply,
            recommendedProducts: welcomeAi.recommendedProducts,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    }
  }, [visible, initialProduct, initialPrompt]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal("");

    const userMsg: AiChatMessage = {
      id: String(Date.now()),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiRes = askNexoraAi(text, products);
      const aiMsg: AiChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: aiRes.reply,
        setup: aiRes.setup,
        recommendedProducts: aiRes.recommendedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 400);
  };

  const handleAddSetupToCart = (setup: AiSetupResult) => {
    let count = 0;
    for (const item of setup.items) {
      if (item.product.stock > 0) {
        onAddToCart(item.product, 1);
        count++;
      }
    }
    Alert.alert(
      "🎉 เพิ่มเซ็ตลงตะกร้าสำเร็จ",
      `เพิ่มอุปกรณ์เซ็ต ${setup.game} ทั้งหมด ${count} รายการลงตะกร้าแล้ว!\nราคารวม: ฿${setup.totalPrice.toLocaleString()}`
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.chatContainer}>
          {/* TOP CHAT HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botAvatar}>
                <Text style={{ fontSize: 22 }}>🤖</Text>
                <View style={styles.onlineBadge} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>NEXORA AI Assistant</Text>
                <Text style={styles.headerSubtitle}>
                  🟢 Online • mono Gaming Intelligent Advisor
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* QUICK PROMPT CHIPS */}
          <View style={styles.quickPromptContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
              {QUICK_PROMPTS.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickChip}
                  onPress={() => handleSendMessage(p)}
                >
                  <Text style={styles.quickChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* CHAT MESSAGES SCROLL VIEW */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isAi = msg.role === "assistant";
              return (
                <View
                  key={msg.id}
                  style={[styles.msgRow, isAi ? styles.msgRowAi : styles.msgRowUser]}
                >
                  {isAi && (
                    <View style={styles.msgAvatarAi}>
                      <Text style={{ fontSize: 14 }}>🤖</Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.msgBubble,
                      isAi ? styles.msgBubbleAi : styles.msgBubbleUser,
                    ]}
                  >
                    {isAi && (
                      <Text style={styles.aiSenderLabel}>NEXORA AI</Text>
                    )}
                    <Text style={[styles.msgText, isAi ? styles.msgTextAi : styles.msgTextUser]}>
                      {msg.text}
                    </Text>

                    {/* EMBEDDED GAMING SETUP IN CHAT */}
                    {msg.setup && (
                      <View style={styles.setupCard}>
                        <View style={styles.setupHeader}>
                          <Text style={styles.setupTitle}>🎮 {msg.setup.game} Setup</Text>
                          <Text style={styles.setupBudgetTag}>
                            งบ: ฿{msg.setup.budget.toLocaleString()}
                          </Text>
                        </View>

                        {msg.setup.items.map((item, idx) => (
                          <View key={idx} style={styles.setupItemRow}>
                            <Text style={styles.setupItemIcon}>{item.icon}</Text>
                            <View style={{ flex: 1, marginHorizontal: 8 }}>
                              <Text style={styles.setupItemName} numberOfLines={1}>
                                {item.product.name}
                              </Text>
                              <Text style={styles.setupItemCat}>{item.category}</Text>
                            </View>
                            <Text style={styles.setupItemPrice}>
                              ฿{item.product.price.toLocaleString()}
                            </Text>
                          </View>
                        ))}

                        <View style={styles.setupDivider} />
                        <View style={styles.setupTotalRow}>
                          <Text style={styles.setupTotalLabel}>รวมทั้งเซ็ต:</Text>
                          <Text style={styles.setupTotalValue}>
                            ฿{msg.setup.totalPrice.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.setupRemainingRow}>
                          <Text style={styles.setupRemainingLabel}>💰 เหลืองบ:</Text>
                          <Text style={styles.setupRemainingValue}>
                            ฿{msg.setup.remainingBudget.toLocaleString()}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.setupAddCartBtn}
                          onPress={() => handleAddSetupToCart(msg.setup!)}
                          activeOpacity={0.85}
                        >
                          <Ionicons name="cart" size={16} color="#FFF" style={{ marginRight: 6 }} />
                          <Text style={styles.setupAddCartBtnText}>
                            เพิ่มเซ็ตนี้ลงตะกร้า (Add All)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* RECOMMENDED PRODUCT CARDS IN CHAT */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && !msg.setup && (
                      <View style={styles.recommendContainer}>
                        <Text style={styles.recommendTitle}>สินค้าที่เกี่ยวข้อง:</Text>
                        {msg.recommendedProducts.map((p) => (
                          <View key={p.id} style={styles.recommendRow}>
                            <Image
                              source={{ uri: p.image_url }}
                              style={styles.recommendThumb}
                            />
                            <View style={{ flex: 1, marginHorizontal: 8 }}>
                              <Text style={styles.recommendName} numberOfLines={1}>
                                {p.name}
                              </Text>
                              <Text style={styles.recommendPrice}>
                                ฿{p.price.toLocaleString()}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={[
                                styles.recommendAddBtn,
                                p.stock <= 0 && { backgroundColor: COLORS.surfaceLight },
                              ]}
                              disabled={p.stock <= 0}
                              onPress={() => {
                                onAddToCart(p, 1);
                                Alert.alert("ใส่ตะกร้าแล้ว", `เพิ่ม ${p.name} ลงตะกร้าแล้ว`);
                              }}
                            >
                              <Ionicons name="cart" size={14} color="#FFF" />
                              <Text style={styles.recommendAddText}>
                                {p.stock <= 0 ? "หมด" : "+ ตะกร้า"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    <Text style={styles.msgTime}>{msg.timestamp}</Text>
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.msgRow, styles.msgRowAi]}>
                <View style={styles.msgAvatarAi}>
                  <Text style={{ fontSize: 14 }}>🤖</Text>
                </View>
                <View style={[styles.msgBubble, styles.msgBubbleAi]}>
                  <Text style={styles.typingText}>NEXORA AI กำลังประมวลผล...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* BOTTOM INPUT BAR */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="พิมพ์คำถาม หรือ บอกงบ เช่น งบ 20,000 เล่น Valorant..."
              placeholderTextColor={COLORS.textSecondary}
              value={inputVal}
              onChangeText={setInputVal}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputVal.trim() && styles.sendBtnDisabled]}
              onPress={() => handleSendMessage()}
              disabled={!inputVal.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  chatContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    borderWidth: 1,
    borderColor: "#4C1D95",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: COLORS.cyan,
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickPromptContainer: {
    paddingVertical: 8,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  quickChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  quickChipText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 24,
  },
  msgRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  msgRowAi: {
    justifyContent: "flex-start",
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgAvatarAi: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  msgBubble: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: 12,
  },
  msgBubbleAi: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#4C1D95",
    borderTopLeftRadius: 4,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiSenderLabel: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
  },
  msgTextAi: {
    color: "#F1F5F9",
  },
  msgTextUser: {
    color: "#FFF",
  },
  msgTime: {
    color: COLORS.textSecondary,
    fontSize: 9,
    alignSelf: "flex-end",
    marginTop: 6,
  },
  typingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: "italic",
  },
  // EMBEDDED SETUP STYLES
  setupCard: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#6D28D9",
  },
  setupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  setupTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "bold",
  },
  setupBudgetTag: {
    color: COLORS.cyan,
    fontSize: 11,
    fontWeight: "600",
  },
  setupItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  setupItemIcon: {
    fontSize: 14,
  },
  setupItemName: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  setupItemCat: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  setupItemPrice: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "bold",
  },
  setupDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  setupTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setupTotalLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  setupTotalValue: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  setupRemainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  setupRemainingLabel: {
    color: COLORS.badgeInStock,
    fontSize: 11,
    fontWeight: "bold",
  },
  setupRemainingValue: {
    color: COLORS.badgeInStock,
    fontSize: 13,
    fontWeight: "bold",
  },
  setupAddCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  setupAddCartBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  // RECOMMENDED PRODUCTS IN CHAT
  recommendContainer: {
    marginTop: 10,
    backgroundColor: "#0F172A",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendTitle: {
    color: COLORS.cyan,
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  recommendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  recommendThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  recommendName: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  recommendPrice: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "bold",
  },
  recommendAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  recommendAddText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  // BOTTOM INPUT BAR
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    color: "#FFF",
    fontSize: 13,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.5,
  },
});
