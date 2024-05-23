// HomeScreen.js
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import DashSquare from "../components/DashSquare";

const HomeScreen = ({ navigation }) => {
  const items = [
    {
      name: "Dash1",
      image: require("../assets/images/dollars.png"),
      label: "Dash 1",
      screen: "DashScreen",
    },
    {
      name: "Dash2",
      image: require("../assets/images/sub.png"),
      label: "Dash 2",
      screen: "DashScreen2",
    },
    {
      name: "Dash3",
      image: require("../assets/images/gift.png"),
      label: "Dash 3",
      screen: "DashScreen3",
    },
    {
      name: "Dash4",
      image: require("../assets/images/music.png"),
      label: "Dash 4",
      screen: "DashScreen4",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {items.map((item, index) => (
          <DashSquare
            key={index}
            name={item.label}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ButtonsPage")}
      >
        <Text style={styles.buttonText}>Aller à la Page de Boutons</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
