import { Box, HStack, IconButton, Text } from 'native-base'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerHeader = ({ navigation, title }) => {


  return (
    <Box background='#fff' py='4' px='6'>
      <HStack alignItems='center'>
        <IconButton
          variant='unstyled'
          rounded='full'
          _icon={{
            as: Ionicons,
            name: "menu",
            size: "4xl",
          }}
          onPress={() => navigation.openDrawer()}
        />
        <Text ml='5' fontFamily='body' fontSize='2xl' fontWeight='600'>{title}</Text>
      </HStack>
    </Box>
  )
}

export default CustomDrawerHeader