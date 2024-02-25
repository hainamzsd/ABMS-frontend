import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";

const stylesHomeScreen = StyleSheet.create({
  avatar: {
    objectFit: "cover",
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  room: {
    ...SHADOW,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginTop: 26,
  },
  featureContainer: {
    marginTop: 36,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureBox: {
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 10,
    width: "48%",
    height: 100,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  callBox: {
    backgroundColor: "#ED6666",
    borderRadius: 10,
    padding: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  newContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newImage: {
    width: 236,
    height: 150,
    objectFit: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  newTitle: {
    ...SHADOW,
    width: 236,
    height: 90,
    backgroundColor: "white",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "space-between",
  },
});

export default stylesHomeScreen;
