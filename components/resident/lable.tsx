import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface LabelProps {
  text: string;
  required?: boolean; 
}

const Label: React.FC<LabelProps> = ({ text, required = false }) => {
  return (
    <Text style={styles.label}>
      {text}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 5, // Adjust spacing as needed
  },
  required: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Label;