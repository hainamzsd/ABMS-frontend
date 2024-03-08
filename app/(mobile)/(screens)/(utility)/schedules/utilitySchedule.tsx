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
import { useEffect, useState } from "react";
import { calculateSlots } from "../../../../../utils/convertSlot";
import axios from "axios";
import LoadingComponent from "../../../../../components/resident/loading";
import AlertWithButton from "../../../../../components/resident/AlertWithButton";

interface Schedule{
  openTime: string;
  closeTime: string;
  numberOfSlot: number;
}

interface Utility{
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  numberOfSlot: string;
  pricePerSlot: string;
  location:string;
}
export default function Schedule() {
  const utility = useLocalSearchParams();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [slots, setSlots] = useState<Array<{ index: number; slot: string }>>([]);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ utilityData, setUtilityData] = useState<Utility>();
  const [utilityPlace, setUtilityPlace] = useState();
  const [selectedSlotString, setSelectedSlotString] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/utility/get/${utility.id}`,{
            timeout:10000
          }
        );
        console.log(response?.data?.data);
        setUtilityData(response.data.data);
      } catch (error) {
        if(axios.isCancel(error)){
          setShowError(true);
          setError(t("System error please try again later"));
          return;
        }
        console.error('Error fetching data:', error);
        setShowError(true);
        setError(t("System error please try again later"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (utilityData) {
      const numSlots = Number(utilityData.numberOfSlot);
      if (isNaN(numSlots)) {
        // Optional: Set an error state or handle invalid data
        console.error('Invalid number of slots.');
      } else {
        const calculatedSlots = calculateSlots(
          utilityData.openTime as string,
          utilityData.closeTime as string,
          numSlots
        );
        const slotsWithIndex = calculatedSlots.map((slot, index) => ({
          index: index + 1, // Start index from 1
          slot,
        }));
        setSlots(slotsWithIndex);
      }
    }
  }, [utilityData]);
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  setCalendarLocale(currentLanguage);

  const [selectedDate, setSelectedDate] = useState<any | undefined>(undefined);
  const handleDayPress = (day: any) => {
    const selectedDateString = day.dateString;
    setSelectedDate(selectedDateString);
  };
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const toggleSelection = (itemId: number,slot:string ) => {
    if (selectedSlot === itemId) {
      setSelectedSlot(0);
    } else {
      setSelectedSlot(itemId);
      setSelectedSlotString(slot);
    }
  };
  const isButtonDisabled = selectedSlot === 0 || !selectedDate;
    const maxDate = new Date(currentDate.getTime() + 14);
    maxDate.setDate(maxDate.getDate() + 14);
    const formattedMaxDate = maxDate.toISOString().split("T")[0];
  return (
    <>
    <AlertWithButton title={t("Error")} content={error} visible={showError}
    onClose={()=>setShowError(false)}></AlertWithButton>
    <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Register utility")} />
      <SafeAreaView
        style={{
          backgroundColor: theme.background,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <ScrollView style={{flex:1}}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 30, marginHorizontal: 26 }}>
            <View style={styles.schedule}>
              <Calendar
                minDate={formattedCurrentDate}
                maxDate={formattedMaxDate}
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
            horizontal
            style={{padding:10}}
              data={slots}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => toggleSelection(item.index,item.slot)}
                  style={[
                    styles.slot,
                    {
                      backgroundColor:
                        selectedSlot === item.index
                          ? theme.primary
                          : "transparent",
                      borderWidth: selectedSlot !== item.index ? 2 : 0,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.slot}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.index.toString()}
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
                params: {
                  date: selectedDate,
                  slot: selectedSlot,
                  slotString: selectedSlotString,
                  // utilityId: item.id,
                  price:utility.price,
                  // utilityName:item.utilityName
                },
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
        </ScrollView>
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
    marginRight:5
  },
  button: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
