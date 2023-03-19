import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Box, Button, HStack, Divider, Icon, IconButton, Text, VStack, FlatList } from 'native-base';
import { DataContext } from '../../context/DataContext';
import * as Linking from 'expo-linking'
import Empty from "../../assets/svg/home/home.svg";
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import bloodLineApi from '../../api';



const Home = () => {


  const { requests, getRequest, getSavedRequest, savedRequests } = useContext(DataContext);
  const { accessToken, getUser } = useContext(AuthContext)

  const [refreshing, setRefreshing] = useState(false);

  const loadRequest = async () => {
    return new Promise(() => {
      getRequest(accessToken)
      getSavedRequest(accessToken)
      setRefreshing(false)
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadRequest()
  }

  const saveUnSave = (id) => {
    const headers = { headers: { "Authorization": accessToken } }
    bloodLineApi.get(`/request/save?requestId=${id}`, {
      headers, withCredentials: true
    }).then((res) => {
      if (res.data.success) {
        getSavedRequest(accessToken)
        getRequest(accessToken)
        getUser(accessToken);
      }
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      }
    })
  }

  return (
    <View style={styles.container}>
      <Box pt='4' pb='4'>
        <Text fontFamily='body' fontWeight='600' fontSize='xl'
          px="4" pt="4">
          List of requests for donations
        </Text>
      </Box>

      {
        requests && requests.length > 0 ?
          <FlatList w='full'
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingVertical: 15 }} data={requests} renderItem={({ item }) => {
              const isSaved = savedRequests.length > 0 && savedRequests.findIndex((e) => e._id === item._id) !== -1
              return (
                <Box border="1" mt='3' mb='3' borderRadius="xl"
                  w='full'
                  position='relative'
                  borderColor='muted.300' borderWidth='1'>
                  <IconButton
                    zIndex='100'
                    variant='unstyled'
                    position='absolute'
                    rounded='full'
                    right='0'
                    _icon={{
                      color: 'primary.100',
                      as: Ionicons,
                      name: isSaved ? "bookmark" : "bookmark-outline",
                      size: "xl",
                    }}
                    onPress={() => saveUnSave(item._id)}
                  />
                  <VStack space="2">
                    <Text fontFamily='body' fontWeight='600' fontSize='lg'
                      px="4" pt="4">
                      {item.name}
                    </Text>
                    <Box px="4">
                      {item.address}
                    </Box>
                    <Box px="4">
                      {item.city}
                    </Box>
                    <Box px="4">
                      {item.pin}
                    </Box>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`mailto:${item.email}`)}
                      style={{ marginVertical: 5 }}
                      activeOpacity={0.6}
                    >
                      <Box px="4" >
                        {`Mail to ${item.email}`}
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`tel:+91${item.phone}`)}
                      style={{ marginVertical: 5 }}
                      activeOpacity={0.6}
                    >
                      <Box px="4" >
                        {`Contact on ${item.phone}`}
                      </Box>
                    </TouchableOpacity>
                    <Box px='4' pb="4">
                      <Button
                        size='md'
                        pl='6'
                        pr='6'
                        fontSize='xl'
                        rounded='xl'
                        onPress={() => {
                          Linking.openURL(`https://maps.google.com/maps?q=${item.location[1]},${item.location[0]}`)
                        }}
                      >
                        Donate
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              )
            }} />
          : (<Box justifyContent='center' h='full' alignItems='center'>
            <Empty />
            <Text fontFamily='body' fontWeight='600' fontSize='xl'
              px="4" pt="4" mt='8' textAlign='center'>
              Woohoo! There's no request for blood
            </Text>
          </Box>)
      }
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
    alignItems: "center",
    position: "relative",
  },
});
