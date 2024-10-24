import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import * as Calendar from 'expo-calendar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

const EarningsCalendar = ({ earningsDate, stockSymbol, color }) => {
  const [calendarId, setCalendarId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch or create the default calendar when the component mounts
    getOrCreateDefaultCalendar();
  }, []);

  const getOrCreateDefaultCalendar = async () => {
    try {
      const calendars = await Calendar.getCalendarsAsync();
  
      // Check if there's an existing calendar that allows event creation
      const defaultCalendar = calendars.find(
        (cal) =>
          cal.allowsModifications && cal.source.name === 'iCloud' // Targeting iCloud calendar
      );
  
      if (defaultCalendar) {
        setCalendarId(defaultCalendar.id);
      } else {
        Alert.alert('Error', 'No calendar available that allows modifications.');
      }
    } catch (error) {
      console.error('Error fetching calendars: ', error);
    }
  };

  const createCalendar = async () => {
    try {
      const defaultCalendarSource = await getDefaultCalendarSource();

      const newCalendarId = await Calendar.createCalendarAsync({
        title: 'Earnings Date Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'Earnings Date Calendar',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      return newCalendarId;
    } catch (error) {
      Alert.alert('Error', 'Unable to create calendar.');
      console.error(error);
    }
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendar = calendars.find(cal => cal.source && cal.source.name === 'Default');

    if (!defaultCalendar) {
      return calendars[0].source; // Fallback if no default calendar is found
    }

    return defaultCalendar.source;
  };

  const handleAddToCalendar = async (reminderType) => {
    try {
      if (!calendarId) {
        Alert.alert('Error', 'Unable to find or create calendar.');
        return;
      }

      let reminderDate;
      switch (reminderType) {
        case '1D':
          reminderDate = subDays(new Date(earningsDate), 1);
          break;
        case '1W':
          reminderDate = subWeeks(new Date(earningsDate), 1);
          break;
        case '1M':
          reminderDate = subMonths(new Date(earningsDate), 1);
          break;
        default:
          reminderDate = new Date(earningsDate);
      }

      console.log(reminderDate);

      // Create a new calendar event
      await Calendar.createEventAsync(calendarId, {
        title: `${stockSymbol} - Earnings Date Reminder`,
        startDate: reminderDate,
        endDate: reminderDate,
        alarms: [{ relativeOffset: -15 }], // 15 mins before the event
        notes: `Earnings release for ${stockSymbol}. Be sure to check the latest market trends and updates.`,
        timeZone: 'GMT',
      });

      Alert.alert('Success', 'Reminder added to your calendar');
      setModalVisible(false); // Close the modal after adding event
    } catch (error) {
      Alert.alert('Error', 'Unable to add event to calendar.');
      console.error(error);
    }
  };

  return (
    <View>
      {/* Calendar icon to open the modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="calendar-today" size={23} color={color} />
        <Text>Add to Calendar</Text>
      </TouchableOpacity>

      {/* Modal for selecting reminder option */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Reminder Time</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleAddToCalendar('1D')}
            >
              <Text style={styles.optionButtonText}>1 Day Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleAddToCalendar('1W')}
            >
              <Text style={styles.optionButtonText}>1 Week Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleAddToCalendar('1M')}
            >
              <Text style={styles.optionButtonText}>1 Month Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly transparent black
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black', // Modal background color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white', // Modal title text color
  },
  optionButton: {
    backgroundColor: '#000',  // Set background to black
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,  // Add a border
    borderColor: '#ad93c8', 
    width: '100%',
    marginTop: 15,
  },
  optionButtonText: {
    color: '#ad93c8',  // Change the text color to match the border
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#000',  // Set background to black
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,  // Add a border
    borderColor: 'white', 
    width: '100%',
    marginTop: 15, 
  },
  closeButtonText: {
    color: 'white',  // Change the text color to match the border
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EarningsCalendar;