import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import LoadingComponent from "../../../../../components/resident/loading";
import Header from "../../../../../components/resident/header";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Calendar, Info } from "lucide-react-native";
import Label from "../../../../../components/resident/lable";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import SHADOW from "../../../../../constants/shadow";
import { useLanguage } from "../../../context/LanguageContext";
import axios from "axios";
import { combineDateTime } from "../../../../../utils/convertDateTime";
import { useSession } from "../../../context/AuthContext";
import CustomAlert from "../../../../../components/resident/confirmAlert";
import AlertWithButton from "../../../../../components/resident/AlertWithButton";
import * as yup from 'yup';
import { jwtDecode } from "jwt-decode";
import moment from "moment";
interface Room{
  roomNumber:string;
  id:string;
}

const ElevatorRegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useSession();
  const { currentLanguage } = useLanguage();
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showStartTime, setShowStartTime] = useState(false);
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [minTime, setMinTime] = useState<Date>(new Date());
  const [maxTime, setMaxTime] = useState<Date>(new Date());
  const [showEndTime, setShowEndTime] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const currentDate = new Date();
  const maxDate = new Date(currentDate.getTime() + 14);
  maxDate.setDate(maxDate.getDate() + 14);
  minTime.setHours(8, 0, 0, 0);
  maxTime.setHours(17, 0, 0, 0);
  const onChangeStartTime = (event: any, selectedTime: Date | undefined) => {
    const currentDate = selectedTime || startTime;
    setStartTime(currentDate);
    setShowStartTime(false);
  };
  const onChangeEndTime = (event: any, selectedTime: Date | undefined) => {
    const currentDate = selectedTime || endTime;
    setEndTime(currentDate);
    setShowEndTime(false);
  };
  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setShowStartDate(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(t("System error please try again later"));
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfirmVisible, setAlertConfirmVisible] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const user:any = jwtDecode(session as string);
  const [room, setRoom] = useState<Room[]>([]);
  useEffect(() => {
    const fetchData = async () => {
    setErrorText("");
      try {
        setLoading(true);
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}`,{
            timeout:10000
          }
        );
        if(response.data.statusCode==200){
            setRoom(response?.data?.data);
        }
        else{
            setError(true);
            setErrorText(t("System error please try again later"));
        }
      } catch (error) {
        if(axios.isCancel(error)){
            setError(true);
            setErrorText(t("System error please try again later"));
        }
        console.error('Error fetching data:', error);
        setError(true);
        setErrorText(t("System error please try again later"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);
  
  const handleCreateRequest = async () => {
    const sendStartDate = combineDateTime(startDate, startTime);
    const sendEndDate = combineDateTime(startDate, endTime);
    setIsLoading(true);
    setDisableBtn(true);
    try {
      const body = {
        room_id: room[0].id,
        start_time: sendStartDate,
        end_time: sendEndDate,
        description: note
      };
      const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/elevator/create', body, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      },
      );

      console.log(response);
      if(response.data.statusCode==409){
        setError(true);
        setErrorText(t("There has been a request to use the elevator at this time, please choose another time")+".");
      }
      if (response.data.statusCode == 200) {
        const createPost = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/notification/create-for-receptionist',{
          title: `Phòng ${room[0].roomNumber} đăng ký sử dụng thang máy bắt đầu vào lúc ${moment.utc(sendStartDate).format('DD/MM/YYYY HH:mm')}`,
          buildingId: user.BuildingId,
          content: `/web/Receptionist/services/elevator/${response.data.data}`,
      },
      {
          timeout: 10000, 
          headers:{
              'Authorization': `Bearer ${session}`
          }
        },)
        setAlertConfirmVisible(true);
        setStartDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
        setNote("");
      }
      else {
        setError(true);
        setErrorText(t("Failed to create request, try again later")+".");
      }
    } catch (error:any) {
     
      if (axios.isCancel(error)) {
        console.error('Request timed out:', error);
        setError(true);
        setErrorText(t("System error please try again later")+".");
      } else {
        // Handle other errors
        setError(true);
        setErrorText(t("Failed to create request, try again later")+".");
      }
    } finally {
      setIsLoading(false);
      setAlertVisible(false);
      setDisableBtn(false);
    }
  };

  const isButtonDisabled = !startDate || !startTime || !endTime || !note;
  return (
    <>
      <CustomAlert
        visible={alertVisible}
        title={t("Confirm")}
        content={t("Do you confirm your request") + "?"}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleCreateRequest}
        disable={disableBtn}
      />
      <AlertWithButton
        visible={alertConfirmVisible}
        title={t("Request successful")}
        content={t("Your request has been created successfuly, please wait for the receptionist to confirm") + "."}
        onClose={() => setAlertConfirmVisible(false)}
      ></AlertWithButton>
      <AlertWithButton
        visible={error}
        title={t("Request unsuccessful")}
        content={t(errorText)}
        onClose={() => setError(false)}
      ></AlertWithButton>
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
              <Label text={t("Start time")} required></Label>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowStartTime(!showStartTime)}
              >
                <TextInput
                  placeholder={t("Choose time")}
                  editable={false}
                  value={startTime.toLocaleTimeString()}
                  style={styles.textInput}
                />
                <Calendar color={"black"}></Calendar>
              </Pressable>
              {showStartTime && (
                <RNDateTimePicker
                  mode="time"
                  testID="datePicker"
                  themeVariant="light"
                  value={startTime}
                  minimumDate={minTime}
                  maximumDate={maxTime}
                  locale={currentLanguage}
                  display="default"
                  onChange={onChangeStartTime}
                  is24Hour
                />
              )}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("End time")} required></Label>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowEndTime(!showEndTime)}
              >
                <TextInput
                  placeholder={t("Choose time")}
                  editable={false}
                  value={endTime.toLocaleTimeString()}
                  style={styles.textInput}
                />
                <Calendar color={"black"}></Calendar>
              </Pressable>
              {showEndTime && (
                <RNDateTimePicker
                  mode="time"
                  testID="datePicker"
                  themeVariant="light"
                  value={endTime}
                  minimumDate={startTime}
                  maximumDate={maxTime}
                  locale={currentLanguage}
                  display="default"
                  onChange={onChangeEndTime}
                  is24Hour
                />
              )}
               
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Note")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  multiline
                  value={note}
                  onChangeText={setNote}
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput, { height: 100 }]}
                  numberOfLines={4}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable
              onPress={() => setAlertVisible(true)}
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
                  {t("Create request")}
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
  errorText:{
    fontSize:14,
    color:'red'
  }
});

export default ElevatorRegisterScreen;
