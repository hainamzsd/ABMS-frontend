import React from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>; // Allow additional styles to be passed
}

const Button: React.FC<ButtonProps> = ({
  text,
  height = 40,
  color = "#171717",
  style,
  ...rest
}) => {
  const buttonSize: ViewStyle = { height };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, buttonSize, style]}
      {...rest}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default Button;
