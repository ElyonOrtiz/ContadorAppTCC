// src/types.ts
export type RootStackParamList = {
  historico: undefined; // A tela "historico" não recebe parâmetros
  calcular: { contagemId?: number }; // A tela "calcular" pode receber um parâmetro "contagemId"
};