import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private sqliteConnection: SQLiteConnection;

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    this.initDB();
  }

  async initDB() {
    const dbName = 'qrdb';

    try {
      // 🔑 Parámetros requeridos: database, encrypted, mode, version, readonly
      this.db = await this.sqliteConnection.createConnection(
        dbName,         // database name
        false,          // encrypted
        'no-encryption',// mode
        1,              // version
        false           // readonly
      );

      await this.db.open();

      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS datos (
          id INTEGER PRIMARY KEY,
          nombre TEXT
        );
      `);

      console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
    }
  }
  async addDato(id: number, nombre: string) {
    if (!this.db) return;
    await this.db.run(
      `INSERT OR REPLACE INTO datos (id, nombre) VALUES (?, ?)`,
      [id, nombre]
    );
  }

  async getDatos(): Promise<{ id: number; nombre: string }[]> {
    if (!this.db) return [];
    const res = await this.db.query(`SELECT * FROM datos`);
    return res.values || [];
  }
}
