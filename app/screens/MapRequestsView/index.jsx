import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { heightScreen, widthScreen } from "../../utils/layout";
import {
  Box,
  Text,
  Button,
  CloseIcon,
  HStack,
  Divider,
  Icon,
  IconButton,
  VStack,
  FlatList,
} from "native-base";
import { DataContext } from "../../context/DataContext";
import * as Linking from "expo-linking";
import { AuthContext } from "../../context/AuthContext";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

const RequestsCallOut = (props) => {
  const { name, address, email, phone, city, pin, bloodGroup, location } = props.data;
  return (
    <Box w='300' h='200' p='2'>
      <Text fontSize="xl">{name}</Text>
      <Text>{email}</Text>
      <Text>{phone}</Text>
      <Text>{bloodGroup}</Text>
      <Text>{address}</Text>
      <Text>{city}</Text>
      <Text>{pin}</Text>
    </Box>
  )
};

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

  const mapRef = useRef(null);

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


  const fetchNearByRequests = () => {
    setTimeout(async () => {
      await getNearByRequests(accessToken);
    }, 1000)
  }

  useEffect(() => {
    if (location && location.coords && location.coords.latitude != locationState.latitude && location.coords.longitude != locationState.longitude) {
      setLocationState({ ...locationState, latitude: location.coords.latitude, longitude: location.coords.longitude });
      fetchNearByRequests();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView.Animated
        region={locationState}
        style={styles.map}
        ref={mapRef}
      >
        {locationState.latitude && locationState.longitude && (
          <Marker coordinate={locationState}
            title={"Your Location"} image={require('../../assets/user_marker.png')}
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
            >
              <Callout onPress={() =>
                Linking.openURL(`https://maps.google.com/maps?q=${request.location[1]},${request.location[0]}`)
              }
                style={{ width: 300, height: 200, borderRadius: 20 }}>
                <RequestsCallOut data={request} />
              </Callout>
            </Marker>
          );
        })}
      </MapView.Animated>
      <IconButton size={"lg"} variant="solid"
        position="absolute"
        bottom={65}
        right={5}
        rounded="full"
        _icon={{
          as: MaterialIcons,
          name: "location-searching"
        }}
        zIndex={10}
        onPress={getLocation}
      // onPress={() => console.log("Pressed")}
      />
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
