import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import Header from '../../../../../components/resident/header';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { moneyFormat } from '../../../../../utils/moneyFormat';
import { Ticket } from 'lucide-react-native';
import SHADOW from '../../../../../constants/shadow';
import axios from 'axios';
import LoadingComponent from '../../../../../components/resident/loading';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import { useSession } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import statusUtility from '../../../../../constants/status';
import Alert from '../../../../../components/resident/Alert';
import CustomAlert from '../../../../../components/resident/confirmAlert';

interface Reservation {
    id: string,
    room_id: string,
    utility_id: string,
    slot: number,
    booking_date: string,
    number_of_person: string,
    total_price: number,
    description: string,
    status: number,
    utility: string,
    utility_detail_name: string
}
interface Room {
    roomNumber: string;
    id: string;
}
const Page = () => {
    const item = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { session } = useSession();
    const user: any = jwtDecode(session as string);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState(false);
    const [data, setData] = useState<Reservation>();
    console.log(item);
    useEffect(() => {
        const fetchItems = async () => {
            setError("");
            if (item) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/reservation/get/${item.reservationUtility}`, {
                        timeout: 10000
                    });
                    if (response.data.statusCode == 200) {
                        setData(response.data.data);
                        console.log(data);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        setShowError(true);
                        setError(t("System error please try again later") + ".");
                        return;
                    }
                    setShowError(true);
                    console.error('Error fetching reservations:', error);
                    setError(t('Failed to return requests') + ".");
                } finally {
                    setIsLoading(false);
                }
            }

        };
        fetchItems();
    }, []);


    const [room, setRoom] = useState<Room[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            setError("");
            try {
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
            }
        };

        fetchData();
    }, [session]);

    const [showDeleteMsg, setShowDeleteMsg] = useState(false);
    const [confirmBox, setShowConfirmBox] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const navigation = useNavigation();
    
        const handleDeleteReservation = async () => {
            setDisableBtn(true);
            setIsLoading(true);
            setError("");
            try {
                const response = await axios.delete(
                    `https://abmscapstone2024.azurewebsites.net/api/v1/reservation/delete/${data?.id}`, {
                    timeout: 10000,
                    headers:{
                        'Authorization': `Bearer ${session}`
                      }
                }
                );
                if (response.data.statusCode == 200) {
                    setShowConfirmBox(false);
                    setShowDeleteMsg(true);
                    setTimeout(() => {
                        setShowDeleteMsg(false);
                        router.back();
                      }, 3000);
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


    return (
        <>
            <LoadingComponent loading={isLoading}></LoadingComponent>
            <CustomAlert title={t("Delete confirmation")} 
            content={t("Do you want to delete this booking")+"?"}
            visible={confirmBox}
            onClose={() => setShowConfirmBox(false)}
            onConfirm={handleDeleteReservation}
            disable={disableBtn}
            ></CustomAlert>
            <Alert title={t("Successful")} content={t("Delete booking successfuly")}
            visible={showDeleteMsg}></Alert>
            <AlertWithButton title={t("Error")} content={error} visible={showError}
                onClose={() => setShowError(false)}
            ></AlertWithButton>
            <Header headerTitle={t("Register confirmation")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{t("Reservation information")}</Text>
                                <View style={{
                                    padding: 10, borderRadius: 20, backgroundColor: statusUtility[data?.status as any]?.color,
                                    justifyContent: 'center', height: 40
                                }}>
                                    <Text style={{ fontWeight: 'bold' }}>{t(statusUtility[data?.status as any]?.status)}</Text>
                                </View>
                            </View>
                            <View style={styles.reservationBox}>
                                <View style={{ borderBottomWidth: 1 }}>
                                    <View style={styles.reservationBoxContent}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ticket color={'black'}></Ticket>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>{data?.utility}</Text>
                                        </View>
                                        <View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Date")}</Text>
                                                <Text style={styles.highlightText}>{data?.booking_date}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Time")}</Text>
                                                <Text style={styles.highlightText}>{data?.slot}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Number of tickets")}</Text>
                                                <Text style={styles.highlightText}>{data?.number_of_person}</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Location")}:</Text>
                                                <Text style={styles.highlightText}>{data?.utility_detail_name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.reservationFooter}>
                                    <Text>{t("Total fee")}</Text>
                                    <Text style={styles.highlightText}>{data?.total_price && moneyFormat(data?.total_price)} VND</Text>
                                </View>
                            </View>
                            <View style={{marginTop:20, flexDirection:'row'}}>
                                                <Text>{t("Note")}: </Text>
                                                <Text >{data?.description}</Text>
                                            </View>
                            <Text style={{ marginVertical: 20, fontWeight: 'bold', fontSize: 20 }}>
                                {t("Booker information")}
                            </Text>
                            <View style={[styles.reservationBox, { paddingHorizontal: 20, paddingBottom: 20 }]}>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Fullname")}</Text>
                                    <Text style={styles.highlightText}>Nguyen Van A</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Phone")}</Text>
                                    <Text style={styles.highlightText}>0123456789</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Room")}</Text>
                                    <Text style={styles.highlightText}>{room[0]?.roomNumber}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {data?.status == 2 &&
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 26,
                        paddingVertical: 20
                    }}>
                        <TouchableOpacity
                            style={[
                                {
                                    backgroundColor: "#ED6666",
                                },
                                styles.button,
                            ]}
                            onPress={()=>setShowConfirmBox(true)}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Delete")}</Text>
                        </TouchableOpacity>
                    </View>
                }

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
export default Page;