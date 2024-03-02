import React, { useState } from 'react';
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


const Checkout = () => {
    const item: any = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfirmVisible, setAlertConfirmVisible] = useState(false);

    const handleConfirm = () => {
        setAlertVisible(false);
        fetchData();
        console.log('Confirmed');
    };

    const handleClose = () => {
        setAlertVisible(false);
    };

    const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAlertConfirmVisible(true);
      setTimeout(() => {
        navigation.navigate("(tabs)");
      }, 2000);
    }, 3000); 
  };

    return (
        <>
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
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>San bong</Text>
                                        </View>
                                        <View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Date")}</Text>
                                                <Text style={styles.highlightText}>22/2/222</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Time")}</Text>
                                                <Text style={styles.highlightText}>22-22</Text>
                                            </View>
                                            <View style={styles.reservationinformation}>
                                                <Text>{t("Number of tickets")}</Text>
                                                <Text style={styles.highlightText}>11</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.reservationFooter}>
                                    <Text>{t("Total fee")}</Text>
                                    <Text style={styles.highlightText}>{item.total && moneyFormat(item.total)} VND</Text>
                                </View>
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
                                    <Text>{t("Email")}</Text>
                                    <Text style={styles.highlightText}>231231</Text>
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
                        <Text>Tổng tiền</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 5 }}>20.000 VND</Text>
                    </View>
                    <Pressable
                        onPress={() => setAlertVisible(true)}
                        style={[styles.button, { backgroundColor: theme.primary }]}>
                        <Text style={styles.highlightText}>Checkout</Text>
                    </Pressable>
                    <CustomAlert
                        visible={alertVisible}
                        title={t("Confirm")}
                        content={t("Do you confirm your utility reservation?")}
                        onClose={handleClose}
                        onConfirm={handleConfirm}
                    />
                    <Alert 
                    visible={alertConfirmVisible}
                    title={t("Booking successful")}
                    content={t("You will be redirected to home page") +"."}
                    ></Alert>
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