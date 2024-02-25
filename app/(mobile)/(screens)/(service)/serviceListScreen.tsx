import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import Header from "../../../../components/resident/header";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import SHADOW from "../../../../constants/shadow";
import { CarFront, Hammer, Settings } from "lucide-react-native";

export default function ServiceList() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = [
    {
      serviceName: "Register parking card",
      path: "/(mobile)/(screens)/(service)/serviceListScreen",
      icon: <CarFront color={"black"} strokeWidth={1.5}></CarFront>,
    },
    {
      serviceName: t("Register construction"),
      path: "/(mobile)/(screens)/(service)/serviceListScreen",
      icon: <Hammer color={"black"} strokeWidth={1.5}></Hammer>,
    },
  ];

  const renderItem = ({ item }: any) => (
    <Pressable style={styles.featureBox}>
      <Link href={item.path}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
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
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureBox: {
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 10,
    width: "45%",
    height: 100,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Take up remaining space
    flexDirection: "column", // Stack text vertically if needed
  },
});
