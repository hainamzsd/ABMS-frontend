import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../../components/resident/header";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import SHADOW from "../../../constants/shadow";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import Label from "../../../components/resident/lable";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AlertWithButton from "../../../components/resident/AlertWithButton";
import LoadingComponent from "../../../components/resident/loading";
import { Dropdown } from "react-native-element-dropdown";
import {firebase} from '../../../config'
import CustomAlert from "../../../components/resident/confirmAlert";
interface Room{
  roomNumber:string;
  id:string;
}
interface ServiceType{
  id: string;
  name: string;
  status:0;
}

interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
  BuildingId:string;
}
export default function FeedBack() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [service, setService] = useState("");
  const isButtonDisabled = !service || !description || !title ;
  const { session } = useSession();
  const user: user = jwtDecode(session as string);
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState(false);
  const [success,setSuccess]= useState(false);
  const [errorText, setErrorText] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
const [room, setRoom] = useState<Room[]>([]);
useEffect(() => {
    const fetchData = async () => {
    setErrorText("");
      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}&buildingId=${user.BuildingId}`,{
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
  const pickImage = async () => {
    setErrorText("");
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      setError(true);
      setErrorText(t("Error picking image, please choose different picture"));
      console.error("Error picking image:", error);
    }
  };
  const [uploading, setUploading] = useState(false);
  const uploadImage = async (uri:string) => {
    setUploading(true);
    if(image==""){
      return;
    }
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `feedbacks/${user.Id}_${new Date().getTime()}`;
      const ref = firebase.storage().ref().child(fileName);
      const snapshot = await ref.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    }catch(error){
      console.error('Error uploading image:', error);
      setError(true);
      setErrorText(t("System error please try again later") + ".");
    }finally{
      setUploading(false);
    }
};
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType[]>([]);
  useEffect(() => {
    
    const fetchData = async () => {
    setErrorText("");
    setIsLoading(true);
      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/service-type/get-all?buildingId=${user.BuildingId}`,{
            timeout:10000
          }
        );
        if(response.data.statusCode==200){
            setServiceType(response?.data?.data);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);
const [disableBtn, setDisableBtn]=useState(false);
  async function sendFeedback() {
    setDisableBtn(true);
    setShowConfirm(false);
    const date = new Date();
    const uri = await uploadImage(image);
    console.log(uri);
    if(room.length==0){
      setError(true)
      setErrorText(t("System error please try again later"));
      return;
    }
    setErrorText("");
    setIsLoading(true);
    try {
      const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/feedback/create`, {
        room_Id: room[0].id,
        serviceType_Id: service,
        title: title,
        content: description,
        image: uri?uri:"",
        createTime: date.toISOString(),
        status: 1
      },{
        headers: {
          'Authorization': `Bearer ${session}`
      }
      });
      console.log(response)
      if (response.data.statusCode == 200) {
        setTitle("");
        setDescription("");
        setImage("");
        setSuccess(true);
      }
      else {
        setError(true);
        setErrorText(t("System error please try again later")+".");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setError(true);
        setErrorText(t("System error please try again later")+".");
      }
      console.error('Error sending feedback:', error);
      setError(true);
      setErrorText(t("System error please try again later")+".");
    }finally{
      setIsLoading(false);
      setDisableBtn(false);
    }
  }
  return (
    <>
      <AlertWithButton content={t("Thank you for giving feedback")+"!"} 
     title={t("Success")} 
    visible={success} onClose={() => setSuccess(false)}></AlertWithButton>
    <CustomAlert
                visible={showConfirm}
                title={t("Confirm")}
                content={t("Do you want to send this request") + "?"}
                onClose={() => setShowConfirm(false)}
                onConfirm={sendFeedback}
                disable={disableBtn}
            />
      <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
   
    <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Feedback")} headerRight rightPath={'(feedback)/feedbackList'}></Header>
      <ScrollView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30 }}>
            <Label text={t("Service")} required></Label>
            {serviceType.length>0 &&
                 <Dropdown
                 style={styles.comboBox}
                 placeholderStyle={{ fontSize: 14 }}
                 placeholder={t("Choose service")}
                 itemContainerStyle={{ borderRadius: 10, borderTopWidth: 0.5, borderColor: '#9c9c9c' }}
                 itemTextStyle={{ fontSize: 14 }}
                 data={serviceType}
                 value={service}
                 search={false}
                 labelField="name"
                 valueField="id"
                 onChange={(item) => {
                   setService(item.id);
                 }}
               ></Dropdown>}
                <View style={{ marginTop: 20 }}>
              <Label required text={t("Title")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            <View style={{ marginTop: 30 }}>
              <Label text={t("Description")} required></Label>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                placeholder={t("Type") + "..."}
                placeholderTextColor={"#9C9C9C"}
                value={description}
                onChangeText={(text) => setDescription(text)}
              ></TextInput>
            </View>
            <Pressable style={styles.imageContainer} onPress={pickImage}>
              {!image && <Text>{t("Choose image")}</Text>}
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150 }}
                />
              )}
            </Pressable>
            <TouchableOpacity
              disabled={isButtonDisabled}
              onPress={()=>setShowConfirm(true)}
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  opacity: isButtonDisabled ? 0.7 : 1,
                },
              ]}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {t("Send")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  picker: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    ...SHADOW,
  },
  textInput: {
    flex: 1,
    padding: 15,
  },
  input: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    height: 150,
    ...SHADOW,
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
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  comboBox: {
    backgroundColor: 'white',
    ...SHADOW,
    borderRadius: 10,
    padding: 10,
    marginTop: 5
  },
  button: {
    ...SHADOW,
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
});
