import { Link, Stack } from "expo-router";
import { SafeAreaView, Text, View, Dimensions } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Redirect } from "expo-router";
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ScrollView } from "react-native";
export default function Dashboard() {
  const { isLoading, session } = useAuth();
  const screenWidth = Dimensions.get('window').width;
  if (!session) {
    return <Redirect href="/web/login" />;
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 30,
          paddingVertical: 30,
          backgroundColor: "#F9FAFB",
        }}
      >
        <SafeAreaView>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Cổng quản lý của ban quản lý chung cư
            </Text>
            <Text>Danh sách thống kê</Text>
          </View>
          <ScrollView>
            <View>
              <Text>Line Chart</Text>
              <LineChart
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                  datasets: [
                    {
                      data: [20, 45, 28, 80, 99, 43],
                    },
                  ],
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <Text>Pie Chart</Text>
              <PieChart
                data={[
                  { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                  { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                  { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                  { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                  { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
                ]}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 50]}
                absolute
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}
