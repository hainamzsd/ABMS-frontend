import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, FlatList, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Header from '../../../../../components/resident/header';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { moneyFormat } from '../../../../../utils/moneyFormat';
import { Ticket } from 'lucide-react-native';
import SHADOW from '../../../../../constants/shadow';
import { useSession } from '../../../context/AuthContext';
import axios from 'axios';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import CustomAlert from '../../../../../components/resident/confirmAlert';
import Alert from '../../../../../components/resident/Alert';
import LoadingComponent from '../../../../../components/resident/loading';
import moment from 'moment';
import {firebase} from '../../../../../config';
import { statusUtility } from '../../../../../constants/status';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import 'firebase/storage';
interface Visitor{
    id: string;
    roomId: string;
    fullName: string;
    arrivalTime: Date;
    departureTime: Date;
    gender: boolean;
    phoneNumber: string;
    identityNumber: string;
    identityCardImgUrl: string;
    description: string;
    status: number;
    response:string;
  }
const Page = () => {
    const item = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<Visitor>();
    const {session} = useSession();
  const [showError, setShowError] = useState(false);
    useEffect(() => {
      const fetchItems = async () => {
          setIsLoading(true);
          setError("");
          try {
              const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/visitor/getVisitorbyId/${item.visitor}`,{
                  timeout:10000
              });
              if(response.data.statusCode == 200){
                    setData(response.data.data);
                
              }
              console.log(response.data.data);
          } catch (error) {
              if(axios.isAxiosError(error)){
                setShowError(true);
                  setError(t("System error please try again later")+".");
                  return;
              }
              setShowError(true);
              console.error('Error fetching reservations:', error);
              setError(t('Failed to return requests')+".");
          } finally {
              setIsLoading(false);
          }
      };
      fetchItems();
  }, []); 
  const [disableBtn, setDisableBtn] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [confirmBox, setShowConfirmBox] = useState(false);
  const handleDeleteReservation = async () => {
    setDisableBtn(true);
    setIsLoading(true);
    setError("");
    try {
        const response = await axios.delete(
            `https://abmscapstone2024.azurewebsites.net/api/v1/visitor/delete/${data?.id}`, {
            timeout: 10000,
            headers:{
                'Authorization': `Bearer ${session}`
              }
        }
        );
        const deleteNotification = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/deleteByServiceId/${data?.id}`)
        console.log(response);
        if (response.data.statusCode == 200) {
            setShowConfirmBox(false);
            setShowDeleteMsg(true);
            setTimeout(() => {
                setShowDeleteMsg(false);
                navigation.goBack();
              }, 2000);
        }
        else {
            setShowError(true);
            setError(t("System error please try again later"));
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            setShowError(true);
            setError(t("System error please try again later"));
        }
        console.error('Error fetching data:', error);
        setShowError(true);
        setError(t("System error please try again later"));
    } finally {
        setDisableBtn(false);
        setIsLoading(false);
    }
};
const [imageUrls, setImageUrls] = useState([]);
const [loadingImage, setLoadingImage] = useState(false);
useEffect(() => {
    const fetchImage = async () => {
      const reference = firebase.database().ref(data?.identityCardImgUrl);
      
      try {
        setLoadingImage(true);
        setIsLoading(true);
        const snapshot = await reference.once('value');
        const images = snapshot.val();
        const urls = Object.values(images); 
        setImageUrls(urls as any);
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [data]);

    return (
        <>
         <AlertWithButton
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
         <CustomAlert title={t("Delete confirmation")} 
            content={t("Do you want to delete this request")+"?"}
            visible={confirmBox}
            onClose={() => setShowConfirmBox(false)}
            onConfirm={handleDeleteReservation}
            disable={disableBtn}
            ></CustomAlert>
            <Alert title={t("Successful")} content={t("Delete request successfuly")}
            visible={showDeleteMsg}></Alert>
      <LoadingComponent loading={isLoading}></LoadingComponent>
            <Header headerTitle={t("Visitor information")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{t("Status")}</Text>
                                <View style={{
                                    padding: 10, borderRadius: 20, backgroundColor: statusUtility[data?.status as number]?.color,
                                    justifyContent: 'center', height: 40}}>
                                    <Text style={{ fontWeight: 'bold' }}>{t(statusUtility[data?.status as number]?.status)}</Text>
                                </View>
                            </View>
                            <View style={[styles.reservationBox, { paddingHorizontal: 20, paddingBottom: 20 }]}>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Fullname")}</Text>
                                    <Text style={styles.highlightText}>{data?.fullName}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Gender")}</Text>
                                    <Text style={styles.highlightText}>{data?.gender ? t("Male") : t("Female")}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Phone")}</Text>
                                    <Text style={styles.highlightText}>{data?.phoneNumber}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Arrival date")}</Text>
                                    <Text style={styles.highlightText}>{moment.utc(data?.arrivalTime).format("DD-MM-YYYY")}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Departure date")}</Text>
                                    <Text style={styles.highlightText}>{moment.utc(data?.departureTime).format("DD-MM-YYYY")}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Identity number")}</Text>
                                    <Text style={styles.highlightText}>{data?.identityNumber}</Text>
                                </View>
                                <View style={{marginTop:20}}>
                                    <Text>{t("Note")}:</Text>
                                    <Text style={{marginTop:5}}>{data?.description}</Text>
                                </View>
                                {data?.status==4 &&
                                 <View style={styles.reservationinformation}>
                                 <Text>{t("Request response")}:</Text>
                                 <Text style={{fontSize:16}}>{data?.response}</Text>
                             </View>}
                            </View>
                            <View>
                                {imageUrls.length > 0 && 
                                 <SectionList
                                 horizontal
                                 style={{marginTop:10}}
                                 sections={[{ data: imageUrls }]}
                                 renderItem={({ item, index }) => <View style={{}}>
                                     <Image source={{ uri: item }} style={styles.image}
                                      />
                                 </View>}
                                 keyExtractor={(item) => item}
                                 />
                                }
<ActivityIndicator size={'small'} color={theme.primary}></ActivityIndicator>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 26,
                    paddingVertical: 20
                }}>
                    <TouchableOpacity
                    onPress={()=> setShowConfirmBox(true)}
                        style={[
                            {
                                backgroundColor: "#ED6666",
                            },
                            styles.button,
                        ]}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Delete")}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    reservationBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        ...SHADOW
    },
    image: {
        width: 150,
        height: 150,
        marginRight: 5
    },
    reservationBoxContent: {
        padding: 20,
    },
    reservationinformation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    reservationFooter: {
        padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    ticketBox: {
        ...SHADOW,
        borderRadius: 10, backgroundColor: 'white'
    },
    highlightText: {
        fontWeight: '600', fontSize: 16
    }

})
export default Page;