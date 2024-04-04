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
import { actionController, API_BASE } from "../../../../constants/action"
import { ToastFail } from '../../../../constants/toastMessage';
import { COLORS, SIZES } from '../../../../constants';
import { Link, router } from 'expo-router';

const PostList = () => {
  const { session } = useAuth();
  const user: user = jwtDecode(session as string);

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRequest, setFilterRequest] = useState<Post[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/${actionController.POST}/get-all?buildingId=${user?.BuildingId}`, {
        timeout: 10000,
      });
      if (response.data.statusCode === 200) {
        setPosts(response.data.data);
      } else {
        ToastFail('Lỗi lấy thông tin các bài viết');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error fetching posts data:', error);
      ToastFail('Lỗi lấy thông tin các bài viết')
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [])

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = posts?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilterRequest(filtered);
    }else {
      setFilterRequest(posts);
    }
  }, [searchQuery, posts])

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách bài viết</Text>
            <Text>Thông tin các bài viết</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Input placeholder="Tìm tên tiêu đề bài viết" style={{ width: '100%', paddingVertical: 10 }} value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
            {/* Filter */}
          </View>
          <View style={{ marginBottom: SIZES.medium }}>
            <Button text="Thêm bài viết" onPress={() => router.push({
              pathname: `/web/Receptionist/posts/create`
            })} />
          </View>
          {filterRequest.length > 0 ?
          <FlatList
            data={filterRequest}
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
              : <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Không tìm thấy bài viết.</Text></View>
            }
        </View>
      </SafeAreaView>
      {/* Paging */}
    </View>
  )
}

export default PostList