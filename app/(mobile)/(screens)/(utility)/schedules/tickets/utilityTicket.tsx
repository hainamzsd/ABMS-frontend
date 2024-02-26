import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import Header from "../../../../../../components/resident/header"
import { useTheme } from "../../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import {router} from 'expo-router'
export default function UtilityTicket() {
    const { theme } = useTheme();
    const {t} = useTranslation();

    const isButtonDisabled = false;
    return  <>
    <Header headerTitle={t("Register utility")} />
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 30, marginHorizontal: 26 }}>
          
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
              pathname: "/",
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
      }

})