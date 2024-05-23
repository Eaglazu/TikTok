// src/components/CustomHeaderTitle.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomHeaderTitle = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Outils</Text>
        <View style={styles.underline} />
      </View>
      <Text style={styles.text}>LIVE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 180, // Ajustez selon la largeur souhaitée pour vos éléments
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 18, // Ajustez la taille du texte selon vos préférences
  },
  underline: {
    width: 50, // Ajustez la largeur du trait selon vos préférences
    height: 2,
    backgroundColor: "black",
    marginTop: 2,
  },
});

export default CustomHeaderTitle;
