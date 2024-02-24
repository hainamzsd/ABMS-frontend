import React, { useState, useRef } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  UIManager,
  LayoutAnimation,
} from "react-native";
import Header from "../../../components/resident/header";
import HotlineScreenStyles from "./styles/hotlineScreenStyles";
import { ChevronRight, Phone } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function Hotline() {
  const { theme } = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    setExpanded(!expanded);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.parallel([
      Animated.timing(animation, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const boxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <>
      <Header headerTitle="Liên hệ" />
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <TouchableOpacity onPress={toggleExpand}>
            <View style={HotlineScreenStyles.hotlineBox}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text>Bảo vệ tòa nhà</Text>
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <ChevronRight strokeWidth={2} color={"black"} />
                </Animated.View>
              </View>
              <Animated.View style={{ height: boxHeight, overflow: "hidden" }}>
                <View style={HotlineScreenStyles.hotlineDropdown}>
                  <View>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Hotline
                    </Text>
                    <Text>0923124234</Text>
                  </View>
                  <TouchableOpacity>
                    <View style={HotlineScreenStyles.callBox}>
                      <Phone
                        fill={"white"}
                        color={"white"}
                        strokeWidth={0}
                      ></Phone>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          marginLeft: 3,
                        }}
                      >
                        Gọi
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
