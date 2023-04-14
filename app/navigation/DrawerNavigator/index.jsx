import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../components/CustomDrawer';
import Home from '../../screens/Home';
import PostRequest from '../../screens/PostRequest';
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerHeader from '../../components/CustomDrawerHeader';
import SavedRequests from '../../screens/SavedRequests';
import NearByRequests from '../../screens/NearByRequests';
import MapRequestsView from '../../screens/MapRequestsView';
import ChatBot from '../../screens/ChatBot';

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
          header: (props) => <CustomDrawerHeader {...props} title={'Home'} />,
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={25} color={color} />
          ),
        }}
        component={Home} />

      <Drawer.Screen name="MapRequestsView"
        options={{
          header: (props) => <CustomDrawerHeader {...props} title={'Map View'} />,
          drawerLabel: "Map View",
          drawerIcon: ({ color }) => (
            <Ionicons name="map" size={25} color={color} />
          ),
        }}
        component={MapRequestsView} />

      <Drawer.Screen name="SavedRequest"
        options={{
          header: (props) => <CustomDrawerHeader {...props} title={'Saved Requests'} />,
          drawerLabel: "Saved Requests",
          drawerIcon: ({ color }) => (
            <Ionicons name="bookmark" size={25} color={color} />
          ),
        }}
        component={SavedRequests} />

      <Drawer.Screen name="NearByRequest"
        options={{
          header: (props) => <CustomDrawerHeader {...props} title={'Near By Request'} />,
          drawerLabel: "Near By Request",
          drawerIcon: ({ color }) => (
            <Ionicons name="location" size={25} color={color} />
          ),
        }}
        component={NearByRequests} />

      <Drawer.Screen name="PostRequest"
        options={{
          header: (props) => <CustomDrawerHeader {...props} title={'Post Request'} />,
          drawerLabel: "Post Request",
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={25} color={color} />
          ),
        }}
        component={PostRequest} />
      <Drawer.Screen name="ChatBot"
        options={{
          header: (props) => <CustomDrawerHeader {...props} title={'Chat Bot'} />,
          drawerLabel: "Chat Bot",
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbubbles-sharp" size={25} color={color} />
          ),
        }}
        component={ChatBot} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator
