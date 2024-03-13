import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SIZES, COLORS } from '../../../constants';
import { posts } from '../../../constants/fakeData';
import RoomItemCard from './roomItemCard';

const RoomItem = (props: any) => {
  const { floor, children } = props;
  const handleCardPress = () => {
    
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Floor {floor}</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <PopularJobCard
                item={item}
                selectedJob={selectedJob}
                handleCardPress={handleCardPress}
              />
            )}
            keyExtractor={(item) => item.job_id}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        )}
      </View> */}
      <FlatList
        data={posts}
        renderItem={({ item }: { item: any }) => (
          <RoomItemCard
            item={item}
            selectedJob={"selectedJob"}
            handleCardPress={handleCardPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ columnGap: SIZES.medium }}
        horizontal
      />
    </View>
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
    marginTop: SIZES.medium,
  },

})

export default RoomItem