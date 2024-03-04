import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (!user) {
    return <Redirect href="/web/Admin/accountManagement/accountManagement" />;
  }

  return (
    <View>
      <Text>Hello world</Text>
    </View>
  )
}

export default Dashboard