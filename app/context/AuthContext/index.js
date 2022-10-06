import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import bloodLineApi from "../../api";

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

  const getUser = (token) => {
    bloodLineApi.get('/user', {
      headers: {
        Authorization: token
      }
    }).then((res) => {
      if (res.data.success) {
        setUser(res.data.data)
        storeData("@user", res.data.data)
      }
    }).catch((err) => {
      if (err.response.status === 401 && err.response.data.message === "Not Authorized") {
        logout()
      }
    })
  }


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
    const firstLoad = async () => {
      try {
        const userN = await AsyncStorage.getItem("@user");
        const accessTokenN = await AsyncStorage.getItem("@accessToken");
        setUser(JSON.parse(userN));
        setAccessToken(JSON.parse(accessTokenN));
        setTimeout(() => {
          if (userN && accessTokenN) {
            getUser(JSON.parse(accessTokenN));
          }
        }, 1000)
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsReady(true);
      }
    };

    firstLoad();
  }, []);

  useEffect(() => {
    if (accessToken) {
      bloodLineApi.defaults.headers.common['Authorization'] = accessToken;
    }
  }, [accessToken])

  useEffect(() => {
    setIsAuth(() => user !== null && accessToken !== null ? true : false)
  }, [user, accessToken])

  if (!appIsReady) {
    return null
  }

  return (
    <AuthContext.Provider
      onLayout={onLayoutRootView}
      value={{ user, accessToken, headers, isAuth, storeCredentials, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
