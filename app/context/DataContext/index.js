import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from "../AuthContext";

SplashScreen.preventAutoHideAsync();

const DataContext = createContext();
const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};


const DataContextProvider = ({ children }) => {

  const { isAuth } = useContext(AuthContext)

  const [appIsReady, setAppIsReady] = useState(false)
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const firstLoad = async () => {
      try {
        setAppIsReady(false)
        const profile = await AsyncStorage.getItem("@profile");
        setProfile(JSON.parse(profile));
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsReady(true);
        if (!isAuth) {
          setProfile({})
        }
      }
    };

    firstLoad();
  }, [isAuth]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);


  const storeProfile = (resData) => {
    storeData("@profile", resData.data);
    setProfile(resData.data);
  };


  if (!appIsReady) {
    return null
  }

  return (
    <DataContext.Provider
      onLayout={onLayoutRootView}
      value={{ profile, storeProfile }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
