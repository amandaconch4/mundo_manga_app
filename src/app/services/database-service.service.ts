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
      await this.poblarMangas();
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

      // Tabla de mangas (catálogo general)
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS mangas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          volumen TEXT NOT NULL,
          autor TEXT NOT NULL,
          genero TEXT NOT NULL,
          sinopsis TEXT NOT NULL,
          imagen TEXT NOT NULL,
          categoria TEXT NOT NULL
        );
      `, []);

      // Tabla de relación usuario-manga
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS usuario_mangas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          manga_id INTEGER,
          tipo TEXT NOT NULL,
          fecha_agregado TEXT,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
          FOREIGN KEY (manga_id) REFERENCES mangas(id)
        );
      `, []);

      console.log('Tablas creadas o ya existentes');
    } catch (error) {
      console.error('Error al crear tablas:', error);
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

  // Método para modificar un usuario existente
  async modificarUsuario(username: string, nombre: string, password: number, nivelEducacion: string, email: string, fechaNacimiento: string, imagen: string | null = null) {
    try {
      const resultado = await this.db.executeSql(
        'UPDATE usuarios SET nombre = ?, password = ?, nivelEducacion = ?, fechaNacimiento = ?, imagen = ?, email = ? WHERE username = ?',
        [nombre, password, nivelEducacion, fechaNacimiento, imagen, email, username]
      );
      if (resultado.rowsAffected > 0) {
        this.presentarToast('Usuario modificado correctamente');
      } else {
        this.presentarToast('No se encontró el usuario para modificar');
      }
    } catch (error) {
      console.error('Error al modificar usuario:', error);
      this.presentarToast('Error al modificar el usuario: ' + error);
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

  // Método para insertar un manga en el catálogo
  async insertarManga(nombre: string, volumen: string, autor: string, genero: string, sinopsis: string, imagen: string, categoria: string) {
    try {
      await this.db.executeSql(
        'INSERT INTO mangas (nombre, volumen, autor, genero, sinopsis, imagen, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, volumen, autor, genero, sinopsis, imagen, categoria]
      );
      this.presentarToast('Manga agregado al catálogo');
    } catch (error) {
      console.error('Error al insertar manga:', error);
      this.presentarToast('Error al agregar manga: ' + error);
      throw error;
    }
  }

  // Método para obtener mangas por categoría
  async obtenerMangasPorCategoria(categoria: string) {
    try {
      const resultado = await this.db.executeSql('SELECT * FROM mangas WHERE categoria = ?', [categoria]);
      const mangas = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        mangas.push(resultado.rows.item(i));
      }
      return mangas;
    } catch (error) {
      console.error('Error al obtener mangas por categoría:', error);
      throw error;
    }
  }

  // Método para obtener todos los mangas de todas las categorías
  async obtenerTodosLosMangas() {
    try {
      const resultado = await this.db.executeSql('SELECT * FROM mangas ORDER BY nombre, volumen', []);
      const mangas = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        mangas.push(resultado.rows.item(i));
      }
      return mangas;
    } catch (error) {
      console.error('Error al obtener todos los mangas:', error);
      throw error;
    }
  }

  // Método para agregar manga a colección o wishlist
  async agregarMangaUsuario(username: string, mangaId: number, tipo: 'coleccion' | 'wishlist') {
    try {
      // Obtener el ID del usuario
      const usuario = await this.getUsuarioPorUsername(username);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const fecha = new Date().toISOString();
      await this.db.executeSql(
        'INSERT INTO usuario_mangas (usuario_id, manga_id, tipo, fecha_agregado) VALUES (?, ?, ?, ?)',
        [usuario.id, mangaId, tipo, fecha]
      );
      this.presentarToast(`Manga agregado a ${tipo}`);
    } catch (error) {
      console.error('Error al agregar manga al usuario:', error);
      this.presentarToast('Error al agregar manga: ' + error);
      throw error;
    }
  }

  // Método para obtener mangas del usuario (colección o wishlist)
  async obtenerMangasUsuario(username: string, tipo: 'coleccion' | 'wishlist') {
    try {
      const usuario = await this.getUsuarioPorUsername(username);
      if (!usuario) {
        return [];
      }

      const resultado = await this.db.executeSql(`
        SELECT m.* FROM mangas m
        INNER JOIN usuario_mangas um ON m.id = um.manga_id
        WHERE um.usuario_id = ? AND um.tipo = ?
      `, [usuario.id, tipo]);

      const mangas = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        mangas.push(resultado.rows.item(i));
      }
      return mangas;
    } catch (error) {
      console.error('Error al obtener mangas del usuario:', error);
      throw error;
    }
  }

  // Método para quitar manga de colección o wishlist
  async quitarMangaUsuario(username: string, mangaId: number, tipo: 'coleccion' | 'wishlist') {
    try {
      const usuario = await this.getUsuarioPorUsername(username);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      await this.db.executeSql(
        'DELETE FROM usuario_mangas WHERE usuario_id = ? AND manga_id = ? AND tipo = ?',
        [usuario.id, mangaId, tipo]
      );
      this.presentarToast(`Manga removido de ${tipo}`);
    } catch (error) {
      console.error('Error al quitar manga del usuario:', error);
      this.presentarToast('Error al quitar manga: ' + error);
      throw error;
    }
  }

  // Método para verificar si un manga está en colección o wishlist
  async mangaEnLista(username: string, mangaId: number, tipo: 'coleccion' | 'wishlist'): Promise<boolean> {
    try {
      const usuario = await this.getUsuarioPorUsername(username);
      if (!usuario) {
        return false;
      }

      const resultado = await this.db.executeSql(
        'SELECT * FROM usuario_mangas WHERE usuario_id = ? AND manga_id = ? AND tipo = ?',
        [usuario.id, mangaId, tipo]
      );

      return resultado.rows.length > 0;
    } catch (error) {
      console.error('Error al verificar manga en lista:', error);
      return false;
    }
  }

  // Método para poblar la base de datos con todos los mangas
  async poblarMangas() {
    try {
      // Verificar si ya hay mangas en la base de datos
      const resultado = await this.db.executeSql('SELECT COUNT(*) as count FROM mangas', []);
      if (resultado.rows.item(0).count > 0) {
        console.log('La base de datos ya tiene mangas, no se poblará nuevamente');
        return;
      }

      // Mangas del HOME
      const mangasHome = [
        { nombre: 'One Piece', volumen: 51, autor: 'Eiichiro Oda', genero: 'Aventura', sinopsis: 'Narra la historia de Monkey D. Luffy, un joven que sueña con convertirse en el Rey de los Piratas. Para ello, viaja por el Grand Line buscando el legendario tesoro llamado One Piece.', imagen: 'assets/mangas/mangas-home/one_piece_51.jpg' },
        { nombre: 'Naruto', volumen: 54, autor: 'Masashi Kishimoto', genero: 'Acción', sinopsis: 'Naruto Uzumaki es un joven ninja que busca reconocimiento y sueña con convertirse en Hokage, el líder de su aldea. A lo largo de su viaje, enfrenta desafíos y descubre secretos sobre su pasado.', imagen: 'assets/mangas/mangas-home/naruto_54.jpg' },
        { nombre: 'Dragon Ball Super', volumen: 7, autor: 'Akira Toriyama', genero: 'Aventura', sinopsis: 'Continúa las aventuras de Goku y sus amigos después de la derrota de Majin Buu, enfrentándose a nuevos enemigos y explorando nuevos universos.', imagen: 'assets/mangas/mangas-home/dbs_7.jpg' },
        { nombre: 'Attack on Titan', volumen: 34, autor: 'Hajime Isayama', genero: 'Fantasía oscura', sinopsis: 'En un mundo donde la humanidad vive rodeada de muros para protegerse de gigantes devoradores de humanos, Eren Yeager y sus amigos se unen a la lucha por la supervivencia.', imagen: 'assets/mangas/mangas-home/attack_on_titan_34.jpg' },
        { nombre: 'Death Note', volumen: 12, autor: 'Tsugumi Ohba', genero: 'Psicológico', sinopsis: 'Un estudiante de secundaria encuentra un cuaderno que le permite matar a cualquier persona cuyo nombre escriba en él. Comienza una caza delictiva para eliminar criminales, mientras es perseguido por un detective.', imagen: 'assets/mangas/mangas-home/death_note_12.jpg' },
        { nombre: 'My Hero Academia', volumen: 29, autor: 'Kohei Horikoshi', genero: 'Superhéroes', sinopsis: 'En un mundo donde la mayoría de las personas tienen superpoderes, Izuku Midoriya, un joven sin habilidades, sueña con convertirse en un héroe. Tras un encuentro con el héroe All Might, recibe la oportunidad de asistir a una academia de héroes.', imagen: 'assets/mangas/mangas-home/mha_29.jpg' },
        { nombre: 'Oshi no ko', volumen: 3, autor: 'Aka Akasaka', genero: 'Comedia dramática', sinopsis: 'La historia sigue a Ai Hoshino, una idol que es asesinada, y a sus hijos gemelos que buscan venganza mientras navegan por el oscuro mundo del entretenimiento japonés.', imagen: 'assets/mangas/mangas-home/oshi_no_ko_3.jpg' },
        { nombre: 'Jujutsu Kaisen', volumen: 11, autor: 'Gege Akutami', genero: 'Sobrenatural', sinopsis: 'Yuji Itadori, un estudiante de secundaria, se convierte en un recipiente para un poderoso espíritu maldito llamado Ryomen Sukuna. Ahora debe aprender a controlar sus poderes y luchar contra maldiciones junto a otros hechiceros.', imagen: 'assets/mangas/mangas-home/jjk_11.jpg' }
      ];

      // Mangas de NOVEDADES
      const mangasNovedades = [
        { nombre: 'Oshi no ko', volumen: 16, autor: 'Aka Akasaka', genero: 'Comedia dramática', sinopsis: 'La historia sigue a Ai Hoshino, una idol que es asesinada, y a sus hijos gemelos que buscan venganza mientras navegan por el oscuro mundo del entretenimiento japonés.', imagen: 'assets/mangas/mangas-novedades/oshi_no_ko_16.jpg' },
        { nombre: 'Moriarty el patriota', volumen: 14, autor: 'Ryosuke Takeuchi', genero: 'Misterio', sinopsis: 'Una reimaginación de Sherlock Holmes desde la perspectiva de su enemigo, James Moriarty, quien busca derrocar a la aristocracia británica.', imagen: 'assets/mangas/mangas-novedades/moriarty_14.jpeg' },
        { nombre: 'Spy x Family', volumen: 14, autor: 'Tatsuya Endo', genero: 'Comedia de acción', sinopsis: 'La historia sigue a un espía que debe formar una familia falsa para completar una misión, sin saber que su esposa es una asesina y su hija es una telépata.', imagen: 'assets/mangas/mangas-novedades/spy_x_family_14.jpg' },
        { nombre: 'Komi-san no puede comunicarse', volumen: 16, autor: 'Tomohito Oda', genero: 'Comedia romántica', sinopsis: 'Komi Shouko, una chica con problemas para comunicarse, intenta hacer 100 amigos mientras lidia con su ansiedad social y la presión de ser popular.', imagen: 'assets/mangas/mangas-novedades/komi_san_16.jpg' },
        { nombre: 'Chainsaw man', volumen: 19, autor: 'Tatsuki Fujimoto', genero: 'Acción', sinopsis: 'Sigue la historia de Denji, un joven que, tras la muerte de su padre y la traición de una organización, se convierte en un híbrido humano-demonio con la capacidad de convertirse en un hombre motosierra.', imagen: 'assets/mangas/mangas-novedades/chainsaw_man_19.jpg' },
        { nombre: 'Hunter x Hunter', volumen: 38, autor: 'Yoshihiro Togashi', genero: 'Aventura', sinopsis: 'Gon Freecss, un joven que descubre que su padre es un cazador legendario, se embarca en una aventura para convertirse en cazador y encontrarlo.', imagen: 'assets/mangas/mangas-novedades/hxh_38.jpg' },
        { nombre: 'Princesa bibliófila', volumen: 7, autor: 'Maki Miyoshi', genero: 'Fantasía', sinopsis: 'La historia se centra en la evolución de la relación entre Eliana y Christopher, así como en los desafíos que enfrentan al tener que elegir entre su amor por los libros y su compromiso con el futuro de la nación.', imagen: 'assets/mangas/mangas-novedades/princesa_bibliofila_7.jpg' },
        { nombre: 'Blue period', volumen: 16, autor: 'Tsubasa Yamaguchi', genero: 'Drama', sinopsis: 'La historia sigue a Yatora Yaguchi, un estudiante de secundaria que descubre su pasión por el arte y decide dedicarse a él, enfrentándose a los desafíos de la vida artística y la presión social.', imagen: 'assets/mangas/mangas-novedades/blue_period_16.jpg' }
      ];

      // Mangas de WISHLIST
      const mangasWishlist = [
        { nombre: 'Los diarios de la boticaria', volumen: 7, autor: 'Natsu Hyūga', genero: 'Misterio', sinopsis: 'Maomao es una joven que trabaja como sirvienta en la corte imperial, quien usa sus conocimientos de medicina y herboristería para resolver misterios y desentrañar intrigas palaciegas.', imagen: 'assets/mangas/mangas-wishlist/diarios_boticaria_7.jpg' },
        { nombre: 'Wind Breaker', volumen: 1, autor: 'Satoru Nii', genero: 'Acción', sinopsis: 'Sakura Haruka, que ha pasado toda su infancia peleando, se inscribe en la infame preparatoria de delincuentes conocida como Furin, con la esperanza de llegar a la cima y convertirse en el peleador más fuerte. Sin embargo, la escuela no es lo que esperaba y rápidamente se da cuenta de que Furin es un grupo que pelea para proteger a su pueblo.', imagen: 'assets/mangas/mangas-wishlist/wind_breaker_1.jpg' },
        { nombre: 'Haikyu!!', volumen: 24, autor: 'Haruichi Furudate', genero: 'Deporte', sinopsis: 'La historia sigue a Shoyo Hinata, un joven apasionado por el voleibol que se inspira en el "Pequeño Gigante", un jugador de la escuela Karasuno. A pesar de su baja estatura, Hinata se esfuerza por alcanzar su sueño de convertirse en una estrella del voleibol.', imagen: 'assets/mangas/mangas-wishlist/haikyu_24.jpg' },
        { nombre: 'Monster', volumen: 3, autor: 'Naoki Urasawa', genero: 'Triller psicológico', sinopsis: 'Kenzo Tenma es un neurocirujano que decide operar a un niño herido, Johan Liebert, en lugar de a un político influyente. Johan, sin embargo, resulta ser un asesino psicópata que causa un gran caos.', imagen: 'assets/mangas/mangas-wishlist/monster_3.jpg' },
        { nombre: 'Signos de afecto', volumen: 2, autor: 'Suu Morishita', genero: 'Romance', sinopsis: 'Yuki, una joven con problemas de audición se enamora de un chico llamado Itsuomi. A través de su relación, Yuki aprende a superar sus inseguridades y a comunicarse mejor con los demás.', imagen: 'assets/mangas/mangas-wishlist/signos_de_afecto_2.jpg' },
        { nombre: 'Mi amor por Yamada está al Nv. 999', volumen: 1, autor: 'Mashiro', genero: 'Romance', sinopsis: 'Akane, una estudiante universitaria que tras una ruptura amorosa, se sumerge en un MMORPG donde conoce a Yamada, un jugador talentoso y reservado.', imagen: 'assets/mangas/mangas-wishlist/yamada_999_1.jpg' },
        { nombre: 'Frieren', volumen: 11, autor: 'Kanehito Yamada', genero: 'Fantasía', sinopsis: 'Frieren es una maga elfa que formó parte de un grupo de héroes que derrotó al Rey Demonio. Después de la muerte de sus compañeros, decide emprender un viaje para comprender mejor la humanidad y el paso del tiempo.', imagen: 'assets/mangas/mangas-wishlist/frieren_11.jpeg' },
        { nombre: 'Re:Zero', volumen: 1, autor: 'Tappei Nagatsuki', genero: 'Fantasía oscura', sinopsis: 'Natsuki Subaru, un joven que es teletransportado a un mundo de fantasía. Allí, se ve envuelto en una serie de eventos donde muere repetidamente y, cada vez que muere, vuelve al punto de partida.', imagen: 'assets/mangas/mangas-wishlist/re_zero_1.jpg' }
      ];

      // Mangas de MI COLECCIÓN
      const mangasColeccion = [
        { nombre: 'Look back', volumen: 'Único', autor: 'Tatsuki Fujimoto', genero: 'Slice of life', sinopsis: 'Narra la historia de Ayumu Fujino, una joven mangaka talentosa que, motivada por la rivalidad y la amistad con un compañero de clase solitario, Kyomoto, se esfuerza por mejorar su arte y encuentra un propósito en la creación artística.', imagen: 'assets/mangas/mangas-mi-coleccion/look_back.jpg' },
        { nombre: 'Moriarty el patriota', volumen: 8, autor: 'Ryosuke Takeuchi', genero: 'Misterio', sinopsis: 'Una reimaginación de Sherlock Holmes desde la perspectiva de su enemigo, James Moriarty, quien busca derrocar a la aristocracia británica.', imagen: 'assets/mangas/mangas-mi-coleccion/moriarty_8.jpeg' },
        { nombre: 'Imakako', volumen: 'Único', autor: 'Daruma Matsuura', genero: 'Drama', sinopsis: 'Está centrado en la pérdida y el duelo, explorando cómo Ima y Tsurumi, dos personajes que cargan con el peso de la pérdida, se enfrentan a su sufrimiento y buscan formas de seguir adelante.', imagen: 'assets/mangas/mangas-mi-coleccion/imakako.jpg' },
        { nombre: 'Erased', volumen: 8, autor: 'Kei Sanbe', genero: 'Suspenso', sinopsis: 'Satoru Fujinuma, un aspirante a mangaka tiene la habilidad de viajar al pasado para evitar tragedias. Tras descubrir que su madre fue asesinada, Satoru se ve obligado a viajar 18 años al pasado para detener el secuestro y asesinato de su compañera de clase, Kayo.', imagen: 'assets/mangas/mangas-mi-coleccion/erased_8.jpg' },
        { nombre: 'Psycho-Pass', volumen: 1, autor: 'Gen Urobuchi', genero: 'Acción', sinopsis: 'En un futuro distópico, la sociedad está controlada por un sistema que mide el estado mental de las personas. La historia sigue a Akane Tsunemori, una inspectora que debe lidiar con criminales y el sistema que la controla.', imagen: 'assets/mangas/mangas-mi-coleccion/psycho_pass_1.jpg' },
        { nombre: 'Anohana', volumen: 2, autor: 'Cho-Heiwa Busters, Mitsu Izumi', genero: 'Drama', sinopsis: 'Narra la historia de un grupo de amigos de la infancia que se separan después de la trágica muerte de uno de ellos, Meiko "Menma" Honma.', imagen: 'assets/mangas/mangas-mi-coleccion/anohana_2.jpg' },
        { nombre: 'Uzumaki', volumen: 'Único', autor: 'Junji Ito', genero: 'Horror', sinopsis: 'Una pequeña ciudad japonesa se ve afectada por una extraña maldición relacionada con espirales. Kirie Goshima y su novio Shuichi Saito intentan descubrir el origen de esta maldición y enfrentarse a sus consecuencias aterradoras.', imagen: 'assets/mangas/mangas-mi-coleccion/uzumaki.jpg' },
        { nombre: 'Spy x family', volumen: 10, autor: 'Tatsuya Endo', genero: 'Comedia de acción', sinopsis: 'La historia sigue a un espía que debe formar una familia falsa para completar una misión, sin saber que su esposa es una asesina y su hija es una telépata.', imagen: 'assets/mangas/mangas-mi-coleccion/spy_x_family_10.jpg' }
      ];

      // Se combinan todos los mangas de las diferentes categorías en un solo array y se añade que tengan categoría
      const todosLosMangas = [
        ...mangasHome.map(m => ({ ...m, categoria: 'home' })),
        ...mangasNovedades.map(m => ({ ...m, categoria: 'novedades' })),
        ...mangasWishlist.map(m => ({ ...m, categoria: 'wishlist' })),
        ...mangasColeccion.map(m => ({ ...m, categoria: 'coleccion' }))
      ];

      for (const manga of todosLosMangas) {
        await this.insertarManga(
          manga.nombre,
          manga.volumen.toString(),
          manga.autor,
          manga.genero,
          manga.sinopsis,
          manga.imagen,
          manga.categoria
        );
      }

      console.log('Base de datos poblada con todos los mangas');
      this.presentarToast('Base de datos poblada correctamente');
    } catch (error) {
      console.error('Error al poblar la base de datos:', error);
      this.presentarToast('Error al poblar la base de datos: ' + error);
    }
  }
}
