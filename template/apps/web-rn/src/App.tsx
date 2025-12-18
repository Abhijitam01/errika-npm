import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [count, setCount] = useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#242424' : '#ffffff',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            Welcome to Errika
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            React Native + Turborepo
          </Text>
        </View>

        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark]}>
            Get Started
          </Text>
          <Text style={[styles.cardText, isDarkMode && styles.textDark]}>
            Edit <Text style={styles.code}>src/App.tsx</Text> to get started
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(count + 1)}>
            <Text style={styles.buttonText}>Count is {count}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.links}>
          <Text style={[styles.linkText, isDarkMode && styles.textDark]}>
            📱 React Native
          </Text>
          <Text style={[styles.linkText, isDarkMode && styles.textDark]}>
            ⚡ Turborepo
          </Text>
          <Text style={[styles.linkText, isDarkMode && styles.textDark]}>
            📦 Monorepo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  titleDark: {
    color: '#8b9dff',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  subtitleDark: {
    color: '#aaa',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  textDark: {
    color: '#fff',
  },
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
});

export default App;

