import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SIZES, COLORS } from '../../../constants';
import { posts } from '../../../constants/fakeData';
import RoomItemCard from './roomItemCard';
import { Link } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const RoomItem = (props: any) => {
  const { floor, data, isLoading } = props;
  return (
    <TouchableOpacity style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Floor {floor}</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
          // ) : error ? (
          // <Text>Something went wrong</Text>
        ) : (
          <Link href={`./rooms/${data.accountId}`}>
            <RoomItemCard
              item={data}
            />
          </Link>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerBtn: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    // marginTop: SIZES.xSmall,
  },

})

export default RoomItem