// screens/CoinDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CoinDetailScreen = ({ route }: any) => {
  const { coin } = route.params; // `coin` detayları `route.params`'tan alınıyor

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{coin.symbol}</Text>
      <Text style={styles.detail}>Position: {coin.position}</Text>
      <Text style={styles.detail}>Old Position: {coin.positionold}</Text>
      <Text style={styles.detail}>Change Time: {coin.changeTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default CoinDetailScreen;
