import mysql from 'mysql2/promise';

// Create a connection pool (recommended for Next.js)
export async function getConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ...(process.env.MYSQL_USE_SSL === 'true' && {
      ssl: { rejectUnauthorized: true }
    }),
  });
}

// Helper function for queries
export async function executeQuery<T>({
  query,
  values = []
}: {
  query: string;
  values?: unknown[];
}): Promise<T> {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results as T;
  } finally {
    connection.end();
  }
}