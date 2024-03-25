import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SIZES, COLORS } from '../../../constants';
import { posts } from '../../../constants/fakeData';
import RoomItemCard from './roomItemCard';
import { Link } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import Button from '../../ui/button';
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Center, TextArea } from "native-base";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Account } from '../../../interface/accountType';

const RoomItem = (props: any) => {
  const { floor, data, isLoading, setIsLoading } = props;
  console.log("data", data);
  const [addOwner, setAddOwner] = useState(false);
  const [password, setPassword] = useState("Mật khẩu");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${data.accountId}`, {
          timeout: 10000,
        });
        console.log(response);
        if (response.status === 200) {
          setAccount(response.data.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin căn hộ',
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
        console.error('Error fetching room data:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin căn hộ',
          position: 'bottom'
        })
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };
    fetchData();
  }, []);

  // ADD: Owner Account

  return (
    <TouchableOpacity style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Floor {floor}</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
          // ) : error ? (
          // <Text>Something went wrong</Text>
        ) : account?.status !== 0 ? (
          <Link href={`./rooms/${data?.id}`}>
            <RoomItemCard
              item={data}
              account={account}
            />
          </Link>
        ) : <View><RoomItemCard item={account} button={<Button text='Thêm chủ căn hộ' onPress={() => setAddOwner(true)} />} /></View>}
      </View>
      
      {/* MODAL add */}
      <Modal isOpen={addOwner} onClose={() => setAddOwner(false)} justifyContent="center" bottom="4" size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Thêm tài khoản chủ căn hộ</Modal.Header>
          <Modal.Body>
            <FormControl mt="3">
              <FormControl.Label>Tên chủ căn hộ</FormControl.Label>
              <Input value={fullName} onChangeText={(text) => setFullName(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Tên đăng nhập</FormControl.Label>
              <Input value={username} onChangeText={(text) => setUsername(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Mật khẩu</FormControl.Label>
              <Input value={password} onChangeText={(text) => setPassword(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
              <Input value={reEnterPassword} onChangeText={(text) => setReEnterPassword(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Số điện thoại</FormControl.Label>
              <Input value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input value={email} onChangeText={(text) => setEmail(text)} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <ButtonNative flex="1" onPress={() => {
              // createUtility();
              setAddOwner(false);
            }}>
              Thêm chủ căn hộ
            </ButtonNative>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </TouchableOpacity>
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
    // marginTop: SIZES.xSmall,
  },

})

export default RoomItem