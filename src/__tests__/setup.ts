import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Fermer toute connexion existante
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Attendre un peu pour s'assurer que la connexion est fermée
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Utiliser une base de données en mémoire pour les tests UNIQUEMENT
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: "test-ia-db", // Base de données séparée pour les tests
    },
  });
  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  // Nettoyer toutes les collections après chaque test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Fermer la connexion et arrêter le serveur en mémoire
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});
