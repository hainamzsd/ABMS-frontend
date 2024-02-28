import React from 'react';
import { ActivityIndicator, StyleSheet, View, Modal } from 'react-native';
import { useTheme } from '../../app/(mobile)/context/ThemeContext';

interface LoadingComponentProps {
  loading: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ loading }) => {
    const {theme}= useTheme();
  return (
    <Modal transparent={true} visible={loading} animationType="none">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadingComponent;
