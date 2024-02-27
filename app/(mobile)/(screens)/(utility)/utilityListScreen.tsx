import { SafeAreaView } from "react-native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import Header from "../../../../components/resident/header";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import SHADOW from "../../../../constants/shadow";
import { Settings } from "lucide-react-native";
import { router } from "expo-router";
export default function UtilityList() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const data = [{ id: "1", name: "Service 1" }];
  const renderItem = ({ item }: any) => (
    <Pressable
      style={{
        alignItems: "center",
        width: "30%",
        marginRight: 10,
        marginTop: 10,
      }}
      onPress={() =>
        router.push({
          pathname: `/(mobile)/(screens)/(utility)/schedules/${item.name}`,
          params: item,
        })
      }
    >
      <View style={[styles.circle, { backgroundColor: theme.sub }]}>
        <Settings color={"black"} strokeWidth={1.5}></Settings>
      </View>
      <Text>{item.name}</Text>
    </Pressable>
  );
  return (
    <>
      <Header headerTitle={t("Utility list")} headerRight></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={styles.container}>
            <View style={styles.row}>
              <FlatList
                data={data}
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
