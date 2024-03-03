import { useLocalSearchParams, router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { Text } from "react-native";
import Header from "../../../../../components/resident/header";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import SHADOW from "../../../../../constants/shadow";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { setCalendarLocale } from "../../../../../utils/calendarLanguage";
import { useLanguage } from "../../../context/LanguageContext";
import { useState } from "react";

export default function Schedule() {
  const item = useLocalSearchParams();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  setCalendarLocale(currentLanguage);

  const [selectedDate, setSelectedDate] = useState<any | undefined>(undefined);

  const handleDayPress = (day: any) => {
    const selectedDateString = day.dateString;
    setSelectedDate(selectedDateString);
  };

  const data = [
    {
      id: 1,
      name: "06:00 - 08:00",
    },
    {
      id: 2,
      name: "06:00 - 08:00",
    },
  ];
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const toggleSelection = (itemId: number) => {
    if (selectedSlot === itemId) {
      setSelectedSlot(0);
    } else {
      setSelectedSlot(itemId);
    }
  };
  console.log(selectedSlot);
  const isButtonDisabled = selectedSlot === 0 || !selectedDate;
  return (
    <>
      <Header headerTitle={t("Register utility")} />
      <SafeAreaView
        style={{
          backgroundColor: theme.background,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 30, marginHorizontal: 26 }}>
            <View style={styles.schedule}>
              <Calendar
                minDate={formattedCurrentDate}
                onDayPress={(day) => handleDayPress(day)}
                theme={{
                  textDayFontSize: 18,
                  textMonthFontSize: 20,
                  textDayHeaderFontSize: 16,
                }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: theme.primary,
                  },
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 30, marginHorizontal: 26, flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              {t("Choose hour")}
            </Text>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => toggleSelection(item.id)}
                  style={[
                    styles.slot,
                    {
                      backgroundColor:
                        selectedSlot === item.id
                          ? theme.primary
                          : "transparent",
                      borderWidth: selectedSlot !== item.id ? 2 : 0,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 26,
            marginVertical: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            disabled={isButtonDisabled}
            onPress={() =>
              router.push({
                pathname: `/(mobile)/(screens)/(utility)/schedules/checkout/utilityTicket`,
                params: item,
              })
            }
            style={[
              {
                backgroundColor: theme.primary,
                opacity: isButtonDisabled ? 0.7 : 1,
              },
              styles.button,
            ]}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Continue")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  schedule: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    ...SHADOW,
  },
  slot: {
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    marginTop: 10,
    marginRight: 10,
  },
  button: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
