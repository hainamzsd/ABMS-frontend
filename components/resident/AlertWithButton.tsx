// CustomAlert.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../../app/(mobile)/context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void; 
}

const AlertWithButton: React.FC<CustomAlertProps> = ({ visible, title, content, onClose }) => {
    const {theme} = useTheme();
    const {t}= useTranslation();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {backgroundColor:theme.background}]}>
          <View style={[styles.header, {backgroundColor:theme.primary}]}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
          <View style={styles.buttonContainer}>
          <Pressable onPress={onClose} style={[styles.button, {backgroundColor:'black'}]}>
              <Text style={[styles.buttonText,{color:'white'}]}>{t("Close")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width:300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: '100%',
    backgroundColor: 'blue',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:18,
    padding:10
  },
  content: {
    marginBottom: 15,
  },
  contentText: {
    margin:10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding:10
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:100,
    marginHorizontal:5
  },
  buttonClose: {
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertWithButton;
