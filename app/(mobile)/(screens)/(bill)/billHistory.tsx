import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, Modal, TouchableOpacity, Button, LayoutAnimation, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { ChevronRight, Home } from 'lucide-react-native'
import SHADOW from '../../../../constants/shadow'
import { Link } from 'expo-router'
import BillDetail from '../../../../components/resident/Bill'
interface YearData {
    year: number;
    months: { month: number; total: number }[];
}

const data: { year: number; month: number; total: number }[] = [
    { year: 2023, month: 1, total: 1000 },
    { year: 2023, month: 2, total: 1200 },
    { year: 2023, month: 3, total: 1500 },
    { year: 2023, month: 4, total: 800 },
    { year: 2023, month: 5, total: 1100 },
    { year: 2023, month: 6, total: 1300 },
    { year: 2024, month: 1, total: 1400 },
    { year: 2024, month: 2, total: 1600 },
];

const BillHistory = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [animation] = useState(new Animated.Value(0));
    const [rotateAnimation] = useState(new Animated.Value(0));
    const groupByYear: YearData[] = data.reduce((acc, current) => {
        const year = current.year;
        const existingYear = acc.find((item) => item.year === year);

        if (existingYear) {
            existingYear.months.push({ month: current.month, total: current.total });
        } else {
            acc.push({ year, months: [{ month: current.month, total: current.total }] });
        }

        return acc;
    }, [] as YearData[]).sort((a, b) => b.year - a.year);

    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const toggleExpand = (itemId: number) => {
        const isExpanded = expanded[itemId] || false;
        setExpanded({
          ...expanded,
          [itemId]: !isExpanded,
        });
    };

    const boxHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
    });

    const rotateInterpolate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
    });

    const [isModalVisible, setModalVisible] = useState(false);
    // State to manage the currently selected item for detail
    const [selectedItem, setSelectedItem] = useState(null);
  
    // Function to open modal with item details
    const openModal = (item:any) => {
      setSelectedItem(item);
      setModalVisible(true);
    };
  
    // Function to close the modal
    const closeModal = () => {
      setModalVisible(false);
    };

    const renderItem = ({ item }: { item: YearData }) => {
        const isExpanded = expanded[item.year] || false;
        return (
            <View >
                <View style={styles.yearBox}>
                    <TouchableOpacity
                        onPress={() => toggleExpand(item.year)}
                        style={{ justifyContent: "space-between", flexDirection: "row", padding:20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.year}</Text>
                        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                            <ChevronRight strokeWidth={2} color={"black"} />
                        </Animated.View>
                    </TouchableOpacity>
                    {isExpanded && ( <View style={{ height: boxHeight, overflow: "hidden" }}>
                        <View style={styles.yearDropdown}>
                            <View>
                                <FlatList
                                    data={item.months}
                                    renderItem={({ item }: { item: { month: number; total: number } }) => (
                                        <Pressable style={[styles.monthItem,{backgroundColor:theme.sub}]}
                                        onPress={() => openModal(item)}>
                                            <Text >Thang {item.month}</Text>
                                            <Text style={{fontWeight:'600'}}>{item.total} VND</Text>
                                            {selectedItem && (
                                                <BillDetail
                                                  visible={isModalVisible}
                                                  item={selectedItem}
                                                  onRequestClose={closeModal}
                                                />
                                              )}
                                        </Pressable>
                                    )}
                                    keyExtractor={(item) => item.month.toString()}
                                />
                            </View>
                        </View>
                    </View>)}
                   
                </View>
            </View>
        );
    };
    return (
        <>
            <Header headerTitle={t("Bill")}></Header>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 20, borderBottomWidth: 0.5, borderColor: '#9C9C9C' }}>
                        <View style={{ paddingHorizontal: 26 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{t("Bill history")}</Text>
                            <Text style={{ marginTop: 5 }}>{t("Below is a list of the bills you have paid")}</Text>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            style={{ paddingHorizontal: 26, paddingBottom: 30 }}
                            data={groupByYear}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.year.toString()}
                        />
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
    },
    yearBox: {
        ...SHADOW,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: "white",
    },
    yearDropdown: {
        marginTop: 10
    },
    callBox: {
        backgroundColor: '#ED6666',
        borderRadius: 10, padding: 5,
        flexDirection: 'row',
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthItem:{
       padding:20, borderTopWidth:0.5, borderColor:"#9c9c9c",
        flexDirection:'row',
        justifyContent:'space-between'
    }
})

export default BillHistory