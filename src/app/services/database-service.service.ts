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

  // Método para inicializar la base de datos
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

  // Método para crear las tablas necesarias
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

      // Agrega la imagen si no existe
      await this.db.executeSql('ALTER TABLE usuarios ADD COLUMN imagen TEXT', []).catch(() => {});
      console.log('Tabla usuarios creada o ya existente (con columna imagen)');
    } catch (error) {
      console.error('Error al crear tabla usuarios:', error);
      throw error;
    }
  }

  //Método para validar si existe un usuario con el username y password proporcionados
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

  //Método para insertar un nuevo usuario en la base de datos
  async insertarUsuario(nombre: string, username: string, email: string, password: number, nivelEducacion: string, fechaNacimiento: string, imagen: string | null = null) {
    try {
      await this.db.executeSql(
        'INSERT INTO usuarios (username, nombre, email, password, nivelEducacion, fechaNacimiento, imagen) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [username, nombre, email, password, nivelEducacion, fechaNacimiento, imagen]
      );
      this.presentarToast('Usuario registrado correctamente');
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      this.presentarToast('Error al registrar el usuario: ' + error);
      throw error;
    }
  }

  // Método para eliminar un usuario por su username
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

  // Método para mostrar un mensaje de toast
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

  // Método para obtener un usuario por su username
  async getUsuarioPorUsername(username: string) {
    try {
      const resultado = await this.db.executeSql('SELECT * FROM usuarios WHERE username = ?', [username]);
      if (resultado.rows.length > 0) {
        return resultado.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Método para actualizar la imagen de perfil de un usuario
  async actualizarImagenUsuario(username: string, imagen: string) {
    try {
      await this.db.executeSql('UPDATE usuarios SET imagen = ? WHERE username = ?', [imagen, username]);
      this.presentarToast('Imagen de perfil actualizada');
    } catch (error) {
      console.error('Error al actualizar imagen de usuario:', error);
      this.presentarToast('Error al actualizar la imagen: ' + error);
      throw error;
    }
  }
}
