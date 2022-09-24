import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../../screens/Welcome';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
    );
}

export default StackNavigator;