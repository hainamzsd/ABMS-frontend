import Toast from "react-native-toast-message"

export const ToastSuccess = (message) => {
    Toast.show({
        type: 'success',
        text1: message,
        position: 'bottom'
    })
}

export const ToastFail = (message) => {
    Toast.show({
        type: 'error',
        text1: message,
        position: 'bottom'
    })
}