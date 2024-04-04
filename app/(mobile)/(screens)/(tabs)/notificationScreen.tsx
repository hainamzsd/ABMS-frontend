import {
  ScrollView,
  Text,
  View,
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
import { Clock } from "lucide-react-native";
import { router } from "expo-router";

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
  isRead: boolean
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
  const fetchItems = async (count = 10) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/get-notification?accountId=${user.Id}&skip=0&take=${count}`, {
        timeout: 10000
      });
      setData(response.data); // Store all data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setShowError(true);
        setError("Failed to retrieve posts" + ".");
      }
      setShowError(true);
      setError(t('Failed to retrieve posts') + ".");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchItems();
    }
  }, [isFocused]);


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
      // onPress={() => router.push(`/(mobile)/(screens)/(post)/${item.notification.id}`)}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Clock color={'#9c9c9c'} size={20} style={{ marginRight: 5 }}></Clock>
          <Text
            style={{ fontWeight: "300", color: "#9C9C9C" }}>
            {moment.utc(item?.notification.createTime).format("DD/MM/YYYY")}
          </Text>
        </View>
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
