// screens/Home.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getNotes, deleteNote } from '../services/NoteStorage';
import { useFocusEffect } from '@react-navigation/native'; 

// --- NEW THEME COLORS ---
const PRIMARY_COLOR = '#4A90E2'; // Soft Blue
const BG_COLOR = '#F5F5F5'; // Very Light Gray
const CARD_BG = '#FFFFFF'; // Pure White Card Background
const TEXT_COLOR = '#333333'; // Dark Gray Text for good contrast

const Home = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadNotes = useCallback(async () => {
    const allNotes = await getNotes();
    // Sort notes by date (newest first)
    allNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotes(allNotes);
  }, []);

  useFocusEffect(useCallback(() => {
      loadNotes();
  }, [loadNotes]));

  // Search Logic (same as before)
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText.toLowerCase()) || 
    note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            await deleteNote(id);
            loadNotes(); 
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Helper to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString();
    // 💡 Displays the time (e.g., 10:30 AM)
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${datePart} at ${timePart}`;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.noteCard}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CreateEditNote', { note: item })}
          style={styles.cardContent}
        >
          <Text style={styles.title}>{item.title}</Text>
          {/* 💡 Displaying the formatted time on the saved note */}
          <Text style={styles.date}>{formatDateTime(item.date)}</Text>
          <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet! Tap '+' to start writing.</Text>}
      />
      
      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateEditNote')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: BG_COLOR, 
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: TEXT_COLOR,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG, 
    padding: 18,
    borderRadius: 0, // 💡 Makes the note cards perfectly square/rectangular
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD', // Soft border
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  cardContent: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700', 
    color: PRIMARY_COLOR, // Soft Blue title
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666', // Good contrast time display
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: TEXT_COLOR,
  },
  deleteButton: {
    marginLeft: 15,
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#FF7F7F', // Soft Red for delete
    borderRadius: 4,
    height: 30,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: PRIMARY_COLOR, 
    borderRadius: 30,
    elevation: 4,
  },
  fabText: {
    fontSize: 35,
    color: 'white',
    lineHeight: 35,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888'
  }
});

export default Home;