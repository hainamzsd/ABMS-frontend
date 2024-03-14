import {
    View,
    Text,
    SafeAreaView,
    Pressable,
    StyleSheet,
    FlatList,
  } from "react-native";
  import Header from "../../../../../components/resident/header";
  import { useTheme } from "../../../context/ThemeContext";
  import { useTranslation } from "react-i18next";
  import { Link } from "expo-router";
  import SHADOW from "../../../../../constants/shadow";
  import {
    CarFront,
    Contact,
    CreditCard,
    GanttChart,
    Hammer,
    ListX,
    Settings,
  } from "lucide-react-native";
  
  export default function page() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const data = [
      {
        serviceName: t("Register parking card"),
        path: "/(mobile)/(screens)/(service)/parking/parkingCardRegisterScreen",
        icon: <CarFront color={"black"} strokeWidth={1.5}></CarFront>,
      },
      {
        serviceName: t("Parking card list"),
        path: "/(mobile)/(screens)/(service)/parking/cardList",
        icon: <CreditCard color={"black"} strokeWidth={1.5}></CreditCard>,
      },
      {
        serviceName: t("Cancel card"),
        path: "/(mobile)/(screens)/(service)/parking/delete",
        icon: <ListX color={"black"} strokeWidth={1.5}></ListX>,
      },
    ];
  
    const renderItem = ({ item }: any) => (
      <Pressable style={styles.featureBox}>
        <Link href={item.path}>
          <View style={{}}>
          <View style={[styles.circle, { backgroundColor: theme.sub }]}>
            {item.icon}
          </View>
            <View style={styles.textContainer}>
              <Text style={{ flexShrink: 1 }}>{t(item.serviceName)}</Text>
            </View>
          </View>
        </Link>
      </Pressable>
    );
  
    return (
      <>
        <Header headerTitle={t("Service list")}></Header>
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
          <View style={{ marginHorizontal: 26 }}>
            <View style={styles.featureContainer}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.serviceName}
                numColumns={2}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    featureContainer: {
      marginTop: 36,
    },
    featureBox: {
      ...SHADOW,
      backgroundColor: "white",
      borderRadius: 10,
      width: "45%",
      height: 130,
      marginBottom: 10,
      padding: 10,
      marginHorizontal: 5,
    },
    circle: {
      width: 60,
      height: 60,
      marginBottom: 10,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    textContainer: {
    },
  });
  