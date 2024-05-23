import React from "react";
import { Image, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DashScreen from "../screens/DashScreen";
import DashScreen2 from "../screens/DashScreen2";
import DashScreen3 from "../screens/DashScreen3";
import DashScreen4 from "../screens/DashScreen4";
import Dash1 from "../screens/Dash1"; // Assurez-vous que ce composant existe
import Dash2 from "../screens/Dash2"; // Assurez-vous que ce composant existe
import Dash3 from "../screens/Dash3"; // Assurez-vous que ce composant existe
import Dash4 from "../screens/Dash4"; // Assurez-vous que ce composant existe
import PerformancePage from "../screens/PerformancePage"; // Importez PerformancePage ici
import ButtonsPage from "../screens/ButtonsPage";

const Stack = createStackNavigator();

const formatDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Soustrait un jour
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  }).format(yesterday);
};

const defaultOptions = {
  headerTintColor: "black",
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: "#ededed",
  },
  headerRight: () => (
    <TouchableOpacity
      onPress={() => {
        console.log("Action du bouton droit");
      }}
    >
      <Image
        source={require("../assets/images/menu.png")}
        style={styles.headerImage}
      />
    </TouchableOpacity>
  ),
};
const defaultOptionsPage = {
  headerTintColor: "black",
  fontWeight: "bold",
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: "#ededed",
  },
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DashScreen"
        component={DashScreen}
        options={{
          ...defaultOptions,
          title: "TikTok Studio",
        }}
      />
      <Stack.Screen
        name="DashScreen2"
        component={DashScreen2}
        options={{
          ...defaultOptions,
          title: "TikTok Studio",
        }}
      />
      <Stack.Screen
        name="DashScreen3"
        component={DashScreen3}
        options={{
          ...defaultOptions,
          title: "TikTok Studio",
        }}
      />
      <Stack.Screen
        name="DashScreen4"
        component={DashScreen4}
        options={{
          ...defaultOptions,
          title: "TikTok Studio",
        }}
      />
      <Stack.Screen
        name="Dash1"
        component={Dash1}
        options={{
          ...defaultOptions,
          title: "Programme de Récompenses pour les créateurs",
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text
                style={styles.headerTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Programme de Récompenses pour les créateurs -
              </Text>
              <Text
                style={styles.headerSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Dernière Mise à jour : {formatDate()}
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Dash2"
        component={Dash2}
        options={{
          ...defaultOptions,
          title: "Programme de Récompenses pour les créateurs",
        }}
      />
      <Stack.Screen
        name="Dash3"
        component={Dash3}
        options={{
          ...defaultOptions,
          title: "Programme de Récompenses pour les créateurs",
        }}
      />
      <Stack.Screen
        name="Dash4"
        component={Dash4}
        options={{
          ...defaultOptions,
          title: "Programme de Récompenses pour les créateurs",
        }}
      />
      <Stack.Screen
        name="RPM"
        component={PerformancePage}
        options={{
          ...defaultOptionsPage,
          title: "Performances",
        }}
      />
      <Stack.Screen
        name="ButtonsPage"
        component={ButtonsPage}
        options={{
          title: "Page de Boutons",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  headerTitleContainer: {
    flexDirection: "column", // Alignement des éléments en colonne
    alignItems: "center", // Alignement centré
    flex: 1, // Prendre tout l'espace disponible
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5, // Un peu d'espace entre le titre et le sous-titre
  },
  headerSubtitle: {
    fontSize: 14, // Taille réduite pour le sous-titre
    color: "gray",
  },
});

export default AppNavigator;
