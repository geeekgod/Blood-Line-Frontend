import { useNavigation } from '@react-navigation/native';
import { Button, Image, Text } from 'native-base'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import useWindow from '../../hooks/useWindow';

const Welcome = () => {
    const navigation = useNavigation()
    const { navigate } = navigation
    const { windowHeight, windowWidth } = useWindow()
    return (
        <View style={styles.flex}>
            <Image source={require('../../assets/logo.png')}
                alt="BloodLine"
                width={(windowWidth * 69) / 100}
                height={(windowHeight * 47) / 100}
            />
            <Text fontFamily='body' fontWeight="600" fontSize='2xl'>BLOODLINE</Text>
            <Text fontFamily='body' fontWeight="500" color='#7A7A7A' mt='3' fontSize='md'>Save Lives by Donating Blood</Text>
            <Button
                fontFamily='body'
                marginTop='1/4'
                bg='#DE2A26' rounded='2xl'
                paddingTop='3' paddingBottom='3'
                paddingLeft='5' paddingRight='5'
                onPress={() => navigate('Walkthrough')}
            >Get Started</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFF'
    }
})


export default Welcome