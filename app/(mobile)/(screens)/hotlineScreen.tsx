import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Alert,
  FlatList,
} from "react-native";
import Header from "../../../components/resident/header";
import HotlineScreenStyles from "./styles/hotlineScreenStyles";
import { ChevronRight, Phone } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import axios from "axios";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import AlertWithButton from "../../../components/resident/AlertWithButton";
import LoadingComponent from "../../../components/resident/loading";

interface Hotline{
  id: string;
  buildingId: string;
  phoneNumber: string;
  name: string;
  status: number;
}
interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  BuildingId:string;
}

export default function Hotline() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [data, setData] = useState<Hotline[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  useEffect(() => {
    const fetchItems = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/hotline/get-all?buildingId=${user.BuildingId}`,{
                timeout:10000
            });
            if(response.data.statusCode==200){

            setData(response.data.data);
            }else{
              setShowError(true);
              setError(t("System error please try again later")+".");
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
              setShowError(true);
                setError(t("System error please try again later")+".");
            }
            setShowError(true);
            setError(t("System error please try again later")+".");
        } finally {
            setIsLoading(false);
        }
    };
        fetchItems();
}, []);

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
  const handleCallPress = (phoneNumber: string) => {
    // Check if the device supports phone calls
    Linking.canOpenURL(`tel:${phoneNumber}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Phone call not supported",
            "Your device does not support phone calls.",
          );
        } else {
          // Open the phone dialer with the provided phone number
          Linking.openURL(`tel:${phoneNumber}`);
        }
      })
      .catch((error) => {
        console.error("Error opening phone call:", error);
      });
  };

  return (
    <>
      <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
        <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Contact")} />
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ flex:1 }}>
          <FlatList
          style={{paddingHorizontal:26}}
          data={data}
          renderItem={({ item }:{item:Hotline}) => (
            <TouchableOpacity onPress={toggleExpand}>
            <View style={HotlineScreenStyles.hotlineBox}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text>{item?.name}</Text>
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
                      {t("Contact phone number")}
                    </Text>
                    <Text>{item?.phoneNumber}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCallPress(item?.phoneNumber)}
                  >
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
          )}
          keyExtractor={(item) => item.id}
          >
          
          </FlatList>
        
        </View>
      </SafeAreaView>
    </>
  );
}
