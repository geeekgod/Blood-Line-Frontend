import { createStackNavigator } from '@react-navigation/stack';
import Walkthrough from '../../screens/Walkthrough';
import Welcome from '../../screens/Welcome';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Walkthrough" component={Walkthrough} />
        </Stack.Navigator>
    );
}

export default StackNavigator;