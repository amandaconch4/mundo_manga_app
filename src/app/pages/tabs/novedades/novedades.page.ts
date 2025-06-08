import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.page.html',
  styleUrls: ['./novedades.page.scss'],
  standalone: false,
})
export class NovedadesPage implements OnInit {

  // Listado de mangas en novedades
  novedades = [
    { 
      nombre: 'Oshi no ko', 
      volumen: 16, 
      autor: 'Aka Akasaka', 
      genero: 'Comedia dramática',
      sinopsis: 'La historia sigue a Ai Hoshino, una idol que es asesinada, y a sus hijos gemelos que buscan venganza mientras navegan por el oscuro mundo del entretenimiento japonés.',
      imagen: 'assets/mangas/mangas-novedades/oshi_no_ko_16.jpg'
    },
    { 
      nombre: 'Moriarty el patriota', 
      volumen: 14, 
      autor: 'Ryosuke Takeuchi', 
      genero: 'Misterio',
      sinopsis: 'Una reimaginación de Sherlock Holmes desde la perspectiva de su enemigo, James Moriarty, quien busca derrocar a la aristocracia británica.',
      imagen: 'assets/mangas/mangas-novedades/moriarty_14.jpeg'
    },
    { 
      nombre: 'Spy x Family',
      volumen: 14,
      autor: 'Tatsuya Endo', 
      genero: 'Comedia de acción',
      sinopsis: 'La historia sigue a un espía que debe formar una familia falsa para completar una misión, sin saber que su esposa es una asesina y su hija es una telépata.',
      imagen: 'assets/mangas/mangas-novedades/spy_x_family_14.jpg'
    },
    { 
      nombre: 'Komi-san no puede comunicarse', 
      volumen: 16, 
      autor: 'Tomohito Oda', 
      genero: 'Comedia romántica',
      sinopsis: 'Komi Shouko, una chica con problemas para comunicarse, intenta hacer 100 amigos mientras lidia con su ansiedad social y la presión de ser popular.',
      imagen: 'assets/mangas/mangas-novedades/komi_san_16.jpg'
    },
    { 
      nombre: 'Chainsaw man', 
      volumen: 19, 
      autor: 'Tatsuki Fujimoto', 
      genero: 'Acción',
      sinopsis: 'Sigue la historia de Denji, un joven que, tras la muerte de su padre y la traición de una organización, se convierte en un híbrido humano-demonio con la capacidad de convertirse en un hombre motosierra.',
      imagen: 'assets/mangas/mangas-novedades/chainsaw_man_19.jpg'
    },
    { 
      nombre: 'Hunter x Hunter', 
      volumen: 38, 
      autor: 'Yoshihiro Togashi', 
      genero: 'Aventura', 
      sinopsis: 'Gon Freecss, un joven que descubre que su padre es un cazador legendario, se embarca en una aventura para convertirse en cazador y encontrarlo.',
      imagen: 'assets/mangas/mangas-novedades/hxh_38.jpg'
    },
    { 
      nombre: 'Princesa bibliófila', 
      volumen: 7, 
      autor: 'Maki Miyoshi', 
      genero: 'Fantasía',
      sinopsis: 'La historia se centra en la evolución de la relación entre Eliana y Christopher, así como en los desafíos que enfrentan al tener que elegir entre su amor por los libros y su compromiso con el futuro de la nación.',
      imagen: 'assets/mangas/mangas-novedades/princesa_bibliofila_7.jpg'
    },
    {
      nombre: 'Blue period',
      volumen: 16,
      autor: 'Tsubasa Yamaguchi',
      genero: 'Drama',
      sinopsis: 'La historia sigue a Yatora Yaguchi, un estudiante de secundaria que descubre su pasión por el arte y decide dedicarse a él, enfrentándose a los desafíos de la vida artística y la presión social.',
      imagen: 'assets/mangas/mangas-novedades/blue_period_16.jpg'
    }
  ];

  constructor(
    private menu: MenuController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  verDetalleManga(manga: any) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { manga }
    });
  }
}
