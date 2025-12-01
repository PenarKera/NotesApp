// screens/CreateEditNote.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { createNote, updateNote } from '../services/NoteStorage';

const PRIMARY_COLOR = '#4A90E2'; 

const CreateEditNote = ({ navigation, route }) => {
  const existingNote = route.params?.note;
  
  const [title, setTitle] = useState(existingNote ? existingNote.title : '');
  const [content, setContent] = useState(existingNote ? existingNote.content : '');
  
  const isEditing = !!existingNote;

  useEffect(() => {
    navigation.setOptions({ 
      title: isEditing ? 'Edit Note' : 'Create New Note' 
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content cannot be empty.");
      return;
    }

    if (isEditing) {
      const noteToUpdate = { ...existingNote, title: title.trim(), content: content.trim() };
      await updateNote(noteToUpdate);
      Alert.alert("Success", "Note updated!");
    } else {
      await createNote(title.trim(), content.trim());
      Alert.alert("Success", "Note created!");
    }

    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
        <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
        />
        <TextInput
            style={styles.contentInput}
            placeholder="Note Content"
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
        />
        <Button 
            title={isEditing ? "Update Note" : "Save Note"} 
            onPress={handleSave} 
            color={PRIMARY_COLOR} 
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', 
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0', 
    marginBottom: 20,
    paddingVertical: 10,
    color: '#333',
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    color: '#333',
  },
});

export default CreateEditNote;