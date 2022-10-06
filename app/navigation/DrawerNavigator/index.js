import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../components/CustomDrawer';
import Home from '../../screens/Home';
import PostRequest from '../../screens/PostRequest';
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: "rgba(277,277,277,0.1)",
        drawerActiveTintColor: "#fff",
        drawerItemStyle: {
          paddingVertical: 2,
          paddingHorizontal: 10,
          borderRadius: 40
        },
        drawerContentContainerStyle: {
          backgroundColor: "#244757"
        },
        drawerInactiveTintColor: "#ffff",
        drawerLabelStyle: {
          marginLeft: -15,
          fontFamily: "Poppins-Regular",
          fontSize: 16,
        }
      }}
    >
      <Drawer.Screen name="Home"
        options={{
          // headerShown: false,
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={25} color={color} />
          ),
        }}
        component={Home} />
      <Drawer.Screen name="PostRequest"
        options={{
          // headerShown: false,
          drawerLabel: "Post Request",
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={25} color={color} />
          ),
        }}
        component={PostRequest} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator