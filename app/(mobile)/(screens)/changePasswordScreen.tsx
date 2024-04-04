import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "../../../components/resident/header";
import SHADOW from "../../../constants/shadow";
import { validatePassword } from "../../../utils/passwordValidate";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import * as yup from "yup"
import axios from "axios";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import LoadingComponent from "../../../components/resident/loading";
import AlertWithButton from "../../../components/resident/AlertWithButton";


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordSchema = yup.object().shape({
  old_password: yup
    .string()
    .required('Old password is required'),
  new_password: yup
    .string()
    .matches(passwordRegex, 'Password must include uppercase, lowercase, numbers, and special characters')
    .required('New password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});
const changePasswordScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {session} = useSession();
  const user:any = jwtDecode(session as string); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);
const [errorText, setErrorText] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [success, setSuccess]= useState(false);
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = { old_password: oldPassword, new_password: newPassword, confirm_password: reEnterPassword };
      await passwordSchema.validate(formData, { abortEarly: false });
      const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/account/change-password/${user.Id}`, formData,
      {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      console.log(response);
      if(response.data.errMsg =="Wrong old password!"){
        setError(true);
        setErrorText(t("Old password is incorrect"));
        return;
      }
      if(response.data.statusCode==200){
        setValidationErrors({});
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setReEnterPassword("");
    }
    else{
        setError(true);
        setErrorText(t("System error please try again later"));
    }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors:any = {};
              error.inner.forEach((err: any) => {
                errors[err.path] = err.message;
              });
              setValidationErrors(errors);
      } else {
        setError(true);
        setErrorText(t("System error please try again later"));
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
      <AlertWithButton content={t("Password updated successfully")} title={t("Success")} 
    visible={success} onClose={() => setSuccess(false)}></AlertWithButton>
    <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Change password")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 16 }}>{t("Password policy")}</Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>{t("Old password")}</Text>
            </View>
            <TextInput
              placeholder={t("Type")+"..."}
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor: "#CCCCCC" },
              ]}
              onChangeText={setOldPassword}
              value={oldPassword}
              secureTextEntry
            />
              {validationErrors.old_password  && (
                            <Text style={styles.errorText}>{validationErrors.old_password}</Text>
                        )}
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>{t("New password")}</Text>
            </View>
            <TextInput
                 placeholder={t("Type")+"..."}
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor: "#CCCCCC" },
              ]}
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry
            />
               {validationErrors.new_password  && (
                            <Text style={styles.errorText}>{validationErrors.new_password}</Text>
                        )}
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>{t("Re-enter password")}</Text>
            </View>
            <TextInput
               placeholder={t("Type")+"..."}
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor:"#CCCCCC" },
              ]}
              onChangeText={setReEnterPassword}
              value={reEnterPassword}
              secureTextEntry
            />
             {validationErrors.confirm_password  && (
                            <Text style={styles.errorText}>{validationErrors.confirm_password}</Text>
                        )}
          </View>
         
          <TouchableOpacity
          onPress={handleSubmit}
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("Change password")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    ...SHADOW,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  errorText: {
    color: "red",
  },
  button: {
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
});

export default changePasswordScreen;
