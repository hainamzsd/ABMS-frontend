import { View, Text, SafeAreaView, Pressable, Button, TextInput, StyleSheet, ScrollView, FlatList, Image, SectionList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../context/ThemeContext'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Calendar, Camera, X } from 'lucide-react-native'
import SHADOW from '../../../../../constants/shadow'

import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import Label from '../../../../../components/resident/lable'
import * as ImagePicker from 'expo-image-picker';
import LoadingComponent from '../../../../../components/resident/loading'
import { useLanguage } from '../../../context/LanguageContext'
import * as yup from 'yup'
import { useSession } from '../../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { firebase } from '../../../../../config';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import CustomAlert from '../../../../../components/resident/confirmAlert'
import AlertWithButton from '../../../../../components/resident/AlertWithButton'
import ProgressBar from '../../../../../components/resident/progressBar'
import { generateRandomGUID } from '../../../../../utils/guid'
import moment from 'moment'
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
}

const databaseURL = "https://abms-47299.firebaseio.com/";
const validationSchema = yup.object({
    fullName: yup.string().required("This field is required").min(10,"Full name must be at least 10 characters").max(30),
    arrivalDate: yup.date().required("This field is required"),
    departureDate: yup.date()
        .required("This field is required")
        .min(yup.ref('arrivalDate'), 'Departure date must be after arrival date'),
    description: yup.string().required('This field is required'),
    phone: yup.string().required('Phone contact is required').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Invalid phone format'), 
    identityNumber: yup.string().required('This field is required').min(9, 'Invalid identity number').max(12, 'Invalid identity number'),
    images: yup.array().min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
});


const visitorRegisterScreen = () => {
    const [loading, setLoading] = useState(false);
    const { session } = useSession();
    const user: user = jwtDecode(session as string);
    const { t } = useTranslation();
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState(t("System error please try again later"));
    const pickImages = async () => {
        const options: any = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 5,
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
            setShowError(true);
            setErrorText(t("Unable to pick images, try again"));
        } finally {
        }
    };

    const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([])
    const removeImage = (index: number) => {
        const newSelectedImages = [...selectedImages]; // Create a copy to avoid mutation
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
    };
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadImage = async (images:string[]) => {
        try {
            const randomGuid=generateRandomGUID();
            const folderPath = `visitors/${randomGuid}`;
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

    const genderList = [
        { label: t("Male"), value: true },
        { label: t("Female"), value: false },
    ]

    const { theme } = useTheme();
    const { currentLanguage } = useLanguage();
    const [fullName, setFullName] = useState("");
    const [identityNumber, setIdentityNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState<string>("");
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(new Date());
    const [showArrivalPicker, setShowArrivalPicker] = useState<boolean>(false);
    const [showDeparturePicker, setShowDeparturePicker] = useState<boolean>(false);
    const [gender, setGender] = useState();

    const [errors, setErrors] = useState<any>({});
   
    const [room, setRoom] = useState<Room[]>([]);
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
                if (response.data.statusCode == 200) {
                    setRoom(response?.data?.data);
                }
                else {
                    setShowError(true);
                    setErrorText(t("System error please try again later"));
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
    const [disableBtn, setDisableBtn] = useState(false);
    const handleSubmit = async () => {
        try {
            setDisableBtn(true);
            setShowConfirm(false);
            setLoading(true);
            const url =await uploadImage(selectedImages.map((image) => image.uri));
            await validationSchema.validate({
                fullName: fullName,
                arrivalDate: arrivalDate,
                departureDate: departureDate,
                gender: gender,
                phone: phone,
                identityNumber: identityNumber,
                images: selectedImages,
                description: description,
            }, { abortEarly: false });
            const body = {
                roomId: room[0].id,
                fullName: fullName,
                arrivalTime: arrivalDate,
                departureTime: departureDate,
                gender: gender,
                phoneNumber: phone,
                identityNumber: identityNumber,
                identityCardImgUrl: url,
                description: description,
            };
            if (url) {
                const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/visitor/create', body, {
                    timeout: 10000,
                    headers: {
                        'Authorization': `Bearer ${session}`
                    }
                },
                );
                if (response.data.statusCode == 200) {
                    const createPost = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/notification/create-for-receptionist',{
                        title: `Phòng ${room[0].roomNumber} đăng ký khách thăm mới `,
                        buildingId: user.BuildingId,
                        content: `http://localhost:8081/web/Receptionist/services/visitor/${response.data.data}`,
                    },
                    {
                        timeout: 10000, 
                        headers:{
                            'Authorization': `Bearer ${session}`
                        }
                      },)
                    setShowSuccess(true);
                    setFullName("");
                    setArrivalDate(new Date());
                    setDepartureDate(new Date());
                    setPhone("");
                    setIdentityNumber("");
                    setDescription("");                    
                    setSelectedImages([]);
                    setErrors({});
                }
                else {
                    setShowError(true);
                    setErrorText(t("Failed to create request, try again later") + ".");
                }
            }
            else {
                setShowError(true);
                setErrorText(t("Error uploading images"));
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

    const onChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || arrivalDate;
        setArrivalDate(currentDate);
        setShowArrivalPicker(false);
    };
    const onChangeDeparture = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || departureDate;
        setDepartureDate(currentDate);
        setShowDeparturePicker(false);
    };
    const showDatepicker = () => {
        setShowArrivalPicker(true);
    };
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getTime() + 14);
    maxDate.setDate(maxDate.getDate() + 14);
    const isButtonDisabled = !gender ||
        selectedImages.length < 1 || !fullName || !phone || !identityNumber;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
            {/* {<ProgressBar progress={uploadProgress} loading={uploadProgress > 0 && uploadProgress < 1} />} */}
            <LoadingComponent loading={loading}></LoadingComponent>
            <Header headerTitle={t("Register visitor")}></Header>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <View style={{ marginHorizontal: 26 }}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Register information")}</Text>
                            <Text>{t("This information is used to register visitor")}</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Label required text={t("Fullname")}></Label>
                            <View style={[styles.inputContainer]}>
                                <TextInput
                                    placeholder={t("Type") + "..."}
                                    placeholderTextColor={'#9C9C9C'}
                                    style={styles.textInput}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                            {errors.fullName && <Text style={styles.errorText}>{t(errors.fullName)}</Text>}
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View>
                                <Label text={t("Arrival date")} required></Label>
                                <Pressable style={styles.inputContainer} onPress={showDatepicker}>
                                    <TextInput
                                        placeholder={t("Choose date")}
                                        editable={false}
                                        value={arrivalDate.toLocaleDateString()}
                                        style={styles.textInput}
                                    />
                                    <Calendar style={styles.icon} color={'black'}></Calendar>
                                </Pressable>
                                {showArrivalPicker && (
                                    <RNDateTimePicker
                                        testID="datePicker"
                                        themeVariant='light'
                                        value={arrivalDate}
                                        minimumDate={currentDate}
                                        maximumDate={maxDate}
                                        locale={currentLanguage}
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                                {errors.arrivalDate && <Text style={styles.errorText}>{t(errors.arrivalDate)}</Text>}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Departure date")} required></Label>
                                <Pressable style={styles.inputContainer} onPress={() => setShowDeparturePicker(true)}>
                                    <TextInput
                                        placeholder={t("Choose date")}
                                        editable={false}
                                        value={departureDate.toLocaleDateString()}
                                        style={styles.textInput}
                                    />
                                    <Calendar style={styles.icon} color={'black'} ></Calendar>
                                </Pressable>
                                {showDeparturePicker && (
                                    <RNDateTimePicker
                                        themeVariant='light'
                                        value={departureDate}
                                        minimumDate={arrivalDate}
                                        maximumDate={maxDate}
                                        display="default"
                                        locale={currentLanguage}
                                        onChange={onChangeDeparture}
                                    />
                                )}
                                {errors.departureDate && <Text style={styles.errorText}>{t(errors.departureDate)}</Text>}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Gender")} required></Label>
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
                                <Label text={t("Phone")} required></Label>
                                <View style={[styles.inputContainer]}>
                                    <TextInput
                                        placeholder={t("Type") + "..."}
                                        placeholderTextColor={'#9C9C9C'}
                                        style={styles.textInput}
                                        value={phone}
                                        keyboardType='phone-pad'
                                        onChangeText={setPhone}

                                    />
                                </View>
                                {errors.phone && <Text style={styles.errorText}>{t(errors.phone)}</Text>}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Identity number")} required></Label>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.imageText}>• {t("Identity card must from 9 to 12 digits")}</Text>
                                </View>
                                <View style={[styles.inputContainer]}>
                                    <TextInput
                                        placeholder={t("Type") + "..."}
                                        placeholderTextColor={'#9C9C9C'}
                                        style={styles.textInput}
                                        keyboardType='number-pad'
                                        value={identityNumber}
                                        onChangeText={setIdentityNumber}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Note")} required></Label>
                               
                                <View style={[styles.inputContainer]}>
                                    <TextInput
                                        multiline
                                        placeholder={t("Type") + "..."}
                                        placeholderTextColor={"#9C9C9C"}
                                        style={[styles.textInput, { height: 100 }]}
                                        numberOfLines={4}
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                </View>

                                {errors.description && <Text style={styles.errorText}>{t(errors.description)}</Text>}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Image")} required></Label>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.imageText}>• {t("Visitor face")}</Text>
                                    <Text style={styles.imageText}>• {t("Identity card image(Both sides)")}</Text>
                                    <Text style={styles.imageText}>• {t("Maximum number of images")}: 5</Text>
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
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                    disabled={isButtonDisabled}
                                    onPress={() => setShowConfirm(true)}
                                    style={[
                                        {
                                            backgroundColor: theme.primary,
                                            opacity: isButtonDisabled ? 0.7 : 1,
                                        },
                                        styles.button,
                                    ]}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Send")}</Text>
                                </TouchableOpacity>
                            </View>

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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
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
    icon: {
        fontSize: 24,
        padding: 10,
    }, imageContainer: {
        position: 'relative', // Position the close button relative to the image
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
    comboBox: {
        backgroundColor: 'white',
        ...SHADOW,
        borderRadius: 10,
        padding: 10,
        marginTop: 5
    },
    errorText: {
        color: 'red',
        marginTop: 5
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
export default visitorRegisterScreen