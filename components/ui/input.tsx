import React from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import shadow from '../../constants/shadow';
interface InputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>; 
}

const Input: React.FC<InputProps> = (props) => {
  const { style, ...otherProps } = props; 

  return (
    <TextInput
      style={[styles.input, style]} 
      placeholderTextColor="#A9A9A9"
      {...otherProps} 
    />
  );
};

const styles = StyleSheet.create({
  input: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 10,
  },
});

export default Input;
