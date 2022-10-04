import React, { memo, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import WalkthroughScreen from "./components/WalktroughScreen";
import Dots from "./components/Dots";
import { Box, IconButton, ZStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { widthScreen } from "../../utils/layout";

const data = [
  {
    id: 1,
    title: "Virtual Platform",
    intro: "The Blood Donation Platform on which you can rely on <3",
  },
  {
    id: 2,
    title: "Completely Free",
    intro: "We will never charge you for using this platform.",
  },
  {
    id: 3,
    title: "Find People near you",
    intro: "Look for donors, people who need your help as well near you using our navigation system.",
  },
  {
    id: 4,
    title: "Donate Blood",
    intro: "Because you can!\nGood things come to those who don't wait around!",
  },
];

const Walkthrough = memo(() => {

  const [screenIndex, setScreenIndex] = useState(0)
  const scrollViewRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNextBtn = () => {
    switch (screenIndex) {
      case 0:
        scrollViewRef.current.scrollTo({ x: widthScreen, y: 0, animated: true })
        break;
      case 1:
        scrollViewRef.current.scrollTo({ x: widthScreen * 2, y: 0, animated: true })
        break;
      case 2:
        scrollViewRef.current.scrollTo({ x: widthScreen * 3, y: 0, animated: true })
        break;
      case 3:
        console.log("next page")
        break
      default:
        break;
    }
  }



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false, listener: (e) => {
                  setScreenIndex(Math.ceil(e.nativeEvent.contentOffset.x / widthScreen))
                }
              }
            )
          }
          scrollEventThrottle={1}
        >
          {data.map((item, index) => {
            return (
              <WalkthroughScreen
                id={item.id}
                title={item.title}
                intro={item.intro}
                key={index}
              />
            );
          })}
        </ScrollView>
      </View>
      <Box alignItems='center' w='full' backgroundColor='#fff' paddingBottom='1/6'>
        <Dots scrollX={scrollX} />
        <IconButton
          onPress={() => handleNextBtn()}
          variant='solid'
          _icon={{
            as: MaterialIcons,
            name: "arrow-forward",
            size: '2xl'
          }} rounded='full' />
      </Box>
    </View>
  );
});


export default Walkthrough;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1
  },
  accountAsk: {
    padding: 8,
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});