import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Box, Button, CloseIcon, HStack, Icon, IconButton, Text, VStack } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';



const Home = () => {

  const { user } = useContext(AuthContext)
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Hello</Text>

    </View>
  );
}

export default Home

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
