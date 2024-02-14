import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";
import { COLORS } from "../../../../constants/colors";
const stylesHomeScreen = StyleSheet.create({
  avatar: {
    objectFit: 'cover',
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  room: {
    ...SHADOW,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 26,
  },
  featureContainer: {
    marginTop:36,
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },
  featureBox: {
    ...SHADOW,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '48%',
    height: 100, 
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding:10
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightPink, // Example background color for the circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default stylesHomeScreen;