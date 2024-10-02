import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    // Format the date to your desired format before setting it to the TextInput
    const formattedDate = currentDate.toLocaleDateString(); // e.g., "MM/DD/YYYY"
    const formattedDateServer = currentDate.toISOString().split('T')[0];
    setTextInputValue(formattedDateServer);

    onDateChange(formattedDateServer)
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a date:</Text>
      <TouchableOpacity onPress={showDatepicker}>
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            value={textInputValue}
            placeholder="Select a date"
            editable={false} // Make it read-only, as the date will be selected via the date picker
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 3,
    fontSize: 16,
    color: 'white',
    backgroundColor: '#000',
  },
});

export default DatePicker;