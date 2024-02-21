import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../styles/indexStyles';
import stylesProfileScreen from '../styles/profileScreenStyles';
import { ChevronRight, KeyRound, Languages, Pencil } from 'lucide-react-native';
import { Link } from 'expo-router';
import { COLORS } from '../../../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
    return (
        <>
            <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
                <StatusBar barStyle='dark-content'></StatusBar>
                <View style={styles.gradientContainer}>
                    <LinearGradient
                        colors={['#B2BC86', '#CCD6A6']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={{
                            width: 350,
                            height: 350,
                            borderRadius: 225,
                            position: 'absolute',
                            top: -40,
                            right: -100,
                        }}
                    />
                </View>
                <ScrollView style={{ marginHorizontal: 26 }}>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 30,
                        }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerText}>Tài khoản</Text>
                            <Text style={styles.normalText}>Quản lý thông tin cá nhân</Text>
                        </View>
                        <TouchableOpacity>
                            <Image
                                style={stylesProfileScreen.avatar}
                                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU' }} />
                        </TouchableOpacity>
                    </View>

                    <View style={stylesProfileScreen.box}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Họ và tên:</Text>
                            <Text style={{ marginLeft: 5, fontWeight: 'bold', marginBottom: 5 }}>Hoa la canh</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Số điện thoại:</Text>
                            <Text style={{ marginLeft: 5 }}>0123 232 2312</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={stylesProfileScreen.room}>
                        <Image
                            style={{
                                width: 56,
                                height: 56
                            }}
                            source={require('../../../../assets/images/house1.png')}></Image>
                        <View style={{
                            marginLeft: 20
                        }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>R2.18A00</Text>
                            <Text style={{ fontWeight: '300' }}>Times city, Hà Nội</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 30 }}>
                        <Link href="/screens/resident/personalInformationScreen">
                            <View style={{ width: '100%' }}>
                                <TouchableOpacity style={stylesProfileScreen.feature}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Pencil color={'black'} style={{ marginRight: 15 }} strokeWidth={1.5}></Pencil>
                                        <Text >Cập nhật thông tin</Text>
                                    </View>
                                    <ChevronRight color={'black'} size={26} strokeWidth={1.75}></ChevronRight>
                                </TouchableOpacity>
                            </View>
                        </Link>
                        <Link href="/screens/resident/changePasswordScreen">
                            <View style={{ width: '100%' }}>
                                <TouchableOpacity style={stylesProfileScreen.feature}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <KeyRound color={'black'} style={{ marginRight: 15 }} strokeWidth={1.5}></KeyRound>
                                        <Text>Đổi mật khẩu</Text>
                                    </View>
                                    <ChevronRight color={'black'} size={26} strokeWidth={1.75}></ChevronRight>
                                </TouchableOpacity>
                            </View>
                        </Link>

                        <TouchableOpacity style={stylesProfileScreen.feature}>
                            <View style={{ flexDirection: 'row' }}>
                                <Languages color={'black'} style={{ marginRight: 15 }} strokeWidth={1.5}></Languages>
                                <Text >Ngôn ngữ</Text>
                            </View>
                            <ChevronRight color={'black'} size={26} strokeWidth={1.75}></ChevronRight>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={stylesProfileScreen.logoutButton}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Đăng xuất</Text>
                    </TouchableOpacity>
                </ScrollView></SafeAreaView></>
    )
}

export default ProfileScreen;