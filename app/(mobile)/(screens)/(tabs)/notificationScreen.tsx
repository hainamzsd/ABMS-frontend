import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { notificationScreenStyles } from "../styles/notificationScreenStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import SHADOW from "../../../../constants/shadow";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSession } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AlertWithButton from "../../../../components/resident/AlertWithButton";
import LoadingComponent from "../../../../components/resident/loading";
import moment from "moment";
import { truncateText } from "../../../../utils/truncate";
import { Clock, Trash } from "lucide-react-native";
import { router } from "expo-router";
import { Button, Checkbox, HStack } from 'native-base';
import Toast from "react-native-toast-message";
import { SwipeListView } from 'react-native-swipe-list-view';

interface user {
  FullName: string;
  PhoneNumber: string;
  Id: string;
  BuildingId: string;
}

interface Notification {
  notification: {
    id: string;
    buildingId: string;
    title: string;
    content: string;
    type: number
    createTime: Date;
  },
  isRead: boolean;
  selected?: boolean; 
}
const NotificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Notification[]>([]);
  const [displayData, setDisplayData] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const { session } = useSession();
  const user: user = jwtDecode(session as string);
  const [displayCount, setDisplayCount] = useState(10);
  const [deleteMode, setDeleteMode] = useState(false);

const toggleDeleteMode = () => setDeleteMode(!deleteMode);

useEffect(() => {
  if (isFocused) {
    fetchItems();
  }
}, [isFocused]);
  const fetchItems = async (count = 10) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/get-notification?accountId=${user.Id}&skip=0&take=${count}`, {
        timeout: 10000
      });
      const notificationsWithSelection = response.data.map((item:any) => ({
        ...item,
        selected: false
      }));
      setData(response.data); // Store all data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setShowError(true);
        setError("Failed to retrieve notifications" + ".");
      }
      setShowError(true);
      setError(t('Failed to retrieve notifications') + ".");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchItems();
    }
  }, [isFocused]);

  const handleSelectNotification = (id:any) => {
    console.log('Selecting notification with ID:', id);
    const newData = data.map(item => {
      if (item.notification.id === id) {
        console.log('Toggling selection for item:', item);
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setData(newData);
  };
  const isAnyItemSelected = () => {
    return data.some(item => item.selected);
  };
  const deleteSelectedNotifications = async () => {
    const selectedIds = data.filter(item => item.selected).map(item => item.notification.id);
  
    if (selectedIds.length === 0) {
      alert('No notifications selected for deletion.');
      return;
    }
  
    try {
      setIsLoading(true); // Show loading indicator during the process
      const response = await axios.delete('https://abmscapstone2024.azurewebsites.net/api/v1/notification/DeleteMultiple', { data: selectedIds });
      console.log('Delete response:', response.data);
      Toast.show({
        type:'success',
        text1:'Deleted successfully',  
      })
  
      const updatedData = data.filter(item => !item.selected);
      setData(updatedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setShowError(true);
        setError("Failed to delete notifications" + ".");
      }
      setShowError(true);
      setError(t('Failed to delete notifications') + ".");
    } finally {
      setIsLoading(false); 
      setDeleteMode(false);
    }
  };
  const loadMoreItems = async () => {
    const newDisplayCount = displayCount + 10;
    await fetchItems(newDisplayCount);
    setDisplayCount(newDisplayCount);
  };
  const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color={theme.primary} />;
    }
    return null;
  };
  
  const render = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: "white",
          marginTop: 20

        },
        SHADOW,
      ]}
      onPress={() => 
        {
          if (deleteMode) {
            handleSelectNotification(item.notification.id);
          }
        }
      }
    > 
     
      <View
        style={{
          width: 20,
          backgroundColor: theme.primary,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      ></View>
      <View style={{ padding: 10, justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18}}>
            {item?.notification.title}
          </Text>
          {/* <Text style={{ marginBottom: 5 }}>
            {item?.notification?.content
              ? truncateText(item.content, 30) // Truncate at 30 characters (adjust as needed)
              : ''}
          </Text> */}
        </View>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Clock color={'#9c9c9c'} size={20} style={{ marginRight: 5 }}></Clock>
          <Text
            style={{ fontWeight: "300", color: "#9C9C9C" }}>
            {moment.utc(item?.notification.createTime).format("DD/MM/YYYY")}
          </Text>
        </View>
        {/* <Checkbox
  isChecked={item.selected}
  onChange={() => handleSelectNotification(item.notification.id)}
  value={item.notification.id.toString()}
  accessibilityLabel="Select notification"  // Descriptive label for screen readers
/> */}
        </HStack>
      </View>
    </TouchableOpacity>
  )
  return (
    <>
      <AlertWithButton
        title={t("Error")}
        visible={showError}
        content={error} onClose={() => setShowError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{ marginHorizontal: 26, marginVertical: 20, fontSize: 24, fontWeight: "bold" }}
          >
            {t("Notification list")}
          </Text>
          {isAnyItemSelected() && (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        padding: 10,
        width:200,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center'
      }}
      onPress={deleteSelectedNotifications}
    >
      <HStack alignItems={'center'}>
      <Trash color={'white'}></Trash>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Selected</Text>

      </HStack>
    </TouchableOpacity>
  )}
          {data?.length > 0 ? <FlatList
            style={{ paddingHorizontal: 26 }}
            data={data}
            renderItem={render}
            keyExtractor={(item) => item.notification.id}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          /> : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../../../assets/images/human.png')}
              style={{ width: 200, height: 300, opacity: 0.7 }}
            />
            <Text style={{ color: '#9c9c9c', marginTop: 5 }}>{t("You don't have any notifications")}</Text>
          </View>)}

        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
