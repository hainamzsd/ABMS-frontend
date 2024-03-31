import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button } from 'native-base';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

// Validation schema
const validationSchema = Yup.object().shape({
  building_Id: Yup.string().required('Building ID is required'),
  money: Yup.number().typeError('Money must be a number').positive('Money must be positive').required('Money is required'),
  expenseSource: Yup.string().required('Expense source is required'),
  description: Yup.string().required('Description is required'),
});

interface ExpenseFormData {
  building_Id: string;
  money: number;
  expenseSource: string;
  description: string;
}

interface ApiResponse {
  status: number;
  data: any; // Adjust according to your actual API response structure
}

interface User {
  BuildingId: string;
}

const ExpenseForm = () => {
  const { session } = useAuth();
  const user: User = jwtDecode(session as string);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data:ExpenseFormData) => {
    try {
      const response: ApiResponse = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/expense/create', {
        ...data,
        building_Id: user.BuildingId,
      }, {
        headers: {
          'Authorization': `Bearer ${session}`,
        },
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Expense created successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to create expense',
        });
      }
    } catch (error: any) {
      console.error('Error creating expense:', error);
      Toast.show({
        type: 'error',
        text1: 'Error creating expense',
      });
    }
  };

  if (isSubmitting) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Building ID (Automatically filled)</Text>
      <Text style={styles.input}>{user.BuildingId}</Text>

      <Text style={styles.label}>Money</Text>
      <Controller
        control={control}
        name="money"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input onBlur={onBlur} onChangeText={onChange} value={value?.toString()} placeholder="Money" keyboardType="numeric" />
        )}
      />
      {errors.money && <Text style={styles.errorText}>{errors.money.message}</Text>}

      <Text style={styles.label}>Expense Source</Text>
      <Controller
        control={control}
        name="expenseSource"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Expense Source" />
        )}
      />
      {errors.expenseSource && <Text style={styles.errorText}>{errors.expenseSource.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Description" />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    borderColor: 'grey',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default ExpenseForm;
