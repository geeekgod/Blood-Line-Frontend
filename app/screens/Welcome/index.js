import { Image } from 'native-base'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Welcome = () => {
    return (
        <View style={styles.flex}>
            <Image src='../../../assets/logo.png' alt="Alternate Text" size="xl" />
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default Welcome