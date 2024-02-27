import { View, Text, SafeAreaView, Pressable, Button, TextInput, StyleSheet, ScrollView, FlatList, Image, SectionList } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Calendar, X } from 'lucide-react-native'
import SHADOW from '../../../../constants/shadow'
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import Label from '../../../../components/resident/lable'
import * as ImagePicker from 'expo-image-picker';
import LoadingComponent from '../../../../components/resident/loading'
import { useLanguage } from '../../context/LanguageContext'

interface ImageInfo {
    uri: string;
    name: string | null | undefined;
    type: "image" | "video" | undefined;
}

const visitorRegisterScreen = () => {
    const [loading, setLoading] = useState(false);
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
        }finally{
        }
    };

    const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([])
    const removeImage = (index: number) => {
        const newSelectedImages = [...selectedImages]; // Create a copy to avoid mutation
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
    };


    const { t } = useTranslation();

    const genderList = [
        { label: t("Male"), value: 1 },
        { label: t("Female"), value: 0 },
    ]

    const { theme } = useTheme();
    const { currentLanguage} = useLanguage();
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(new Date());
    const [showArrivalPicker, setShowArrivalPicker] = useState<boolean>(false);
    const [showDeparturePicker, setShowDeparturePicker] = useState<boolean>(false);
    const [gender, setGender] = useState();
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
    const isButtonDisabled = !gender || !arrivalDate || !departureDate ||selectedImages.length < 1;
    return (
        <>
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
                                />
                            </View>
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
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Identity number")} required></Label>
                                <View style={[styles.inputContainer]}>
                                    <TextInput
                                        placeholder={t("Type") + "..."}
                                        placeholderTextColor={'#9C9C9C'}
                                        style={styles.textInput}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Label text={t("Image")} required></Label>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.imageText}>• {t("Visitor face")}</Text>
                                    <Text style={styles.imageText}>• {t("Identity card iamge(Both sides)")}</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Button title={t("Choose image")} onPress={pickImages} /> 
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
                            <View style={{marginTop:10}}>
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
                                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Tiếp tục</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
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
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        marginRight:5
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