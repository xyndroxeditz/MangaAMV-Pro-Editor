import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#FF2D95', fontSize: 32, fontWeight: 'bold' }}>✨ MangaAMV Pro ✨</Text>
      <Text style={{ color: '#FFF', fontSize: 18, marginTop: 20 }}>App is running!</Text>
    </View>
  );
}
