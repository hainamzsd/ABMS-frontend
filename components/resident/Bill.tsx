import { X } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { moneyFormat } from '../../utils/moneyFormat';

interface BillDetailProps {
    visible: boolean;
    item: any; // Can be replaced with a more specific type based on your data structure
    onRequestClose: () => void; // Function to call when closing the modal
}
interface BillDetail {
    service_name: string;
    fee: number;
    amount: number;
    total: number;
}

const BillModal: React.FC<BillDetailProps> = ({ visible, item, onRequestClose }) => {
    const {t} = useTranslation();
    return (
        <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onRequestClose}
    >
        <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
                <ScrollView style={styles.scrollView}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: "#9C9C9C",}}>
                        <View style={{ flexDirection: 'row',padding: 20, alignItems:'center',justifyContent:'space-between'}}>
                            <X color={'black'} size={30} onPress={onRequestClose} />
                            <Text style={styles.detailText}>{t("Bill details")}</Text>
                            <View></View>
                        </View>
                    </View>
                    {item.details.map((detail:any, index:any) => (
                        <View key={index} style={styles.itemContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>{detail.service_name}</Text>
                                <Text style={{ fontWeight: '600' }}>{moneyFormat(detail.total)} VND</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{color: '#9C9C9C'}}>{t("Fee")}: {moneyFormat(detail.fee)} VND</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim the background
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
    itemContainer:{
        marginHorizontal: 20, paddingVertical: 20, borderBottomWidth: 0.5, borderColor: '#9C9C9C' 
    },
    detailText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 16,
    },
});

export default BillModal;
