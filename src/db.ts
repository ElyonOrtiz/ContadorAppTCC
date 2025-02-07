import * as SQLite from 'expo-sqlite';

// Abre o banco de dados
const db = SQLite.openDatabaseSync('contagens.db');

// Inicializa o banco de dados
export const initDB = (): void => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS contagens (
      id INTEGER PRIMARY KEY NOT NULL,
      data TEXT UNIQUE,
      count INTEGER
    );
  `);
};

// Salva uma contagem no banco de dados
export const salvarContagem = (data: string, count: number): void => {
  db.runSync(
    `INSERT OR REPLACE INTO contagens (id, data, count)
     VALUES (
       (SELECT id FROM contagens WHERE data = ?),
       ?, ?
     );`,
    [data, data, count]
  );
};

// Interface para o tipo Contagem
export interface Contagem {
  id: number;
  data: string;
  count: number;
}

// Busca todas as contagens
export const buscarContagens = (): Contagem[] => {
  const result = db.getAllSync<Contagem>(`SELECT * FROM contagens ORDER BY data DESC;`);
  return result;
};

// Busca uma contagem por ID
export const buscarContagemPorId = (id: number): Contagem | undefined => {
  const result = db.getAllSync<Contagem>(`SELECT * FROM contagens WHERE id = ?;`, [id]);
  return result[0]; // Retorna o primeiro registro ou undefined
};

// Busca uma contagem por data (ex: "2025-02-07")
export const buscarContagemPorData = (data: string): Contagem | undefined => {
  const result = db.getAllSync<Contagem>(`SELECT * FROM contagens WHERE data = ?;`, [data]);
  return result[0];
};
