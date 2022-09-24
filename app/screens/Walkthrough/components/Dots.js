import React, { memo } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { heightScreen, widthScreen } from "../../../utils/layout";

const Dots = memo((props) => {
  const { scrollX } = props;
  const slide = scrollX.interpolate({
    inputRange: [0, widthScreen, widthScreen * 3, widthScreen * 3],
    outputRange: [4, 20, 50, 66],
    extrapolate: "clamp",
  });
  const margin1 = scrollX.interpolate({
    inputRange: [0, widthScreen, widthScreen * 2, widthScreen * 3],
    outputRange: [12, 4, 4, 4],
    extrapolate: "clamp",
  });
  const margin2 = scrollX.interpolate({
    inputRange: [0, widthScreen, widthScreen * 2, widthScreen * 3],
    outputRange: [4, 12, 4, 4],
    extrapolate: "clamp",
  });
  const margin3 = scrollX.interpolate({
    inputRange: [0, widthScreen, widthScreen * 2, widthScreen * 3],
    outputRange: [4, 4, 12, 4],
    extrapolate: "clamp",
  });
  const margin4 = scrollX.interpolate({
    inputRange: [0, widthScreen, widthScreen * 2, widthScreen * 3],
    outputRange: [4, 4, 4, 12],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Animated.View
          style={[
            styles.dotStyle,
            { marginRight: margin1, marginLeft: margin1 },
          ]}
        />
        <Animated.View
          style={[
            styles.dotStyle,
            { marginLeft: margin2, marginRight: margin2 },
          ]}
        />
        <Animated.View
          style={[
            styles.dotStyle,
            { marginLeft: margin3, marginRight: margin3 },
          ]}
        />
        <Animated.View
          style={[
            styles.dotStyle,
            { marginLeft: margin4, marginRight: margin4 },
          ]}
        />
        <Animated.View style={[styles.dotCenter, { left: slide }]} />
      </View>
    </View>
  );
});
export default Dots;

const styles = StyleSheet.create({
  dotStyle: {
    width: 10,
    height: 10,
    padding: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#C1C1C1",
    borderRadius: 50,
  },
  dotCenter: {
    position: "absolute",
    width: 24,
    height: 10,
    padding: 3,
    borderWidth: 2,
    borderColor: "#C1C1C1",
    backgroundColor: "#C1C1C1",
    marginRight: 8,
    borderRadius: 10,
    alignContent: "center",
  },
  container: {
    width: widthScreen,
    position: "absolute",
    top: heightScreen / 2 + 280,
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
});
