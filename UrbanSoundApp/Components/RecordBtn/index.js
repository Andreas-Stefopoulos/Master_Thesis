import React from 'react';
import {Text, View} from 'react-native';
import styles from './style';

const RecordBtn = ({value, textColor, bgColor, bdColor}) => {
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: bgColor, borderColor: bdColor},
      ]}>
      <Text style={{color: textColor}}>{value}</Text>
    </View>
  );
};
export default RecordBtn;
