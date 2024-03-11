import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ViewStyle, TextStyle } from 'react-native';
import Button from './button';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const TableComponent: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ width: '100%' }}>
          <View style={styles.headerRow}>
            {headers.map((header, index) => (
              <Text key={index} style={[styles.cell, styles.header]}>
                {header}
              </Text>
            ))}
          </View>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};


interface CellProps {
  children: React.ReactNode;
  style?:TextStyle | TextStyle[];
}

const Cell: React.FC<CellProps> = ({ children,style }) => {
  return <Text style={[styles.cell, style]}>{children}</Text>;
};

interface TableRowProps {
  children: React.ReactNode;
  active?:boolean;
  style?:ViewStyle | ViewStyle[];
}

const TableRow: React.FC<TableRowProps> = ({ children,style }) => {
  return <View style={[styles.row, style]}>{children}</View>;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  },
  cell: {
    flex:1,
    flexDirection:'row',
    width:200,
    textAlign: 'left',
    color: '#6B7280',
    paddingRight:20,
    fontSize:16,
    paddingHorizontal:15
  },
  header: {
    fontWeight: 'bold',
  },
  buttonCell: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { TableComponent, TableRow, Cell };