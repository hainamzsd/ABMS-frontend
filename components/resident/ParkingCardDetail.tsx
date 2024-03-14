import axios from 'axios';
import { X } from 'lucide-react-native';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, StyleSheet, ScrollView, Dimensions, Touchable, TouchableOpacity } from 'react-native';
import { useSession } from '../../app/(mobile)/context/AuthContext';
import AlertWithButton from './AlertWithButton';
import Alert from './Alert';
import LoadingComponent from './loading';
import CustomAlert from './confirmAlert';

interface ParkingCardDetailProps {
    visible: boolean;
    item: ParkingCard;
    onRequestClose: () => void; 
}

interface ParkingCard{
    id: string;
    residentId: string;
    licensePlate: string;
    brand: string;
    color: string;
    type: number,
    image: string,
    expireDate: string,
    note: string;
    createUser: string;
    createTime: Date,
    modifyUser: string;
    modifyTime: string;
    status: number,
    resident: {
      id: string;
      fullName:string;
  }
}
const vehicleType: { [key: number]: string } ={
    1: "Xe máy",
    2: "Ô tô",
    3: "Xe đạp"
}
const ParkingCardDetail: React.FC<ParkingCardDetailProps> = ({ visible, item, onRequestClose }) => {
    const {t} = useTranslation();
    

    return (
        <>
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.scrollView}>
                        <View style={{ borderBottomWidth: 0.5, borderColor: "#9C9C9C",}}>
                            <View style={{ flexDirection: 'row',padding: 20, alignItems:'center',justifyContent:'space-between'}}>
                                <X color={'black'} size={30} onPress={onRequestClose}></X>
                                <Text style={styles.detailText}>{t("Card Details")}</Text>
                                <View></View>
                            </View>

                        </View>
                        <ScrollView style={styles.itemContainer}>
                            <View>
                                <Text style={{fontWeight:'600', fontSize:16}}>Thông tin đăng ký</Text>
                            </View>
                            <View style={styles.informationContainer}>
                                <Text style={{width:'50%'}}>{t("Card owner")}</Text>
                                <Text style={{ fontWeight: '600',width:'50%',textAlign:'right' }}>{item.resident.fullName}</Text>
                            </View>
                            <View style={styles.informationContainer}>
                                <Text style={{width:'50%'}}>{t("Vehicle type")}</Text>
                                <Text style={{ fontWeight: '600',width:'50%',textAlign:'right' }}>{vehicleType[item.type]}</Text>
                            </View>
                            <View style={styles.informationContainer}>
                                <Text style={{width:'50%'}}>{t("Color")}</Text>
                                <Text style={{ fontWeight: '600',width:'50%',textAlign:'right' }}>{item.color}</Text>
                            </View>
                            <View style={styles.informationContainer}>
                                <Text style={{width:'50%'}}>{t("Brand")}</Text>
                                <Text style={{ fontWeight: '600',width:'50%',textAlign:'right' }}>{item.brand}</Text>
                            </View>
                            <View style={styles.informationContainer}>
                                <Text style={{width:'50%'}}>{t("Create date")}</Text>
                                <Text style={{ fontWeight: '600',width:'50%',textAlign:'right' }}>{moment.utc(item.createTime).format("DD-MM-YYYY")}</Text>
                            </View>
                        </ScrollView>
                        
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim the background
    },
    button: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop:10
    },
    modalContainer: {
        height: Dimensions.get('window').height / 2, // Take up half of the screen
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollView: {
        flex: 1,
    },
    informationContainer:{
        flexDirection: 'row', justifyContent: 'space-between',flex:1,
         marginTop:10, alignItems:'center',
        paddingVertical:15,
        borderBottomWidth:1,
        borderColor:'#9c9c9c'
    },
    itemContainer:{
        marginHorizontal: 20, paddingVertical: 20, 
    },
    detailText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 16,
    },
});

export default ParkingCardDetail;
7