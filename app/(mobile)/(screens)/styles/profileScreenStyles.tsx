import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";

const stylesProfileScreen = StyleSheet.create({
  avatar: {
    objectFit: "cover",
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  box: {
    ...SHADOW,
    justifyContent: "center",
    width: "100%",
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginTop: 26,
  },
  room: {
    ...SHADOW,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginTop: 26,
  },
  feature: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  logoutButton: {
    marginTop: 30,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  text:{
    fontSize:16
  }
});
export default stylesProfileScreen;
