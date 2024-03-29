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

// Sample data for notifications. Replace it with your actual data source

interface User{
  Id: string;
  BuildingId:string;
}
interface Post{
  
    post: {
      id: string;
      buildingId: string;
      title: string;
      content: string;
      image: string;
      type: number
      createUser: string;
      createTime: Date;
      modifyUser: string;
      modifyTime: string;
      status: number
    },
    isRead: boolean
}

const NotificationButton = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [notifications, setNotifications] = useState<Post[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  moment.locale('es')
  const {session} = useAuth();
  const user:User = jwtDecode(session as string);
  useEffect(() => {
    fetchNotifications();
  }, [session]);
  moment.locale('vi');
  const markNotificationsAsRead = async () => {
    try {
      const response= await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/markAsRead?accountId=${user?.Id}`);
      const updatedNotifications = notifications.map((notification:Post) => ({ ...notification, isRead: true }));
      setNotifications(updatedNotifications);
      console.log(response);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const fetchNotifications = async (count = 10) => {
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/get-notification?accountId=${user.Id}&onlyUnread=true&skip=0&take=${count}`);
      console.log(response)
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
    maxHeight={500} overflowY={'scroll'}>
      <Popover.Arrow />
      <Popover.CloseButton />
      <Popover.Header bgColor={"#191919"}>
        <Text color={'white'} fontWeight={'bold'} fontSize={18}
        >Thông báo</Text>
      </Popover.Header>
      <Popover.Body>
        <VStack space={4}>
          <FlatList
            data={notifications?.slice(0, displayCount).sort((a, b) => new Date(b.post.createTime).getTime() - new Date(a.post.createTime).getTime()).reverse()}
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                  <VStack style={{ flex: 1 }}>
                    <Text
                      _dark={{ color: "warmGray.50", }}
                      color="coolGray.800"
                      bold
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ flex: 1 }}
                    >
                      {item?.post.title}
                    </Text>
                    <Text color="coolGray.600" _dark={{ color: "warmGray.200", }}>
                      {calculateTimeAgo(item?.post.createTime)}
                    </Text>
                  </VStack>
                </View>
              </Box>
            )}
            keyExtractor={(item) => item.post.id.toString()}
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
