import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { datePickerStyles as styles } from '../../styles/calculatorStyles';

const DatePicker = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    
    const formattedDate = currentDate.toLocaleDateString();
    const formattedDateServer = currentDate.toISOString().split('T')[0];

    onDateChange(formattedDateServer);
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatepicker}>
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            value={selectedDate} 
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#e5d4d4"  
            editable={false} 
          />
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePicker;