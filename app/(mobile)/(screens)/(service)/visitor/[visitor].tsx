import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Header from '../../../../../components/resident/header';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { moneyFormat } from '../../../../../utils/moneyFormat';
import { Ticket } from 'lucide-react-native';
import SHADOW from '../../../../../constants/shadow';
const Page = () => {
    const item = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    return (
        <>
            <Header headerTitle={t("Visitor information")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{t("Status")}</Text>
                                <View style={{
                                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                                    justifyContent: 'center', height: 40                               }}>
                                    <Text style={{ fontWeight: 'bold' }}>Success</Text>
                                </View>
                            </View>
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
                                    <Text>{t("Arrival date")}</Text>
                                    <Text style={styles.highlightText}>2/2/2022</Text>
                                </View>
                                <View style={styles.reservationinformation}>
                                    <Text>{t("Departure date")}</Text>
                                    <Text style={styles.highlightText}>2/2/2022</Text>
                                </View>
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
                    <Pressable
                        style={[
                            {
                                backgroundColor: "#ED6666",
                            },
                            styles.button,
                        ]}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{t("Delete")}</Text>
                    </Pressable>
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