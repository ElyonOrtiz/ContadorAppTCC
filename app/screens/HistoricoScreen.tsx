import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { buscarContagens, initDB, Contagem } from '@/src/db';
import { RootStackParamList } from '@/src/types';

const HistoricoScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [contagens, setContagens] = useState<Contagem[]>([]);

  const carregarContagens = (): void => {
    initDB(); // Inicializa o banco de dados
    const registros = buscarContagens(); // Busca as contagens
    setContagens(registros);
  };

  useEffect(() => {
    carregarContagens();
    const unsubscribe = navigation.addListener('focus', carregarContagens);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Contagem }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('calcular', { contagemId: item.id })}
    >
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.data}</Text>
      <Text style={[styles.cardText, { color: colors.text }]}>Contagem: {item.count}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Histórico de Contagens</Text>
      <FlatList
        data={contagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: colors.text }}>Nenhuma contagem registrada.</Text>}
      />
    </View>
  );
};

export default HistoricoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    paddingTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
  },
});
