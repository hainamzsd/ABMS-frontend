import React, { useState, useEffect, useRef } from 'react';
import { Image, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from '../../../config'
import { Popover, Button, Input, FormControl, Icon, VStack, Text, HStack, Container, Row, Column, Center, Box, Divider, View } from "native-base";
import { ArrowRight, BarChart, FileText, Home, Layers, PhoneIcon, Settings, UserCircle } from 'lucide-react-native';
import axios from 'axios';
import { API_BASE, actionController } from '../../../constants/action';
import { ToastFail, ToastSuccess } from '../../../constants/toastMessage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
const Dashboard = () => {

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.4;
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, }} >
          <VStack space={3} style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
            <HStack space={2} style={{ alignItems: 'center' }}>
              <Home size={20}></Home>
              <Text>/ Trang chủ</Text>
            </HStack>
            <Text fontSize={24}
              fontWeight={'bold'}>Trang chủ</Text>
            <HStack space={5} justifyContent="space-between">
              <Center h="40" w="20%" rounded="2xl" shadow={5}
                bg={{
                  linearGradient: {
                    colors: ['#FF9190', '#FDC094'],
                    start: [0, 0],
                    end: [1, 0]
                  }
                }}>

                <HStack space={3} alignItems={'center'}>
                  <UserCircle size={50} color={'white'} />
                  <VStack>
                    <Text fontSize={18} color={'white'}>Tổng số người dùng</Text>
                    <Text fontSize={24} fontWeight={'bold'}
                      color={'white'}>12</Text>
                  </VStack>
                </HStack>
                <Divider color={'muted.100'}
                  marginTop={5}></Divider>
                <TouchableOpacity
                  onPress={() => router.push('/web/Receptionist/accounts/')}
                >
                  <HStack space={1} marginTop={5} alignItems={'center'}>
                    <Text color={'white'} italic>Đi tới quản lý danh sách cư dân</Text>
                    <ArrowRight size={20} color={'white'} />
                  </HStack>
                </TouchableOpacity>
              </Center>
              <Center h="40" w="20%" rounded="2xl" shadow={5}
                bg={{
                  linearGradient: {
                    colors: ['#FF9190', '#FDC094'],
                    start: [0, 1],
                    end: [1, 0]
                  }
                }}>

                <HStack space={3} alignItems={'center'}>
                  <Layers size={50} color={'white'} />
                  <VStack >
                    <Text fontSize={18}
                      color={'white'}>Tổng số tiện ích</Text>
                    <Text fontSize={24} fontWeight={'bold'}
                      color={'white'}>12</Text>
                  </VStack>
                </HStack>
                <Divider color={'muted.100'}
                  marginTop={5}></Divider>
                <TouchableOpacity
                  onPress={() => router.push('/web/Receptionist/utilities/')}
                >
                  <HStack space={1} marginTop={5} alignItems={'center'}>
                    <Text color={'white'} italic>Đi tới quản lý tiện ích</Text>
                    <ArrowRight size={20} color={'white'} />
                  </HStack>
                </TouchableOpacity>
              </Center>
              <Center h="40" w="20%" rounded="2xl" shadow={5}
                bg={{
                  linearGradient: {
                    colors: ['#FF9190', '#FDC094'],
                    start: [0, 1],
                    end: [0, 1]
                  }
                }}>

                <HStack space={3} alignItems={'center'}>
                  <Settings size={50} color={'white'} />
                  <VStack >
                    <Text fontSize={18}
                      color={'white'}>Tổng số yêu cầu dịch vụ</Text>
                    <Text fontSize={24} fontWeight={'bold'}
                      color={'white'}>12</Text>
                  </VStack>
                </HStack>
                <Divider color={'muted.100'}
                  marginTop={5}></Divider>
                <TouchableOpacity
                  onPress={() => router.push('/web/Receptionist/services/')}
                >
                  <HStack space={1} marginTop={5} alignItems={'center'}>
                    <Text color={'white'} italic>Đi tới quản lý dịch vụ</Text>
                    <ArrowRight size={20} color={'white'} />
                  </HStack>
                </TouchableOpacity>
              </Center>
              <Center h="40" w="20%" rounded="2xl" shadow={5}
                bg={{
                  linearGradient: {
                    colors: ['#FF9190', '#FDC094'],
                    start: [1, 0],
                    end: [0, 1]
                  }
                }}>

                <HStack space={3} alignItems={'center'}>
                  <FileText size={50} color={'white'} />
                  <VStack >
                    <Text fontSize={18}
                      color={'white'}>Tổng số bài viết</Text>
                    <Text fontSize={24} fontWeight={'bold'}
                      color={'white'}>12</Text>
                  </VStack>
                </HStack>
                <Divider color={'muted.100'}
                  marginTop={5}></Divider>
                <TouchableOpacity
                  onPress={() => router.push('/web/Receptionist/posts/')}
                >
                  <HStack space={1} marginTop={5} alignItems={'center'}>
                    <Text color={'white'} italic>Đi tới quản lý bài viết</Text>
                    <ArrowRight size={20} color={'white'} />
                  </HStack>
                </TouchableOpacity>
              </Center>
            </HStack>
            <HStack flex={1} space={10} mt={5}>
              <Box width="50%" bg="white" rounded="lg" >
                <VStack >
                  <View borderWidth={1} borderColor={'muted.400'}
                    padding={4} roundedTopLeft={'lg'} roundedTopRight={'lg'}>
                    <Text fontSize={18}
                      color={'muted.600'}
                      fontWeight="600" >
                      Biểu đồ đặt tiện ích
                    </Text>
                  </View>
                  <View
                    borderWidth={1} borderColor={'muted.400'}
                    style={{
                    }}>
                   
                  </View>
                </VStack>
              </Box>
              <Box flex={0.3} bg="gray.100" rounded="lg" shadow={3}>
                <VStack>
                  {/* Optional header for the right box */}
                  {/* Add your content here */}
                </VStack>
              </Box>
            </HStack>
          </VStack>
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