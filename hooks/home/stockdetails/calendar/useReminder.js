import { Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { getReminderDate } from '../../../../utils/utils';

export default function  useReminder(calendarId, earningsDate, stockSymbol){
  const handleAddToCalendar = async (reminderType) => {
    if (!calendarId) {
      Alert.alert('Error', 'Unable to find or create calendar.');
      return;
    }

    const reminderDate = getReminderDate(reminderType, earningsDate);

    try {
      await Calendar.createEventAsync(calendarId, {
        title: `${stockSymbol} - Earnings Date Reminder`,
        startDate: reminderDate,
        endDate: reminderDate,
        alarms: [{ relativeOffset: -15 }],
        notes: `Earnings release for ${stockSymbol}. Be sure to check the latest market trends and updates.`,
        timeZone: 'GMT',
      });

      Alert.alert('Success!', 'Reminder added to your calendar.');
    } catch (error) {
      Alert.alert('Error', 'Unable to add event to your calendar.');
      console.error(error);
    }
  };

  return { handleAddToCalendar };
};