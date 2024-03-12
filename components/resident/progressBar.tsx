import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../app/(mobile)/context/ThemeContext';
import * as Progress from 'react-native-progress';

interface LoadingComponentProps {
  loading: boolean;
  progress?: number; // Include a progress prop to track upload progress
}

const ProgressBar: React.FC<LoadingComponentProps> = ({ loading, progress }) => {
    const { theme } = useTheme();
    return (
        <Modal transparent={true} visible={loading} animationType="none">
            <View style={styles.overlay}>
                {/* Check if progress is provided and render the progress bar */}
                {progress !== undefined ? (
                    <Progress.Bar 
                        progress={progress} 
                        width={200} 
                        color={theme.primary} 
                        borderWidth={0} 
                        unfilledColor="rgba(255,255,255,0.5)" 
                        borderColor={theme.primary}
                    />
                ) : (
                    // Optionally, keep the ActivityIndicator for other loading scenarios
                    <Text>Loading...</Text> // Placeholder for scenarios without progress
                )}
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

export default ProgressBar;
