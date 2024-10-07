import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import * as Calendar from 'expo-calendar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

const EarningsCalendar = ({ earningsDate }) => {
  const [calendarId, setCalendarId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch or create the default calendar when the component mounts
    getOrCreateDefaultCalendar();
  }, []);

  // Function to fetch or create a calendar and store the id in state
  const getOrCreateDefaultCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync();

    // Find an existing calendar (if any)
    const defaultCalendar = calendars.find(cal => cal.source && cal.source.name === 'Default');

    if (defaultCalendar) {
      setCalendarId(defaultCalendar.id);
    } else {
      // Create a new calendar if the default doesn't exist
      const newCalendarId = await createCalendar();
      setCalendarId(newCalendarId);
    }
  };

  // Function to create a new calendar
  const createCalendar = async () => {
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
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status === 'granted') {
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

        // Ensure that the calendarId is available
        if (!calendarId) {
          Alert.alert('Error', 'Unable to find or create calendar.');
          return;
        }

        // Create a new calendar event
        await Calendar.createEventAsync(calendarId, {
          title: 'Earnings Date Reminder',
          startDate: reminderDate,
          endDate: reminderDate,
          alarms: [{ relativeOffset: -15 }], // 15 mins before the event
          notes: 'Earnings release for the stock',
          timeZone: 'GMT',
        });

        Alert.alert('Success', 'Reminder added to your calendar');
        setModalVisible(false); // Close the modal after adding event
      } else {
        Alert.alert('Permission Denied', 'Calendar permissions are required to add events.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to add event to calendar');
      console.error(error);
    }
  };

  return (
    <View>
      {/* Calendar icon to open the modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="calendar-today" size={25} color="white"/>
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
              <Text>1 Day Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleAddToCalendar('1W')}
            >
              <Text>1 Week Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleAddToCalendar('1M')}
            >
              <Text>1 Month Before</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#E0E0E0',
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FF6347',
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EarningsCalendar;