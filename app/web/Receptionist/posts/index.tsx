import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, FlatList } from 'react-native'
import Input from '../../../../components/ui/input';
import PostItem from '../../../../components/ui/PostItem';
import { posts } from "../../../../constants/fakeData"
import { user } from '../../../../interface/accountType';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../../../interface/postType';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import Button from '../../../../components/ui/button';

const PostList = () => {
  const { session } = useAuth();
  const user: user = jwtDecode(session as string);

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/get-all?buildingId=${user?.BuildingId}`, {
        timeout: 10000,
      });
      if (response.status === 200) {
        setPosts(response.data.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin các bài viết',
          position: 'bottom'
        })
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        Toast.show({
          type: 'error',
          text1: 'Hệ thống lỗi! Vui lòng thử lại sau',
          position: 'bottom'
        })
      }
      console.error('Error fetching posts data:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi lấy thông tin các bài viết',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
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
              imageUrl={item.image}
              href={`/web/Receptionist/posts/${item.id}`}
              date={moment.utc(item?.createTime).format("DD-MM-YYYY")}

            />
          )}
          keyExtractor={item => item.id} />
        <View style={{flex: 1}}>
          <Button text="Thêm bài viết" />
        </View>
      </SafeAreaView>
      {/* Paging */}
    </View>
  )
}

export default PostList