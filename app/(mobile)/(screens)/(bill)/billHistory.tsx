import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, Modal, TouchableOpacity, Button, LayoutAnimation, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { ChevronRight, Home } from 'lucide-react-native'
import SHADOW from '../../../../constants/shadow'
import { Link } from 'expo-router'
import BillDetail from '../../../../components/resident/Bill'
import { Center, Image, VStack } from 'native-base'
import BillModal from '../../../../components/resident/Bill'
import { moneyFormat } from '../../../../utils/moneyFormat'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useSession } from '../../context/AuthContext'

interface YearData {
    year: number;
    months: {
        month: number;
        total: number;
        details: BillDetail[]; // Adding details here
    }[];
}
interface Bill{
    id: string;
    room_id: string;
    room_number: string;
    year: number;
    month: number;
    total: number;
    status: number;
    detail:BillDetail[]
}

interface BillDetail{
    service_name: string;
    fee: number;
    amount: number;
    total: number;
}interface user{
    FullName:string;
    PhoneNumber:string;
    Id:string;
    Avatar:string;
    BuildingId:string;
  }
    
  interface Room{
    roomNumber:string;
    id:string;
    buildingName: string;
    buildingAddress: string;
  }
const BillHistory = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const{session } = useSession();
const user:user = jwtDecode(session as string);
    const [animation] = useState(new Animated.Value(0));
    const [rotateAnimation] = useState(new Animated.Value(0));
    const [bill, setBill] = useState<Bill[]>([]);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groupByYear,setGroupByYear]= useState<YearData[]>([]);
    
const [room, setRoom] = useState<Room[]>([]);
useEffect(() => {
    const fetchData = async () => {
    setError("");
      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}&buildingId=${user.BuildingId}`,{
            timeout:10000
          }
        );
        if(response.data.statusCode==200){
            setRoom(response?.data?.data);
        }
        else{
            setShowError(true);
            setError(t("System error please try again later"));
        }
      } catch (error) {
        if(axios.isCancel(error)){
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
  
  useEffect(() => {
    const fetchItems = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/service-charge/get-total/${room[0]?.id}`,{
                timeout:10000
            });
            console.log(response);
            if(response.data.statusCode === 200){
                const billsWithStatusFive = response.data.data.filter((bill: Bill) => bill.status === 5); // Filter here
                setBill(billsWithStatusFive);
                setGroupByYear(transformData(billsWithStatusFive));
            }
            else{
                setShowError(true);
                setError(t("System error please try again later") + ".");
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
                setShowError(true);
                setError(t("System error please try again later") + ".");
            }
            setShowError(true);
            setError(t("System error please try again later") + ".");
        } finally {
            setIsLoading(false);
        }
    };
    if(room.length > 0) { // Ensure room data is loaded
        fetchItems();
    }
}, [room]);

const transformData = (bills: Bill[]): YearData[] => {
    const groupedByYear: { [year: number]: YearData } = {};

    bills.forEach((bill) => {
        if (!groupedByYear[bill.year]) {
            groupedByYear[bill.year] = { year: bill.year, months: [] };
        }
        // Find or create the month entry
        let monthEntry = groupedByYear[bill.year].months.find(m => m.month === bill.month);
        if (!monthEntry) {
            monthEntry = { month: bill.month, total: bill.total, details: bill.detail };
            groupedByYear[bill.year].months.push(monthEntry);
        } else {
            // Assuming the total and details can be updated or are meant to accumulate
            monthEntry.total += bill.total; // Adjust as needed, depending on your logic
            monthEntry.details.push(...bill.detail);
        }
    });

    return Object.values(groupedByYear).sort((a, b) => b.year - a.year);
};
    useEffect(() => {
    setGroupByYear(transformData(bill));
    }, [bill])
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
    const [selectedItem, setSelectedItem] = useState<any>(null);
  
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
                                    renderItem={({ item }) => (
                                        <Pressable style={[styles.monthItem,{backgroundColor:theme.sub}]}
                                        onPress={() => openModal(item)}>
                                            <Text >Thang {item.month}</Text>
                                            <Text style={{fontWeight:'600'}}>{moneyFormat(item.total)} VND</Text>
                                            {selectedItem && (
                                                <BillModal
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
                    <View style={{flex:1}}>
                    {bill.length === 0 && !isLoading ? (
                         <Center flex={1}>
                         <VStack space={4} alignItems="center">
                         <Image source={require('../../../../assets/images/human.png')}
                        style={{width:200,height:300, opacity:0.7}}
                        />
                        <Text style={{color:'#9c9c9c', marginTop:5}}>{t("Currently, you don't have any bills that have paid")+"."}</Text>
                         </VStack>
                     </Center>
                    ):(  <View>
                        <FlatList
                            style={{ paddingHorizontal: 26, paddingBottom: 30 }}
                            data={groupByYear}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.year.toString()}
                        />
                    </View>)}
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