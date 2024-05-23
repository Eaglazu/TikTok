// DashSquare.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const DashSquare = ({ name, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.square}>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#007BFF",
  },
  text: {
    fontFamily: "HelveticaNeue", // Utilisation de la police déclarée
    fontSize: 16,
  },
});

export default DashSquare;
