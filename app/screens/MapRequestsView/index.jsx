import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { heightScreen, widthScreen } from "../../utils/layout";
import {
  Box,
  Button,
  CloseIcon,
  HStack,
  Divider,
  Icon,
  IconButton,
  Text,
  VStack,
  FlatList,
} from "native-base";
import { DataContext } from "../../context/DataContext";
import * as Linking from "expo-linking";
import { AuthContext } from "../../context/AuthContext";
import MapView, { Marker } from "react-native-maps";

const MapRequestsView = () => {
  const {
    requests,
    getRequest,
    getSavedRequest,
    savedRequests,
    nearByRequests,
    getLocation,
    getNearByRequests,
    setLocation,
    location
  } = useContext(DataContext);
  const { accessToken, getUser } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);
  const [locationState, setLocationState] = useState({
    latitude: 19.2183,
    longitude: 72.9781,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  })

  const loadRequest = async () => {
    return new Promise(async () => {
      await getLocation()
      await getSavedRequest(accessToken);
      await getRequest(accessToken);
      await getNearByRequests(accessToken);
      setRefreshing(false);
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequest();
  };

  const updateCurrentLocation = (e) => {
    setLocationState({ ...locationState, latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })
  }

  useEffect(() => {
    setLocation({ coords: { latitude: locationState.latitude, longitude: locationState.longitude } })
    setTimeout(async () => {
      await getNearByRequests(accessToken);
    }, 1000)
  }, [locationState]);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={locationState}
        style={styles.map}
        onRegionChangeComplete={(e) => setLocationState({...locationState, latitude: e.latitude, longitude: e.longitude})}
        >

        {locationState.latitude && locationState.longitude && (
          <Marker coordinate={locationState}
            title={"Your Location"} image={require('../../assets/user_marker.png')}
            draggable
            onDragEnd={(e) => updateCurrentLocation(e)}
          />)}
        {nearByRequests && nearByRequests.map((request, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: request.location[1],
                longitude: request.location[0],
              }}
              title={`Requests from ${request.name} for ${request.bloodGroup}`}
              image={require('../../assets/requests_marker.png')}
            // description={request.description}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default MapRequestsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: widthScreen,
    backgroundColor: "#fff",
    alignItems: "center",
    position: "relative",
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
