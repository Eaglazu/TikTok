import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DashScreen from "../screens/DashScreen";
import Dash1 from "../screens/Dash1"; // Assurez-vous que ce composant est correctement importé
import { Image, TouchableOpacity, StyleSheet } from "react-native";

const Stack = createStackNavigator();

const Home1 = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dash"
        component={DashScreen}
        options={{
          title: "Outils pour les créateurs",
          headerTintColor: "black",
          headerBackTitleVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Définissez ici l'action que vous souhaitez exécuter
                console.log("Paramètres");
              }}
            >
              <Image
                source={require("../assets/images/reglage.png")}
                style={styles.headerImage}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#ededed",
          },
        }}
      />
      <Stack.Screen
        name="Dash1"
        component={Dash1}
        options={{
          title: "Programme de Récompenses",
          headerTintColor: "black",
          headerBackTitleVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Définissez ici l'action que vous souhaitez exécuter
                console.log("Menu");
              }}
            >
              <Image
                source={require("../assets/images/menu.png")}
                style={styles.headerImage}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#ededed",
          },
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
});

export default Home1;
