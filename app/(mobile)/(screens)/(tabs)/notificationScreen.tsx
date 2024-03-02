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


export const MOCK_DATA = [
  { id: 1, name: 'Item 1', description: 'Description for item 1' },
  { id: 2, name: 'Item 2', description: 'Description for item 2' },
  { id: 3, name: 'Item 3', description: 'Description for item 3' },
  { id: 4, name: 'Item 3', description: 'Description for item 3' },
  { id: 5, name: 'Item 3', description: 'Description for item 3' },
  { id: 6, name: 'Item 3', description: 'Description for item 3' },
  { id: 7, name: 'Item 3', description: 'Description for item 3' },
  { id: 8, name: 'Item 3', description: 'Description for item 3' },
];

const NotificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [dataToDisplay, setDataToDisplay] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state

  useEffect(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    const newData = MOCK_DATA.slice(startIndex, endIndex);
    // Append new data to existing data
    setDataToDisplay([...dataToDisplay, ...newData]);
  }, [currentPage]); // Update data when page changes

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const newData = await fetchItems(currentPage);
  //       setData([...data, ...newData]); // Append new data
  //     };
  //     fetchData();
  //   }, [currentPage]); 


  const handleNextPage = async () => {
    if (currentPage * 3 < MOCK_DATA.length && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate delayed loading for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentPage(currentPage + 1);
      setIsLoadingMore(false);
    }
  };
  const renderFooter = () => {
    if (isLoadingMore) {
      return <ActivityIndicator size="small" color={theme.primary} />;
    }
    return null;

  };
  const render = ({ item }: any) => (
    <Pressable
      style={[
        {
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: "white",
          marginTop:20
        
        },
        SHADOW,
      ]}
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
            Thông báo chung
          </Text>
          <Text style={{ marginBottom: 5 }}>
            lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
            lorem loremloremloremlorem
          </Text>
        </View>
        <Text
          style={{ fontWeight: "300", color: "#9C9C9C" }}>
          22 tháng 1, 2024
        </Text>
      </View>
    </Pressable>
  )
  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{ marginHorizontal: 26, marginVertical: 20, fontSize: 24, fontWeight: "bold" }}
          >
            {t("Notification list")}
          </Text>
          <FlatList
            style={{ paddingHorizontal: 26 }}
            data={dataToDisplay}
            renderItem={render}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleNextPage}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
