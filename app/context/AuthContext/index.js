import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const AuthContext = createContext();
const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log("Error while clearing all data", e);
  }
};

const AuthContextProvider = ({ children }) => {
  const [appIsReady, setAppIsReady] = useState(false)
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const firstLoad = async () => {
      try {
        const user = await AsyncStorage.getItem("@user");
        const accessToken = await AsyncStorage.getItem("@accessToken");
        setUser(JSON.parse(user));
        setAccessToken(JSON.parse(accessToken));
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsReady(true);
      }
    };

    firstLoad();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const headers = {
    Authorization: accessToken,
    "Content-Type": "application/json",
  };

  const [isAuth, setIsAuth] = useState(() =>
    user !== null && accessToken !== null ? true : false
  );

  const storeCredentials = (resData) => {
    storeData("@user", resData.user);
    storeData("@accessToken", resData.accessToken);
    setUser(resData.user);
    setAccessToken(resData.accessToken)
  };

  const logout = () => {
    clearAll().then(() => {
      setIsAuth(false);
      setUser({});
      setAccessToken(null);
    });
  };

  useEffect(() => {
    setIsAuth(() => user !== null && accessToken !== null ? true : false)
  }, [user, accessToken])

  if (!appIsReady) {
    return null
  }

  return (
    <AuthContext.Provider
      onLayout={onLayoutRootView}
      value={{ user, accessToken, headers, isAuth, storeCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
