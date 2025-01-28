import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

// Connexion à la base de données PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Script SQL pour créer la base de données et les tables
const createDatabaseAndTables = async () => {
  const client = await pool.connect();

  try {
    // Création des tables
    const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          pseudo VARCHAR(30) NOT NULL,
          email VARCHAR(40) NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN NOT NULL
      );

      CREATE TABLE follow (
          follower_id CHAR(36) NOT NULL,
          followed_id CHAR(36) NOT NULL,
          PRIMARY KEY(follower_id, followed_id)
      );

      CREATE TABLE reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          game_id BIGINT NOT NULL,
          user_id CHAR(36) NOT NULL,
          rating INT NOT NULL,
          review TEXT NULL
      );

      CREATE TABLE review_like (
          review_id CHAR(36) NOT NULL,
          user_id CHAR(36) NOT NULL,
          PRIMARY KEY(review_id, user_id)
      );

      CREATE TABLE user_game_status (
          user_id CHAR(36) NOT NULL,
          game_id BIGINT NOT NULL,
          status VARCHAR(35) NOT NULL,
          PRIMARY KEY(user_id, game_id)
      );

      CREATE TABLE lists (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id CHAR(36) NOT NULL,
          name VARCHAR(20) NOT NULL,
          description TEXT NOT NULL,
          is_private BOOLEAN NOT NULL
      );

      CREATE TABLE game_list (
          game_id BIGINT NOT NULL,
          list_id CHAR(36) NOT NULL,
          PRIMARY KEY(game_id, list_id)
      );

      -- Définition des clés étrangères
      ALTER TABLE follow ADD CONSTRAINT follow_followed_id_foreign FOREIGN KEY(followed_id) REFERENCES users(id);
      ALTER TABLE follow ADD CONSTRAINT follow_follower_id_foreign FOREIGN KEY(follower_id) REFERENCES users(id);

      ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_foreign FOREIGN KEY(user_id) REFERENCES users(id);

      ALTER TABLE review_like ADD CONSTRAINT review_like_user_id_foreign FOREIGN KEY(user_id) REFERENCES users(id);
      ALTER TABLE review_like ADD CONSTRAINT review_like_review_id_foreign FOREIGN KEY(review_id) REFERENCES reviews(id);

      ALTER TABLE user_game_status ADD CONSTRAINT user_game_status_user_id_foreign FOREIGN KEY(user_id) REFERENCES users(id);
      ALTER TABLE user_game_status ADD CONSTRAINT user_game_status_game_id_foreign FOREIGN KEY(game_id) REFERENCES game_list(game_id);

      ALTER TABLE game_list ADD CONSTRAINT game_list_list_id_foreign FOREIGN KEY(list_id) REFERENCES lists(id);

      ALTER TABLE lists ADD CONSTRAINT lists_user_id_foreign FOREIGN KEY(user_id) REFERENCES users(id);
    `;

    // Exécution du script pour créer les tables et les relations
    await client.query(createTablesQuery);
    console.log('Database and tables created successfully!');
  } catch (err) {
    console.error('Error creating database and tables:', err);
  } finally {
    client.release(); // Libérer la connexion après l'exécution
    await pool.end(); // Fermer la connexion poolée à la fin
  }
};

// Exécuter la fonction pour créer la base de données et les tables
createDatabaseAndTables().catch((error) => {
  console.error('Error running the database creation script:', error);
});
