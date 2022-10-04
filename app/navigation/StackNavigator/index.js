import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Login from '../../screens/Login';
import Walkthrough from '../../screens/Walkthrough';
import Welcome from '../../screens/Welcome';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS
            }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Walkthrough" component={Walkthrough} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}

export default StackNavigator;