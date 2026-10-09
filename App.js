import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,BackHandler,
} from "react-native";
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

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [shopName, setShopName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
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

  const [commissionRate, setCommissionRate] = useState(10);
const [seller, setSeller] = useState(null);
const [sellerProducts, setSellerProducts] = useState([]);
const [sellerLoading, setSellerLoading] = useState(false);
const [productName, setProductName] = useState("");
const [productPrice, setProductPrice] = useState("");
const [productCategory, setProductCategory] = useState("");
const [productStock, setProductStock] = useState("");
const [productDescription, setProductDescription] = useState("");
  useEffect(() => {
    loadSession();
    loadProducts();
    loadCommission();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user || null);

  if (!session?.user) {
    setProfile(null);
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

    Alert.alert("Cart", "Product cart mein add ho gaya.");
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setScreen("home");
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

  function checkout() {
    if (!user) {
      Alert.alert(
        "Login required",
        "Order place karne ke liye pehle login karo."
      );
      setScreen("auth");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Cart empty", "Pehle product cart mein add karo.");
      return;
    }

    const commission =
      (cartTotal * commissionRate) / 100;

    const sellerAmount = cartTotal - commission;

    const newOrder = {
      id: "ORDER-" + Date.now(),
      items: cart,
      total: cartTotal,
      commission,
      sellerAmount,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    setOrders((old) => [newOrder, ...old]);
    setCart([]);
    setScreen("orders");

    Alert.alert(
      "Order created",
      `Total: ₹${cartTotal}\nMarketplace commission: ₹${commission.toFixed(
        2
      )}\nSeller amount: ₹${sellerAmount.toFixed(2)}`
    );
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
        <Header />

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
        ><TouchableOpacity
  style={styles.termsRow}
  onPress={() => setSellerTermsAccepted(!sellerTermsAccepted)}
>
  <Text style={styles.checkbox}>
    {sellerTermsAccepted ? "☑" : "☐"}
  </Text>

  <Text style={styles.termsText}>
    Main ShopKart Seller Terms & Conditions ko accept karta/karti hoon.
  </Text>
</TouchableOpacity>
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
              </View>
            </View>
          ))
        )}
      </ScrollView>
    );
  }

  function Cart() {
    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>🛒 My Cart</Text>

        {cart.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Cart empty hai
            </Text>

            <TouchableOpacity
              style={styles.primary}
              onPress={() => setScreen("home")}
            >
              <Text style={styles.primaryText}>
                Shopping Start Karo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View style={styles.cartItem} key={item.id}>
                <Text style={styles.productIcon}>
                  {item.icon || "🛍️"}
                </Text>

                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>
                    {item.name}
                  </Text>

                  <Text style={styles.price}>
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        removeFromCart(item.id)
                      }
                    >
                      <Text>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qty}>
                      {item.qty}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => addToCart(item)}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.total}>
                ₹{cartTotal.toLocaleString("en-IN")}
              </Text>

              <Text style={styles.commissionInfo}>
                Marketplace commission: {commissionRate}%
              </Text>

              <TouchableOpacity
                style={styles.primary}
                onPress={checkout}
              >
                <Text style={styles.primaryText}>
                  Proceed to Checkout
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
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>📦 My Orders</Text>

        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Abhi koi order nahi hai
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View style={styles.order} key={order.id}>
              <Text style={styles.orderId}>
                {order.id}
              </Text>

              <Text>
                Date: {order.createdAt}
              </Text>

              <Text>
                Status: {order.status}
              </Text>

              <Text style={styles.orderTotal}>
                ₹{order.total.toLocaleString("en-IN")}
              </Text>

              <Text style={styles.commissionInfo}>
                Commission: ₹
                {order.commission.toFixed(2)}
              </Text>
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      Alert.alert("Google Login", error.message);
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
  
  


  async function addProduct() {
    if (!seller || seller.status !== "approved") {
      Alert.alert(
        "Seller Approval",
        "Product add karne ke liye seller account approve hona zaroori hai."
      );
      return;
    }

    if (!productName || !productPrice || !productStock) {
      Alert.alert(
        "Missing Information",
        "Product name, price aur stock bharna zaroori hai."
      );
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        seller_id: seller.id,
        name: productName,
        price: Number(productPrice),
        category: productCategory || "Other",
        stock: Number(productStock),
        description: productDescription || null,
      })
      .select()
      .single();

    if (error) {
      Alert.alert("Product Error", error.message);
      return;
    }

    setSellerProducts((old) => [data, ...old]);

    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductStock("");
    setProductDescription("");

    Alert.alert("Success", "Product successfully add ho gaya.");
  }

  if (!user) {
    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>🏪 Seller Center</Text>

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            Seller banne ke liye login karo
          </Text>

          <TouchableOpacity
            style={styles.primary}
            onPress={() => setScreen("auth")}
          >
            <Text style={styles.primaryText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (sellerLoading) {
    return (
      <View style={styles.page}>
        <ActivityIndicator size="large" />
        <Text style={styles.emptyText}>
          Seller information load ho rahi hai...
        </Text>
      </View>
    );
  }

  if (!seller) {
    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>
          🏪 Become a Seller
        </Text>

        

        <TextInput
          value={shopName}
          onChangeText={setShopName}
          placeholder="Shop Name"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <TextInput
          value={sellerPhone}
          onChangeText={setSellerPhone}
          placeholder="Phone Number"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          value={sellerAddress}
          onChangeText={setSellerAddress}
          placeholder="Shop Address"
          placeholderTextColor="#777"
          style={styles.input}
        />
<TextInput
  value={user?.email || ""}
  editable={false}
  placeholder="Email"
  placeholderTextColor="#777"
  style={styles.input}
/>

<TextInput
  value={sellerPan}
  onChangeText={setSellerPan}
  placeholder="PAN Number"
  placeholderTextColor="#777"
  autoCapitalize="characters"
  style={styles.input}
/>

<TextInput
  value={sellerGstin}
  onChangeText={setSellerGstin}
  placeholder="GSTIN (Optional)"
  placeholderTextColor="#777"
  autoCapitalize="characters"
  style={styles.input}
/>

<TextInput
  value={sellerBankName}
  onChangeText={setSellerBankName}
  placeholder="Bank Name"
  placeholderTextColor="#777"
  style={styles.input}
/>

<TextInput
  value={sellerAccountNumber}
  onChangeText={setSellerAccountNumber}
  placeholder="Bank Account Number"
  placeholderTextColor="#777"
  keyboardType="numeric"
  style={styles.input}
/>

<TextInput
  value={sellerIfsc}
  onChangeText={setSellerIfsc}
  placeholder="IFSC Code"
  placeholderTextColor="#777"
  autoCapitalize="characters"
  style={styles.input}
/>

<TouchableOpacity
  style={styles.termsRow}
  onPress={() =>
    setSellerTermsAccepted(!sellerTermsAccepted)
  }
>
  <Text style={styles.checkbox}>
    {sellerTermsAccepted ? "☑" : "☐"}
  </Text>

  <Text style={styles.termsText}>
    Main ShopKart Seller Terms & Conditions ko accept karta/karti hoon.
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.primary}
  onPress={registerSeller}
>
  <Text style={styles.primaryText}>
    Submit Seller Application
  </Text>
</TouchableOpacity>
      </ScrollView>
    );
  }

  if (seller.status !== "approved") {
    return (
      <ScrollView style={styles.page}>
        <Text style={styles.pageTitle}>
          🏪 Seller Center
        </Text>

        <View style={styles.accountCard}>
          <Text style={styles.accountIcon}>⏳</Text>

          <Text style={styles.accountTitle}>
            Application {seller.status || "pending"}
          </Text>

          <Text style={styles.accountText}>
            Admin approval ke baad aap products add kar sakenge.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.accountOption}
          onPress={loadSellerData}
        >
          <Text style={styles.accountOptionText}>
            🔄 Check Approval Status
          </Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.pageTitle}>
        🏪 Seller Dashboard
      </Text>

      <View style={styles.accountCard}>
        <Text style={styles.accountIcon}>🏪</Text>

        <Text style={styles.accountTitle}>
          {seller.shop_name}
        </Text>

        <Text style={styles.accountText}>
          Status: Approved
        </Text>

        <Text style={styles.accountText}>
          Commission: {seller.commission_rate || commissionRate}%
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        ➕ Add New Product
      </Text>

      <TextInput
        value={productName}
        onChangeText={setProductName}
        placeholder="Product Name"
        placeholderTextColor="#777"
        style={styles.input}
      />

      <TextInput
        value={productPrice}
        onChangeText={setProductPrice}
        placeholder="Price"
        placeholderTextColor="#777"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        value={productCategory}
        onChangeText={setProductCategory}
        placeholder="Category"
        placeholderTextColor="#777"
        style={styles.input}
      />

      <TextInput
        value={productStock}
        onChangeText={setProductStock}
        placeholder="Stock Quantity"
        placeholderTextColor="#777"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        value={productDescription}
        onChangeText={setProductDescription}
        placeholder="Product Description"
        placeholderTextColor="#777"
        multiline
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.primary}
        onPress={addProduct}
      >
        <Text style={styles.primaryText}>
          ➕ Add Product
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        🛍️ My Products
      </Text>

      {sellerProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            Abhi koi product nahi hai
          </Text>
        </View>
      ) : (
        sellerProducts.map((product) => (
          <View key={product.id} style={styles.cartItem}>
            <Text style={styles.cartItemIcon}>🛍️</Text>

            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>
                {product.name}
              </Text>

              <Text style={styles.cartItemPrice}>
                ₹{product.price}
              </Text>

              <Text>
                Stock: {product.stock}
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
      <View style={styles.page}>
        <Text style={styles.pageTitle}>👤 My Account</Text>

        <Text style={styles.accountText}>
          Welcome to ShopKart
        </Text>

        <TouchableOpacity
          style={styles.accountOption}
          onPress={() => {
            setAuthMode("login");
            setScreen("auth");
          }}
        >
          <Text style={styles.accountOptionText}>
            🔐 Login
          </Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.pageTitle}>👤 My Account</Text>

      <Text style={styles.accountText}>
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </Text>

      <Text style={styles.accountText}>
        {user.email}
      </Text>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={() => setScreen("orders")}
      >
        <Text style={styles.accountOptionText}>
          📦 My Orders
        </Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={() => setScreen("seller")}
      >
        <Text style={styles.accountOptionText}>
          🏪 Become a Seller
        </Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      {profile?.role === "admin" && (
        <TouchableOpacity
          style={styles.accountOption}
          onPress={() => setScreen("admin")}
        >
          <Text style={styles.accountOptionText}>
            🛡️ Admin Panel
          </Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.primary}
        onPress={logout}
      >
        <Text style={styles.primaryText}>
          Logout
        </Text>
      </TouchableOpacity>
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
          onPress={() => Alert.alert(
            "Admin",
            "Seller management next step me connect hoga."
          )}
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
{screen === "auth" && Auth()}
{screen === "seller" && Seller()}
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
});
