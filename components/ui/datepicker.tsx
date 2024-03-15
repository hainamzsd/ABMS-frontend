import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SHADOW } from '../../constants';

interface DatePickerProps {
    selectedDate: Date;
    onDateChange: (newDate: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
    const [year, setYear] = useState(selectedDate.getFullYear());
    const [month, setMonth] = useState(selectedDate.getMonth());
    const [day, setDay] = useState(selectedDate.getDate());

    const generateNumberArray = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    const handleDateChange = (newYear: number, newMonth: number, newDay: number) => {
        const newDate = new Date(newYear, newMonth, newDay);
        onDateChange(newDate);
    };

    const years = generateNumberArray(1900, new Date().getFullYear());
    const months = generateNumberArray(1, 12);
    const days = generateNumberArray(1, new Date(year, month + 1, 0).getDate());

    return (
        <View>
            <View style={{ flexDirection: 'row'}}>
               
              
                <Picker
                    selectedValue={day}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setDay(itemValue);
                        handleDateChange(year, month, itemValue);
                    }}>
                    {days.map((day) => (
                        <Picker.Item key={day} label={`${day}`} value={day} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={month}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setMonth(itemValue);
                        handleDateChange(year, itemValue, day);
                    }}>
                    {months.map((month) => (
                        <Picker.Item key={month} label={`${month}`} value={month - 1} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={year}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setYear(itemValue);
                        handleDateChange(itemValue, month, day);
                    }}>
                    {years.map((year) => (
                        <Picker.Item key={year} label={`${year}`} value={year} />
                    ))}
                </Picker>
            </View>
        </View>
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
      marginRight:10
    },
  });
  
export default DatePicker;
