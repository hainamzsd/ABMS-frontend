import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import Header from "../../../../../../components/resident/header"
import { useTheme } from "../../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import {router, useLocalSearchParams} from 'expo-router'
import SHADOW from "../../../../../../constants/shadow";
import { Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { moneyFormat } from "../../../../../../utils/moneyFormat";
export default function UtilityTicket() {
    const { theme } = useTheme();
    const {t} = useTranslation();
  const item = useLocalSearchParams();

    const fee = 20000;
    const [ticket, setTicket] = useState(0);
    const passO={
      ticket:ticket,
      date:item.date,
      total:ticket*fee,
    }
    const handleIncrease = () => {
      if (ticket < 10) {
        setTicket(prevNumber => prevNumber + 1);
      }
    };
  
    const handleDecrease = () => {
      if (ticket > 0) {
        setTicket(prevNumber => prevNumber - 1);
      }
    };

    const isButtonDisabled = ticket===0;

  
    return  <>
    <Header headerTitle={t("Register utility")} />
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
          <Text style={{fontSize:20,fontWeight:'bold',marginBottom:10}}>{item.name}</Text>
          <View style={styles.ticketBox}>
              <View style={{marginVertical:20, borderBottomWidth:1}}>
                <View style={{paddingHorizontal:20, paddingBottom:20}}>
                    <Text style={{fontWeight:'bold',fontSize:16}}>{t("Ticket fee")}: {moneyFormat(fee)}</Text>
                </View>
              </View>
              <View style={{paddingHorizontal:20,paddingBottom:20, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:16}}>{t("Number of tickets")}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Pressable onPress={handleDecrease}>
                      <Minus></Minus>
                    </Pressable>
                    <Text style={{fontSize:16, marginHorizontal:15}}>{ticket}</Text>
                    <Pressable onPress={handleIncrease}>
                    <Plus></Plus>
                    </Pressable>
                </View>
              </View>
          </View>
        </View>
        
      </View>
      <View style={{
        marginHorizontal: 26, marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Pressable
          disabled={isButtonDisabled}
          onPress={() =>
            router.push({
              pathname: "/(mobile)/(screens)/(utility)/schedules/checkout/checkout",
              params:passO
            })}
          style={[
            {
              backgroundColor: theme.primary,
              opacity: isButtonDisabled ? 0.7 : 1
            },
            styles.button
          ]}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Tiếp tục</Text>
        </Pressable></View>
    </SafeAreaView>
  </>
}


const styles = StyleSheet.create({
    button: {
        padding: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
    ticketBox:{
      ...SHADOW,
      borderRadius:10, backgroundColor:'white'
    }

})