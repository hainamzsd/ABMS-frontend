import React from 'react';
import { Box, Text, HStack, VStack, Icon, Center, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

// Helper function to select an icon based on the statistic name
const getIconName = (statisticName:string|undefined) => {
    switch (statisticName) {
        case 'Phòng':
            return 'meeting-room';
        case 'Bài viết':
            return 'post-add';
        case 'Tiện ích':
            return 'build';
        case 'Đơn đặt tiện ích':
            return 'book-online';
        default:
            return 'info';
    }
};

const StatisticCard = ({ statisticName, number, route  }:{ statisticName:string|undefined, number:number|undefined, route?:string}) => {
    return (
      
        <Pressable
            bg="white"
            shadow={2}
            rounded="lg"
            width="20%"
            mx="auto"
            my={4}
            px={5}
            py={3}
            onPress={()=>{
                if(route){
                    router.push(route as any)
                }
            }}
        >
            <HStack space={3} justifyContent="space-between" alignItems="center">
                <VStack>
                    <Text color="muted.600" fontSize={18} bold>
                        {statisticName}
                    </Text>
                    <Text color="muted.800" fontSize="xl" fontWeight={"semibold"}>
                        {number}
                    </Text>
                </VStack>
                <Center
                    bg="primary.100"
                    size={50}
                    rounded="full"
                >
                    <Icon as={MaterialIcons} name={getIconName(statisticName)} size="xl" color="primary.500" />
                </Center>
            </HStack>
            <Text color={'muted.500'}>Đi Tới Quản Lý {statisticName}</Text>
        </Pressable>
    );
};

export default StatisticCard;
