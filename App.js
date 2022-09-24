import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import StackNavigator from "./app/navigation/StackNavigator";


export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" />
      <StackNavigator />
    </NativeBaseProvider>
  );
}
