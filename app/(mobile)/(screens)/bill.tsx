import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { Home } from 'lucide-react-native'

interface Bill {
    year: number;
    month: number;
    amount: number;
    // Add other bill details here
}


const Bill = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [bills, setBills] = useState<Bill[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonthBills, setSelectedMonthBills] = useState<Bill[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const sampleBills: Bill[] = [
        { year: 2023, month: 1, amount: 100 },
        { year: 2023, month: 2, amount: 150 },
        { year: 2024, month: 1, amount: 200 },
        { year: 2024, month: 2, amount: 250 },
    ];

    useEffect(() => {
        setBills(sampleBills);
    }, []);

    const filterByYear = (year: number) => {
        setSelectedYear(year);
        const filteredBills = bills.filter((bill) => bill.year === year);
        setSelectedMonthBills(filteredBills);
    };

    const renderYearItem = ({ item }: { item: number }) => (
        <Pressable onPress={() => filterByYear(item)}>
            <Text>{item}</Text>
        </Pressable>
    );

    const renderMonthItem = ({ item }: { item: Bill }) => (
        <Pressable onPress={() => setIsModalVisible(true)}>
            <Text>
                {item.month} - {item.amount}
            </Text>
        </Pressable>
    );

    const renderModalBillItem = ({ item }: { item: Bill }) => (
        <Text>
            Month: {item.month}, Amount: {item.amount}
        </Text>
    );  const closeModal = () => {
        setIsModalVisible(false);
      };
    
    return (
        <>
            <Header headerTitle={t("Bill")}></Header>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 20, borderBottomWidth: 0.5, borderColor: '#9C9C9C' }}>
                        <View style={{ paddingHorizontal: 26 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{t("Bill list")}</Text>
                            <Text style={{ marginTop: 5 }}>{t("List bill for room")}</Text>
                            <View style={[styles.room, {
                                backgroundColor: theme.sub,
                                borderColor: theme.primary,
                            }]}>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>R2.2332</Text>
                                    <Text style={{ color: '#9C9C9C', fontWeight: '300' }}>Times city, Hà Nội</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                    <FlatList
        data={bills.map((bill) => bill.year).sort()}
        renderItem={renderYearItem}
        keyExtractor={(item) => item.toString()}
      />
      {selectedYear && (
        <FlatList
          data={selectedMonthBills}
          renderItem={renderMonthItem}
          keyExtractor={(item) => `${item.year}-${item.month}`}
        />
      )}
      <Modal visible={isModalVisible} onRequestClose={closeModal} animationType='slide'>
        <SafeAreaView>
        <FlatList data={selectedMonthBills} renderItem={renderModalBillItem} keyExtractor={(item) => item.month.toString()} />
        <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', top: 10, right: 10 }}>
          <Text>Close</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </Modal>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    room: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10, marginTop: 10,
    }
})

export default Bill