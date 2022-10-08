import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";

const CustomDrawer = (props) => {

  const { user, logout } = useContext(AuthContext)

  return (
    <View style={{ flex: 1, backgroundColor: "#244757" }}>
      <DrawerContentScrollView
        {...props}
      >
        <View style={{ padding: 20 }}>
          <View style={{ marginBottom: 10, alignItems: "center" }}>

            <Image
              source={{ uri: user.imageUrl }}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                borderRadius: 50,
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: '#DE2A26'
              }}
            />

          </View>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Medium",
              marginBottom: 5,
              textAlign: "center"
            }}
          >
            {user.name}
          </Text>
        </View>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
        <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => Linking.openURL("https://www.buymeacoffee.com/thisisrishabh")}
            style={{ paddingVertical: 10 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="heart-outline" size={22} color='#fff' />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  marginLeft: 20,
                  color: "#fff"
                }}
              >
                Support Us
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => logout()}
          style={{ paddingVertical: 10 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} color='#fff' />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Light",
                marginLeft: 10,
                color: "#fff"
              }}
            >
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;