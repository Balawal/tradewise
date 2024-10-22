import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import AppNavigation from './navigation/appNavigation';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import 'react-native-reanimated';  // Make sure it's imported correctly
import 'react-native-gesture-handler';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
     <BottomSheetModalProvider>
        <AppNavigation />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}