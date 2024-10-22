import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    
    // Format date to display in the TextInput (MM/DD/YYYY)
    const formattedDate = currentDate.toLocaleDateString();
    const formattedDateServer = currentDate.toISOString().split('T')[0];

    // Pass the formatted date back to parent (CalculatorScreen)
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
            value={selectedDate} // Use selectedDate passed from parent
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#e5d4d4"  // Matches the investment amount placeholder
            editable={false}  // Make it read-only
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
    paddingVertical: 0,
  },
  input: {
    backgroundColor: '#312c35',  // Matches investment amount background color
    borderColor: '#302938',  
    color: 'white',  // Matches the text color
    borderRadius: 10,  // Same border radius
    height: 56,  // Same height
    paddingHorizontal: 16,  // Matches padding
    fontSize: 16,  // Same font size
    borderWidth: 0,  // No border
    placeholderTextColor: '#fff',  // Matches placeholder color
  },
});

export default DatePicker;