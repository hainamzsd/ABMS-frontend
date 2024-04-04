import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon, Badge, Button, Text, Box, Popover, VStack, HStack, Avatar } from 'native-base';
import { Bell } from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../../app/web/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import { calculateTimeAgo } from '../../utils/fromNow';
import { router } from 'expo-router';
import { HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
interface User{
  Id: string;
  BuildingId:string;
}
interface Notification{
  
  notification: {
      id: string;
      buildingId: string;
      title: string;
      content: string;
      type: number
      createTime: Date;
    },
    isRead: boolean
}

const NotificationButton = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  moment.locale('es')
  const {session} = useAuth();
  const user:User = jwtDecode(session as string);
  useEffect(() => {
    fetchNotifications();
    const connection = new HubConnectionBuilder()
    .withUrl("https://abmscapstone2024.azurewebsites.net/notificationHub")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  // Start the connection and handle new notifications
  connection.start().then(() => {
    console.log("Connected to SignalR hub.");

    connection.on("ReceiveNotification", (newNotification) => {
      const receivedTime = Date.now(); // Capture current time when notification arrives
      console.log(`Notification received with timestamp: ${newNotification.createTime} (server)`);
      console.log(`Received at: ${receivedTime} (client)`);
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    });
  
  }).catch(err => console.error('SignalR Connection Error: ', err));

  // Clean up on component unmount
  return () => {
    connection.stop();
  };
  }, [session]);
  moment.locale('vi');
  const markNotificationsAsRead = async () => {
    try {
      const response= await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/markAsRead?accountId=${user?.Id}`);
      const updatedNotifications = notifications.map((notification:Notification) => ({ ...notification, isRead: true }));
      setNotifications(updatedNotifications);
      console.log(response);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const fetchNotifications = async (count = 10) => {
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/get-notification?accountId=${user.Id}&skip=0&take=${count}`);
      setNotifications(response.data); 
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleViewMore = async () => {
    const newDisplayCount = displayCount + 10;
    await fetchNotifications(newDisplayCount);
    setDisplayCount(newDisplayCount);
  };

  const handlePopoverOpen = () => {
    setShowPopover(true);
    markNotificationsAsRead();
  };

  const unreadCount = notifications?.filter(notification => !notification.isRead)?.length;


  return (
    <Box style={{ marginRight: 10 }}>
  <Popover
    isOpen={showPopover}
    onClose={() => setShowPopover(false)}
    trigger={(triggerProps) => (
      <Button variant="unstyled" {...triggerProps} onPress={handlePopoverOpen} >
        <Bell size={25} color={showPopover?"#333":'#6B7280' }></Bell>
        {unreadCount > 0 && (
          <Badge
            colorScheme="danger"
            rounded="full"
            mb={-4}
            mr={-3}
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            position="absolute"
            _text={{
              fontSize: 12,
            }}
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    )}
  >
    <Popover.Content accessibilityLabel="Notifications" 
    maxHeight={400} overflowY={'scroll'}
    width={"500"}
    top={5}>
      <Popover.Arrow />
      <Popover.CloseButton />
      <Popover.Header bgColor={"#191919"}>
        <Text color={'white'} fontWeight={'bold'} fontSize={18}
        >Thông báo</Text>
      </Popover.Header>
      <Popover.Body>
        <VStack space={4}>
          <FlatList
            data={notifications?.slice(0, displayCount).sort((a, b) => new Date(b.notification.createTime).getTime() - new Date(a.notification.createTime).getTime())}
            renderItem={({ item }) => (
              <Box
                borderBottomWidth="1"
                _dark={{ borderColor: "gray.600", }}
                borderColor="coolGray.200"
                pl="4"
                pr="5"
                py="2"
                bgColor={item.isRead ? "transparent" : "highlight"}
              >
                <TouchableOpacity 
                onPress={()=>{
                  router.push(item?.notification.content as any)
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                  <VStack style={{ flex: 1 }}>
                    <Text
                      _dark={{ color: "warmGray.50", }}
                      color="coolGray.800"
                      bold
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ flex: 1 }}
                    >
                      {item?.notification.title}
                    </Text>
                    <Text color="coolGray.600" _dark={{ color: "warmGray.200", }}>
                      {calculateTimeAgo(item?.notification.createTime)}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </Box>
            )}
            keyExtractor={(item) => item.notification.id.toString()}
          />
          {displayCount < notifications?.length && (
            <TouchableOpacity onPress={handleViewMore}>
              <Text color="primary.500">View More</Text>
            </TouchableOpacity>
          )}
        </VStack>
      </Popover.Body>
    </Popover.Content>
  </Popover>
</Box>

  );
};

export default NotificationButton;
