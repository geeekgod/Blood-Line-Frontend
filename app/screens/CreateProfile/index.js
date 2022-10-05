import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Box, Button, Center, CloseIcon, Select, CheckIcon, FormControl, HStack, Icon, IconButton, Image, Input, Stack, Text, VStack } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { Fontisto, MaterialIcons } from "@expo/vector-icons";



const CreateProfile = () => {

  const { user } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.imageUrl }} alt={user.name}
        size='xl'
        rounded='full' borderColor='primary.100'
        borderWidth='3'
      />
      <Text>Create Profile</Text>

      <FormControl>
        <FormControl.Label>Basic details:</FormControl.Label>
        <Stack space={5}>
          <Stack mt='2'>
            <Input
              InputLeftElement={
                <Icon as={<MaterialIcons name="phone" />}
                  size={5} ml="2" color="muted.600" />}
              variant="underlined" p={2} placeholder="Enter your phone number" />
          </Stack>
          <Stack mt='2'>
            <Input
              InputLeftElement={
                <Icon as={<MaterialIcons name="phone" />}
                  size={5} ml="2" color="muted.600" />}
              variant="underlined" p={2} placeholder="Enter your city name" />
          </Stack>
          <Stack mt='2'>
            <Input
              InputLeftElement={
                <Icon as={<MaterialIcons name="location" />}
                  size={5} ml="2" color="muted.600" />}
              variant="underlined" p={2} placeholder="Enter your pin code" />
          </Stack>
          <Stack mt='2'>
            <Select
              // selectedValue={service} 
              borderWidth='0'
              borderBottomWidth='1'
              minWidth="200" accessibilityLabel="Choose Service"
              placeholder="Choose Service" _selectedItem={{
                bg: "teal.600",
                startIcon:
                  <Icon as={<Fontisto name='blood-drop' />}
                    size={5} />,
                endIcon: <CheckIcon size="5" />
              }} mt={1}
            // onValueChange={itemValue => setService(itemValue)}
            >
              <Select.Item label="UX Research" value="ux" />
              <Select.Item label="Web Development" value="web" />
              <Select.Item label="Cross Platform Development" value="cross" />
              <Select.Item label="UI Designing" value="ui" />
              <Select.Item label="Backend Development" value="backend" />
            </Select>
          </Stack>

          <Center>
            <Button
              mt='5'
              size='lg'
              w='1/2'
              fontSize='xl'
              rounded='2xl'
            >
              Continue
            </Button>
          </Center>
        </Stack>
      </FormControl>

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
