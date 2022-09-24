import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { heightScreen, widthScreen } from "../../../utils/layout";
import { Box, Text } from "native-base";
import Bg1 from "../../../assets/svg/walkthrough/walkthrough1.svg";
import Bg2 from "../../../assets/svg/walkthrough/walkthrough2.svg";
import Bg3 from "../../../assets/svg/walkthrough/walkthrough3.svg";
import Bg4 from "../../../assets/svg/walkthrough/walkthrough4.svg";


const WalkthroughScreen = memo((props) => {
  const imageComponent = () => {
    switch (props.id) {
      case 1:
        return <Bg1 />
      case 2:
        return <Bg2 />
      case 3:
        return <Bg3 />
      case 4:
        return <Bg4 />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <Box
        h="400"
        w="400"
        bg="#DE2A26"
        rounded="full"
        position="absolute"
        top="-120"
        right="-120"
      ></Box>
      {imageComponent()}
      <Text fontFamily='body' fontWeight="600" mt='6' fontSize='3xl'>{props.title}</Text>
      <Text fontFamily='body' color='#7A7A7A' mt='4' fontWeight="400" fontSize='md' textAlign='center'>{props.intro}</Text>
    </View>
  );
});

export default WalkthroughScreen;

const styles = StyleSheet.create({
  container: {
    width: widthScreen,
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imgBackground: {
    position: "absolute",
    bottom: 0,
    width: widthScreen,
    height: heightScreen,
    zIndex: -20,
    resizeMode: "stretch",
  },
});
