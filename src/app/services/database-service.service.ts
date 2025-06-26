import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServiceService {
  public db!: SQLiteObject;
  private dbLista: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private sqlite: SQLite,
    private toastController: ToastController
  ) {
    this.iniciarDB();
  }

  private async iniciarDB() {
    try {
      const db = await this.sqlite.create({
        name: 'mundomanga.db',
        location: 'default'
      });
      this.db = db;
      await this.crearTablas();
      this.dbLista.next(true);
      this.presentarToast('Base de datos creada correctamente');
    } catch (error) {
      console.error('Error al crear la base de datos:', error);
      this.presentarToast('Error al crear la base de datos: ' + error);
    }
  }

  private async crearTablas() {
    try {
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          nombre TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password INTEGER NOT NULL,
          nivelEducacion TEXT NOT NULL,
          fechaNacimiento TEXT NOT NULL
        );
      `, []);
      console.log('Tabla usuarios creada o ya existente');
    } catch (error) {
      console.error('Error al crear tabla usuarios:', error);
      throw error;
    }
  }

  async validarUsuario(username: string, password: number) {
    try {
      const resultado = await this.db.executeSql(
        'SELECT * FROM usuarios WHERE username = ? AND password = ?',
        [username, password]
      );

      if (resultado.rows.length > 0) {
        return resultado.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al validar usuario:', error);
      throw error;
    }
  }

  async insertarUsuario(nombre: string, username: string, email: string, password: number, nivelEducacion: string, fechaNacimiento: string) {
    try {
      await this.db.executeSql(
        'INSERT INTO usuarios (username, nombre, email, password, nivelEducacion, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?);',
        [username, nombre, email, password, nivelEducacion, fechaNacimiento]
      );
      this.presentarToast('Usuario registrado correctamente');
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      this.presentarToast('Error al registrar el usuario: ' + error);
      throw error;
    }
  }

  async eliminarUsuario(username: string) {
    try {
      const resultado = await this.db.executeSql('DELETE FROM usuarios WHERE username = ?', [username]);
      if (resultado.rowsAffected > 0) {
        this.presentarToast('Usuario eliminado correctamente');
      } else {
        this.presentarToast('No se encontró el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      this.presentarToast('Error al eliminar el usuario: ' + error);
      throw error;
    }
  }

  private async presentarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  getDbLista() {
    return this.dbLista.asObservable();
  }
}
