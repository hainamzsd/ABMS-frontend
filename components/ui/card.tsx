import React from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Icon, Divider, Box } from 'native-base';

function ComplexStatisticsCard({ color, title, count, percentage, iconName }:{
    color:string;
    title:string;
    count:number;
    percentage:{
        color:string;
        amount:number;
        label:string;
    };
    iconName:string;
}) {
  // Define a method to select color based on the prop
  const selectColor = (color:string) => {
    switch (color) {
      case 'primary': return 'blue.500';
      case 'secondary': return 'gray.400';
      case 'info': return 'cyan.400';
      case 'success': return 'green.500';
      case 'warning': return 'amber.500';
      case 'error': return 'red.500';
      case 'light': return 'gray.100';
      case 'dark': return 'black';
      default: return 'blue.500';
    }
  };

  return (
    <Card>
      <Box flex={1} flexDirection="row" justifyContent="space-between" pt={1} px={2}>
        <Box
          bg={selectColor(color)}
          borderRadius={10}
          width={16}
          height={16}
          alignItems="center"
          justifyContent="center"
          mt={-3}
        >
          <Icon as={<Icon name={iconName} />} size="md" color="white" />
        </Box>
        <Box textAlign="right" lineHeight={1.25}>
          <Text fontSize="sm" color="coolGray.600">
            {title}
          </Text>
          <Text fontSize="xl">{count}</Text>
        </Box>
      </Box>
      <Divider />
      <Box pb={2} px={2}>
        <Text fontSize="sm" color="coolGray.600">
          <Text bold color={selectColor(percentage.color)}>
            {percentage.amount}
          </Text>
          {' '}{percentage.label}
        </Text>
      </Box>
    </Card>
  );
}

// Setting default values for the props
ComplexStatisticsCard.defaultProps = {
  color: 'info',
  percentage: {
    color: 'success',
    text: '',
    label: '',
  },
};

// Typechecking props
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    'primary', 'secondary', 'info', 'success', 'warning', 'error', 'light', 'dark',
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'white',
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  iconName: PropTypes.string.isRequired, // Adjusted for NativeBase icon usage
};

export default ComplexStatisticsCard;
