import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: -1,
  },
  gradient: {
    width: 350,
    height: 350,
    borderRadius: 225,
    position: "absolute",
    top: -50,
    left: -80,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  primaryText: {
    fontSize: 16,
  },
  normalText: {
    fontSize: 14,
  },
});

export default styles;
