import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, View } from 'react-native';
import { heightScreen, widthScreen } from '../../utils/layout';
import { Box, Button, Icon, Text } from 'native-base';
import LoginUnlock from "../../assets/svg/login/LoginUnlock.svg";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '938415613346-3ecn64agj1971r8l0s520kc41d4s0n6p.apps.googleusercontent.com',
        androidClientId: '938415613346-f70dmihvkcjpjo3ljm798e85t5g45s2i.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;

            axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                headers: { Authorization: `Bearer ${authentication?.accessToken}` }
            }).then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Box
                h="400"
                w="400"
                // bg="#DE2A26"
                // rounded="full"
                position="absolute"
                top={heightScreen > 800 ? "-20" : "-40"}
                right={heightScreen > 800 ? "-120" : "-150"}
            >
                <AntDesign name='heart' size={400} color='#DE2A26' />
            </Box>
            <LoginUnlock />
            <Text fontFamily='body' fontWeight="600" mt='6' fontSize='3xl' textAlign='center'>Continue with us</Text>
            <Text fontFamily='body' color='#7A7A7A' mt='3' mb='3' fontWeight="400" fontSize='md' textAlign='center' lineHeight='2xl'>Sign in via</Text>
            <Button
                leftIcon={<Icon name="google" as={AntDesign} color="white" />}
                disabled={!request}
                onPress={() => promptAsync()}
                size='lg'
                fontSize='xl'
                rounded='2xl'
            >
                Login with Google
            </Button>
        </View>
    );
}

export default Login

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
