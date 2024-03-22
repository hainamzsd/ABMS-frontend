import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useSession } from '../../context/AuthContext';
import { useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LoadingComponent from '../../../../components/resident/loading';
import AlertWithButton from '../../../../components/resident/AlertWithButton';
import Header from '../../../../components/resident/header';
import { Clock } from 'lucide-react-native';
import moment from 'moment';

interface Post{
    id: string;
    title: string;
    content: string;
    image: string;
    createUser: string;
    createTime: Date,
    modifyUser: string;
    modifyTime: string;
    status: number;
    buildingId: string;
    type: number;
  }

const page = () => {
    const item = useLocalSearchParams();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { session } = useSession();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState(false);
    const [data, setData] = useState<Post>();
    useEffect(() => {
        const fetchItems = async () => {
            setError("");
            if (item) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/getPostId/${item.post}`, {
                        timeout: 10000
                    });
                    if (response.data.statusCode == 200) {
                        setData(response.data.data);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        setShowError(true);
                        setError(t("System error please try again later") + ".");
                        return;
                    }
                    setShowError(true);
                    console.error('Error fetching reservations:', error);
                    setError(t('Failed to return requests') + ".");
                } finally {
                    setIsLoading(false);
                }
            }

        };
        fetchItems();
    }, []);

  return (
    <>
     <LoadingComponent loading={isLoading}></LoadingComponent>
            <AlertWithButton title={t("Error")} content={error} visible={showError}
                onClose={() => setShowError(false)}
            ></AlertWithButton>
            <Header headerTitle={t("Post detail")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                    {data?.image && <Image source={{uri:data?.image}} 
                            style={{width:'100%',height:200,objectFit:'cover'}}></Image>}
                        <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                            
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Clock strokeWidth={2} size={20} color={'black'}></Clock>
                                <Text>{moment.utc(data?.createTime).format("DD-MM-YYYY")}</Text>
                            </View>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
                                {data?.title}</Text> 

                            <Text style={{marginTop:20}}>
                                {data?.content}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}

export default page