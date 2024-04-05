import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, SectionList, Button, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import SHADOW from '../../../../../constants/shadow'
import LoadingComponent from '../../../../../components/resident/loading'
import Header from '../../../../../components/resident/header'
import { ScrollView } from 'react-native'
import { Camera, Info, UserCircle, X } from 'lucide-react-native'
import Label from '../../../../../components/resident/lable'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-native-element-dropdown'
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup'
import { useSession } from '../../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { generateRandomGUID } from '../../../../../utils/guid'
import { firebase } from '../../../../../config';
import axios from 'axios'
import CustomAlert from '../../../../../components/resident/confirmAlert'
import AlertWithButton from '../../../../../components/resident/AlertWithButton'
import moment from 'moment'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
interface ImageInfo {
  uri: string;
  name: string | null | undefined;
  type: "image" | "video" | undefined;
}

interface user {
  FullName: string;
  PhoneNumber: string;
  Id: string;
  Avatar: string;
  BuildingId:string;
}

interface Room {
  roomNumber: string;
  id: string;
  residents:Resident[]
}

interface Fee{
  id: string;
  serviceName: string;
}
interface Resident{
  id:string;
  fullName:string;
}
const parkingCardSchema = yup.object().shape({
  color: yup.string().required("This field is required"),
  brand: yup.string().required("This field is required"), 
  note: yup.string().required("This field is required"), 
});


const parkingCardRegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useSession();
  const user: user = jwtDecode(session as string);
  const [errors, setErrors] = useState<any>({});
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState(t("System error please try again later"));
  const [residentId,setResidentId]= useState("");
  const [color,setColor] = useState("");
  const [brand,setBrand] = useState("");
  const [note,setNote] = useState("");
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([])
  const [licensePlate, setLicensePlate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [vehicleTypeList, setVehicleTypeList] = useState<Fee[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
 
  const [vehicleTypes, setVehicleTypes] = useState("");

  const [isLicensePlateRequired, setIsLicensePlateRequired] = useState(true); 

  useEffect(() => {
    setIsLicensePlateRequired(vehicleTypes !== "Xe đạp điện" && vehicleTypes !== "Xe đạp");
  }, [vehicleTypes]);
    const isButtonDisabled = !color || !brand || !note || selectedImages.length === 0 ||  !vehicleTypes;
  useEffect(() => {
      const fetchData = async () => {
          setErrorText("");
          try {
              setLoading(true);
              const response = await axios.get(
                  `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}`, {
                  timeout: 10000
              }
              );
              const checkVehicle = await axios.get(
                `https://abmscapstone2024.azurewebsites.net/api/v1/CheckVehicleFee/${user.BuildingId}`, {
                timeout: 10000
            }
            );
            const getVehicle = await axios.get(
              `https://abmscapstone2024.azurewebsites.net/api/v1/GetFeesByNames?names=%C3%94%20t%C3%B4&names=Xe%20m%C3%A1y&names=Xe%20%C4%91%E1%BA%A1p&names=Xe%20%C4%91%E1%BA%A1p%20%C4%91i%E1%BB%87n&buildingId=${user.BuildingId}`
            ,{timeout:10000})
              console.log(response.data.statusCode == 200,checkVehicle.data.statusCode == 200
                , getVehicle.data.statusCode == 200 );
              if (response.data.statusCode == 200 && checkVehicle.data.statusCode == 200
                && getVehicle.data.statusCode == 200) {
                  // setRoom(response?.data?.data);
                  // if(room[0]?.residents.length>0){
                  //     setResidents(room[0].residents);
                  // }
                  // else{
                  //   setShowError(true);
                  //   setErrorText(t("Error retrieving resident datas, try again later"));
                  //   return;
                  // }
                  if(!checkVehicle.data.data){
                    Toast.show({
                      type: 'info',
                      text1: 'Lỗi',
                      topOffset:50,
                      text2: 'Chưa có thông tin phí đỗ xe, vui lòng liên hệ quản lý chung cư để được hỗ trợ',
                      
                    });
                    router.back();
                  }
                  setResidents(response?.data?.data[0].residents);
                  setVehicleTypeList(getVehicle.data.data);
              }
              else {
                  setShowError(true);
                  setErrorText(t("System error please try again later"));
                  return;
              }
          } catch (error) {
              if (axios.isCancel(error)) {
                  setShowError(true);
                  setErrorText(t("System error please try again later"));
              }
              console.error('Error fetching data:', error);
              setShowError(true);
              setErrorText(t("System error please try again later"));
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, [session]);
  const pickImages = async () => {
    const options: any = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: true,
      aspect: [16, 9],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        const selectedImages = result.assets?.length > 5
          ? result.assets.slice(0, 5)
          : result.assets;

        // Create an array of objects to store image data
        const imageData = selectedImages.map((file) => {

          return { uri: file.uri, name: file.fileName, type: file.type };
        });

        setSelectedImages(imageData);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const uploadImage = async (images:string[]) => {
    try {
        const randomGuid=generateRandomGUID();
        const folderPath = `parking/${randomGuid}`;
        let uploadPromises = images.map(async (image, index) => {
            const response = await fetch(image);
            const blob = await response.blob();
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}-${index}-${image.split('/').pop()}`; // Ensuring unique filenames
            const fileRef = firebase.storage().ref(`${folderPath}/${fileName}`);
            await fileRef.put(blob);
            return fileRef.getDownloadURL();
        });
  
        const downloadURLs = await Promise.all(uploadPromises);
  
        const imagesRef = firebase.database().ref(`imageFolders/${folderPath}`);
        await imagesRef.set({
            images: downloadURLs
        });
        return `/imageFolders/${folderPath}/images`;
  
    } catch (error) {
        console.error('Error uploading images:', error);
        setShowError(true);
        setErrorText("System error please try again later.");
    }
  };
  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages]; // Create a copy to avoid mutation
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
  };

  const [disableBtn, setDisableBtn] = useState(false);
  const handleSubmit = async () => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 12));
      try {
          setDisableBtn(true);
          setShowConfirm(false);
          setLoading(true);
          const url =await uploadImage(selectedImages.map((image) => image.uri));
          await parkingCardSchema.validate({
            color:color,
            brand: brand,
            note: note,
          }, { abortEarly: false });
        const body = {
          resident_id: residentId,
          license_plate: vehicleTypes==="Xe đạp" || vehicleTypes==="Xe đạp điện"
          ?"Xe dap":licensePlate,
          brand: brand,
          color: color,
          type: (function() {
            switch (vehicleTypes) {
              case "Xe đạp":
                return 3;
              case "Ô tô":
                return 2;
              case "Xe đạp điện":
                return 4;
              case "Xe máy":
                return 1;
              default:
                return null; // Or a different default value
            }
          })(),
          image: url,
          expire_date: moment.utc(expirationDate).format("YYYY-MM-DD"),
          note: note
        };
        console.log(body);
        if (url) {
          const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/create', body, {
                  timeout: 10000,
                  headers: {
                      'Authorization': `Bearer ${session}`
                  }
              },
              );
              if (response.data.statusCode == 200) {
                const createPost = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/notification/create-for-receptionist',{
                title: `Cư dân ${user.FullName} đăng ký sử dụng thẻ đỗ xe`,
                buildingId: user.BuildingId,
                content: `/web/Receptionist/services/parkingcard/${response.data.data}`,
            },
            {
              timeout: 10000, 
              headers:{
                  'Authorization': `Bearer ${session}`
              }
            },)
              console.log(createPost);
                  setShowSuccess(true);
                  setColor("");
                  setBrand("");
                  setNote("");
                  setLicensePlate("");
                  setSelectedImages([]);
                  setErrors({});
              }
              else {
                  setShowError(true);
                  setErrorText(t("Failed to create request, try again later") + ".");
                  return;
              }
          }
          else {
              setShowError(true);
              setErrorText(t("Error uploading images"));
              return;
          }
      } catch (error: any) {
          console.error(error);
          const validationErrors: any = {};
          error.inner.forEach((err: any) => {
              validationErrors[err.path] = err.message;
          });
          setErrors(validationErrors);
      } finally {
          setLoading(false);
          setDisableBtn(false);
      }
  };
  return (
    <>
     <CustomAlert
                visible={showConfirm}
                title={t("Confirm")}
                content={t("Do you confirm your request") + "?"}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleSubmit}
                disable={disableBtn}
            />
            <AlertWithButton
                visible={showSuccess}
                title={t("Request successful")}
                content={t("Your request has been created successfuly, please wait for the receptionist to confirm") + "."}
                onClose={() => setShowSuccess(false)}
            ></AlertWithButton>
            <AlertWithButton
                visible={showError}
                title={t("Error")}
                content={t(errorText)}
                onClose={() => setShowError(false)}
            ></AlertWithButton>
      <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Parking card request")}></Header>
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
              <Text>{t("The information will be used to register for parking in the apartment")}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Choose card owner")} required></Label>
              {residents.length>0 &&
                 <Dropdown
                 style={styles.comboBox}
                 placeholderStyle={{ fontSize: 14 }}
                 placeholder={t("Card owner")}
                 itemContainerStyle={{ borderRadius: 10, borderTopWidth: 0.5, borderColor: '#9c9c9c' }}
                 itemTextStyle={{ fontSize: 14 }}
                 renderLeftIcon={() => <UserCircle color={"black"} style={{ marginRight: 5 }}></UserCircle>}
                 data={residents}
                 value={residentId}
                 search={false}
                 labelField="fullName"
                 valueField="id"
                 onChange={(item) => {
                   setResidentId(item.id);
                 }}
               ></Dropdown>}
           
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Vehicle type")} required></Label>
              <Dropdown
                style={styles.comboBox}
                placeholderStyle={{ fontSize: 14 }}
                placeholder={t("Choose vehicle type")}
                itemContainerStyle={{ borderRadius: 10, borderTopWidth: 0.5, borderColor: '#9c9c9c' }}
                itemTextStyle={{ fontSize: 14 }}
                data={vehicleTypeList}
                value={vehicleTypes}
                search={false}
                labelField="serviceName"
                valueField="id"
                onChange={(item) => {
                  setVehicleTypes(item.serviceName);
                  setIsLicensePlateRequired(item.serviceName !== "Xe đạp điện" && item.serviceName !== "Xe đạp"); 
                }}
              ></Dropdown>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Color")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={color}
                  onChangeText={setColor}
                />
              </View>
              {errors.color && <Text style={styles.errorText}>{t(errors.color)}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Brand")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              {errors.brand && <Text style={styles.errorText}>{t(errors.brand)}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required={isLicensePlateRequired} text={t("License plate")}></Label>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.imageText}>• {t("If vehicle type is bicycle, license plate can leave blank")}</Text>
               </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                />
              </View>
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
                  value={note}
                  onChangeText={setNote}
                />
              </View>
              
              {errors.note && <Text style={styles.errorText}>{t(errors.note)}</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Image")} required></Label>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.imageText}>• {t("Full photo of vehicle registration certificate")}</Text>
                <Text style={styles.imageText}>• {t("Photo of the vehicle with clear colors. For bicycles, the photo needs to have the brand logo")}</Text>
                <Text style={styles.imageText}>• {t("Apartment contract")}</Text>
                <Text style={styles.imageText}>• {t("Identification documents to authenticate the owner")}</Text>
                <Text style={styles.imageText}>• {t("Maximum number of images")}: 20</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Pressable style={styles.chooseImageBox} onPress={pickImages}>
                <View style={{ alignItems: 'center' }}>
                  <Camera color={'black'} size={30}></Camera>
                  <Text>{t("Choose image")}</Text>
                </View>
              </Pressable>
              {selectedImages.length > 0 &&
                <SectionList
                  horizontal
                  sections={[{ data: selectedImages }]}
                  renderItem={({ item, index }) => <View style={styles.imageContainer}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                    <Pressable style={styles.closeButton} onPress={() => removeImage(index)}>
                      <X color="white" />
                    </Pressable>
                  </View>}
                  keyExtractor={(item) => item.uri}
                />}
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable
                disabled={isButtonDisabled}
                onPress={()=>setShowConfirm(true)}
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
  )
}

const styles = StyleSheet.create({
  chooseImageBox: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    marginRight: 5
  },
  errorText:{
    color:'red'
  },
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
  comboBox: {
    backgroundColor: 'white',
    ...SHADOW,
    borderRadius: 10,
    padding: 10,
    marginTop: 5
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 5
  },
  imageText: {
    color: '#9C9C9C',
    margin: 5,
    fontSize: 14
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default parkingCardRegisterScreen