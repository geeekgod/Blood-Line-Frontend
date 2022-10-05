import React, { useCallback, useEffect, useState } from "react";
import { NativeBaseProvider, Box, extendTheme } from "native-base";
import { StatusBar, View } from "react-native";
import "react-native-gesture-handler";
import StackNavigator from "./app/navigation/StackNavigator";
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import useFont from "./app/hooks/useFont";
import { AuthContextProvider } from "./app/context/AuthContext";


export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
  const defaultTheme = extendTheme();
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await useFont();
      } catch (e) {
        console.warn("Errror", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      const theme = extendTheme({
        colors: {
          primary: {
            50: "#DE2A26",
            100: '#DE2A26',
            200: '#DE2A26',
            300: '#DE2A26',
            400: '#DE2A26',
            500: '#DE2A26',
            600: '#DE2A26',
            700: '#DE2A26',
            800: '#DE2A26',
            900: '#DE2A26',
          }
        },
        fontConfig: {
          Poppins: {
            100: {
              normal: "Poppins-Light",
              italic: "Poppins-LightItalic",
            },
            200: {
              normal: "Poppins-Light",
              italic: "Poppins-LightItalic",
            },
            300: {
              normal: "Poppins-Light",
              italic: "Poppins-LightItalic",
            },
            400: {
              normal: "Poppins-Regular",
            },
            500: {
              normal: "Poppins-Medium",
            },
            600: {
              normal: "Poppins-Medium",
              italic: "Poppins-MediumItalic",
            },
            700: {
              normal: 'Poppins-Bold',
            },
            800: {
              normal: 'Poppins-Bold',
              italic: 'Poppins-BoldItalic',
            },
            900: {
              normal: 'Poppins-Bold',
              italic: 'Poppins-BoldItalic',
            },
          },
        },

        fonts: {
          heading: "Poppins",
          body: "Poppins",
          mono: "Poppins",
        },
      });
      setTheme(theme);
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NativeBaseProvider theme={theme}>
        <AuthContextProvider>
          <NavigationContainer>
            <StatusBar barStyle={"default"} />
            <StackNavigator />
          </NavigationContainer>
        </AuthContextProvider>
      </NativeBaseProvider>
    </View>
  );
}
