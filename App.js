import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Shop<Text style={styles.logoYellow}>Kart</Text>
          </Text>

          <Text style={styles.cart}>🛒</Text>
        </View>

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search for products..."
          placeholderTextColor="#777"
        />

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Big Deals</Text>
          <Text style={styles.bannerText}>Big Savings</Text>
          <Text style={styles.bannerSmall}>Up to 70% Off</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["📱 Mobiles", "👕 Fashion", "🏠 Home", "💻 Electronics", "🎧 Audio"].map(
            (item) => (
              <TouchableOpacity style={styles.category} key={item}>
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Products */}
        <Text style={styles.sectionTitle}>Top Deals</Text>

        <View style={styles.products}>
          {[
            ["📱", "Smartphone", "₹19,999"],
            ["🎧", "Wireless Headphones", "₹1,999"],
            ["⌚", "Smart Watch", "₹2,499"],
            ["👟", "Running Shoes", "₹3,499"],
          ].map(([icon, name, price]) => (
            <TouchableOpacity style={styles.product} key={name}>
              <Text style={styles.productImage}>{icon}</Text>
              <Text style={styles.productName}>{name}</Text>
              <Text style={styles.price}>{price}</Text>

              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addText}>Add to Cart</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottom}>
        <Text style={styles.navActive}>⌂{"\n"}Home</Text>
        <Text style={styles.nav}>▦{"\n"}Categories</Text>
        <Text style={styles.nav}>🛒{"\n"}Cart</Text>
        <Text style={styles.nav}>👤{"\n"}Account</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
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

  cart: {
    fontSize: 25,
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

  category: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginLeft: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  categoryText: {
    fontWeight: "600",
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
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  productImage: {
    fontSize: 55,
    textAlign: "center",
    paddingVertical: 10,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 7,
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

  bottom: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  nav: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
  },

  navActive: {
    textAlign: "center",
    color: "#1769E0",
    fontSize: 12,
    fontWeight: "700",
  },
});
