import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";

const Tab = createBottomTabNavigator();

// Sprout: a watering-reminder app for people with houseplants. Users are mostly
// renters in small apartments who have 5-20 plants and forget to water them.
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
        <Tab.Screen name="Calendar" component={HomeScreen} options={{ tabBarIcon: () => <Text>📅</Text> }} />
        <Tab.Screen name="Insights" component={HomeScreen} options={{ tabBarIcon: () => <Text>📊</Text> }} />
        <Tab.Screen name="Settings" component={HomeScreen} options={{ tabBarIcon: () => <Text>⚙️</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
