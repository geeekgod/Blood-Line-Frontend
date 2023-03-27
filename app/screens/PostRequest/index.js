import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Button, Select, FormControl, HStack, Icon, IconButton, Input, Stack, Text, VStack, Center, useTheme, Pressable } from 'native-base';
import { Fontisto, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import * as Location from 'expo-location';
import bloodLineApi from '../../api';
import { DataContext } from '../../context/DataContext';
import SearchBar from 'react-native-dynamic-search-bar';
import axios from 'axios';

const bloodGroups = [
  {
    name: "Type O Positive",
    value: "O+ve"
  },
  {
    name: "Type O Negative",
    value: "O-ve"
  },
  {
    name: "Type A Positive",
    value: "A+ve"
  },
  {
    name: "Type A Negative",
    value: "A-ve"
  },
  {
    name: "Type B Positive",
    value: "B+ve"
  },
  {
    name: "Type B Negative",
    value: "B-ve"
  },
  {
    name: "Type AB Positive",
    value: "AB+ve"
  },
  {
    name: "Type AB Negative",
    value: "AB-ve"
  },
]


const PostRequest = ({ navigation }) => {

  const theme = useTheme()
  const colorScheme = useColorScheme()

  const { accessToken, getUser } = useContext(AuthContext)
  const { getRequest, config } = useContext(DataContext)

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [postUsing, setPostUsing] = useState("automatic")
  const [searchValue, setSearchValue] = useState("");
  const [searchedLocation, setSearchedLocation] = useState([])
  const [completedSearch, setCompletedSearch] = useState(true)

  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [pin, setPin] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [cityErr, setCityErr] = useState("")
  const [addressErr, setAddressErr] = useState("")
  const [pinErr, setPinErr] = useState("")
  const [bloodGroupErr, setBloodGroupErr] = useState("")

  useEffect(() => {
    (async () => {

      if (postUsing === "automatic")
        return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status && status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location)
        setLocation(location);
    })();
  }, [postUsing]);

  const getLocation = async () => {

    if (postUsing === "automatic")
      return;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status && status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location)
      setLocation(location);
  }


  useEffect(() => {

    if (city.trim() !== "") {
      setCityErr("City name is required")
    } else {
      setCityErr("")
    }

    if (city.trim().length < 3) {
      setCityErr("City name is too short")
    }
    else {
      setCityErr("")
    }

    if (address.trim() !== "") {
      setAddressErr("Address is required")
    } else {
      setAddressErr("")
    }

    if (address.trim() < 8) {
      setAddressErr("Address is too short")
    }
    else {
      setAddressErr("")
    }

    if (pin.trim() !== "") {
      setPinErr("Pin code is required")
    }
    else {
      setPinErr("")
    }

    if (pin.trim().length < 5) {
      setPinErr("Pin code is invalid")
    }
    else {
      setPinErr("")
    }

    if (!bloodGroup) {
      setBloodGroupErr("Blood Group is required")
    }
    else {
      setBloodGroupErr("")
    }

    if (submitted) {
      setSubmitted(false)
    }

  }, [city, pin, bloodGroup, address])

  const reset = () => {
    setAddress("");
    setBloodGroup("");
    setCity("");
    setPin("")
    setLocation(null)
  }

  const onSubmit = () => {
    const headers = { headers: { "Authorization": accessToken } }
    if (cityErr === '' && pinErr === '' && addressErr === "" && bloodGroupErr === "" && location) {
      const data = {
        city: city,
        pin: pin,
        bloodGroup: bloodGroup,
        address: address,
        long: location.coords.longitude,
        lat: location.coords.latitude
      }

      bloodLineApi.post("/request", {
        ...data,
        headers, withCredentials: true
      }).then((res) => {
        if (res.data.success) {
          reset();
          getUser(accessToken);
          getRequest(accessToken)
          setSubmitted(false)
          setSearchValue("")
          setSearchedLocation([])
          navigation.navigate("Home")
        }
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      })
    }
  }

  const fetchLocation = async (text) => {
    setCompletedSearch(false)
    axios.
      get(`https://api.mapbox.com/geocoding/v5/mapbox.places/{${text.trim()}}.json?access_token=${config ? config.map_box_token : ""}&country=IN&limit=5`).
      then((res) => {
        if (res.data && res.data.features)
          setSearchedLocation(res.data.features)
        setCompletedSearch(true)
      })
      .catch((err) => {
        console.log("Error while searching address", err);
        setCompletedSearch(true)
      })
  }

  const searchAddress = async () => {
    await fetchLocation(searchValue)
  }

  const searchBarRender = () => {
    return (
      <SearchBar
        spinnerVisibility={!completedSearch}
        value={searchValue}
        style={{ width: "100%", height: 50, backgroundColor: "white" }}
        textInputStyle={{ backgroundColor: "white", fontFamily: 'Poppins-Light', fontSize: 14 }}
        fontColor={theme.colors.gray['500']}
        spinnerColor={theme.colors.gray['500']}
        placeholderTextColor={theme.colors.gray['500']}
        spinnerSize={20}
        darkMode={colorScheme === "dark" ? true : false}
        placeholder="Enter the address"
        backgroundColor="#ffff"
        onChangeText={async (text) => {
          setSearchValue(text)
          if ((searchValue.trim().length > 5 && searchValue.trim().length) < 150 && completedSearch) {
            await searchAddress()
          }
        }}
        onClearPress={() => {
          setSearchValue("")
          setSearchedLocation([])
        }}
      />
    )
  }


  const updateAddressesBySearch = (item) => {
    let zipCode = item.context.find((item) => item.id.includes("postcode"))
    let city = item.context.find((item) => item.id.includes("place"))
    setLocation({ coords: { longitude: item.center[0], latitude: item.center[1] } })
    setSearchValue(item.place_name)
    setAddress(item.place_name)
    if (zipCode)
      setPin(zipCode.text)
    if (city)
      setCity(city.text)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 20 }} nestedScrollEnabled={true}>
      <Text fontFamily='body' mb='4' fontWeight="600" fontSize='2xl'>Enter the request details</Text>
      <FormControl mt='4'>
        <Stack mt='2'>
          <HStack w='full' justifyContent='flex-start'
            borderBottomWidth='1'
            borderBottomColor='gray.300'
            pl='3'
            pr='3'
            alignItems='center'>
            <Icon as={<MaterialIcons name='edit-location' />}
              size={5} />
            <Select
              selectedValue={postUsing}
              borderWidth='0'
              color='gray.600'
              placeholderTextColor='gray.400'
              minWidth="full" accessibilityLabel="Select your blood group"
              placeholder="Select your blood group" _selectedItem={{
                bg: "gray.200",
                startIcon:
                  <Icon as={<Fontisto name='blood-drop' />}
                    size={5} />,
              }} mt={1}
              onValueChange={itemValue => setPostUsing(itemValue)}
            >
              <Select.Item label="Search the address" value={"automatic"} />
              <Select.Item label="Enter the address" value={"manual"} />
            </Select>
          </HStack>
          <FormControl.ErrorMessage>{bloodGroupErr}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      {
        postUsing === "automatic" &&
        <HStack mt='6' justifyContent='space-between' w='full' alignItems='center'>
          {searchBarRender()}
        </HStack>
      }

      {postUsing === "automatic" &&
        searchedLocation.length > 0 &&
        <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
          {
            searchedLocation.map((item, index) => {
              return (
                <Pressable key={`${index}_${item.text}`}
                  onPress={() => {
                    updateAddressesBySearch(item)
                  }}
                  rounded="8"
                  overflow="hidden"
                  borderWidth="1"
                  borderColor="coolGray.300"
                  shadow="3"
                  bg="coolGray.100"
                  my="2"
                  py="2"
                  px="3"
                >
                  <HStack w='full' justifyContent='space-between' alignItems='center'>
                    <VStack w='3/4' justifyContent='flex-start' alignItems='flex-start'>
                      <Text fontFamily='body' fontSize='sm' color='gray.500'>{item.text}</Text>
                      <Text fontFamily='body' fontSize='xs' color='gray.500'>{item.place_name}</Text>
                    </VStack>
                    <Button onPress={() => {
                      updateAddressesBySearch(item)
                    }} size='sm' colorScheme="red" variant="ghost">Select</Button>
                  </HStack>
                </Pressable>
              )
            })
          }
        </ScrollView>
      }

      <FormControl mt='4' isRequired isInvalid={cityErr !== "" && submitted}>
        <Stack mt='2'>
          <Input
            value={city}
            onChangeText={(text) => setCity(text)}
            InputLeftElement={
              <Icon as={<FontAwesome5 name="building" />}
                size={5} ml="2" color="muted.600" />}
            variant="underlined" p={2} placeholder="Enter your city name" />
          <FormControl.ErrorMessage>{cityErr}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl mt='4' isRequired isInvalid={addressErr !== "" && submitted}>
        <Stack mt='2'>
          <Input
            value={address}
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => setAddress(text)}
            InputLeftElement={
              <Icon as={<Entypo name="address" />}
                size={5} ml="2" color="muted.600" />}
            variant="underlined" p={2} placeholder="Enter your address" />
          <FormControl.ErrorMessage>{addressErr}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl mt='4' isInvalid={pinErr !== "" && submitted}>
        <Stack mt='2'>
          <Input
            value={pin}
            onChangeText={(text) => setPin(text)}
            InputLeftElement={
              <Icon as={<FontAwesome5 name="map-pin" />}
                size={5} ml="2" color="muted.600" />}
            variant="underlined" p={2} placeholder="Enter your pin code"
            keyboardType='numeric'
          />
          <FormControl.ErrorMessage>{pinErr}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl mt='4' isInvalid={bloodGroupErr !== "" && submitted}>
        <Stack mt='2'>
          <HStack w='full' justifyContent='flex-start'
            borderBottomWidth='1'
            borderBottomColor='gray.300'
            pl='3'
            pr='3'
            alignItems='center'>
            <Icon as={<Fontisto name='blood' />}
              size={5} />
            <Select
              selectedValue={bloodGroup}
              borderWidth='0'
              color='gray.600'
              placeholderTextColor='gray.400'
              minWidth="full" accessibilityLabel="Select your blood group"
              placeholder="Select your blood group" _selectedItem={{
                bg: "gray.200",
                startIcon:
                  <Icon as={<Fontisto name='blood-drop' />}
                    size={5} />,
              }} mt={1}
              onValueChange={itemValue => setBloodGroup(itemValue)}
            >
              {bloodGroups && bloodGroups.map((i, k) => (
                <Select.Item label={i.name} value={i.value}
                  key={`${i.name}${i.value}${k}`} />
              ))}
            </Select>
          </HStack>
          <FormControl.ErrorMessage>{bloodGroupErr}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>
      {
        postUsing === "manual" && <HStack mt='6' justifyContent='space-between' w='full' alignItems='center'>
          {location && location.coords ? <Text>Location is loaded</Text> : <Text color='primary.100'>Please get current location</Text>}
          <IconButton
            variant='solid'
            _icon={{
              as: Entypo,
              name: "location"
            }}
            onPress={async () => await getLocation()}
          />
        </HStack>
      }

      <Center>
        <Button
          mt='12'
          size='lg'
          pl='6'
          pr='6'
          fontSize='xl'
          opacity={submitted ? 50 : 100}
          rounded='2xl'
          onPress={() => {
            setSubmitted(true)
            onSubmit()
          }}
        >
          Post Request
        </Button>
      </Center>
    </ScrollView>
  );
}

export default PostRequest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: widthScreen,
    backgroundColor: "#fff",
    paddingHorizontal: heightScreen > 800 ? 32 : 26,
    position: "relative",
  },
});
