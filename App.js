import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { createClient } from "@supabase/supabase-js";
import {
Linking,
SafeAreaView,
View,
Text,
Image,
TextInput,
ScrollView,
TouchableOpacity,
StyleSheet,
Alert,
ActivityIndicator,
BackHandler,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import CountryPicker from "react-native-country-picker-modal";
// Keep your existing Supabase values here
const SUPABASE_URL = "https://fewuccdcoujgbeafxazu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4dR2ryPZxL8cjNula-kePQ_lYrwSi49";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
const PRODUCTS = [
  {
    id: "demo-1",
    name: "Smartphone",
    price: 19999,
    category: "Mobiles",
    icon: "📱",
  },
  {
    id: "demo-2",
    name: "Wireless Headphones",
    price: 1999,
    category: "Audio",
    icon: "🎧",
  },
  {
    id: "demo-3",
    name: "Smart Watch",
    price: 2499,
    category: "Electronics",
    icon: "⌚",
  },
  {
    id: "demo-4",
    name: "Men's Fashion",
    price: 1499,
    category: "Fashion",
    icon: "👕",
  },
  {
    id: "demo-5",
    name: "Home Decor",
    price: 999,
    category: "Home",
    icon: "🏠",
  },
];

const CATEGORIES = [
  { name: "All", icon: "🛍️" },
  { name: "Mobiles", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
  { name: "Electronics", icon: "💻" },
  { name: "Audio", icon: "🎧" },
];

export default function App() {
  const [screen, setScreen] = useState("home");

  useEffect(() => {
    const onBackPress = () => {
      if (screen === "home") {
        return false;
      }

      setScreen("home");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [screen]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
const [editProfile, setEditProfile] = useState(false);
const [profileSaving, setProfileSaving] = useState(false);
  const [editFullName, setEditFullName] = useState("");
const [editPhone, setEditPhone] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cart, setCart] = useState([]);
const [cartLoaded, setCartLoaded] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
useEffect(() => {
  let mounted = true;

  const loadSavedCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("shopkart_cart");

      if (mounted && savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.log("Failed to load cart:", error);
    } finally {
      if (mounted) {
        setCartLoaded(true);
      }
    }
  };

  loadSavedCart();

  return () => {
    mounted = false;
  };
}, []);

useEffect(() => {
  if (!cartLoaded) {
    return;
  }

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(
        "shopkart_cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.log("Failed to save cart:", error);
    }
  };

  saveCart();
}, [cart, cartLoaded]);
  const [sellerApplications, setSellerApplications] = useState([]);
 const [sellerTab, setSellerTab] = useState("pending");
const [sellerStatusHistory, setSellerStatusHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [shopName, setShopName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerCountryCode, setSellerCountryCode] = useState("IN");
const [sellerCallingCode, setSellerCallingCode] = useState("91");
const [showSellerCountryPicker, setShowSellerCountryPicker] = useState(false);

const [loginCountryCode, setLoginCountryCode] = useState("IN");
const [loginCallingCode, setLoginCallingCode] = useState("91");
const [showLoginCountryPicker, setShowLoginCountryPicker] = useState(false);
const [loginPhone, setLoginPhone] = useState("");
  const [sellerPan, setSellerPan] = useState("");
const [sellerGstin, setSellerGstin] = useState("");
  const [sellerBankName, setSellerBankName] = useState("");
const [sellerAccountNumber, setSellerAccountNumber] = useState("");
const [sellerIfsc, setSellerIfsc] = useState("");
 const [sellerTermsAccepted, setSellerTermsAccepted] = useState(false);
  const [sellerAddress, setSellerAddress] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
const [emailOtp, setEmailOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);
const [seller, setSeller] = useState(null);
const [sellerProducts, setSellerProducts] = useState([]);
const [sellerLoading, setSellerLoading] = useState(false);
const [productName, setProductName] = useState("");
const [productPrice, setProductPrice] = useState("");
const [productCategory, setProductCategory] = useState("");
const [categories, setCategories] = useState([]);
const [productStock, setProductStock] = useState("");
const [productDescription, setProductDescription] = useState("");
 const [productImage, setProductImage] = useState(null);
  useEffect(() => {
async function loadCategories() {
const { data, error } = await supabase
.from("categories")
.select("id, name")
.order("name");

  if (error) {
    Alert.alert("Category Error", error.message);
    return;
  }

  setCategories(data || []);
}

loadCategories();

}, []);
  useEffect(() => {
    loadSession();
    loadProducts();
    loadCommission();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;

      setUser(currentUser);

      if (!currentUser) {
  setProfile(null);
  setWishlist([]);
  return;
}

      if (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION" ||
        event === "TOKEN_REFRESHED"
      ) {
        setTimeout(() => {
          loadProfile(currentUser.id);
       loadWishlist(currentUser.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadSession() {
    const { data } = await supabase.auth.getSession();

    if (data?.session?.user) {
      setUser(data.session.user);
      await loadProfile(data.session.user.id);
    }
  }

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  }
async function loadWishlist(userId) {
const { data, error } = await supabase
.from("wishlists")
.select("product_id, products(*)")
.eq("user_id", userId);

if (error) {
  Alert.alert("Wishlist", error.message);
  return;
}

const savedProducts = (data || [])
  .map((item) => item.products)
  .filter(Boolean);

setWishlist(savedProducts);

}
  async function saveProfile() {
  if (!user) {
    Alert.alert("Profile", "Please login first.");
    return;
  }

  if (!editFullName.trim()) {
    Alert.alert("Profile", "Please enter your full name.");
    return;
  }

  setProfileSaving(true);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: editFullName.trim(),
          phone: editPhone.trim() || null,
          email: user.email || null,
          role: profile?.role || "customer",
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      Alert.alert("Save Failed", error.message);
      return;
    }

    setProfile(data);
    setEditProfile(false);

    Alert.alert("Success", "Profile saved successfully.");
  } catch (error) {
    Alert.alert("Error", "Profile save nahi ho paya.");
  } finally {
    setProfileSaving(false);
  }
}
  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (!error && data && data.length > 0) {
      setProducts(data);
    } else {
      setProducts(PRODUCTS);
    }

    setLoadingProducts(false);
  }
async function loadSellerStatusHistory() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("seller_status_history")
    .select(`
      id,
      seller_id,
      old_status,
      new_status,
      changed_at,
      changed_by,
      sellers (
        id,
        shop_name,
        phone,
        address,
        created_at
      )
    `)
    .gte("changed_at", sevenDaysAgo.toISOString())
    .order("changed_at", { ascending: false });

  if (error) {
    Alert.alert("Status History", error.message);
    return;
  }

  setSellerStatusHistory(data || []);
}
  async function loadSellerApplications() {
  const { data, error } = await supabase
    .from("sellers")
    .select(
      "id, user_id, shop_name, phone, address, status, created_at, status_updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    Alert.alert("Seller Applications", error.message);
    return;
  }

  setSellerApplications(data || []);
}
  async function updateSellerStatus(sellerId, newStatus) {
  const { error } = await supabase
    .from("sellers")
    .update({ status: newStatus })
    .eq("id", sellerId);

  if (error) {
    Alert.alert("Error", error.message);
    return;
  }

  Alert.alert(
    "Success",
    newStatus === "approved"
      ? "Seller application approved!"
      : "Seller application rejected!"
  );

  await loadSellerApplications();
  await loadSellerStatusHistory();
}
  async function loadCommission() {
    const { data } = await supabase
      .from("marketplace_settings")
      .select("commission_rate")
      .limit(1)
      .maybeSingle();

    if (data?.commission_rate != null) {
      setCommissionRate(Number(data.commission_rate));
    }
  }

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      const productCategory =
        p.category || p.category_name || "";

      const matchesCategory =
        category === "All" ||
        String(productCategory).toLowerCase() ===
          category.toLowerCase();

      const matchesSearch =
        !q ||
        String(p.name || "")
          .toLowerCase()
          .includes(q) ||
        String(productCategory)
          .toLowerCase()
          .includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.qty,
      0
    );
  }, [cart]);

  function addToCart(product) {
    setCart((old) => {
      const exists = old.find((x) => x.id === product.id);

      if (exists) {
        return old.map((x) =>
          x.id === product.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [...old, { ...product, qty: 1 }];
    });

    Alert.alert("Cart", "Product added to cart successfully.");
  }
  async function toggleWishlist(product) {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Wishlist use karne ke liye pehle login karo."
      );
      setScreen("auth");
      return;
    }
console.log("Wishlist user:", user);
console.log("Wishlist user ID:", user?.id);
    if (
      !product.id ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        String(product.id)
      )
    ) {
      Alert.alert(
        "Wishlist",
        "Is product ko save karne ke liye pehle ise Supabase Products table mein add karna hoga."
      );
      return;
    }

    const { data: existing, error: findError } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (findError) {
      Alert.alert("Wishlist Error", findError.message);
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", existing.id);

      if (error) {
        Alert.alert("Wishlist Error", error.message);
        return;
      }
setWishlist((old) =>
old.filter((item) => item.id !== product.id)
);

Alert.alert(
"Wishlist",
"Product removed from wishlist successfully."
);
} else {
const { error } = await supabase
.from("wishlists")
.insert({
user_id: user.id,
product_id: product.id,
});
      if (error) {
        Alert.alert("Wishlist Error", error.message);
        return;
      }

      setWishlist((old) => [...old, product]);
      

      Alert.alert(
        "Wishlist",
        "Product added to wishlist successfully."
      );
    }
  }
  function removeFromCart(id) {
    setCart((old) =>
      old
        .map((x) =>
          x.id === id ? { ...x, qty: x.qty - 1 } : x
        )
        .filter((x) => x.qty > 0)
    );
  }
async function sendEmailOtp() {
  if (!email || !email.includes("@")) {
    Alert.alert("Email Required", "Valid Gmail enter karo.");
    return;
  }

  setAuthLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      Alert.alert("OTP Failed", error.message);
      return;
    }

    setOtpSent(true);

    Alert.alert(
      "OTP Sent",
      "Apne email ka Inbox aur Spam folder check karo."
    );
  } catch (error) {
    Alert.alert(
      "Error",
      error?.message || "OTP bhejne mein problem aayi."
    );
  } finally {
    setAuthLoading(false);
  }
}
async function verifyEmailOtp() {
  if (!emailOtp || !/^\d{6}$/.test(emailOtp.trim())) {
    Alert.alert(
      "Invalid OTP",
      "Email par aaya 6-digit OTP enter karo."
    );
    return;
  }

  setAuthLoading(true);

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: emailOtp.trim(),
      type: "email",
    });

    if (error) {
      Alert.alert("OTP Verification Failed", error.message);
      return;
    }

    if (data?.user) {
      setUser(data.user);
      await loadProfile(data.user.id);
      setEmailOtp("");
      setOtpSent(false);
      setScreen("home");

      Alert.alert("Success", "Email OTP se login successful.");
    }
  } catch (error) {
    Alert.alert(
      "Error",
      error?.message || "OTP verify karne mein problem aayi."
    );
  } finally {
    setAuthLoading(false);
  }
}
  async function login() {
  if (!email || !password) {
    Alert.alert("Login", "Email aur password enter karo.");
    return;
  }

  setAuthLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  setAuthLoading(false);

  if (error) {
    Alert.alert("Login failed", error.message);
    return;
  }

  if (data?.user) {
    setUser(data.user);
    await loadProfile(data.user.id);
    setScreen("home");

    Alert.alert("Success", "Login successful.");
  }
}

  async function signup() {
    if (!email || !password) {
      Alert.alert("Signup", "Email aur password enter karo.");
      return;
    }

    setAuthLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthLoading(false);
      Alert.alert("Signup failed", error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName || null,
        role: "customer",
      });

      setUser(data.user);
      await loadProfile(data.user.id);
    }

    setAuthLoading(false);

    Alert.alert(
      "Signup",
      "Account create ho gaya. Agar email confirmation enabled hai to email confirm karo."
    );

    setScreen("home");
  }

  async function logout() {
const { error } = await supabase.auth.signOut();

if (error) {
Alert.alert("Logout Failed", error.message);
return;
}

setUser(null);
setProfile(null);
setAuthMode("login");
setScreen("home");

Alert.alert("Logout", "Aap successfully logout ho gaye hain.");
  }

  async function registerSeller() {
    if (!user) {
      setScreen("auth");
      return;
    }

    if (!shopName || !sellerPhone) {
      Alert.alert(
        "Seller",
        "Shop name aur phone number enter karo."
      );
      return;
    }
if (!sellerTermsAccepted) {
  Alert.alert(
    "Terms Required",
    "Seller Terms & Conditions accept karo."
  );
  return;
}
    const { error } = await supabase.from("sellers").insert({
  user_id: user.id,
  shop_name: shopName,
  phone: sellerPhone,
  address: sellerAddress || null,
  email: user.email || null,
  pan: sellerPan || null,
  gstin: sellerGstin || null,
  bank_name: sellerBankName || null,
  account_number: sellerAccountNumber || null,
  ifsc: sellerIfsc || null,
  status: "pending",
  commission_rate: 10,
});

    if (error) {
      Alert.alert("Seller registration", error.message);
      return;
    }

    Alert.alert(
      "Application submitted",
      "Seller application admin approval ke liye bhej di gayi hai."
    );

    setShopName("");
setSellerPhone("");
setSellerAddress("");
setSellerPan("");
setSellerGstin("");
setSellerBankName("");
setSellerAccountNumber("");
setSellerIfsc("");
setSellerTermsAccepted(false);
setScreen("account");
  }

  async function checkout() {
  if (!user) {
    Alert.alert(
      "Login Required",
      "Please login before placing an order."
    );
    setScreen("auth");
    return;
  }

  if (cart.length === 0) {
    Alert.alert(
      "Empty Cart",
      "Please add products to your cart first."
    );
    return;
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const invalidProduct = cart.find(
    (item) => !uuidPattern.test(String(item.id))
  );

  if (invalidProduct) {
    Alert.alert(
      "Invalid Product",
      "Please add a valid product from the Supabase Products table."
    );
    return;
  }

  const total = Number(cartTotal);
  const commission = (total * commissionRate) / 100;
  const sellerAmount = total - commission;

  try {
    const { data: orderData, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          order_status: "pending",
          payment_status: "pending",
        })
        .select(
          "id, created_at, total_amount, order_status, payment_status"
        )
        .single();

    if (orderError) {
      Alert.alert("Order Failed", orderError.message);
      return;
    }
const orderItems = cart.map((item) => ({
  order_id: orderData.id,
  product_id: item.id,
  product_name: item.name,
  quantity: item.qty,
  price: Number(item.price),
  subtotal: Number(item.price) * Number(item.qty),
}));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", orderData.id);

      Alert.alert("Order Items Failed", itemsError.message);
      return;
    }

    const newOrder = {
      id: orderData.id,
      items: [...cart],
      total: Number(orderData.total_amount),
      commission,
      sellerAmount,
      status: orderData.order_status,
      paymentStatus: orderData.payment_status,
      createdAt: orderData.created_at,
    };

    setOrders((old) => [newOrder, ...old]);
    setCart([]);
    setScreen("orders");

    Alert.alert(
      "Order Created Successfully",
      `Order ID: ${orderData.id}\n` +
        `Total: ₹${total.toFixed(2)}\n` +
        `Marketplace Commission: ₹${commission.toFixed(2)}\n` +
        `Seller Amount Before Other Charges: ₹${sellerAmount.toFixed(2)}\n` +
        "Payment Status: Pending"
    );
  } catch (error) {
    Alert.alert(
      "Checkout Error",
      error?.message || "Unable to create the order."
    );
  }
}

  function Header() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>ShopKart</Text>
          <Text style={styles.subtitle}>
            Multi-Vendor Marketplace
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setScreen("cart")}
        >
          <Text style={styles.cartText}>
            🛒 {cart.length}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Home() {
    return (
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Header()}

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products..."
          placeholderTextColor="#777"
          style={styles.search}
        />

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            Big Deals. Big Savings.
          </Text>
          <Text style={styles.bannerText}>
            ShopKart par best products discover karo.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sellerBanner}
          onPress={() => setScreen("seller")}
        >
          <View style={styles.sellerBannerContent}>
            <Text style={styles.sellerBannerIcon}>🏪</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.sellerBannerTitle}>
                Sell on ShopKart
              </Text>

              <Text style={styles.sellerBannerText}>
                Apna business ShopKart par grow karein
              </Text>
            </View>

            <Text style={styles.sellerBannerArrow}>›</Text>
          </View>

          <View style={styles.sellerBannerButton}>
            <Text style={styles.sellerBannerButtonText}>
              Become a Seller
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          >
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[
                styles.category,
                category === c.name && styles.categoryActive,
              ]}
              onPress={() => setCategory(c.name)}
            >
              <Text style={styles.categoryIcon}>
                {c.icon}
              </Text>
              <Text
                style={[
                  styles.categoryText,
                  category === c.name &&
                    styles.categoryTextActive,
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>
            {category === "All"
              ? "Top Deals"
              : category}
          </Text>

          {loadingProducts && (
            <ActivityIndicator size="small" />
          )}
        </View>

        {visibleProducts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Product nahi mila
            </Text>
            <Text style={styles.emptyText}>
              Search ya category change karke dekho.
            </Text>
          </View>
        ) : (
          visibleProducts.map((p) => (
            <View style={styles.product} key={p.id}>
              <Text style={styles.productIcon}>
                {p.icon || "🛍️"}
              </Text>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {p.name || "Product"}
                </Text>

                <Text style={styles.productCategory}>
                  {p.category ||
                    p.category_name ||
                    "General"}
                </Text>

                <Text style={styles.price}>
                  ₹{Number(p.price || 0).toLocaleString("en-IN")}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(p)}
                >
                  <Text style={styles.addButtonText}>
                    Add to Cart
                  </Text>
                </TouchableOpacity>
             <TouchableOpacity
  onPress={() => toggleWishlist(p)}
  style={{
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  }}
>
  <Text style={{ fontSize: 14, fontWeight: "700" }}>
    {wishlist.some((item) => item.id === p.id)
      ? "❤️ Saved to Wishlist"
      : "♡ Add to Wishlist"}
  </Text>
</TouchableOpacity>
                    </View>
            </View>
          ))
        )}
      </ScrollView>
    );
  }

  function Cart() {
return (
<ScrollView
style={{ flex: 1, backgroundColor: "#F4F6FA" }}
contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
>
<Text
style={{
fontSize: 26,
fontWeight: "800",
color: "#172337",
marginBottom: 6,
}}
>
My Cart
</Text>

    <Text
      style={{
        fontSize: 14,
        color: "#718096",
        marginBottom: 20,
      }}
    >
      Review your items before checkout
    </Text>

    {cart.length === 0 ? (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 28,
          alignItems: "center",
          marginTop: 10,
          borderWidth: 1,
          borderColor: "#E8EDF4",
        }}
      >
        <View
          style={{
            width: 94,
            height: 94,
            borderRadius: 47,
            backgroundColor: "#EEF4FF",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 46 }}>🛒</Text>
        </View>

        <Text
          style={{
            fontSize: 21,
            fontWeight: "800",
            color: "#172337",
            marginBottom: 8,
          }}
        >
          Cart is empty
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#718096",
            textAlign: "center",
            lineHeight: 21,
            marginBottom: 24,
          }}
        >
          Looks like you haven't added anything to your cart yet.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#2457D6",
            paddingVertical: 14,
            paddingHorizontal: 34,
            borderRadius: 12,
            minWidth: 170,
            alignItems: "center",
          }}
          onPress={() => setScreen("home")}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Shop Now
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E8EDF4",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: "#172337",
              marginBottom: 14,
            }}
          >
            Cart Items ({cart.length})
          </Text>

          {cart.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#EDF0F5",
              }}
            >
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 14,
                  backgroundColor: "#F1F5FA",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 13,
                }}
              >
                <Text style={{ fontSize: 32 }}>
                  {item.icon || "🛍️"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#172337",
                    marginBottom: 5,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#2457D6",
                    marginBottom: 10,
                  }}
                >
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      borderWidth: 1,
                      borderColor: "#DCE3ED",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={{ fontSize: 19, color: "#172337" }}>
                      −
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#172337",
                      marginHorizontal: 16,
                    }}
                  >
                    {item.qty}
                  </Text>

                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      borderWidth: 1,
                      borderColor: "#DCE3ED",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={{ fontSize: 19, color: "#172337" }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: "#E8EDF4",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#172337",
              marginBottom: 18,
            }}
          >
            Price Details
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: "#718096" }}>
              Items ({cart.length})
            </Text>

            <Text style={{ fontSize: 15, color: "#172337", fontWeight: "600" }}>
              ₹{cartTotal.toLocaleString("en-IN")}
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#EDF0F5",
              paddingTop: 14,
              marginTop: 4,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#172337" }}>
              Total Amount
            </Text>

            <Text style={{ fontSize: 19, fontWeight: "800", color: "#2457D6" }}>
              ₹{cartTotal.toLocaleString("en-IN")}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#2457D6",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={checkout}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Proceed to Checkout →
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </ScrollView>
);

}
function Orders() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F4F6FA" }}
      contentContainerStyle={{ padding: 18 }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "800",
          color: "#172337",
          marginBottom: 20,
        }}
      >
        My Orders
      </Text>

      {/* Existing Orders Icon */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert("My Orders", "Your orders will appear here.");
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: 16,
          borderRadius: 14,
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 31 }}>📦</Text>

        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#172337",
            }}
          >
            My Orders
          </Text>

          <Text style={{ fontSize: 12, color: "#718096", marginTop: 5 }}>
            View your orders
          </Text>
        </View>
      </TouchableOpacity>

      {/* New Wishlist Option */}
      <TouchableOpacity
        onPress={() => setScreen("wishlist")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: 16,
          borderRadius: 14,
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 31 }}>🛍️</Text>

        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#172337",
            }}
          >
            My Wishlist
          </Text>

          <Text style={{ fontSize: 12, color: "#718096", marginTop: 5 }}>
            View your favourite products
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
function WishlistScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F4F6FA" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 22 }}>
        <Text
          style={{
            fontSize: 27,
            fontWeight: "800",
            color: "#172337",
          }}
        >
          My Wishlist
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#718096",
            marginTop: 5,
          }}
        >
          Your favorite products, all in one place.
        </Text>
      </View>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 28,
            borderRadius: 18,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#E8EDF5",
          }}
        >
          <Text style={{ fontSize: 48 }}>♡</Text>

          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: "#172337",
              marginTop: 12,
            }}
          >
            Your Wishlist is Empty
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#718096",
              marginTop: 7,
              textAlign: "center",
              lineHeight: 21,
            }}
          >
            Save your favorite products here and find them whenever you need.
          </Text>

          <TouchableOpacity
            onPress={() => setScreen("home")}
            style={{
              backgroundColor: "#2874F0",
              paddingVertical: 13,
              paddingHorizontal: 24,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: 14,
              }}
            >
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        wishlist.map((product) => (
          <View
            key={product.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              padding: 14,
              borderRadius: 16,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "#E8EDF5",
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
            }}
          >
            {/* Product Icon */}
            <View
              style={{
                width: 76,
                height: 82,
                backgroundColor: "#F4F6FA",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 36 }}>
                {product.icon || "🛍️"}
              </Text>
            </View>

            {/* Product Details */}
            <View style={{ flex: 1, marginLeft: 13 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#172337",
                  lineHeight: 21,
                }}
              >
                {product.name || "Product"}
              </Text>

              <Text
                style={{
                  color: "#172337",
                  fontSize: 17,
                  fontWeight: "800",
                  marginTop: 6,
                }}
              >
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </Text>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <TouchableOpacity
                  onPress={() => addToCart(product)}
                  style={{
                    backgroundColor: "#2874F0",
                    paddingVertical: 10,
                    paddingHorizontal: 13,
                    borderRadius: 8,
                    marginRight: 10,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "800",
                    }}
                  >
                    + Add to Cart
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleWishlist(product)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#D32F2F",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
async function loadSellerData() {
if (!user) return;

setSellerLoading(true);

try {
const { data, error } = await supabase
.from("sellers")
.select("*")
.eq("user_id", user.id)
.maybeSingle();

if (error) {
  Alert.alert("Seller Error", error.message);
  return;
}

setSeller(data || null);

if (data?.id) {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", data.id)
    .order("created_at", { ascending: false });

  if (productError) {
    Alert.alert("Products Error", productError.message);
    return;
  }

  setSellerProducts(productData || []);
} else {
  setSellerProducts([]);
}

} catch (error) {
Alert.alert("Seller Error", String(error));
} finally {
setSellerLoading(false);
}
}
  useEffect(() => {
  if (screen === "seller" && user) {
    loadSellerData();
  }
}, [screen, user]);
function Auth() {
  

  async function handleGoogleLogin() {
setAuthLoading(true);

try {
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: "shopkart",
      path: "auth/callback",
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      Alert.alert("Google Login Failed", error.message);
      return;
    }

    if (!data?.url) {
      Alert.alert("Google Login", "Google login URL nahi mila.");
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo
    );

    if (result.type !== "success" || !result.url) {
      Alert.alert(
        "Google Login",
        "Login complete nahi hua. Dobara try karein."
      );
      return;
    }

    const callbackUrl = new URL(result.url);
    const code = callbackUrl.searchParams.get("code");

    if (code) {
      const { error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        Alert.alert("Google Login Failed", sessionError.message);
        return;
      }
    } else {
      const params = new URLSearchParams(
        callbackUrl.hash.substring(1)
      );

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      const errorMessage =
        params.get("error_description") ||
        callbackUrl.searchParams.get("error_description");

      if (errorMessage) {
        Alert.alert("Google Login Failed", errorMessage);
        return;
      }

      if (!accessToken || !refreshToken) {
        Alert.alert(
          "Google Login",
          "Login session nahi mili. Redirect settings check karein."
        );
        return;
      }

      const { error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      if (sessionError) {
        Alert.alert("Google Login Failed", sessionError.message);
        return;
      }
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      Alert.alert("Session Error", sessionError.message);
      return;
    }

    const currentUser = sessionData?.session?.user;

    if (!currentUser) {
      Alert.alert(
        "Google Login",
        "Login session verify nahi ho saki. Dobara try karein."
      );
      return;
    }

    setUser(currentUser);

    await loadProfile(currentUser.id);

    setScreen("account");
    } catch (error) {
    Alert.alert(
      "Google Login Failed",
      error?.message || "Google login mein error aaya."
    );
  } finally {
    setAuthLoading(false);
  }
}

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.authContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>
        {authMode === "login"
          ? "🔐 Login"
          : "📝 Create Account"}
      </Text>

      {authMode === "signup" && (
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          placeholderTextColor="#777"
          style={styles.input}
          autoCorrect={false}
        />
      )}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#777"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        style={styles.input}
        returnKeyType="next"
      />
{authMode === "login" && (
  <TouchableOpacity
    style={styles.googleButton}
    onPress={sendEmailOtp}
    disabled={authLoading}
  >
    <Text style={styles.googleButtonText}>
      {authLoading ? "Please wait..." : "Send Email OTP"}
    </Text>
  </TouchableOpacity>
)}

{authMode === "login" && otpSent && (
  <>
    <TextInput
      value={emailOtp}
      onChangeText={setEmailOtp}
      placeholder="Enter 6-digit Email OTP"
      placeholderTextColor="#777"
      keyboardType="number-pad"
      maxLength={6}
      style={styles.input}
    />

    <TouchableOpacity
      style={styles.primary}
      onPress={verifyEmailOtp}
      disabled={authLoading}
    >
      <Text style={styles.primaryText}>
        {authLoading ? "Please wait..." : "Verify OTP & Login"}
      </Text>
    </TouchableOpacity>
  </>
)}
      <View style={styles.passwordRow}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword((old) => !old)}
        >
          <Text>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={authMode === "login" ? login : signup}
        disabled={authLoading}
      >
        <Text style={styles.primaryText}>
          {authLoading
            ? "Please wait..."
            : authMode === "login"
            ? "Login"
            : "Create Account"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.googleButtonText}>
          🔵 Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setAuthMode(
            authMode === "login" ? "signup" : "login"
          )
        }
      >
        <Text style={styles.link}>
          {authMode === "login"
            ? "New user? Create Account"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

  function Seller() {
  
  async function chooseProductImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Product photo choose karne ke liye Gallery permission zaroori hai."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProductImage(result.assets[0]);
        Alert.alert("Success", "Product photo select ho gayi.");
      }
    } catch (error) {
      Alert.alert("Photo Error", error.message);
    }
  }

async function addProduct() {
  if (!seller || seller.status !== "approved") {
    Alert.alert(
      "Seller Approval",
      "Product add karne ke liye seller account approve hona zaroori hai."
    );
    return;
  }

  if (!productImage) {
    Alert.alert(
      "Product Photo Required",
      "Please select a product photo before adding the product."
    );
    return;
  }

  if (
    !productName.trim() ||
    !productPrice ||
    !productStock ||
    !productCategory
  ) {
    Alert.alert(
      "Missing Information",
      "Product name, price, stock, and category are required."
    );
    return;
  }

  const price = Number(productPrice);
  const stock = Number(productStock);

  if (
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    Alert.alert(
      "Invalid Information",
      "Please enter a valid price and stock quantity."
    );
    return;
  }

  let uploadedPath = null;

  try {
    // 1. Selected image ko Blob mein convert karein
    const response = await fetch(productImage.uri);

    if (!response.ok) {
      throw new Error("Selected photo could not be read.");
    }

    const blob = await response.blob();

    // 2. Unique file name aur seller folder banayein
    const extensionMatch = productImage.uri.match(
      /\.(jpg|jpeg|png|webp)(?:\?|$)/i
    );

    const extension = extensionMatch
      ? extensionMatch[1].toLowerCase()
      : "jpg";

    const filePath =
      `${seller.id}/${Date.now()}.${extension}`;

    // 3. Supabase Storage mein photo upload karein
    const { data: uploadData, error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(filePath, blob, {
          contentType:
            productImage.mimeType || "image/jpeg",
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    uploadedPath = uploadData.path;

    // 4. Uploaded photo ka URL nikalein
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    const imageUrl = urlData?.publicUrl;

    if (!imageUrl) {
      throw new Error("Product photo URL could not be created.");
    }

    // 5. Product aur photo URL database mein save karein
    const { data, error } = await supabase
      .from("products")
      .insert({
        seller_id: seller.id,
        name: productName.trim(),
        price,
        category_id: productCategory,
        stock,
        description: productDescription.trim() || null,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 6. Product list update karein
    setSellerProducts((old) => [data, ...old]);

    // 7. Form reset karein
    setProductImage(null);
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductStock("");
    setProductDescription("");

    Alert.alert(
      "Success",
      "Product aur photo successfully save ho gaye."
    );
  } catch (error) {
    // Product save fail ho to uploaded photo clean up karein
    if (uploadedPath) {
      const { error: cleanupError } =
        await supabase.storage
          .from("product-images")
          .remove([uploadedPath]);

      if (cleanupError) {
        console.log(
          "Photo cleanup failed:",
          cleanupError.message
        );
      }
    }

    Alert.alert(
      "Product Error",
      error.message || "Product save nahi ho saka."
    );
  }
}
    if (!user) {
return (
<View style={styles.page}>
<Text style={styles.pageTitle}>🏪 Become a Seller</Text>
<Text style={styles.accountText}>
Seller registration ke liye pehle login karein.
</Text>
<TouchableOpacity
style={styles.primary}
onPress={() => setScreen("auth")}
>
<Text style={styles.primaryText}>Login</Text>
</TouchableOpacity>
</View>
);
}

if (sellerLoading) {
return (
<View style={styles.page}>
<ActivityIndicator size="large" />
<Text style={styles.accountText}>
Seller details load ho rahi hain...
</Text>
</View>
);
}
if (!seller) {
return (
<ScrollView
style={styles.page}
contentContainerStyle={styles.sellerFormContainer}
keyboardShouldPersistTaps="handled"
>
<Text style={styles.sellerFormTitle}>
Become a Seller
</Text>

  <Text style={styles.sellerLabel}>Shop Name *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter your shop name"
    placeholderTextColor="#888888"
    value={shopName}
    onChangeText={setShopName}
  />

  <Text style={styles.sellerLabel}>Mobile Number *</Text>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <TouchableOpacity
      style={[
        styles.sellerInput,
        {
          width: 112,
          justifyContent: "center",
          marginBottom: 0,
          paddingHorizontal: 8,
        },
      ]}
      onPress={() => setShowSellerCountryPicker(true)}
    >
      <Text style={{ color: "#111111", fontSize: 13 }}>
        {sellerCountryCode} +{sellerCallingCode} ▼
      </Text>
    </TouchableOpacity>

    <View style={{ flex: 1, marginLeft: 8 }}>
      <TextInput
        style={[styles.sellerInput, { marginBottom: 0 }]}
        placeholder="Mobile number"
        placeholderTextColor="#888888"
        value={sellerPhone}
        onChangeText={setSellerPhone}
        keyboardType="phone-pad"
      />
    </View>

    <CountryPicker
      countryCode={sellerCountryCode}
      withFilter
      withFlag
      withCallingCode
      withEmoji
      visible={showSellerCountryPicker}
      onClose={() => setShowSellerCountryPicker(false)}
      onSelect={(country) => {
        setSellerCountryCode(country.cca2);
        setSellerCallingCode(
          country.callingCode?.[0] || "91"
        );
        setShowSellerCountryPicker(false);
      }}
    />
  </View>

  <Text style={styles.sellerLabel}>Shop Address *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter complete shop address"
    placeholderTextColor="#888888"
    value={sellerAddress}
    onChangeText={setSellerAddress}
  />

  <Text style={styles.sellerLabel}>PAN Number *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter PAN number"
    placeholderTextColor="#888888"
    value={sellerPan}
    onChangeText={setSellerPan}
    autoCapitalize="characters"
  />

  <Text style={styles.sellerLabel}>GSTIN (Optional)</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter GSTIN, if available"
    placeholderTextColor="#888888"
    value={sellerGstin}
    onChangeText={setSellerGstin}
    autoCapitalize="characters"
  />

  <Text style={styles.sellerLabel}>Bank Name *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter bank name"
    placeholderTextColor="#888888"
    value={sellerBankName}
    onChangeText={setSellerBankName}
  />

  <Text style={styles.sellerLabel}>Bank Account Number *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter account number"
    placeholderTextColor="#888888"
    value={sellerAccountNumber}
    onChangeText={setSellerAccountNumber}
    keyboardType="numeric"
  />

  <Text style={styles.sellerLabel}>IFSC Code *</Text>
  <TextInput
    style={styles.sellerInput}
    placeholder="Enter IFSC code"
    placeholderTextColor="#888888"
    value={sellerIfsc}
    onChangeText={setSellerIfsc}
    autoCapitalize="characters"
  />

  <TouchableOpacity
    style={[
      styles.accountOption,
      {
        marginHorizontal: 0,
        padding: 12,
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#DDDDDD",
      },
    ]}
    onPress={() =>
      setSellerTermsAccepted((old) => !old)
    }
  >
    <Text
      style={{
        color: "#111111",
        fontSize: 13,
        fontWeight: "600",
      }}
    >
      {sellerTermsAccepted ? "☑" : "☐"} I accept ShopKart's
      Terms & Conditions.
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sellerPrimaryButton}
    onPress={registerSeller}
  >
    <Text style={styles.sellerPrimaryButtonText}>
      Submit Seller Application
    </Text>
  </TouchableOpacity>
</ScrollView>

);
}
if (seller.status !== "approved") {
return (
<View style={styles.page}>
<Text style={styles.pageTitle}>Seller Application</Text>
<View style={styles.accountCard}>
<Text style={styles.accountTitle}>
Status: {(seller.status || "pending").toUpperCase()}
</Text>
<Text style={styles.accountText}>
Product add karne se pehle Admin approval zaroori hai.
</Text>
</View>
</View>
);
}
return (
  <ScrollView
    style={styles.page}
    contentContainerStyle={styles.sellerFormContainer}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.sellerFormTitle}>
      🏪 Seller Dashboard
    </Text>

    {/* Shop Information */}
    <View style={styles.sellerFormCard}>
      <Text style={styles.sellerSectionTitle}>
        Shop Information
      </Text>

      <Text style={styles.accountTitle}>
        {seller.shop_name}
      </Text>

      <Text style={styles.accountText}>
        Marketplace Commission: {commissionRate}%
      </Text>
    </View>

    {/* Add New Product */}
    <View style={styles.sellerFormCard}>
      <Text style={styles.sellerSectionTitle}>
        Add New Product
      </Text>

      <Text style={styles.sellerLabel}>
        Product Name *
      </Text>

      <TextInput
        style={styles.sellerInput}
        placeholder="Enter product name"
        placeholderTextColor="#888888"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.sellerLabel}>
        Selling Price (₹) *
      </Text>

      <TextInput
        style={styles.sellerInput}
        placeholder="Enter selling price"
        placeholderTextColor="#888888"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="decimal-pad"
      />

      <Text style={styles.sellerLabel}>
        Stock Quantity *
      </Text>

      <TextInput
        style={styles.sellerInput}
        placeholder="Enter available quantity"
        placeholderTextColor="#888888"
        value={productStock}
        onChangeText={setProductStock}
        keyboardType="numeric"
      />

      <Text style={styles.sellerLabel}>
        Product Description
      </Text>

      <TextInput
        style={styles.sellerMultilineInput}
        placeholder="Describe your product (optional)"
        placeholderTextColor="#888888"
        value={productDescription}
        onChangeText={setProductDescription}
        multiline
      />

      {/* Category Selection */}
      <Text style={styles.sellerLabel}>
        Select Category *
      </Text>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.accountOption,
            {
              marginHorizontal: 0,
              marginTop: 5,
              padding: 12,
              backgroundColor:
                productCategory === cat.id
                  ? "#111111"
                  : "#FFFFFF",
              borderWidth: 1,
              borderColor:
                productCategory === cat.id
                  ? "#111111"
                  : "#DDDDDD",
            },
          ]}
          onPress={() => setProductCategory(cat.id)}
        >
          <Text
            style={{
              flex: 1,
              color:
                productCategory === cat.id
                  ? "#FFFFFF"
                  : "#222222",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {productCategory === cat.id ? "✓  " : "○  "}
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Product Photo */}
      <Text style={[styles.sellerLabel, { marginTop: 18 }]}>
        Product Photo *
      </Text>

      <TouchableOpacity
        style={[
          styles.sellerPrimaryButton,
          {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#111111",
            borderStyle: "dashed",
            paddingVertical: 16,
          },
        ]}
        onPress={chooseProductImage}
      >
        {productImage?.uri ? (
          <Image
            source={{ uri: productImage.uri }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
        ) : null}

        <Text
          style={{
            color: "#111111",
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {productImage
            ? "Change Product Photo"
            : "📷 Choose Product Photo"}
        </Text>
      </TouchableOpacity>

      {/* Add Product Button */}
      <TouchableOpacity
        style={styles.sellerPrimaryButton}
        onPress={addProduct}
      >
        <Text style={styles.sellerPrimaryButtonText}>
          + Add Product
        </Text>
      </TouchableOpacity>
    </View>

    {/* My Products */}
    <Text style={styles.sellerFormTitle}>
      My Products
    </Text>

    {sellerProducts.length === 0 ? (
      <View style={styles.sellerFormCard}>
        <Text style={styles.accountText}>
          You haven't added any products yet.
        </Text>
      </View>
    ) : (
      sellerProducts.map((p) => (
        <View
          key={p.id}
          style={[
            styles.sellerFormCard,
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          {p.image_url ? (
            <Image
              source={{ uri: p.image_url }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                backgroundColor: "#F2F2F2",
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                backgroundColor: "#EEEEEE",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#777777" }}>
                No Photo
              </Text>
            </View>
          )}

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#111111",
              }}
            >
              {p.name}
            </Text>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: "#111111",
                marginTop: 7,
              }}
            >
              ₹{p.price}
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: "#666666",
                marginTop: 5,
              }}
            >
              Stock: {p.stock}
            </Text>
          </View>
        </View>
      ))
    )}
  </ScrollView>
);
}
    function Categories() {
    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>📂 Categories</Text>

        {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
          <TouchableOpacity
            key={c.name}
            style={styles.largeCategory}
            onPress={() => {
              setCategory(c.name);
              setScreen("home");
            }}
          >
            <Text style={styles.largeCategoryIcon}>
              {c.icon}
            </Text>

            <Text style={styles.largeCategoryText}>
              {c.name}
            </Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

function Account() {
  if (!user) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F5F7FB" }}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      >
        <Text
          style={{
            fontSize: 27,
            fontWeight: "800",
            color: "#172033",
            marginTop: 20,
          }}
        >
          My Account
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 22,
            padding: 24,
            marginTop: 25,
            alignItems: "center",
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 78,
              height: 78,
              borderRadius: 39,
              backgroundColor: "#E8F0FF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 35 }}>👤</Text>
          </View>

          <Text
            style={{
              fontSize: 21,
              fontWeight: "800",
              color: "#172033",
            }}
          >
            Welcome to ShopKart
          </Text>

          <Text
            style={{
              color: "#7A8498",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
              lineHeight: 21,
            }}
          >
            Login to manage your profile, orders and shopping activities.
          </Text>

          <TouchableOpacity
            onPress={() => {
              setAuthMode("login");
              setScreen("auth");
            }}
            style={{
              backgroundColor: "#172033",
              paddingVertical: 14,
              paddingHorizontal: 35,
              borderRadius: 12,
              marginTop: 22,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              Login to ShopKart
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const displayName =
    profile?.full_name?.trim() || "ShopKart Customer";

  const initial = displayName.charAt(0).toUpperCase();

  const menuRow = (
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true
  ) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F2F6",
      }}
    >
      <View
        style={{
          width: 43,
          height: 43,
          borderRadius: 13,
          backgroundColor: "#F0F4FA",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 13,
        }}
      >
        <Text style={{ fontSize: 21 }}>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#202A3D",
            fontSize: 15,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={{
              color: "#8791A3",
              fontSize: 12,
              marginTop: 4,
              lineHeight: 17,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {showArrow && (
        <Text
          style={{
            color: "#9AA3B2",
            fontSize: 25,
            marginLeft: 8,
          }}
        >
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  const sectionTitle = (title) => (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "800",
        color: "#69758B",
        marginTop: 24,
        marginBottom: 10,
        marginLeft: 3,
        letterSpacing: 0.5,
      }}
    >
      {title.toUpperCase()}
    </Text>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F5F7FB" }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 15,
        paddingBottom: 35,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 27,
          fontWeight: "800",
          color: "#172033",
          marginBottom: 5,
        }}
      >
        My Account
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: "#8791A3",
          marginBottom: 18,
        }}
      >
        Manage your ShopKart account
      </Text>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 18,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 65,
              height: 65,
              borderRadius: 33,
              backgroundColor: "#172033",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#FFFFFF",
              }}
            >
              {initial}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#172033",
              }}
              numberOfLines={2}
            >
              {displayName}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#788397",
                marginTop: 5,
              }}
              numberOfLines={2}
            >
              {user.email || "Email not available"}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#788397",
                marginTop: 4,
              }}
            >
              📱 {profile?.phone || "Mobile number not added"}
            </Text>
          </View>
        </View>

        {!editProfile ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setEditFullName(profile?.full_name || "");
              setEditPhone(profile?.phone || "");
              setEditProfile(true);
            }}
            style={{
              marginTop: 18,
              borderWidth: 1,
              borderColor: "#DCE4F0",
              borderRadius: 11,
              paddingVertical: 12,
              alignItems: "center",
              backgroundColor: "#F8FAFD",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#263B5E",
              }}
            >
              ✏️  Edit Profile
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#344054",
                marginBottom: 7,
              }}
            >
              Full Name
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#DCE3ED",
                backgroundColor: "#FAFBFD",
                borderRadius: 11,
                paddingHorizontal: 13,
                paddingVertical: 12,
                fontSize: 15,
                color: "#172033",
                marginBottom: 15,
              }}
              placeholder="Enter your full name"
              placeholderTextColor="#9AA3B2"
              value={editFullName}
              onChangeText={setEditFullName}
              autoCapitalize="words"
            />

            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#344054",
                marginBottom: 7,
              }}
            >
              Mobile Number
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#DCE3ED",
                backgroundColor: "#FAFBFD",
                borderRadius: 11,
                paddingHorizontal: 13,
                paddingVertical: 12,
                fontSize: 15,
                color: "#172033",
                marginBottom: 12,
              }}
              placeholder="Enter mobile number"
              placeholderTextColor="#9AA3B2"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
              maxLength={15}
            />

            <Text
              style={{
                fontSize: 12,
                color: "#8791A3",
                marginBottom: 16,
              }}
            >
              Email: {user.email || "Not available"}
            </Text>

            <TouchableOpacity
              disabled={profileSaving}
              onPress={saveProfile}
              style={{
                backgroundColor: "#172033",
                paddingVertical: 14,
                borderRadius: 11,
                alignItems: "center",
                opacity: profileSaving ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditProfile(false)}
              style={{
                paddingVertical: 13,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: "#69758B",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SHOPPING */}
      {sectionTitle("My Shopping")}

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 17,
          overflow: "hidden",
          elevation: 1,
        }}
      >
        {menuRow(
          "📦",
          "My Orders",
          "Track and manage your orders",
          () => setScreen("orders")
        )}

        {menuRow(
          "🏠",
          "Saved Addresses",
          "Manage your delivery addresses",
          () =>
            Alert.alert(
              "Saved Addresses",
              "Address management will be added after the address database is configured."
            ),
          false
        )}
      </View>

      {/* SELLER */}
      {sectionTitle("Business")}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setScreen("seller")}
        style={{
          backgroundColor: "#172033",
          borderRadius: 17,
          padding: 19,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "#34435F",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 13,
          }}
        >
          <Text style={{ fontSize: 25 }}>🏪</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Become a Seller
          </Text>

          <Text
            style={{
              color: "#CFD7E6",
              fontSize: 12,
              marginTop: 5,
              lineHeight: 18,
            }}
          >
            Start selling your products on ShopKart
          </Text>
        </View>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 25,
            marginLeft: 8,
          }}
        >
          ›
        </Text>
      </TouchableOpacity>

      {/* SUPPORT AND SECURITY */}
      {sectionTitle("Support & Settings")}

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 17,
          overflow: "hidden",
          elevation: 1,
        }}
      >
        {menuRow(
          "🎧",
          "Help & Support",
          "Get help with your account and orders",
          () =>
            Alert.alert(
              "Help & Support",
              "Please contact ShopKart support for assistance."
            )
        )}

        {menuRow(
          "🔐",
          "Privacy & Security",
          "Your account and login information",
          () =>
            Alert.alert(
              "Privacy & Security",
              "Your account email is managed by your login provider."
            )
        )}

        {profile?.role === "admin" &&
          menuRow(
            "🛡️",
            "Admin Panel",
            "Manage ShopKart marketplace",
            () => setScreen("admin")
          )}
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Logout", style: "destructive", onPress: logout },
            ]
          )
        }
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#F0DADA",
          paddingVertical: 15,
          alignItems: "center",
          marginTop: 23,
        }}
      >
        <Text
          style={{
            color: "#C43D46",
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          🚪  Logout
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: "#A0A8B6",
          textAlign: "center",
          fontSize: 12,
          marginTop: 22,
        }}
      >
        ShopKart • Your Shopping Partner
      </Text>
    </ScrollView>
  );
}
      function ManageSellers() {
  if (!user || profile?.role !== "admin") {
    return (
      <View style={styles.page}>
        <Text style={styles.pageTitle}>Access Denied</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen("account")}
        >
          <Text style={styles.buttonText}>
            Back to Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (date) => {
    if (!date) return "Not recorded";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const callSeller = async (phone) => {
    if (!phone) {
      Alert.alert("Phone Number", "Seller का नंबर उपलब्ध नहीं है।");
      return;
    }

    try {
      await Linking.openURL(`tel:${phone}`);
    } catch (error) {
      Alert.alert("Call Seller", "कॉल खोलने में समस्या हुई।");
    }
  };

  const viewSellerDetails = (seller) => {
    Alert.alert(
      "Seller Details",
      `Shop: ${seller.shop_name || "Not provided"}\n` +
      `Phone: ${seller.phone || "Not provided"}\n` +
      `Address: ${seller.address || "Not provided"}\n` +
      `Application Date: ${formatDate(seller.created_at)}\n` +
      `Last Status Change: ${formatDate(seller.status_updated_at)}\n` +
      `Status: ${seller.status || "pending"}`
    );
  };

  const changeTab = (tab) => {
    setSellerTab(tab);

    if (tab === "history") {
      loadSellerStatusHistory();
    }
  };

  const filteredSellers = sellerApplications.filter(
    (seller) => (seller.status || "pending") === sellerTab
  );

  const historyIsRecent = (entry) => {
    if (!entry.changed_at) return false;

    const changedAt = new Date(entry.changed_at).getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return (
      !Number.isNaN(changedAt) &&
      changedAt <= Date.now() &&
      Date.now() - changedAt < sevenDays
    );
  };

  const tabs = [
    { id: "pending", label: "🟡 Pending Requests" },
    { id: "approved", label: "🟢 Approved Sellers" },
    { id: "rejected", label: "🔴 Rejected Sellers" },
    { id: "history", label: "📋 Status History (7 Days)" },
  ];

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.pageTitle}>
        🏪 Manage Sellers
      </Text>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={() => setScreen("admin")}
      >
        <Text style={styles.accountOptionText}>
          ← Back to Admin Panel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={async () => {
          await loadSellerApplications();
          await loadSellerStatusHistory();
        }}
      >
        <Text style={styles.accountOptionText}>
          🔄 Refresh Sellers & History
        </Text>
      </TouchableOpacity>

      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.accountOption,
            sellerTab === tab.id && {
              backgroundColor: "#FFF0B3",
              borderWidth: 1,
              borderColor: "#D9A400",
            },
          ]}
          onPress={() => changeTab(tab.id)}
        >
          <Text style={styles.accountOptionText}>
            {tab.label}
          </Text>
          <Text style={styles.arrow}>
            {sellerTab === tab.id ? "✓" : "›"}
          </Text>
        </TouchableOpacity>
      ))}

      {sellerTab !== "history" && (
        <>
          {filteredSellers.length === 0 ? (
            <Text style={styles.accountText}>
              No {sellerTab} sellers found.
            </Text>
          ) : (
            filteredSellers.map((seller) => (
              <View
                key={seller.id}
                style={styles.accountCard}
              >
                <Text style={styles.accountTitle}>
                  {seller.shop_name || "Unnamed Shop"}
                </Text>

                <Text style={styles.accountText}>
                  Phone: {seller.phone || "Not provided"}
                </Text>

                <Text style={styles.accountText}>
                  Address: {seller.address || "Not provided"}
                </Text>

                <Text style={styles.accountText}>
                  Application Date: {formatDate(seller.created_at)}
                </Text>

                <Text style={styles.accountText}>
                  Status: {(seller.status || "pending").toUpperCase()}
                </Text>

                {seller.status === "approved" && (
                  <Text style={styles.accountText}>
                    Approval Date: {formatDate(seller.status_updated_at)}
                  </Text>
                )}

                {seller.status === "rejected" && (
                  <Text style={styles.accountText}>
                    Rejection Date: {formatDate(seller.status_updated_at)}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.accountOption}
                  onPress={() => callSeller(seller.phone)}
                >
                  <Text style={styles.accountOptionText}>
                    📞 Call Seller
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountOption}
                  onPress={() => viewSellerDetails(seller)}
                >
                  <Text style={styles.accountOptionText}>
                    👁️ View Details
                  </Text>
                </TouchableOpacity>

                {sellerTab === "pending" && (
                  <>
                    <TouchableOpacity
                      style={styles.accountOption}
                      onPress={() =>
                        Alert.alert(
                          "Approve Seller?",
                          `क्या आप ${seller.shop_name} को Approve करना चाहते हैं?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Approve",
                              onPress: () =>
                                updateSellerStatus(seller.id, "approved"),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={styles.accountOptionText}>
                        ✅ Approve Seller
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.accountOption}
                      onPress={() =>
                        Alert.alert(
                          "Reject Seller?",
                          `क्या आप ${seller.shop_name} की application Reject करना चाहते हैं?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Reject",
                              style: "destructive",
                              onPress: () =>
                                updateSellerStatus(seller.id, "rejected"),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={styles.accountOptionText}>
                        ❌ Reject Seller
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {sellerTab === "rejected" && (
                  <TouchableOpacity
                    style={styles.accountOption}
                    onPress={() =>
                      Alert.alert(
                        "Reconsider Application",
                        `क्या आप ${seller.shop_name} को Approve करना चाहते हैं?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Approve Seller",
                            onPress: () =>
                              updateSellerStatus(seller.id, "approved"),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.accountOptionText}>
                      🔄 Reconsider / Approve Seller
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </>
      )}

      {sellerTab === "history" && (
        <>
          <Text style={styles.accountTitle}>
            Status History — Last 7 Days
          </Text>

          {sellerStatusHistory.filter(historyIsRecent).length === 0 ? (
            <Text style={styles.accountText}>
              पिछले 7 दिनों में कोई Status Change रिकॉर्ड नहीं मिला।
            </Text>
          ) : (
            sellerStatusHistory
              .filter(historyIsRecent)
              .map((entry) => {
                const seller = Array.isArray(entry.sellers)
                  ? entry.sellers[0]
                  : entry.sellers;

                return (
                  <View
                    key={entry.id}
                    style={styles.accountCard}
                  >
                    <Text style={styles.accountTitle}>
                      {seller?.shop_name || "Seller"}
                    </Text>

                    <Text style={styles.accountText}>
                      Status: {(entry.new_status || "").toUpperCase()}
                    </Text>

                    <Text style={styles.accountText}>
                      Date: {formatDate(entry.changed_at)}
                    </Text>

                    <TouchableOpacity
                      style={styles.accountOption}
                      onPress={() => {
                        if (seller) {
                          viewSellerDetails({
                            ...seller,
                            status: entry.new_status,
                          });
                        } else {
                          Alert.alert(
                            "Seller Details",
                            "Seller की वर्तमान जानकारी उपलब्ध नहीं है।"
                          );
                        }
                      }}
                    >
                      <Text style={styles.accountOptionText}>
                        👁️ View Details
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.accountOption}
                      onPress={() => callSeller(seller?.phone)}
                    >
                      <Text style={styles.accountOptionText}>
                        📞 Call Seller
                      </Text>
                    </TouchableOpacity>

                    {entry.new_status === "rejected" && seller && (
                      <TouchableOpacity
                        style={styles.accountOption}
                        onPress={() =>
                          Alert.alert(
                            "Reconsider Application",
                            `क्या आप ${seller.shop_name} को Approve करना चाहते हैं?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Approve",
                                onPress: () =>
                                  updateSellerStatus(seller.id, "approved"),
                              },
                            ]
                          )
                        }
                      >
                        <Text style={styles.accountOptionText}>
                          🔄 Reconsider / Approve
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
          )}
        </>
      )}
    </ScrollView>
  );
}
  function Admin() {
    if (!user) {
      return (
        <View style={styles.page}>
          <Text style={styles.pageTitle}>
            👨‍💼 Admin Panel
          </Text>

          <Text style={styles.emptyText}>
            Admin panel ke liye login required hai.
          </Text>

          <TouchableOpacity
            style={styles.primary}
            onPress={() => setScreen("auth")}
          >
            <Text style={styles.primaryText}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (profile?.role !== "admin") {
      return (
        <View style={styles.page}>
          <Text style={styles.pageTitle}>
            👨‍💼 Admin Panel
          </Text>

          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Access Denied
            </Text>

            <Text style={styles.emptyText}>
              Sirf admin account is panel ko access kar
              sakta hai.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>
          👨‍💼 Admin Panel
        </Text>

        <View style={styles.accountCard}>
          <Text style={styles.accountIcon}>⚙️</Text>

          <Text style={styles.accountTitle}>
            ShopKart Admin
          </Text>

          <Text style={styles.accountText}>
            Marketplace commission: {commissionRate}%
          </Text>
        </View>

        <TouchableOpacity
  style={styles.accountOption}
  onPress={() => {
    setScreen("manageSellers");
    loadSellerApplications();
  }}
>
  <Text style={styles.accountOptionText}>
    🏪 Manage Sellers
  </Text>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.accountOption}
          onPress={() => Alert.alert(
            "Admin",
            "Product management next step me connect hoga."
          )}
        >
          <Text style={styles.accountOptionText}>
            🛍️ Manage Products
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountOption}
          onPress={() => Alert.alert(
            "Commission",
            `Current marketplace commission: ${commissionRate}%`
          )}
        >
          <Text style={styles.accountOptionText}>
            💰 Commission: {commissionRate}%
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {screen === "home" && Home()}
{screen === "categories" && Categories()}
{screen === "cart" && Cart()}
{screen === "orders" && Orders()}
{screen === "wishlist" && WishlistScreen()}
{screen === "auth" && Auth()}
{screen === "seller" && Seller()}
{screen === "manageSellers" && ManageSellers()}
{screen === "account" && Account()}
{screen === "admin" && Admin()}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text
            style={[
              styles.nav,
              screen === "home" && styles.navActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScreen("categories")}
        >
          <Text style={styles.navIcon}>📂</Text>
          <Text
            style={[
              styles.nav,
              screen === "categories" && styles.navActive,
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScreen("cart")}
        >
          <Text style={styles.navIcon}>🛒</Text>
          <Text
            style={[
              styles.nav,
              screen === "cart" && styles.navActive,
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScreen("orders")}
        >
          <Text style={styles.navIcon}>📦</Text>
          <Text
            style={[
              styles.nav,
              screen === "orders" && styles.navActive,
            ]}
          >
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScreen("account")}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text
            style={[
              styles.nav,
              screen === "account" && styles.navActive,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
                }
const styles = StyleSheet.create({
      page: {
    flex: 1,
    paddingBottom: 20,
  },

  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
  },

  qty: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 15,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  commissionInfo: {
    color: "#777777",
    fontSize: 13,
    marginTop: 6,
  },

  infoBox: {
    backgroundColor: "#EAF2FF",
    marginHorizontal: 18,
    marginBottom: 15,
    padding: 14,
    borderRadius: 10,
  },
  authContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    fontSize: 15,
  },

  passwordRow: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    height: 50,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
  },

  passwordToggle: {
    paddingHorizontal: 15,
  },

  primary: {
    backgroundColor: "#1769E0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  orText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#777777",
    fontWeight: "600",
  },
  sellerBanner: {
    backgroundColor: "#FFF7E6",
    marginHorizontal: 18,
    marginVertical: 15,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFD166",
  },

  sellerBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  sellerBannerIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  sellerBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
  },

  sellerBannerText: {
    fontSize: 13,
    color: "#666666",
    marginTop: 4,
  },

  sellerBannerArrow: {
    fontSize: 30,
    color: "#1769E0",
    marginLeft: 8,
  },

  sellerBannerButton: {
    backgroundColor: "#1769E0",
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 14,
  },

  sellerBannerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADADA",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },

  googleButtonText: {
    color: "#222222",
    fontSize: 15,
    fontWeight: "700",
  },

  link: {
    textAlign: "center",
    color: "#1769E0",
    fontWeight: "700",
    marginTop: 18,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  scrollContent: {
    paddingBottom: 25,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172033",
  },

  logoYellow: {
    color: "#FFC400",
  },

  cartButton: {
    position: "relative",
    padding: 5,
  },

  cartIcon: {
    fontSize: 27,
  },

  cartBadge: {
    position: "absolute",
    right: -2,
    top: -3,
    backgroundColor: "#E53935",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  search: {
    backgroundColor: "#FFFFFF",
    margin: 18,
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    fontSize: 15,
  },

  banner: {
    marginHorizontal: 18,
    backgroundColor: "#1769E0",
    borderRadius: 18,
    padding: 22,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  bannerText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  bannerSmall: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#FFC400",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 15,
  },

  buttonText: {
    fontWeight: "700",
    color: "#111111",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginHorizontal: 18,
    marginTop: 25,
    marginBottom: 12,
    color: "#172033",
  },

  categoryScroll: {
    paddingRight: 18,
  },

  category: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginLeft: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  categoryActive: {
    backgroundColor: "#1769E0",
    borderColor: "#1769E0",
  },

  categoryText: {
    fontWeight: "600",
    color: "#333333",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  products: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },

  product: {
    width: "46%",
    backgroundColor: "#FFFFFF",
    margin: "2%",
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  productImageBox: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 10,
  },

  productImage: {
    fontSize: 50,
    textAlign: "center",
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#172033",
  },

  productCategory: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 7,
    color: "#172033",
  },

  addButton: {
    backgroundColor: "#FFC400",
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 10,
  },

  addText: {
    textAlign: "center",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    padding: 40,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginTop: 10,
  },

  emptyText: {
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#172033",
    margin: 20,
  },

  emptyCart: {
    alignItems: "center",
    padding: 30,
  },

  emptyCartIcon: {
    fontSize: 70,
  },

  shopButton: {
    backgroundColor: "#1769E0",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cartItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  cartItemIcon: {
    fontSize: 42,
  },

  cartItemInfo: {
    marginLeft: 15,
  },

  cartItemName: {
    fontSize: 16,
    fontWeight: "700",
  },

  cartItemPrice: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "800",
  },

  totalBox: {
    backgroundColor: "#FFFFFF",
    margin: 18,
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
  },

  checkoutButton: {
    backgroundColor: "#1769E0",
    marginHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 10,
  },

  checkoutText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  largeCategory: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  largeCategoryIcon: {
    fontSize: 35,
  },

  largeCategoryText: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 15,
    flex: 1,
  },

  arrow: {
    fontSize: 28,
    color: "#888",
  },

  accountCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  accountIcon: {
    fontSize: 55,
  },

  accountTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginTop: 10,
  },

  accountText: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },

  accountOption: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: 12,
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  accountOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },

  bottom: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 19,
    marginBottom: 2,
  },

  nav: {
    color: "#555",
    fontSize: 11,
  },

  navActive: {
    color: "#1769E0",
    fontWeight: "800",
  },
// ShopKart Seller Forms - Black Theme

sellerFormContainer: {
paddingHorizontal: 16,
paddingTop: 8,
paddingBottom: 30,
},

sellerFormTitle: {
fontSize: 23,
fontWeight: "800",
color: "#111111",
marginHorizontal: 2,
marginTop: 12,
marginBottom: 18,
},

sellerLabel: {
fontSize: 13,
fontWeight: "700",
color: "#222222",
marginBottom: 5,
marginLeft: 2,
},

sellerInput: {
backgroundColor: "#FFFFFF",
color: "#111111",
borderWidth: 1,
borderColor: "#D0D0D0",
borderRadius: 8,
paddingHorizontal: 12,
height: 43,
marginBottom: 12,
fontSize: 14,
},

sellerMultilineInput: {
backgroundColor: "#FFFFFF",
color: "#111111",
borderWidth: 1,
borderColor: "#D0D0D0",
borderRadius: 8,
paddingHorizontal: 12,
paddingTop: 10,
minHeight: 75,
marginBottom: 12,
fontSize: 14,
textAlignVertical: "top",
},

sellerPrimaryButton: {
backgroundColor: "#111111",
paddingVertical: 12,
paddingHorizontal: 16,
borderRadius: 8,
alignItems: "center",
justifyContent: "center",
marginTop: 6,
marginBottom: 12,
},

sellerPrimaryButtonText: {
color: "#FFFFFF",
fontSize: 15,
fontWeight: "800",
},

sellerFormCard: {
backgroundColor: "#FFFFFF",
marginHorizontal: 2,
marginBottom: 14,
padding: 14,
borderRadius: 10,
borderWidth: 1,
borderColor: "#E2E2E2",
},

sellerSectionTitle: {
fontSize: 19,
fontWeight: "800",
color: "#111111",
marginTop: 18,
marginBottom: 12,
},
});
