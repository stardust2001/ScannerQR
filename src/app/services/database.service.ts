import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {
    this.initializeDatabase();
  }

  async initializeDatabase(): Promise<void> {
    try {
      const db = await this.sqlite.create({
        name: 'users.db',
        location: 'default'
      });

      this.dbInstance = db;

      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS datos (
          id INTEGER PRIMARY KEY,
          nombre TEXT
        )
      `, []);

      console.log('Base de datos SQLite inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async addDato(id: number, nombre: string): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada.');
    }

    try {
      await this.dbInstance.executeSql(
        'INSERT OR REPLACE INTO datos (id, nombre) VALUES (?, ?)',
        [id, nombre]
      );
      console.log(`Dato guardado: id=${id}, nombre=${nombre}`);
    } catch (error) {
      console.error('Error al insertar dato:', error);
    }
  }

  async getDatos(): Promise<{ id: number; nombre: string }[]> {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada.');
    }

    try {
      const result = await this.dbInstance.executeSql('SELECT * FROM datos', []);
      const datos: { id: number; nombre: string }[] = [];

      for (let i = 0; i < result.rows.length; i++) {
        datos.push(result.rows.item(i));
      }

      return datos;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return [];
    }
  }
}
