import { ScrollView } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import Header from "../../../../../components/resident/header";
import LoadingComponent from "../../../../../components/resident/loading";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Info, Calendar } from "lucide-react-native";
import Label from "../../../../../components/resident/lable";
import { useLanguage } from "../../../context/LanguageContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import SHADOW from "../../../../../constants/shadow";
import * as yup from 'yup'
import axios from "axios";
import { useSession } from "../../../context/AuthContext";
import CustomAlert from "../../../../../components/resident/confirmAlert";
import AlertWithButton from "../../../../../components/resident/AlertWithButton";
import { jwtDecode } from "jwt-decode";
  
interface Room{
  roomNumber:string;
  id:string;
}


export default function ConstructionRegisterScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {session} = useSession();
  const [loading, setLoading] = useState(false);
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

  //get room information
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
  
  //handle create form
  const [projectName, setProjectName] = useState('');
const [constructionUnitName, setConstructionUnitName] = useState('');
const [phoneContact, setPhoneContact] = useState('');
const [note, setNote] = useState('');
const [errors, setErrors] = useState<any>({}); 
  const validationSchema = yup.object().shape({
    projectName: yup.string().required(t('Project name is required')),
    constructionUnitName: yup.string().required(t('Construction unit name is required')),
    phoneContact: yup.string().required(t('Phone contact is required')).matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, t('Invalid phone format')),      startDate: yup.date().required(t('Start date is required')),
    endDate: yup.date().required(t('End date is required')).when('startDate', {
      is: (startDate:Date) => startDate, // Only apply when startDate exists
      then: (schema) => schema.min(startDate, t('End date must be after start date')),
    }),
    note: yup.string().required(""), // Optional note field
  });
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(t("System error please try again later"));
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfirmVisible, setAlertConfirmVisible] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const handleSubmit = async () => {
    try {
      setDisableBtn(true);
      await validationSchema.validate({
        projectName,
        constructionUnitName,
        phoneContact,
        startDate,
        endDate,
        note, 
      },{ abortEarly: false });
      const body = {
        roomId:room[0].id,
        name: projectName,
        constructionOrganization: constructionUnitName,
        phone: phoneContact,
        startTime: startDate,
        endTime: endDate,
        description: note,
      };
      console.log(body)
      const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/construction/create', body, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      },
      );

      console.log(response);
      if (response.data.statusCode == 200) {
        setAlertConfirmVisible(true);
        setStartDate(new Date());
        setProjectName("");
        setConstructionUnitName("");
        setPhoneContact("");
        setEndDate(new Date());
        setNote("");
        setErrors({});
      }
      else {
        setError(true);
        setErrorText(t("Failed to create request, try again later")+".");
      }
    } catch (error:any) {
      const validationErrors:any = {};
      error.inner.forEach((err:any) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
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
      setLoading(false);
      setAlertVisible(false);
      setDisableBtn(false);
    }
  };
  

  const isButtonDisabled = !startDate || !endDate || !projectName || !constructionUnitName || !phoneContact ;
  return (
    <>
      <CustomAlert
        visible={alertVisible}
        title={t("Confirm")}
        content={t("Do you confirm your request") + "?"}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleSubmit}
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
        title={t("Error")}
        content={t(errorText)}
        onClose={() => setError(false)}
      ></AlertWithButton>
      <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Register construction")}></Header>
      <SafeAreaView
        style={{
          backgroundColor: theme.background,
          flex: 1,
        }}
      >
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={{ marginHorizontal: 26, paddingVertical: 20 }}>
            <View
              style={[
                { backgroundColor: theme.sub, borderColor: theme.primary },
                styles.headerBox,
              ]}
            >
              <Info color={"black"} style={{ marginRight: 5 }}></Info>
              <Text>{t("Fill in construction information")}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Project name")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={projectName}
                  onChangeText={setProjectName}
                />
              </View>
              {errors.projectName && <Text style={styles.errorText}>{errors.projectName}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Name of construction unit")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={constructionUnitName}
                  onChangeText={setConstructionUnitName}
                />
              </View>
              {errors.constructionUnitName && <Text style={styles.errorText}>{errors.constructionUnitName}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Phone contact")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  keyboardType="phone-pad"
                  value={phoneContact}
                  onChangeText={setPhoneContact}
                />
              </View>
              {errors.phoneContact && <Text style={styles.errorText}>{errors.phoneContact}</Text>}
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
              {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
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
              {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Note")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  multiline
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput, { height: 100 }]}
                  numberOfLines={4}
                  value={note}
                  onChangeText={setNote}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable
                disabled={isButtonDisabled}
                onPress={() => setAlertVisible(true)}
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
}

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 20,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  errorText:{
    color:'red',
    marginTop:5
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
