import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Button, Select, FormControl, HStack, Icon, IconButton, Input, Stack, Text, VStack, Center } from 'native-base';
import { Fontisto, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import * as Location from 'expo-location';
import bloodLineApi from '../../api';
import { DataContext } from '../../context/DataContext';

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

  const { accessToken, getUser } = useContext(AuthContext)
  const { getRequest } = useContext(DataContext)

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setTimeout(() => setLocation(null))
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
          navigation.navigate("Home")
        }
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      })
    }
  }


  return (
    <View style={styles.container}>
      <Text fontFamily='body' mb='4' fontWeight="600" fontSize='2xl'>Enter the request details</Text>
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
      <HStack mt='6' justifyContent='space-between' w='full' alignItems='center'>
        {location && location.coords ? <Text>Location is loaded</Text> : <Text color='primary.100'>Please get current location</Text>}
        <IconButton
          variant='solid'
          _icon={{
            as: Entypo,
            name: "location"
          }}
          onPress={() => getLocation()}
        />
      </HStack>

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
    </View>
  );
}

export default PostRequest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: widthScreen,
    backgroundColor: "#fff",
    paddingHorizontal: heightScreen > 800 ? 32 : 26,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
