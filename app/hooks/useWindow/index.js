import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const useWindow = () => {
  const [window, setWindow] = useState(Dimensions.get("window"));
  const [windowHeight, setWindowHeight] = useState(window.height ? window.height : 0);
  const [windowWidth, setWindowWidth] = useState(window.width ? window.width : 0);
  useEffect(() => {
    setWindow(Dimensions.get("window"));
    setWindowHeight(window.height ? window.height : 0);
    setWindowWidth(window.width ? window.width : 0);
  }, []);
  return {window, windowHeight, windowWidth};
};

export default useWindow;
