import { Image, SafeAreaView } from "react-native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import Header from "../../../../../components/resident/header";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import SHADOW from "../../../../../constants/shadow";
import { CircleDotDashedIcon, MapPin, Settings } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import LoadingComponent from "../../../../../components/resident/loading";
import { useLocalSearchParams } from "expo-router";
interface UtilityDetail {
  id: string;
  name: string;
  utilityId: string;
}

export default function UtilityPlace() {
  const utility = useLocalSearchParams();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utilities, setUtilities] = useState<UtilityDetail[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          'https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-utility-detail',
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
  const renderItem = ({item}:{item:UtilityDetail}) => {
    return(
      <View style={{
        marginRight: 10,
        marginTop: 10,
        backgroundColor:'white',
        borderRadius:10,
        flex:1,
        ...SHADOW,
        padding: 15,
      }}>
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(mobile)/(screens)/(utility)/schedules/utilitySchedule`,
          params: {
            id: utility.id,
            // openTime:utility.openTime,
            // closeTime:utility.closeTime,
            numberOfSlot:utility.numberOfSlot,
            price:utility.price,
            utilityName:utility.utilityName,
            location:utility.location,
            utitlityDetailId:item.id
            // utilityDetailId:item.id
          },
        })
      }
    >
      <Text style={{fontWeight:'bold', fontSize:18}}>{item.name}</Text>
    </Pressable>
<View style={{flexDirection:'row', alignItems:'center'}}>
    <MapPin strokeWidth={1.5} color={'#9c9c9c'}></MapPin>
    <Text style={{fontSize:14, color:'#9c9c9c'}}>{utility.location}</Text>
    </View>
    </View>
  )};
  return (
    <>
    <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Utility list")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{flex:1}}>
        <View style={{ paddingHorizontal: 26, marginTop:20 }}>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{utility.utilityName}</Text>
              <Text>{t("Utility location list")}</Text>
            </View>
              <FlatList
               style={{ paddingHorizontal: 26 }}
                data={utilities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
              />
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
