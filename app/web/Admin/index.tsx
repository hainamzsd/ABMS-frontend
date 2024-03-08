import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (!user) {
    return <Redirect href="/web/Admin/accounts" />;
  }

  return (
    // Liet ke so tai khoan CMB, so building dang quan ly
    // So account role resident dang su dung
    <View>
      <Text>Welcome back, Admin</Text>
    </View>
  )
}

export default Dashboard