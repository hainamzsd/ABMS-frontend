import React, { useEffect } from 'react'
import { View, SafeAreaView, Text, FlatList } from 'react-native'
import Input from '../../../../components/ui/input';
import PostItem from '../../../../components/ui/PostItem';
import { posts } from "../../../../constants/fakeData"

const PostList = () => {
  useEffect(() => {
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{flex:1}}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách bài viết</Text>
            <Text>Thông tin các bài viết</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Input placeholder="Tìm tên tài khoản" style={{ width: '100%', paddingVertical: 10 }} />
            {/* Filter */}
          </View>
        </View>
        <FlatList
          style={{ paddingHorizontal: 30, paddingVertical: 10 }}
          data={posts}
          renderItem={({ item }) => (
            <PostItem
              title={item.title}
              content={item.content}
              date={item.date}
              imageUrl={item.imageUrl}
              href={`/web/Receptionist/posts/${item.id}`}
            />
          )}
          keyExtractor={item => item.id} />
      </SafeAreaView>
      {/* Paging */}
    </View>
  )
}

export default PostList