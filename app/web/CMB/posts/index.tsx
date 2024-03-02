import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import PostItem from '../../../../components/ui/PostItem';  // Adjust the import path according to your file structure
import { Link } from 'expo-router';
import Button from '../../../../components/ui/button';
import Input from '../../../../components/ui/input';

const posts = [
    {
        id: '1',
        title: 'Post Title One',
        content: 'This is the content of the first post...',
        date: '2023-01-01',
        imageUrl: 'https://images.pexels.com/photos/1254736/pexels-photo-1254736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    }, 
];

const Page: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView >
                <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách bài viết</Text>
                        <Text>Thông tin các bài viết</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                    <Input placeholder="Tìm tên tài khoản" style={{ width: '100%', paddingVertical: 10 }} />
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
                            href="/web/CMB/posts/posts/1"
                        />
                    )}
                    keyExtractor={item => item.id} />
            </SafeAreaView>
        </View>



    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Adjust background color
    },
});

export default Page;
