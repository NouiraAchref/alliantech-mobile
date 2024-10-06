import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function AboutUs() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <View style={styles.topBorder} />
          <View style={styles.bottomBorder} />
          <Text style={styles.headerText}>Who are we</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>AllianTech</Text>
          <Text style={styles.text}>
            Alliantech est un acteur de premier rang dans la fourniture de
            capteurs, systèmes d’acquisition, moyens d’essais et moyens
            d’étalonnage.
          </Text>
          <Text style={styles.text}>
            Cette vision globale du métier de l’instrumentation nous permet de
            vous apporter des solutions techniquement innovantes et
            économiquement pertinentes pour vos applications.
          </Text>
        </View>

        <View style={styles.certificationContainer}>
          <Image
            source={require("@/assets/images/cert1.webp")}
            style={styles.certificationImage}
          />
          <Image
            source={require("@/assets/images/cert2.webp")}
            style={styles.certificationImage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    width: width,
    height: "25%",
    backgroundColor: "#002235",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topBorder: {
    borderRightWidth: 5,
    borderRightColor: "white",
    aspectRatio: 1,
    borderTopRightRadius: 5,
    borderTopWidth: 5,
    borderTopColor: "white",
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    position: "absolute",
    right: 5,
    top: 10,
    width: "10%",
  },
  bottomBorder: {
    borderLeftWidth: 5,
    borderLeftColor: "white",
    borderTopLeftRadius: 5,
    borderBottomWidth: 5,
    borderBottomColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    position: "absolute",
    left: 5,
    bottom: 10,
    width: "10%",
    aspectRatio: 1,
  },
  headerText: {
    color: "white",
    textAlign: "center",
    maxWidth: "75%",
    fontSize: 36,
    fontWeight: "bold",
  },
  logoContainer: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    aspectRatio: 4,
    objectFit: "contain",
  },
  content: {
    width: width * 0.9,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#002235",
    borderRadius: 15,
    alignSelf: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    lineHeight: 22,
  },
  certificationContainer: {
    flexDirection: "row",
    gap: 5,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  certificationImage: {
    width: 50,
    aspectRatio: 1,
    objectFit: "contain",
  },
  footer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#002235",
  },
  footerText: {
    color: "white",
    marginVertical: 2,
  },
});
