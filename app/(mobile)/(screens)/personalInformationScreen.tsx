import { View, Text, SafeAreaView, TextInput, StyleSheet, Pressable, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../components/resident/header";
import SHADOW from "../../../constants/shadow";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Calendar, Info } from "lucide-react-native";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
import Label from "../../../components/resident/lable";
import { useLanguage } from "../context/LanguageContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import AlertWithButton from "../../../components/resident/AlertWithButton";
import LoadingComponent from "../../../components/resident/loading";
import moment from "moment";
import { err } from "react-native-svg";
import { router } from "expo-router";
interface user{
  FullName:string;
  PhoneNumber:string;
  Email:string;
  Id:string;
  BuildingId:string;
  Role:string;
}
interface Room{
  roomNumber:string;
  id:string;
  buildingName: string;
  buildingAddress: string;
}

interface Resident{
  id: string;
  roomId: string;
  fullName: string;
  dateOfBirth: Date;
  isHouseholder: boolean;
  gender: boolean;
  phone: string;
  status: 1;
}

const validationSchema = yup.object().shape({
  fullName: yup.string().required("This field is required").min(5,"Full name must be at least 5 characters").max(30),
});



const personalInformationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  const [owner, setOwner] = useState<Resident>();
  const [gender, setGender] = useState<boolean>();
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Date>(new Date());
  const [showDob, setShowDob] = useState(false);
  const currentDate = new Date();
  const { currentLanguage } = useLanguage();
  const onChangeDob = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dob;
    setDob(currentDate);
    setShowDob(false);
  };
  const genderList = [
    { label: t("Male"), value: true },
    { label: t("Female"), value: false },
]

const [error, setError] = useState(false);
const [errorText, setErrorText] = useState("");
const [room, setRoom] = useState<Room[]>([]);
useEffect(() => {
    const fetchData = async () => {
    setErrorText("");
      try {
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
      }
    };

    fetchData();
  }, [session]);
  
const [loading,setLoading] = useState(false);useEffect(() => {
  const fetchItems = async () => {
    setErrorText("");
    // Check if the room data is available and has at least one entry
    if (room && room.length > 0 && room[0].id) {
      setLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/owner-member/${room[0].id}`, {
          timeout: 10000
        });
        if (response.data.statusCode == 200) {
          setOwner(response.data.data);
          if (response.data.data) {
            const ownerData:Resident = response.data.data;
            const parsedDate = moment(ownerData.dateOfBirth, "MM/DD/YYYY").toDate();
            setGender(ownerData.gender);
            setDob(parsedDate);
            setFullName(ownerData.fullName);
          }
        } else {
          setError(true);
          setErrorText(t("Failed to return requests") + ".");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(true);
          setErrorText(t("System error please try again later") + ".");
          return;
        }
        console.error('Error fetching reservations:', error);
        setError(true);
        setErrorText(t('Failed to return requests') + ".");
      } finally {
        setLoading(false);
      }
    }
  };

  fetchItems();
}, [session, room]);
const [errors, setErrors] = useState<any>({});
const [success, setSuccess]= useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body=   {
        roomId: room[0]?.id,
        fullName: fullName,
        dob: moment.utc(dob).format("YYYY-MM-DD"),
        gender: gender,
        phone: user.PhoneNumber,
        isHouseHolder: true
      }
      console.log(body);
      await validationSchema.validate({ fullName }, { abortEarly: false });
      const response = await axios.put(
        `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room-member/update/${owner?.id}`,body,
        {
          timeout: 10000,
          headers: {
            'Authorization': `Bearer ${session}`
          }
        })
        console.log(response);
        // const updateAccount = await axios.put(
        //   `https://abmscapstone2024.azurewebsites.net/api/v1/account/update/${user.Id}`,
        //   {
        //     building_id: user.BuildingId,
        //     phone: user.PhoneNumber,
        //     email: user.Email,
        //     user_name: "",
        //     role: Number(user.Role),
        //     full_name: fullName,
        //     avatar: ""
        //   },
        //   {
        //     timeout: 10000,
        //     headers: {
        //       'Authorization': `Bearer ${session}`
        //     }
        //   })
        //   console.log(updateAccount);
        if(response.data.statusCode==200){
          setSuccess(true);
        }else{
          setError(true);
          setErrorText(t("System error please try again later"));
        }
    } catch (error: any) {
      console.error(error);
      const validationErrors: any = {};
      error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      if(axios.isCancel(error)){
        setError(true);
        setErrorText(t("System error please try again later")); 
      }
    }finally{setLoading(false)}

}
  
  return (
    <>
     <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
      <AlertWithButton content={t("Update house owner information successfully")} title={t("Success")} 
    visible={success} onClose={() => setSuccess(false)}></AlertWithButton>
    <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Update Information")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: 26, flex:1 }}>
        <View
              style={[
                { backgroundColor: theme.sub, borderColor: theme.primary },
                styles.headerBox,
              ]}
            >
              <Info color={"black"} style={{ marginRight: 5 }}></Info>
              <Text>{t("Updated information will be displayed in the profile")}</Text>
            </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ marginBottom: 10 }}>{t("Fullname")}</Text>
            <TextInput
              placeholder={t("Type")+"..."}
              placeholderTextColor={"#9C9C9C"}
              value={fullName}
              onChangeText={setFullName}
              style={[
                SHADOW,
                { padding: 15, backgroundColor: "white", borderRadius: 10 },
              ]}
            ></TextInput>
            {errors.fullName && <Text style={styles.errorText}>{t(errors.fullName)}</Text>}
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ marginBottom: 10 }}>{t("Gender")}</Text>
            <Dropdown
              style={styles.comboBox}
              placeholderStyle={{ fontSize: 14 }}
              placeholder={t("Choose gender")}
              itemContainerStyle={{ borderRadius: 10 }}
              data={genderList}
              value={gender}
              search={false}
              labelField="label"
              valueField="value"
              onChange={(item: any) => {
                setGender(item.value);
              }}
            ></Dropdown>
          </View>
          <View style={{ marginTop: 20 }}>
            <Label text={t("Date of birth")} required></Label>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowDob(!showDob)}
              >
                <TextInput
                  placeholder={t("Choose date")}
                  editable={false}
                  value={dob.toLocaleDateString()}
                  style={styles.textInput}
                />
                <Calendar color={"black"}></Calendar>
              </Pressable>
              {showDob && (
                <RNDateTimePicker
                  mode="date"
                  testID="datePicker"
                  themeVariant="light"
                  value={dob}
                  // minimumDate={currentDate}
                  maximumDate={currentDate}
                  locale={currentLanguage}
                  display="default"
                  onChange={onChangeDob}
                />
              )}
            </View>
            <TouchableOpacity
            onPress={handleSubmit}
            style={{
              padding:20,
              borderRadius:20,
              backgroundColor:theme.primary,
              marginTop:20,
              justifyContent:'center',
              alignItems:'center'
            }}
            ><Text style={{fontWeight:'bold', fontSize:16}}> {t("Update information")}</Text></TouchableOpacity>
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
  comboBox: {
    backgroundColor: 'white',
    ...SHADOW,
    borderRadius: 10,
    padding: 10,
    marginTop: 5
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
  errorText: {
    color: 'red',
    marginTop: 5
},
  textInput: {
    flex: 1,
    padding: 15,
  },
})

export default personalInformationScreen;
