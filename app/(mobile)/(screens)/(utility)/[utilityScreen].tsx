import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text } from "react-native";

export default function Page() {
  const item = useLocalSearchParams();
  console.log(item);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      <Text style={{ marginTop: 200 }}>{item.id} a</Text>
    </SafeAreaView>
  );
}
