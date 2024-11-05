import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useReminder from '../../../hooks/home/stockdetails/calendar/useReminder';
import useCalendar from '../../../hooks/home/stockdetails/calendar/useCalendar';
import { calendarStyles as styles } from '../../../styles/homeStyles';

const EarningsCalendar = ({ earningsDate, stockSymbol, color }) => {
  const { calendarId, getOrCreateDefaultCalendar } = useCalendar();
  const { handleAddToCalendar } = useReminder(calendarId, earningsDate, stockSymbol);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = async () => {
    await getOrCreateDefaultCalendar();  // Ensure calendar exists when opening modal
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <Icon name="calendar-today" size={23} color={color} />
        <Text>Add to Calendar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Reminder Time</Text>
            {['1D', '1W', '1M'].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.optionButton}
                onPress={() => {
                  handleAddToCalendar(type);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionButtonText}>
                  {type === '1D' ? '1 Day' : type === '1W' ? '1 Week' : '1 Month'} Before
                </Text>
              </TouchableOpacity>
            ))}
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

export default EarningsCalendar;