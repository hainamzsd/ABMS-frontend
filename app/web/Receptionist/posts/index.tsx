import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import Input from '../../../../components/ui/input';
import PostItem from '../../../../components/ui/PostItem';
import { user } from '../../../../interface/accountType';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../../../interface/postType';
import axios from 'axios';
import moment from 'moment';
import Button from '../../../../components/ui/button';
import { actionController, API_BASE } from "../../../../constants/action"
import { ToastFail } from '../../../../constants/toastMessage';
import { COLORS, SIZES } from '../../../../constants';
import { Link, router } from 'expo-router';
import { paginate } from '../../../../utils/pagination';
import { CheckIcon, Select, Button as ButtonBase } from 'native-base';
import { filterPost, filterPostStatus } from '../../../../constants/filter';

const PostList = () => {
  const { session } = useAuth();
  const user: user = jwtDecode(session as string);

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRequest, setFilterRequest] = useState<Post[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Paging
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { currentItems, totalPages } = paginate(filterRequest, currentPage, itemsPerPage)

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

  // Search
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = posts?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilterRequest(filtered);
    } else {
      setFilterRequest(posts);
    }
  }, [searchQuery, posts])

  // Filter Type and Status
  useEffect(() => {
    let filtered: Post[] = posts;

    if (filterType !== "") {
      filtered = filtered.filter(item => item.type.toString() === filterType);
    }
  
    if (filterStatus !== "") {
      filtered = filtered.filter(item => item.status.toString() === filterStatus);
    }
  
    setFilterRequest(filtered);
  }, [filterType, filterStatus, posts])

  // Cancel Filter
  const handleCancelFilter = () => {
    setFilterType("");
    setFilterStatus("");
    fetchPosts();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách bài viết</Text>
              <Text>Thông tin các bài viết</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Input placeholder="Tìm tên tiêu đề bài viết" style={{ width: '100%', paddingVertical: 10 }} value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
              {/* Filter */}
            </View>
            <View style={{ marginBottom: SIZES.xSmall }}>
              <Button text="Thêm bài viết" onPress={() => router.push({
                pathname: `/web/Receptionist/posts/create`
              })} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Category */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <Select selectedValue={filterType} maxWidth={150} accessibilityLabel="Phân loại" placeholder="Phân loại" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => setFilterType(itemValue)}>
                  {filterPost.map((item) => (
                    <Select.Item key={item.value} label={item.name} value={item.value} />
                  ))}
                </Select>

              </View>

              {/* Status */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <Select selectedValue={filterStatus} maxWidth={150} accessibilityLabel="Trạng thái" placeholder="Trạng thái" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => setFilterStatus(itemValue)}>
                  {filterPostStatus.map((item) => (
                    <Select.Item key={item.value} label={item.name} value={item.value} />
                  ))}
                </Select>
              </View>
              {(filterType !== "" || filterStatus !== "") && <ButtonBase onPress={handleCancelFilter} style={{ marginTop: 4 }} height="35">Huỷ lọc</ButtonBase>}
            </View>
            {isLoading ? <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator> : filterRequest.length > 0 ?
              <FlatList
                data={currentItems}
                renderItem={({ item }) => (
                  <PostItem
                    title={item.title}
                    content={item?.content}
                    imageUrl={item.image}
                    href={`/web/Receptionist/posts/${item.id}`}
                    date={moment.utc(item?.createTime).format("DD-MM-YYYY")}
                    status={item?.status}
                  />
                )}
                keyExtractor={item => item.id} />
              : <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Không tìm thấy bài viết.</Text></View>
            }
          </View>
          {/* Paging */}
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
            <Button text="Trước"
              style={{ width: 50 }}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            <Text style={{ marginHorizontal: 10, fontWeight: "600" }}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button text="Sau" onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </View>
        </ScrollView>
      </SafeAreaView>

    </View>
  )
}

export default PostList