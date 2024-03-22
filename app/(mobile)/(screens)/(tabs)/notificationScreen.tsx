import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  FlatList,
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

interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  BuildingId:string;
}

interface Post{
  id: string;
  title: string;
  content: string;
  image: string;
  createUser: string;
  createTime: Date,
  modifyUser: string;
  modifyTime: string;
  status: number;
  buildingId: string;
  type: number;
}
const NotificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Post[]>([]); 
  const [displayData, setDisplayData] = useState<Post[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  useEffect(() => {
    const fetchItems = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/get-all?buildingId=${user.BuildingId}&type=1`,{
                timeout:10000
            });
            setData(response.data.data); // Store all data
            setDisplayData(response.data.data);
            console.log(displayData)
        } catch (error) {
            if(axios.isAxiosError(error)){
              setShowError(true);
                setError("Failed to retrieve posts"+".");
            }
            setShowError(true);
            setError(t('Failed to retrieve posts')+".");
        } finally {
            setIsLoading(false);
        }
    };
    if(isFocused){
        fetchItems();
    }
}, [isFocused]);

const PER_PAGE = 3;
useEffect(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    setDisplayData(data.slice(startIndex, endIndex));
}, [currentPage, data]);


const loadMoreItems = () => {
    // Only attempt to load more items if there are more items to load
    if (!isLoading && displayData.length < data.length) {
        setCurrentPage(currentPage => currentPage + 1);
    }
};
const renderFooter = () => {
if (isLoading) {
  return <ActivityIndicator size="small"  color={theme.primary}/>;
}
return null;
};
  const render = ({ item }: {item:Post}) => (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: "white",
          marginTop:20
        
        },
        SHADOW,
      ]}
      onPress={()=>router.push(`/(mobile)/(screens)/(post)/${item.id}`)}
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
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>
            {item?.title}
          </Text>
          <Text style={{ marginBottom: 5 }}>
          {item?.content
            ? truncateText(item.content, 30) // Truncate at 30 characters (adjust as needed)
            : ''}
          </Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
        <Clock color={'#9c9c9c'} size={20} style={{marginRight:5}}></Clock>
        <Text
          style={{ fontWeight: "300", color: "#9C9C9C" }}>
          {moment.utc(item?.createTime).format("DD/MM/YYYY")}
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
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
        <LoadingComponent loading={isLoading}></LoadingComponent>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{ marginHorizontal: 26, marginVertical: 20, fontSize: 24, fontWeight: "bold" }}
          >
            {t("Notification list")}
          </Text>
          <FlatList
            style={{ paddingHorizontal: 26 }}
            data={displayData}
            renderItem={render}
            keyExtractor={(item) => item.id}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5} 
            ListFooterComponent={renderFooter}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
