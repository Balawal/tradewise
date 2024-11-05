import { useState, useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import { Alert } from 'react-native';

export default function useCalendar() {
  const [calendarId, setCalendarId] = useState(null);

  useEffect(() => {
    (async () => {
      const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
      const remindersPermission = await Calendar.requestRemindersPermissionsAsync();
      if (calendarPermission.status === 'granted' && remindersPermission.status === 'granted') {
        getOrCreateDefaultCalendar();
      } else {
        Alert.alert('Error', 'Calendar and Reminders permissions are required to add reminders. Please enable them in your settings.');
      }
    })();
  }, []);

  const getOrCreateDefaultCalendar = async () => {
    try {
      const calendars = await Calendar.getCalendarsAsync();
      let defaultCalendar = calendars.find(
        (cal) => cal.allowsModifications && cal.source.name === 'iCloud'
      );

      if (!defaultCalendar) {
        const newCalendarId = await createCalendar();
        if (newCalendarId) {
          setCalendarId(newCalendarId);
        } else {
          Alert.alert('Error', 'Unable to create a new calendar.');
        }
      } else {
        setCalendarId(defaultCalendar.id);
      }
    } catch (error) {
      console.error('Error fetching calendars: ', error);
    }
  };

  const createCalendar = async () => {
    try {
      const sources = await Calendar.getSourcesAsync();
      const defaultSource = sources.find((source) => source.name === 'iCloud') || sources[0];

      if (!defaultSource) {
        throw new Error('No calendar source found');
      }
  
      const newCalendarId = await Calendar.createCalendarAsync({
        title: 'Earnings Reminders',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultSource.id,
        source: defaultSource,
        name: 'Earnings Reminders',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
  
      return newCalendarId;
    } catch (error) {
      console.error('Error creating calendar:', error);
      Alert.alert('Error', 'Unable to create calendar. Please ensure iCloud is enabled in Calendar settings.');
      return null;
    }
  };

  return { calendarId, getOrCreateDefaultCalendar };
};