import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mangateca',
  templateUrl: './mangateca.page.html',
  styleUrls: ['./mangateca.page.scss'],
  standalone: false,
})
export class MangatecaPage implements OnInit {

  // Listado de mangas en mi colección
  miColeccion = [
    { 
      nombre: 'Look back', 
      volumen: 'Único', 
      autor: 'Tatsuki Fujimoto', 
      genero: 'Slice of life',
      sinopsis: 'Narra la historia de Ayumu Fujino, una joven mangaka talentosa que, motivada por la rivalidad y la amistad con un compañero de clase solitario, Kyomoto, se esfuerza por mejorar su arte y encuentra un propósito en la creación artística.',
      imagen: 'assets/mangas/mangas-mi-coleccion/look_back.jpg'
    },
    { 
      nombre: 'Moriarty el patriota', 
      volumen: 8, 
      autor: 'Ryosuke Takeuchi', 
      genero: 'Misterio',
      sinopsis: 'Una reimaginación de Sherlock Holmes desde la perspectiva de su enemigo, James Moriarty, quien busca derrocar a la aristocracia británica.',
      imagen: 'assets/mangas/mangas-mi-coleccion/moriarty_8.jpeg'
    },
    { 
      nombre: 'Imakako',
      volumen: 'Único',
      autor: 'Daruma Matsuura', 
      genero: 'Drama',
      sinopsis: 'Está centrado en la pérdida y el duelo, explorando cómo Ima y Tsurumi, dos personajes que cargan con el peso de la pérdida, se enfrentan a su sufrimiento y buscan formas de seguir adelante',
      imagen: 'assets/mangas/mangas-mi-coleccion/imakako.jpg'
    },
    { 
      nombre: 'Erased', 
      volumen: 8, 
      autor: 'Kei Sanbe', 
      genero: 'Suspenso',
      sinopsis: 'narra la historia de Satoru Fujinuma, un aspirante a mangaka que tiene la habilidad de viajar al pasado para evitar tragedias. Tras descubrir que su madre fue asesinada, Satoru se ve obligado a viajar 18 años al pasado para detener el secuestro y asesinato de su compañera de clase, Kayo.',
      imagen: 'assets/mangas/mangas-mi-coleccion/erased_8.jpg'
    },
    { 
      nombre: 'Psycho-Pass', 
      volumen: 1, 
      autor: 'Gen Urobuchi', 
      genero: 'Acción',
      sinopsis: 'En un futuro distópico, la sociedad está controlada por un sistema que mide el estado mental de las personas. La historia sigue a Akane Tsunemori, una inspectora que debe lidiar con criminales y el sistema que la controla.',
      imagen: 'assets/mangas/mangas-mi-coleccion/psycho_pass_1.jpg'
    },
    { 
      nombre: 'Anohana', 
      volumen: 2, 
      autor: 'Mitsu Izumi', 
      genero: 'Drama', 
      sinopsis: 'Narra la historia de un grupo de amigos de la infancia que se separan después de la trágica muerte de uno de ellos, Meiko "Menma" Honma.',
      imagen: 'assets/mangas/mangas-mi-coleccion/anohana_2.jpg'
    },
    { 
      nombre: 'Uzumaki', 
      volumen: 'Único', 
      autor: 'Junji Ito', 
      genero: 'Horror',
      sinopsis: 'Una pequeña ciudad japonesa se ve afectada por una extraña maldición relacionada con espirales. Kirie Goshima y su novio Shuichi Saito intentan descubrir el origen de esta maldición y enfrentarse a sus consecuencias aterradoras.',
      imagen: 'assets/mangas/mangas-mi-coleccion/uzumaki.jpg'
    },
    {
      nombre: 'Spy x family',
      volumen: 10,
      autor: 'Tatsuya Endo',
      genero: 'Comedia de acción',
      sinopsis: 'La historia sigue a un espía que debe formar una familia falsa para completar una misión, sin saber que su esposa es una asesina y su hija es una telépata.',
      imagen: 'assets/mangas/mangas-mi-coleccion/spy_x_family_10.jpg'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
