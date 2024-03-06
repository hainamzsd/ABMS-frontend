import { Image, SafeAreaView } from "react-native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import Header from "../../../../components/resident/header";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import SHADOW from "../../../../constants/shadow";
import { CircleDotDashedIcon, Settings } from "lucide-react-native";
import { router } from "expo-router";
import ICON_MAP from "../../../../constants/iconUtility";
import { useEffect, useState } from "react";
import axios from 'axios';
import LoadingComponent from "../../../../components/resident/loading";
import { calculateSlots } from "../../../../utils/convertSlot";
interface Utility {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  numberOfSlot: number;
  pricePerSlot: number;
  description: string;
  createUser: string;
  createTime: string;
  modifyUser: string;
  modifyTime: string;
  status: number;
}

export default function UtilityList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          'http://localhost:5108/api/v1/utility/get-all',
        );
        setUtilities(response?.data?.data);
        console.log(response?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t("System error please try again later"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const renderItem = ({item}:{item:Utility}) => {
    const icon = ICON_MAP[item.name];
    return(
    <Pressable
      style={{
        alignItems: "center",
        width: "30%",
        marginRight: 10,
        marginTop: 10,
      }}
      onPress={() =>
        router.push({
          pathname: `/(mobile)/(screens)/(utility)/schedules/utilitySchedule`,
          params: {
            id: item.id,
            openTime:item.openTime,
            closeTime:item.closeTime,
            numberOfSlot:item.numberOfSlot,
            price:item.pricePerSlot,
            utilityName:item.name
          },
        })
      }
    >
      <View style={[styles.circle, { backgroundColor: theme.sub }]}>
      {icon && <Image source={icon} style={{width:24,height:24}}/>}
      </View>
      <Text>{item.name}</Text>
    </Pressable>
  )};
  return (
    <>
    <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Utility list")} headerRight
      rightPath={"reservationUtilityList"}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={styles.container}>
            <View style={styles.row}>
              <FlatList
                data={utilities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    padding: 20,
    backgroundColor: "white",
    ...SHADOW,
  },
  row: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  item: {
    width: "30%",
    padding: 10,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
