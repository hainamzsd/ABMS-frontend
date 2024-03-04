import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import SHADOW from "../../constants/shadow";
import { TouchableOpacity } from "react-native";
import { useSession } from "./context/AuthContext";
import { router } from "expo-router";
import { useTheme } from "./context/ThemeContext";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18next";
import { Pressable } from "react-native";
import { Image } from "react-native";
import LoadingComponent from "../../components/resident/loading";
import AlertWithButton from "../../components/resident/AlertWithButton";

const LoginScreen = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState<string|null>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { signIn,session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const onPress = async () => {
    setIsLoading(true); // Set loading state to true before making request
      setErrorText(null);
    try {
      const timeoutId = setTimeout(() => {
        setError(true);
        throw new Error('Request timed out.');
      }, 5000); 
      const token = await Promise.race([
        signIn(phone, password),
        new Promise((resolve, reject) => {
          return clearTimeout(timeoutId);
        }),
      ]);
      if(token.error) {
        setErrorText(t("There is no account in the system, please check your phone number and password"));
      }
      else{
        router.replace('/')
      }
    } catch (e:any) {
      setError(e.message || 'An error occurred. Check your connection and try again.');
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <AlertWithButton title={t("Error")} content={t("System error please try again later")} visible={error} onClose={() => setError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
      <StatusBar barStyle="dark-content" backgroundColor={"red"} />
      <View style={[styles.container]}>
        {/* <Stack.Screen options={{ headerShown: false }}></Stack.Screen> */}
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{t("Login")}</Text>
            <Text style={styles.subHeader}>{t("Start manage your home")}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={t("Phone")}
            placeholderTextColor="#A9A9A9"
            onChangeText={(text: string) => setPhone(text)}
            value={phone}
          />
          <TextInput
            style={styles.input}
            placeholder={t("Password")}
            placeholderTextColor="#A9A9A9"
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
          />
          <View style={{ alignItems: "flex-end" }}>
            <Text>{t("Forgot password")}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onPress}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("Login")}
            </Text>
          </TouchableOpacity>
          {errorText&&
          <View style={{alignItems:'center'}}>
          <Text style={{color:'red', fontWeight:'600'}}>{errorText}</Text></View>}

          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <Pressable
              style={{ paddingRight: 20, alignItems: "center" }}
              onPress={() => changeLanguage("vi")}
            >
              <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                {t("Vietnam")}
              </Text>
              <Image
                style={{
                  height: 30,
                  width: 40,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                source={require("../../assets/images/vietnam.png")}
              />
            </Pressable>
            <Pressable
              style={{ alignItems: "center" }}
              onPress={() => changeLanguage("en")}
            >
              <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                {t("English")}
              </Text>
              <Image
                style={{
                  height: 30,
                  width: 40,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                source={require("../../assets/images/england.png")}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.Box}>
        <Path
          d="M0 0 L0 50 Q25 60 50 50 Q75 40 100 50 L100 0 Z"
          fill={theme.primary}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    zIndex: 1,
  },

  input: {
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  Box: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
  },
  subHeader: {
    fontSize: 16,
  },
  button: {
    ...SHADOW,
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
});

export default LoginScreen;
