import React, { useState, useEffect, useRef } from 'react';
import {  ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from '../../../config'
import { Popover, Button, Input, FormControl, Icon,
   VStack, Text, HStack, Container, Row, Column, Center, Box, Divider, View, Badge, Image, 
   IconButton} from "native-base";
import { AlertTriangle, ArrowRight, FileText, Home, Layers, PhoneIcon, Settings, UserCircle } from 'lucide-react-native';
import axios from 'axios';
import { API_BASE, actionController } from '../../../constants/action';
import { ToastFail, ToastSuccess } from '../../../constants/toastMessage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { LineChart, PieChart } from 'react-native-chart-kit';
import StatisticCard from '../../../components/receptionist/rooms/staticCard';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';
import { BarChart } from 'react-native-chart-kit';
import { ICON_COLOR } from '../../../constants/iconUtility';
import { Calendar } from 'react-native-calendars';
import { setCalendarLocale } from '../../../utils/calendarLanguage';
interface Report {
  totalRooms: number
  totalUtilities: number
  totalUtilityRequests: number
  totalPosts: number
  totalParkingCardRequests: number
  totalElevatorRequests: number
  totalConstructionRequests: number
  totalVisitorRequests: number
  totalFee:number
}

interface Building{
  name: string
  address: string
  numberOfFloor: number
  roomEachFloor: number
}
interface UitlityReport{
  utilityName: string
  reservationCount: number
}


const Dashboard = () => {
  const { session } = useAuth();
  const user: any = jwtDecode(session as string);
  const [report, setReport] = useState<Report>();
  const [building, setBuilding] = useState<Building>({} as Building); 
  const [utilityReport, setUtilityReport] = useState<UitlityReport[]>([]);
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const [isHotlineAlert, setIsHotlineAlert] = useState(false);
  const [isUtilityAlert, setIsUtilityAlert] = useState(false);
  const [isFeeAlert, setFeeAlert] = useState(false);
  setCalendarLocale('vi')
  useEffect(() => {
    const report = async () => {
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/report/building-report/${user.BuildingId}`);
        const utilityResponse = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/report/utility-report/${user.BuildingId}`);
        const building = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get/${user.BuildingId}`)
        const hotline = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/hotline/get-all?buildingId=${user.BuildingId}`)
        console.log(utilityResponse.data);
        if (response.data.statusCode == 200 && utilityResponse.data.statusCode == 200)  {
          setReport(response.data.data);
          setUtilityReport(utilityResponse.data.data);
          setBuilding(building.data.data);
          if(hotline.data.data.length == 0){
            setIsHotlineAlert(true);
          }
          if(response.data.data.totalUtilities==0){
            setIsUtilityAlert(true);
          }
          if(response.data.data.totalFee==0){
            setFeeAlert(true);
          }
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy dữ liệu',
            position: 'bottom'
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
    report();
  }, [session])


  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.6; 
  const pieChartWidth = screenWidth * 0.3; 
  const dataForPieChart = utilityReport.map(utility => ({
    name: utility?.utilityName,
    total: utility?.reservationCount,
    color: ICON_COLOR[utility.utilityName],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} >
          <VStack space={3} style={{
            paddingHorizontal: 30, backgroundColor: '#1e293b',  paddingVertical: 30
          }}
            >
            <HStack space={2} style={{ alignItems: 'center' }}>
              <Home size={20} color={'white'}></Home>
              <Text color={'white'}>/ Trang chủ</Text>
            </HStack>
            <Text fontSize={24}
              fontWeight={'bold'} color={'white'}>Trang chủ</Text>
              {isHotlineAlert &&  <Box p={3} borderRadius={'lg'} backgroundColor={'white'} shadow={4} w="40%" >
            <TouchableOpacity
            onPress={()=>{
              router.push('/web/Receptionist/services/hotline/')
            }}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <HStack alignItems="center">
                    <AlertTriangle  color="red"  />
                    <Text fontSize="sm" color="red.500" fontWeight="semibold"
                    numberOfLines={2} ellipsizeMode="tail">
                      Nhắc nhở: Tòa nhà chưa có số điện thoại đường dây nóng!
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">Vui lòng tạo ngay.</Text>
                </VStack>
                </HStack>
                </TouchableOpacity>
              </Box>}
              {isUtilityAlert &&
               <Box p={3} borderRadius={'lg'} backgroundColor={'white'} shadow={4} w="20%" >
               <TouchableOpacity
                onPress={()=>{
                  router.push('/web/Receptionist/utilities/')
                }}>
             <HStack justifyContent="space-between" alignItems="center">
               <VStack>
                 <HStack alignItems="center">
                   <AlertTriangle  color="red"  />
                   <Text fontSize="sm" color="red.500" fontWeight="semibold"
                   numberOfLines={2} ellipsizeMode="tail">
                     Nhắc nhở: Tòa nhà chưa có tiện ích!
                   </Text>
                 </HStack>
                 <Text fontSize="xs" color="gray.500"
                 numberOfLines={2}>Tạo tiện ích để cư dân có thể sử dụng.</Text>
                 <Text fontSize="xs" color="gray.500">Vui lòng tạo ngay.</Text>
               </VStack>
               </HStack>
               </TouchableOpacity>
             </Box>}
             {isFeeAlert &&
               <Box p={3} borderRadius={'lg'} backgroundColor={'white'} shadow={4} w="20%" >
               <TouchableOpacity
                onPress={()=>{
                  router.push('/web/Receptionist/fees/')
                }}>
             <HStack justifyContent="space-between" alignItems="center">
               <VStack>
                 <HStack alignItems="center">
                   <AlertTriangle  color="red"  />
                   <Text fontSize="sm" color="red.500" fontWeight="semibold"
                   numberOfLines={2} ellipsizeMode="tail">
                     Nhắc nhở: Tòa nhà chưa có phí dịch vụ
                   </Text>
                 </HStack>
                 <Text fontSize="xs" color="gray.500"
                 numberOfLines={2}>Tạo phí dịch vụ ngay.</Text>
               </VStack>
               </HStack>
               </TouchableOpacity>
             </Box>}
             
            <HStack space={2}>
              <StatisticCard number={report?.totalRooms} statisticName='Phòng'
                route='/web/Receptionist/rooms'></StatisticCard>
              <StatisticCard number={report?.totalPosts} statisticName='Bài viết'
                route='/web/Receptionist/posts'></StatisticCard>
              <StatisticCard number={report?.totalUtilities} statisticName='Tiện ích'
                route='/web/Receptionist/utilities'></StatisticCard>
              <StatisticCard number={report?.totalUtilityRequests} statisticName='Đơn đặt tiện ích'
                route='/web/Receptionist/utilities'></StatisticCard>
            </HStack>
          </VStack>
          <HStack justifyContent="space-between" alignItems="center"
          py={5} px={5}
            style={{
              width: '100%', 
              // top: (screenWidth / 4 + 30) - (220 / 2),
              // paddingHorizontal: 30, 
              zIndex: 2
            }}>
            {/* BarChart */}
            <Box padding={5} backgroundColor={'#334155'}
              borderRadius={'md'}
              shadow={7} zIndex={1}>
              <VStack mb={5}>
                <Text fontSize={'md'} color={'white'}
                  fontWeight={'medium'}>Tổng quan</Text>
                <Text fontSize={'xl'} color={'white'}
                  fontWeight={'semibold'}>Các loại dịch vụ</Text>
              </VStack>
              <BarChart
                yAxisSuffix=""
                data={{
                  labels: ['Khách thăm', 'Thang máy', 'Thẻ gửi xe', 'Thi công'],
                  datasets: [
                    {
                      data: [
                        report?.totalVisitorRequests as any,
                        report?.totalElevatorRequests as any,
                        report?.totalParkingCardRequests as any,
                        report?.totalConstructionRequests as any,
                      ],
                    },
                  ],
                }}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#334155',
                  backgroundGradientFrom: '#334155',
                  backgroundGradientTo: '#334155',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // this makes the labels white
                  barPercentage: 1,
                  fillShadowGradient: '#FF9190',
                  fillShadowGradientFrom:'#FF9190', 
                  fillShadowGradientTo:'#FDC094',
                  fillShadowGradientOpacity: 1,
                  style: {
                    borderRadius: 16,
                  },
                  // Adding props for labels styling
                  propsForLabels: {
                    fontSize: '14',
                    fontWeight: 'bold',
                    fill: '#ffffff', // White color for labels
                  },
                }}
                style={{
                  borderRadius: 16,
                }}
                fromZero={true} // Ensures that the chart starts from 0
              />
            </Box>
            {/* PieChart */}
            <Box padding={5} backgroundColor={'white'}
              borderRadius={'md'}
              shadow={7} zIndex={1}>
              <VStack mb={5}>
                <Text fontSize={'md'} color={'muted.400'}
                  fontWeight={'semibold'}>Tiện ích</Text>
                <Text fontSize={'xl'} color={'muted.600'}
                  fontWeight={'semibold'}>Đơn đặt các tiện ích</Text>
              </VStack>
            <PieChart
              data={dataForPieChart}
              width={pieChartWidth}
              height={220}  
              chartConfig={{
                backgroundColor: '#1E2923',
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                strokeWidth: 2,
                
              }}
              accessor="total"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
            />
              </Box>
          </HStack>
          <HStack space={2} mb={10}>
          <Box
      p={5}
      mt={5}
      mx={5} // mx is shorthand for marginHorizontal
      borderRadius="lg"
      backgroundColor="white"
      width="48%" // Adjusted to '95%' for better responsiveness
      shadow="5"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" fontSize="xl" color="#1e293b">
          Tòa nhà
        </Text>
        <Badge backgroundColor="#1e293b" borderRadius="md" color="white">
          <Text color="white" fontWeight="semibold">
            Thông tin
          </Text>
        </Badge>
        {/* Placeholder for Image, adjust the path as needed */}
       
      </HStack>
      <VStack space={3} mt={3}>
      <HStack space={3} alignItems="center">
        <Text fontSize="md" fontWeight="bold" color="#1e293b" width="20%">
          Tên:
        </Text>
        <Input
          fontSize="md"
          variant="filled"
          isReadOnly
          value={building.name}
          w="80%"
          _readOnly={{
            backgroundColor: "gray.200",
            color: "black",
          }}
        />
      </HStack>
      <HStack space={3} alignItems="center">
        <Text fontSize="md" fontWeight="bold" color="#1e293b" width="20%">
          Địa chỉ:
        </Text>
        <Input
          fontSize="md"
          variant="filled"
          isReadOnly
          value={building.address}
          w="80%"
          _readOnly={{
            backgroundColor: "gray.200",
            color: "black",
          }}
        />
      </HStack>
      <HStack space={3} alignItems="center">
        <Text fontSize="md" fontWeight="bold" color="#1e293b" width="50%">
          Số tầng:
        </Text>
        <Input
          fontSize="md"
          variant="filled"
          isReadOnly
          value={String(building.numberOfFloor)}
          w="50%"
          _readOnly={{
            backgroundColor: "gray.200",
            color: "black",
          }}
        />
      </HStack>
      <HStack space={3} alignItems="center">
        <Text fontSize="md" fontWeight="bold" color="#1e293b" width="50%">
          Số phòng mỗi tầng:
        </Text>
        <Input
          fontSize="md"
          variant="filled"
          isReadOnly
          value={String(building.roomEachFloor)}
          w="50%"
          _readOnly={{
            backgroundColor: "gray.200",
            color: "black",
          }}
        />
      </HStack>
    </VStack>
    </Box>
    <Box
       p={5}
       mt={5}
       mx={5} // mx is shorthand for marginHorizontal
       borderRadius="lg"
       backgroundColor="white"
       width="48%" // Adjusted to '95%' for better responsiveness
       shadow="5">
    <Calendar
                selectedDate={formattedCurrentDate}
                theme={{
                  textDayFontSize: 18,
                  textMonthFontSize: 20,
                  textDayHeaderFontSize: 16,
                }}
                
                
              />
    </Box>
    </HStack>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 2,
  },
});
export default Dashboard;