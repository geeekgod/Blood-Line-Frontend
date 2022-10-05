import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Button, Center, Select, CheckIcon, FormControl, HStack, Icon, IconButton, Image, Input, Stack, Text, VStack } from 'native-base';
import { AuthContext } from '../../context/AuthContext';
import { Fontisto, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";


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
    name: "Type O Negative",
    value: "AB-ve"
  },
]


const CreateProfile = () => {

  const { user } = useContext(AuthContext)

  const [phone, setPhone] = useState(null)
  const [city, setCity] = useState(null)
  const [pin, setPin] = useState(null)
  const [bloodGroup, setBloodGroup] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const [errors, setErrors] = useState({});

  console.log(errors);
  useEffect(() => {
    if (!phone && typeof (phone) !== 'string') {
      setErrors({
        phone: 'Phone number is required', ...errors,
      })
    } else {
      delete errors['phone']
      setErrors(errors)
    }

    if (typeof (phone) === 'string' && (phone.length < 10 || phone.length > 10)) {
      console.log(1);
      setErrors({
        phone: 'Phone number is invalid',
        ...errors
      })
    } else {
      console.log(2);
      delete errors['phone']
      setErrors(errors)
    }

    if (!city && typeof (city) !== 'string') {
      setErrors({
        city: 'City name is required', ...errors,
      })
    } else {
      delete errors['city']
      setErrors(errors)
    }

    if (typeof (city) === 'string' && (city.length < 3)) {
      setErrors({
        city: 'City name is too short', ...errors,
      })
    }
    else {
      delete errors['city']
      setErrors(errors)
    }

    if (typeof (pin) === 'string' && (pin.length < 5)) {
      setErrors({
        pin: 'Pin code is invalid', ...errors,
      })
    }
    else {
      delete errors['pin']
      setErrors(errors)
    }

    if (!bloodGroup) {
      setErrors({
        ...errors,
        bloodGroup: 'Blood Group is required'
      })
    }
    else {
      delete errors['bloodGroup']
      setErrors(errors)
    }

    if (submitted) {
      setSubmitted(false)
    }

  }, [phone, city, pin, bloodGroup])


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
        isInvalid={'phone' in errors && submitted}
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
        <FormControl.ErrorMessage>Error big error</FormControl.ErrorMessage>
      </FormControl>

      <FormControl mt='4' isRequired isInvalid={'city' in errors && submitted}>
        <Stack mt='2'>
          <Input
            value={city}
            onChangeText={(text) => setCity(text)}
            InputLeftElement={
              <Icon as={<FontAwesome5 name="building" />}
                size={5} ml="2" color="muted.600" />}
            variant="underlined" p={2} placeholder="Enter your city name" />
          <FormControl.ErrorMessage>Error big error</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl mt='4' isInvalid={'pin' in errors && submitted}>
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
          <FormControl.ErrorMessage>Error big error</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl mt='4' isInvalid={'bloodGroup' in errors && submitted}>
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
          <FormControl.ErrorMessage>{errors.bloodGroup}</FormControl.ErrorMessage>
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
          // disabled={true}
          onPress={() => {
            setSubmitted(true)
            console.log(phone, city, pin, bloodGroup)
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
