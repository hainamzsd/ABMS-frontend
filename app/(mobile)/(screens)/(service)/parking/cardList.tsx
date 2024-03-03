import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../../../../../components/resident/header'
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react-native';

const CardList = () => {

  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <>
      <Header headerTitle={t("Manage parking card")} />
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Registered card")}</Text>
            <Text>{t("Card has been verified")}</Text>
          </View>
          <View style={[styles.card,{backgroundColor:theme.primary}]}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <CreditCard strokeWidth={3} color={'white'}></CreditCard>
              <Text style={{fontSize:16, fontWeight:'600', color:'white'}}>{t("Parking card")}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  card:{
    marginTop:20,
    borderRadius:20,
    padding:20,
  }
})


export default CardList