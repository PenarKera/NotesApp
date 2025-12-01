// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// 🛑 FIX: Importi i saktë për navigimin stack
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
// Shtohen komponentët për butonin në header
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'; 


import Home from './screens/Home';
import CreateEditNote from './screens/CreateEditNote';

// Inicializohet navigimi me komponentin e saktë
const Stack = createNativeStackNavigator();
const PRIMARY_COLOR = '#4A90E2'; // Ngjyra kryesore blu

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: PRIMARY_COLOR, // Koka blu
          },
          headerTintColor: '#fff', // Teksti i bardhë
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={({ navigation }) => ({
            title: 'Soft Notes',
            // Shtojmë butonin '+' në header (Koka)
            headerRight: () => (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => navigation.navigate('CreateEditNote', { isEdit: false })}
              >
                <Text style={styles.headerButtonText}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="CreateEditNote" 
          component={CreateEditNote} 
          options={({ route }) => ({ 
            title: route.params?.note ? 'Edit Note' : 'Create New Note'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stilet për butonin e shtimit
const styles = StyleSheet.create({
  headerButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#fff', 
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: PRIMARY_COLOR, 
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
  }
});

export default App;