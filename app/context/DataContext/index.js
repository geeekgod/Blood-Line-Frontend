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


  const [location, setLocation] = useState(null);

  console.log("nearByRequests", nearByRequests, location);
  const getRequest = (token) => {
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

  const getSavedRequest = (token) => {
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

  const getNearByRequests = (token) => {
    console.log(2, location !== null, location);
    if (location !== null) {
      console.log(1);
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
        setProfile(JSON.parse(profile) ? JSON.parse(profile) : {});
        setRequests(JSON.parse(requestsN) ? JSON.parse(requestsN) : [])
        setSavedRequests(JSON.parse(savedRequestN) ? JSON.parse(savedRequestN) : [])
        setNearByRequests(JSON.parse(nearByRequest) ? JSON.parse(nearByRequest) : [])
        setTimeout(() => {
          if (accessTokenN) {
            getRequest(JSON.parse(accessTokenN));
            getSavedRequest(JSON.parse(accessTokenN))
            getNearByRequests(JSON.parse(accessTokenN))
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

  useEffect(() => {
    (async () => {
      if (isAuth) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setTimeout(() => setLocation(null))
      }
    })();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }


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
        nearByRequests
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
