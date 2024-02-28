import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, Modal, TouchableOpacity, Button, LayoutAnimation, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { ChevronRight, Home } from 'lucide-react-native'
import SHADOW from '../../../constants/shadow'
interface YearData {
  year: number;
  months: { month: number; total: number }[];
}

const data: { year: number; month: number; total: number }[] = [
  { year: 2023, month: 1, total: 1000 },
  { year: 2023, month: 2, total: 1200 },
  { year: 2023, month: 3, total: 1500 },
  { year: 2023, month: 4, total: 800 },
  { year: 2023, month: 5, total: 1100 },
  { year: 2023, month: 6, total: 1300 },
  { year: 2024, month: 1, total: 1400 },
  { year: 2024, month: 2, total: 1600 },
];

const Bill = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [animation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));
  const groupByYear: YearData[] = data.reduce((acc, current) => {
    const year = current.year;
    const existingYear = acc.find((item) => item.year === year);

    if (existingYear) {
      existingYear.months.push({ month: current.month, total: current.total });
    } else {
      acc.push({ year, months: [{ month: current.month, total: current.total }] });
    }

    return acc;
  }, [] as YearData[]);
  const initialExpandedItems: { [year: string]: boolean } = {};
  for (const item of data.reduce((acc, current) => {
    // ... groupByYear logic (unchanged)
    return acc;
  }, [] as YearData[])) {
    initialExpandedItems[item.year.toString()] = false;
  }
  const [expandedItems, setExpandedItems] = useState(initialExpandedItems);;
  console.log(expandedItems)
  const toggleExpand = (year: string) => {
    setExpandedItems((prevExpanded) => ({
      ...prevExpanded,
      [year]: !prevExpanded[year],
    }));

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.parallel([
      Animated.timing(animation, {
        toValue: expandedItems[year] ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: expandedItems ? 0 : 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const boxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  


  const renderItem = ({ item }: { item: YearData }) => {
    const year = item.year.toString(); 

    return (
      <View >
        <View style={styles.hotlineBox}>
          <TouchableOpacity
          onPress={() => toggleExpand(year)}
          style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.year}</Text>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <ChevronRight strokeWidth={2} color={"black"} />
            </Animated.View>
          </TouchableOpacity>
          <Animated.View style={{ height: boxHeight, overflow: "hidden" }}>
            <View style={styles.hotlineDropdown}>
              <View>
                <FlatList
                  data={item.months}
                  renderItem={({ item }: { item: { month: number; total: number } }) => (
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Month: {item.month}, Total: {item.total}
                    </Text>
                  )}
                  keyExtractor={(item) => item.month.toString()}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  };
  return (
    <>
      <Header headerTitle={t("Bill")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingVertical: 20, borderBottomWidth: 0.5, borderColor: '#9C9C9C' }}>
            <View style={{ paddingHorizontal: 26 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{t("Bill list")}</Text>
              <Text style={{ marginTop: 5 }}>{t("List bill for room")}</Text>
              <View style={[styles.room, {
                backgroundColor: theme.sub,
                borderColor: theme.primary,
              }]}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>R2.2332</Text>
                  <Text style={{ color: '#9C9C9C', fontWeight: '300' }}>Times city, Hà Nội</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <FlatList
            style={{paddingHorizontal: 26, paddingVertical:30}}
              data={groupByYear}
              renderItem={renderItem}
              keyExtractor={(item) => item.year.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  room: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10, marginTop: 10,
  },
  hotlineBox:{
    ...SHADOW,
    marginTop:20,
    borderRadius:10,
    backgroundColor:"white",
    padding:20
},
hotlineDropdown:{
    marginTop:10
},
callBox:{
    backgroundColor: '#ED6666',
    borderRadius: 10, padding: 5,
    flexDirection: 'row',
    width:80,
    height:30,
    justifyContent: 'center',
    alignItems: 'center',
}
})

export default Bill