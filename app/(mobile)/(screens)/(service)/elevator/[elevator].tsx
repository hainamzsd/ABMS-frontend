import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Header from '../../../../../components/resident/header';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { moneyFormat } from '../../../../../utils/moneyFormat';
import { Ticket } from 'lucide-react-native';
import SHADOW from '../../../../../constants/shadow';
import axios from 'axios';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import LoadingComponent from '../../../../../components/resident/loading';
import { statusUtility } from '../../../../../constants/status';
import { useSession } from '../../../context/AuthContext';
import CustomAlert from '../../../../../components/resident/confirmAlert';
import Alert from '../../../../../components/resident/Alert';

interface Elevator{
    id: string
    roomId: string,
    startTime: Date,
    endTime: Date,
    description: string,
    status: number,
    response:string;
  }

const Page = () => {
    const item = useLocalSearchParams();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const {session} = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<Elevator>();
  const [showError, setShowError] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
    useEffect(() => {
      const fetchItems = async () => {
          setIsLoading(true);
          setError("");
          try {
              const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/elevator/get/${item.elevator}`,{
                  timeout:10000
              });
              if(response.data.statusCode == 200){
                setData(response.data.data);
                if(data){
                    setStartDate(new Date(data.startTime))
                    setEndDate(new Date(data.endTime))
                
                }
              }
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
            `https://abmscapstone2024.azurewebsites.net/api/v1/elevator/delete/${data?.id}`, {
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
            <Header headerTitle={t("Elevator request information")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{t("Status")}</Text>
                                <View style={{
                                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                                    justifyContent: 'center', height: 40}}>
                                    <Text style={{ fontWeight: 'bold' }}>{t(statusUtility[data?.status as number]?.status)}</Text>
                                </View>
                            </View>
                            <View style={[styles.reservationBox, { paddingHorizontal: 20, paddingBottom: 20 }]}>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Start date")}:</Text>
                                    <Text style={styles.highlightText}>{startDate.toLocaleDateString('vi')}</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Start time")}:</Text>
                                    <Text style={styles.highlightText}>{
                                        `${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')}`
                                    }</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("End time")}:</Text>
                                    <Text style={styles.highlightText}>{
                                        `${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')}`
                                    }</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Note")}:</Text>
                                    <Text style={{fontSize:16}}>{data?.description}</Text>
                                </View>
                                {data?.status==4 &&
                                 <View style={styles.reservationinformation}>
                                 <Text>{t("Request response")}:</Text>
                                 <Text style={{fontSize:16}}>{data?.response}</Text>
                             </View>}
                               
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {data?.status==2 &&  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 26,
                    paddingVertical: 20
                }}>
                    <Pressable
                    onPress={() => setShowConfirmBox(true)}
                        style={[
                            {
                                backgroundColor: "#ED6666",
                            },
                            styles.button,
                        ]}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Delete")}</Text>
                    </Pressable>
                </View>}
               
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