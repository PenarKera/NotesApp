// services/NoteStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@NotesApp:notes';

/**
 * 1. GET (READ): Retrieves all notes stored.
 */
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading notes:", e);
    return [];
  }
};

/**
 * Helper function to save the updated list of notes back to AsyncStorage.
 */
const saveNotesList = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving notes list:", e);
  }
};

/**
 * 2. CREATE: Creates a new note object.
 */
export const createNote = async (title, content) => {
  const newNote = {
    id: uuid.v4(), 
    title,
    content,
    date: new Date().toISOString(), // Use current date for sorting
  };

  const currentNotes = await getNotes();
  const updatedNotes = [newNote, ...currentNotes]; 
  
  await saveNotesList(updatedNotes);
};

/**
 * 3. UPDATE: Finds a note by ID and replaces its data.
 */
export const updateNote = async (updatedNote) => {
  const currentNotes = await getNotes();
  const notesAfterUpdate = currentNotes.map(note => 
    note.id === updatedNote.id ? updatedNote : note
  );
  
  await saveNotesList(notesAfterUpdate);
};

/**
 * 4. DELETE: Removes a note from the list by its ID.
 */
export const deleteNote = async (noteId) => {
  const currentNotes = await getNotes();
  const notesAfterDelete = currentNotes.filter(note => note.id !== noteId);
  
  await saveNotesList(notesAfterDelete);
};