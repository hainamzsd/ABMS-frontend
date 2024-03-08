import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Pressable } from 'react-native';
import Header from '../../../../../../components/resident/header';
import { Redirect, useLocalSearchParams, useNavigation, Navigator } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../context/ThemeContext';
import SHADOW from '../../../../../../constants/shadow';
import { Ticket } from 'lucide-react-native';
import { moneyFormat } from '../../../../../../utils/moneyFormat';
import ConfirmAlert from '../../../../../../components/resident/confirmAlert';
import CustomAlert from '../../../../../../components/resident/confirmAlert';
import LoadingComponent from '../../../../../../components/resident/loading';
import Alert from '../../../../../../components/resident/Alert';
import { useSession } from '../../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AlertWithButton from '../../../../../../components/resident/AlertWithButton';
interface user{
    FullName:string;
    PhoneNumber:string;
    Id:string;
    Avatar:string;
  }
  
interface Room{
    roomNumber:string;
    id:string;
}
const Checkout = () => {
    const item: any = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfirmVisible, setAlertConfirmVisible] = useState(false);
    const{session } = useSession();
    const user:user = jwtDecode(session as string);
    const handleClose = () => {
        setAlertVisible(false);
    };
    const [isLoading, setIsLoading] = useState(false);
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
      
      const [disableBtn, setDisableBtn] = useState(false);
    const handleCreateReservation = async () => {
        setIsLoading(true);
        setDisableBtn(true);
        try {
          const body = {
            room_id: room[0].id,
            utilityId: item.utilityId,
            utility_detail_id:item.utitlityDetailId,
            slot: item.slotString,
            booking_date: item.date,
            number_of_person: item.ticket,
            total_price: item.total,
            description:item.note
          };
      
          console.log('Body:', body);
          
          const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/reservation/create', body, {
            timeout: 10000, 
            headers:{
                'Authorization': `Bearer ${session}`
            }
          },
          );
      
          if(response.data.statusCode==200){
            setAlertConfirmVisible(true);
            setTimeout(() => {
              setAlertConfirmVisible(false);
              navigation.navigate('(tabs)');
            }, 3000);
          }
          else{
            setError(true);
            setErrorText(t("Failed to create reservation"));
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            setError(true);
            setErrorText(t("System error please try again later"));
          } else {
            setError(true);
            setErrorText(t("Failed to create reservation"));
          }
        } finally {
          setIsLoading(false);
          setAlertVisible(false);
          setDisableBtn(false);
        }
      };
    return (
        <>
        <LoadingComponent loading={isLoading}></LoadingComponent>

            <Header headerTitle={t("Register confirmation")} />
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1, backgroundColor: theme.background }}>
                    <ScrollView>
                        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{t("Reservation information")}</Text>
                            <View style={styles.reservationBox}>
                                <View style={{ borderBottomWidth: 1 }}>
                                    <View style={styles.reservationBoxContent}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ticket color={'black'}></Ticket>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>{item.utilityName}</Text>
                                        </View>
                                        <View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Date")}:</Text>
                                                <Text style={styles.highlightText}>{item.date}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Time")}:</Text>
                                                <Text style={styles.highlightText}>{item.slotString}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Number of tickets")}:</Text>
                                                <Text style={styles.highlightText}>{item.ticket}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Location")}:</Text>
                                                <Text style={styles.highlightText}>{item.location}</Text>
                                            </View>
                                         
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.reservationFooter}>
                                    <Text>{t("Total fee")}</Text>
                                    <Text style={styles.highlightText}>{item.total && moneyFormat(item.total)} VND</Text>
                                </View>
                            </View>
                            <View style={{marginTop:20, flexDirection:'row'}}>
                                                <Text>{t("Note")}: </Text>
                                                <Text >{item.note}</Text>
                                            </View>
                            <Text style={{ marginVertical: 20, fontWeight: 'bold', fontSize: 20 }}>
                                {t("Booker information")}
                            </Text>
                            <View style={[styles.reservationBox, { paddingHorizontal: 20, paddingBottom: 20 }]}>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Fullname")}</Text>
                                    <Text style={styles.highlightText}>{user.FullName}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Phone")}</Text>
                                    <Text style={styles.highlightText}>{user.PhoneNumber}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Room")}</Text>
                                    <Text style={styles.highlightText}>{room[0]?.roomNumber}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{
                    borderTopWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 26,
                    paddingVertical: 20
                }}>
                    <View>
                        <Text>{t("Total money")}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 5 }}>{item.total && moneyFormat(item.total)} VND</Text>
                    </View>
                    <Pressable
                        onPress={() => setAlertVisible(true)}
                        style={[styles.button, { backgroundColor: theme.primary }]}>
                        <Text style={styles.highlightText}>{t("Create reservation")}</Text>
                    </Pressable>
                    <CustomAlert
                        visible={alertVisible}
                        title={t("Confirm")}
                        content={t("Do you confirm your utility reservation?")}
                        onClose={handleClose}
                        onConfirm={handleCreateReservation}
                        disable={disableBtn}
                    />
                    <Alert 
                    visible={alertConfirmVisible}
                    title={t("Booking successful")}
                    content={t("You will be redirected to home page") +"."}
                    ></Alert>
                    <AlertWithButton 
                    visible={error}
                    title={t("Booking unsuccessful")}
                    content={t(errorText) +"."}
                    onClose={() => setError(false)}
                    ></AlertWithButton>
 <LoadingComponent loading={isLoading} />
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
    },
    reservationBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        ...SHADOW
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
        fontWeight: 'bold', fontSize: 16
    }

})
export default Checkout;