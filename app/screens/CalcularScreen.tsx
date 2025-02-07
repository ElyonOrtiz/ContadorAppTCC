import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { initDB, salvarContagem, buscarContagemPorId, buscarContagemPorData } from '@/src/db';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types';

const CalcularScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'calcular'>>();
  const { colors } = useTheme();
  const [count, setCount] = useState<number>(0);
  const [dataSelecionada, setDataSelecionada] = useState<string>('');

  useEffect(() => {
    initDB(); // Inicializa o banco de dados

    if (route.params?.contagemId) {
      // Se um contagemId foi passado (por exemplo, ao clicar num card do histórico)
      const registro = buscarContagemPorId(route.params.contagemId);
      if (registro) {
        setCount(registro.count);
        setDataSelecionada(registro.data);
      }
    } else {
      // Se não há parâmetro, utiliza a data atual
      const today = new Date().toISOString().split('T')[0];
      const registroHoje = buscarContagemPorData(today);
      if (registroHoje) {
        setCount(registroHoje.count);
        setDataSelecionada(registroHoje.data);
      } else {
        setDataSelecionada(today);
        setCount(0);
      }
    }
  }, [route.params]);

  const increment = (): void => setCount(prev => prev + 1);
  const decrement = (): void => setCount(prev => prev - 1);

  const finalizar = (): void => {
    const dataAtual: string = new Date().toISOString().split('T')[0];
    const dataRegistro: string = dataSelecionada || dataAtual;

    Alert.alert(
      'Finalizar',
      'Tem certeza que deseja finalizar esta contagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: () => {
            salvarContagem(dataRegistro, count);
            Alert.alert('Sucesso', 'Contagem salva com sucesso!');
            navigation.navigate('historico'); // Retorna à tela de histórico
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.counterText, { color: colors.text }]}>{count}</Text>
      <TouchableOpacity style={[styles.buttonAdd]} onPress={increment}>
        <Text style={styles.buttonText}>Adicionar</Text>
        <Text style={styles.symbolText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonSubtract]} onPress={decrement}>
        <Text style={styles.buttonText}>Subtrair</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonReset]} onPress={finalizar}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalcularScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    padding: 20,
  },
  counterText: {
    marginTop: '15%',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4BA556',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: '28%',
    marginBottom: 10,
  },
  buttonSubtract: {
    marginTop: "15%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: 60,
    marginBottom: 10,
  },
  buttonReset: {
    backgroundColor: '#2E98D2',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  symbolText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
});
