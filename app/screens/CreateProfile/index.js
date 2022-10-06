import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Button, Center, Select, FormControl, HStack, Icon, IconButton, Image, Input, Stack, Text, VStack } from 'native-base';
import { AuthContext } from '../../context/AuthContext';
import { Fontisto, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import bloodLineApi from '../../api';
import { DataContext } from '../../context/DataContext';
import { useNavigation } from '@react-navigation/native';


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


const CreateProfile = () => {

  const { user, accessToken, getUser } = useContext(AuthContext)
  const { storeProfile } = useContext(DataContext)
  const navigation = useNavigation();

  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [pin, setPin] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [phoneErr, setPhoneErr] = useState("")
  const [cityErr, setCityErr] = useState("")
  const [pinErr, setPinErr] = useState("")
  const [bloodGroupErr, setBloodGroupErr] = useState("")

  useEffect(() => {
    if (phone.trim() !== "") {
      setPhoneErr("Phone number is required")
    } else {
      setPhoneErr("")
    }

    if (phone.trim().length < 10 || phone.trim().length > 10) {
      setPhoneErr("Phone number is invalid")
    } else {
      setPhoneErr("")
    }

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

    if (pin.trim().length < 5 && pin !== "") {
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

  }, [phone, city, pin, bloodGroup])

  const onSubmit = () => {
    const headers = { headers: { "Authorization": accessToken } }
    if (phoneErr === '' && cityErr === '' && pinErr === '' && bloodGroupErr === "") {
      bloodLineApi.post("/profile", {
        phone: phone, city: city, pin: pin !== "" ? pin : null, bloodGroup: bloodGroup,
        headers, withCredentials: true
      }).then((res) => {
        storeProfile(res.data);
        setSubmitted(false)
        getUser(accessToken);
        navigation.navigate("HomeNavigation")
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.imageUrl }} alt={user.name}
        size='xl'
        rounded='full' borderColor='primary.100'
        borderWidth='3'
      />
      <Text fontFamily='body' fontWeight="600" mt='6' mb='6' fontSize='2xl'
        textAlign='center'>{`Hii there! ${user.name.split(" ")[0]}`}</Text>

      <FormControl mt='4'
        isInvalid={phoneErr !== "" && submitted}
      >
        <FormControl.Label>Basic details:</FormControl.Label>
        <Input
          value={phone}
          onChangeText={(text) => setPhone(text)}
          InputLeftElement={
            <Icon as={<MaterialIcons name="phone" />}
              size={5} ml="2" color="muted.600" />}
          variant="underlined" p={2} placeholder="Enter your phone number"
          keyboardType='number-pad'
        />
        <FormControl.ErrorMessage>{phoneErr}</FormControl.ErrorMessage>
      </FormControl>

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

      <Center>
        <Button
          mt='8'
          size='lg'
          pl='6'
          pr='6'
          fontSize='xl'
          rounded='2xl'
          onPress={() => {
            setSubmitted(true)
            onSubmit()
          }}
        >
          Continue
        </Button>
      </Center>

    </View>
  );
}

export default CreateProfile

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
