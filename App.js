import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const PRODUCTS = [
  {
    id: "1",
    icon: "📱",
    name: "Smartphone",
    price: 19999,
    category: "Mobiles",
  },
  {
    id: "2",
    icon: "🎧",
    name: "Wireless Headphones",
    price: 1999,
    category: "Audio",
  },
  {
    id: "3",
    icon: "⌚",
    name: "Smart Watch",
    price: 2499,
    category: "Electronics",
  },
  {
    id: "4",
    icon: "👟",
    name: "Running Shoes",
    price: 3499,
    category: "Fashion",
  },
  {
    id: "5",
    icon: "👕",
    name: "Men's T-Shirt",
    price: 799,
    category: "Fashion",
  },
  {
    id: "6",
    icon: "💻",
    name: "Laptop",
    price: 54999,
    category: "Electronics",
  },
];

const CATEGORIES = [
  "All",
  "Mobiles",
  "Fashion",
  "Home",
  "Electronics",
  "Audio",
];

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const addToCart = (product) => {
    setCart((currentCart) => [...currentCart, product]);
    Alert.alert("Added to Cart", `${product.name} cart mein add ho gaya.`);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const renderHome = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Shop<Text style={styles.logoYellow}>Kart</Text>
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setActiveTab("Cart")}
        >
          <Text style={styles.cartIcon}>🛒</Text>

          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search for products..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Big Deals</Text>
        <Text style={styles.bannerText}>Big Savings</Text>
        <Text style={styles.bannerSmall}>Up to 70% Off</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedCategory("All")}
        >
          <Text style={styles.buttonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.category,
              selectedCategory === category && styles.categoryActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category &&
                  styles.categoryTextActive,
              ]}
            >
              {category === "All" ? "🛍️ All" : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      <Text style={styles.sectionTitle}>
        {selectedCategory === "All"
          ? "Top Deals"
          : selectedCategory}
      </Text>

      {filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Product nahi mila</Text>
          <Text style={styles.emptyText}>
            Search ya category change karke dekho.
          </Text>
        </View>
      ) : (
        <View style={styles.products}>
          {filteredProducts.map((product) => (
            <View style={styles.product} key={product.id}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    product.name,
                    `Category: ${product.category}\nPrice: ₹${product.price.toLocaleString(
                      "en-IN"
                    )}`
                  )
                }
              >
                <View style={styles.productImageBox}>
                  <Text style={styles.productImage}>
                    {product.icon}
                  </Text>
                </View>

                <Text style={styles.productName}>
                  {product.name}
                </Text>

                <Text style={styles.productCategory}>
                  {product.category}
                </Text>

                <Text style={styles.price}>
                  ₹{product.price.toLocaleString("en-IN")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(product)}
              >
                <Text style={styles.addText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderCart = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.pageTitle}>🛒 My Cart</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Products add karo aur yahan order dekho.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => setActiveTab("Home")}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cart.map((item, index) => (
            <View style={styles.cartItem} key={`${item.id}-${index}`}>
              <Text style={styles.cartItemIcon}>{item.icon}</Text>

              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>
                  ₹{item.price.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              ₹{cartTotal.toLocaleString("en-IN")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() =>
              Alert.alert(
                "Checkout",
                "Next step mein real payment system connect karenge."
              )
            }
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderCategories = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>📦 Categories</Text>

      {CATEGORIES.filter((item) => item !== "All").map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.largeCategory}
          onPress={() => {
            setSelectedCategory(category);
            setActiveTab("Home");
          }}
        >
          <Text style={styles.largeCategoryIcon}>
            {category === "Mobiles"
              ? "📱"
              : category === "Fashion"
              ? "👕"
              : category === "Electronics"
              ? "💻"
              : category === "Audio"
              ? "🎧"
              : "🏠"}
          </Text>

          <Text style={styles.largeCategoryText}>{category}</Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAccount = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>👤 Account</Text>

      <View style={styles.accountCard}>
        <Text style={styles.accountIcon}>👤</Text>
        <Text style={styles.accountTitle}>Welcome to ShopKart</Text>
        <Text style={styles.accountText}>
          Login aur signup system next step mein connect karenge.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={() =>
          Alert.alert("My Orders", "Orders section next step mein banega.")
        }
      >
        <Text style={styles.accountOptionText}>📦  My Orders</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountOption}
        onPress={() =>
          Alert.alert("Seller", "Seller registration next step mein banega.")
        }
      >
        <Text style={styles.accountOptionText}>🏪  Become a Seller</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {activeTab === "Home" && renderHome()}
      {activeTab === "Categories" && renderCategories()}
      {activeTab === "Cart" && renderCart()}
      {activeTab === "Account" && renderAccount()}

      {/* Bottom Navigation */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab("Home")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "Home" && styles.navActive,
            ]}
          >
            🏠
          </Text>
          <Text
            style={[
              styles.nav,
              activeTab === "Home" && styles.navActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab("Categories")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "Categories" && styles.navActive,
            ]}
          >
            📦
          </Text>
          <Text
            style={[
              styles.nav,
              activeTab === "Categories" && styles.navActive,
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab("Cart")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "Cart" && styles.navActive,
            ]}
          >
            🛒
          </Text>
          <Text
            style={[
              styles.nav,
              activeTab === "Cart" && styles.navActive,
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab("Account")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "Account" && styles.navActive,
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.nav,
              activeTab === "Account" && styles.navActive,
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
