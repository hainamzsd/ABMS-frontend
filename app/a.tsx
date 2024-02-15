import { SplashScreen, Stack } from 'expo-router';
import {
    View, FlatList, SafeAreaView,
    ScrollView, Image,
    Text,
    TouchableOpacity,
    StyleSheet, Animated
} from 'react-native';
import styles from './styles/indexStyles';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import HomeScreen from './screens/resident/homeScreen';
import ProfileScreen from './screens/resident/profileScreen';
import NotificationScreen from './screens/resident/notificationScreen';
import { Home, Bell, User } from 'lucide-react-native';


const Layout = ({ children }: any) => {

    const [selectedTab, setSelectedTab] = useState<String>('Home');

    
    const renderScreen = () => {
        switch (selectedTab) {
            case 'Home':
                return <HomeScreen />;
            case 'Profile':
                return <ProfileScreen />;
            case 'Notifications':
                return <NotificationScreen />;
            default:
                return null;
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={styles.gradientContainer}>
                <LinearGradient
                    colors={['#B2BC86', '#CCD6A6']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={{
                        width: 350,
                        height: 350,
                        borderRadius: 225,
                        position: 'absolute',
                        top: -50,
                        left: -80,
                    }}
                />
            </Animated.View>


            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {renderScreen()}
                </View>
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Home' && styles.selectedTab]}
                        onPress={() => setSelectedTab('Home')}>
                        <Home size={30} color={'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Profile' && styles.selectedTab]}
                        onPress={() => setSelectedTab('Profile')}>
                        <User size={30} color={'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Notifications' && styles.selectedTab]}
                        onPress={() => setSelectedTab('Notifications')}>
                        <Bell size={30} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>

    );
}

export default Layout;

