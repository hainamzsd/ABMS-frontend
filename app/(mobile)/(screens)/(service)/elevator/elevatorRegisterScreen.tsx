import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import LoadingComponent from "../../../../../components/resident/loading";
import Header from "../../../../../components/resident/header";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Calendar, Info } from "lucide-react-native";
import Label from "../../../../../components/resident/lable";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import SHADOW from "../../../../../constants/shadow";
import { useLanguage } from "../../../context/LanguageContext";
const ElevatorRegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showEndDate, setShowEndDate] = useState(false);
  const currentDate = new Date();
  const maxDate = new Date(currentDate.getTime() + 14);
  maxDate.setDate(maxDate.getDate() + 14);
  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setShowStartDate(false);
  };
  const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setEndDate(currentDate);
    setShowEndDate(false);
  };

  const isButtonDisabled = !startDate || !endDate;
  return (
    <>
      <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Elevator request")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={{ marginHorizontal: 26, paddingVertical: 20 }}>
            <View
              style={[
                { backgroundColor: theme.sub, borderColor: theme.primary },
                styles.headerBox,
              ]}
            >
              <Info color={"black"} style={{ marginRight: 5 }}></Info>
              <Text>{t("Register using elevator for personal purpose")}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Start date")} required></Label>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowStartDate(!showStartDate)}
              >
                <TextInput
                  placeholder={t("Choose date")}
                  editable={false}
                  value={startDate.toLocaleDateString()}
                  style={styles.textInput}
                />
                <Calendar color={"black"}></Calendar>
              </Pressable>
              {showStartDate && (
                <RNDateTimePicker
                  mode="date"
                  testID="datePicker"
                  themeVariant="light"
                  value={startDate}
                  minimumDate={currentDate}
                  maximumDate={maxDate}
                  locale={currentLanguage}
                  display="default"
                  onChange={onChangeStartDate}
                />
              )}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("End date")} required></Label>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowEndDate(!showEndDate)}
              >
                <TextInput
                  placeholder={t("Choose date")}
                  editable={false}
                  value={endDate.toLocaleDateString()}
                  style={styles.textInput}
                />
                <Calendar color={"black"}></Calendar>
              </Pressable>
              {showEndDate && (
                <RNDateTimePicker
                  mode="date"
                  testID="datePicker"
                  themeVariant="light"
                  value={endDate}
                  minimumDate={startDate}
                  maximumDate={maxDate}
                  locale={currentLanguage}
                  display="default"
                  onChange={onChangeEndDate}
                />
              )}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Note")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  multiline
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput, { height: 100 }]}
                  numberOfLines={4}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable
                disabled={isButtonDisabled}
                style={[
                  {
                    backgroundColor: theme.primary,
                    opacity: isButtonDisabled ? 0.7 : 1,
                  },
                  styles.button,
                ]}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Tiếp tục
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 20,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
    ...SHADOW,
  },
  textInput: {
    flex: 1,
    padding: 15,
  },
  button: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ElevatorRegisterScreen;
