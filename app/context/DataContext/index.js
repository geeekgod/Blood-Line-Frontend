import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from "../AuthContext";
import bloodLineApi from "../../api";
import * as Location from 'expo-location';

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
  const [requests, setRequests] = useState([])
  const [savedRequests, setSavedRequests] = useState([]);
  const [nearByRequests, setNearByRequests] = useState([])
  const [config, setConfig] = useState({})


  const [location, setLocation] = useState(null);

  const getConfig = async (token) => {
    bloodLineApi.get('/config', {
      headers: {
        Authorization: token
      }
    }).then((res) => {
      if (res.data.success) {
        setConfig(res.data.data)
        storeData("@config", res.data.data)
      }
    }).catch((err) => {
      if (err.response.status === 401 && err.response.data.message === "Not Authorized") {
        logout()
      }
    })
  }

  const getRequest = async (token) => {
    bloodLineApi.get('/request', {
      headers: {
        Authorization: token
      }
    }).then((res) => {
      if (res.data.success) {
        setRequests(res.data.data)
        storeData("@request", res.data.data)
      }
    }).catch((err) => {
      if (err.response.status === 401 && err.response.data.message === "Not Authorized") {
        logout()
      }
    })
  }

  const getSavedRequest = async (token) => {
    bloodLineApi.get('/request/saved', {
      headers: {
        Authorization: token
      }
    }).then((res) => {
      if (res.data.success) {
        setSavedRequests(res.data.data)
        storeData("@savedRequest", res.data.data)
      }
    }).catch((err) => {
      if (err.response.status === 401 && err.response.data.message === "Not Authorized") {
        logout()
      }
    })
  }

  const getNearByRequests = async (token) => {
    if (location !== null) {
      bloodLineApi.post('/request/near', {
        long: location.coords.longitude,
        lat: location.coords.latitude,
        headers: {
          Authorization: token
        }
      }).then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setNearByRequests(res.data.data)
          storeData("@nearByRequest", res.data.data)
        }
      }).catch((err) => {
        console.log(err);
        if (err.response.status === 401 && err.response.data.message === "Not Authorized") {
          logout()
        }
      })
    }
  }

  useEffect(() => {
    const firstLoad = async () => {
      try {
        setAppIsReady(false)
        const profile = await AsyncStorage.getItem("@profile");
        const accessTokenN = await AsyncStorage.getItem("@accessToken");
        const requestsN = await AsyncStorage.getItem("@request");
        const savedRequestN = await AsyncStorage.getItem("@savedRequest");
        const nearByRequest = await AsyncStorage.getItem("@nearByRequest");
        const configN = await AsyncStorage.getItem("@config");
        setProfile(JSON.parse(profile) ? JSON.parse(profile) : {});
        setRequests(JSON.parse(requestsN) ? JSON.parse(requestsN) : [])
        setSavedRequests(JSON.parse(savedRequestN) ? JSON.parse(savedRequestN) : [])
        setNearByRequests(JSON.parse(nearByRequest) ? JSON.parse(nearByRequest) : [])
        setConfig(JSON.parse(configN) ? JSON.parse(configN) : {})
        setTimeout(async () => {
          if (accessTokenN) {
            await getConfig(JSON.parse(accessTokenN))
            await getRequest(JSON.parse(accessTokenN));
            await getSavedRequest(JSON.parse(accessTokenN))
            await getNearByRequests(JSON.parse(accessTokenN))
          }
        }, 500)
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


  // To get location
  const getLocation = async () => {
    try {
      let res = await Location.requestForegroundPermissionsAsync();
      if (res.status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location)
        setLocation(location);
    }
    catch (err) {
      console.log("Error in getting location", err)
    }
  }

  useEffect(() => {
    (async () => {
      if (isAuth) {
        await getLocation();
      }
    })();
  }, [isAuth]);


  if (!appIsReady) {
    return null
  }

  return (
    <DataContext.Provider
      onLayout={onLayoutRootView}
      value={{
        profile,
        storeProfile,
        requests,
        getRequest,
        getSavedRequest,
        savedRequests,
        location,
        getLocation,
        getNearByRequests,
        nearByRequests,
        getConfig,
        config
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
