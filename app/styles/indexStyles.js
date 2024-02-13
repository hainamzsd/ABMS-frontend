import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    gradient: {
        width: 300, 
        height: 300, 
        borderRadius: 150,
        position: 'absolute',
        top: -50, 
        left: -100,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 10,
    },
    tabButton: {
        paddingVertical: 10,
    },
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    avatar: {
        objectFit: 'cover',
        width: 74, 
        height:74, 
        borderRadius: 37, 
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    normalText:{
        fontSize: 16,
    }
});

export default styles;