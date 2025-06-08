import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements OnInit {
  username: string = '';
  showWelcomeMessage: boolean = true;

  // Listado de mangas
  mangas = [
    { 
      nombre: 'One Piece', 
      volumen: 51, 
      autor: 'Eiichiro Oda', 
      genero: 'Aventura',
      sinopsis:'Narra la historia de Monkey D. Luffy, un joven que sueña con convertirse en el Rey de los Piratas. Para ello, viaja por el Grand Line buscando el legendario tesoro llamado One Piece', 
      imagen: 'assets/mangas/one_piece_51.jpg'
    },
    { 
      nombre: 'Naruto', 
      volumen: 54, 
      autor: 'Masashi Kishimoto', 
      genero: 'Acción',
      sinopsis: 'Naruto Uzumaki es un joven ninja que busca reconocimiento y sueña con convertirse en Hokage, el líder de su aldea. A lo largo de su viaje, enfrenta desafíos y descubre secretos sobre su pasado.',
      imagen: 'assets/mangas/naruto_54.jpg'
    },
    { 
      nombre: 'Dragon Ball Super',
      volumen: 7,
      autor: 'Akira Toriyama', 
      genero: 'Aventura',
      sinopsis: 'Continúa las aventuras de Goku y sus amigos después de la derrota de Majin Buu, enfrentándose a nuevos enemigos y explorando nuevos universos.',
      imagen: 'assets/mangas/dbs_7.jpg'
    },
    { 
      nombre: 'Attack on Titan', 
      volumen: 34, 
      autor: 'Hajime Isayama', 
      genero: 'Fantasía oscura',
      sinopsis: 'En un mundo donde la humanidad vive rodeada de muros para protegerse de gigantes devoradores de humanos, Eren Yeager y sus amigos se unen a la lucha por la supervivencia.',
      imagen: 'assets/mangas/attack_on_titan_34.jpg'
    },
    { 
      nombre: 'Death Note', 
      volumen: 12, 
      autor: 'Tsugumi Ohba', 
      genero: 'Psicológico',
      sinopsis: 'Un estudiante de secundaria encuentra un cuaderno que le permite matar a cualquier persona cuyo nombre escriba en él. Comienza una caza delictiva para eliminar criminales, mientras es perseguido por un detective.',
      imagen: 'assets/mangas/death_note_12.jpg'
    },
    { 
      nombre: 'My Hero Academia', 
      volumen: 29, 
      autor: 'Kohei Horikoshi', 
      genero: 'Superhéroes',
      sinopsis: 'En un mundo donde la mayoría de las personas tienen superpoderes, Izuku Midoriya, un joven sin habilidades, sueña con convertirse en un héroe. Tras un encuentro con el héroe All Might, recibe la oportunidad de asistir a una academia de héroes.',
      imagen: 'assets/mangas/mha_29.jpg'
    },
    { 
      nombre: 'Oshi no ko', 
      volumen: 3, 
      autor: 'Aka Akasaka', 
      genero: 'Comedia dramática',
      sinopsis: 'La historia sigue a Ai Hoshino, una idol que es asesinada, y a sus hijos gemelos que buscan venganza mientras navegan por el oscuro mundo del entretenimiento japonés.',
      imagen: 'assets/mangas/oshi_no_ko_3.jpg'
    },
    {
      nombre: 'Jujutsu Kaisen',
      volumen: 11,
      autor: 'Gege Akutami',
      genero: 'Sobrenatural',
      sinopsis: 'Yuji Itadori, un estudiante de secundaria, se convierte en un recipiente para un poderoso espíritu maldito llamado Ryomen Sukuna. Ahora debe aprender a controlar sus poderes y luchar contra maldiciones junto a otros hechiceros.',
      imagen: 'assets/mangas/jjk_11.jpg'
    }
  ];

  constructor(
    private router: Router,
    private menu: MenuController,
    private navCtrl: NavController
  ) {
    // Obtener el username del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.username = (navigation.extras.state as any).username;
    }
  }

  ngOnInit() {
    // Oculta el mensaje de bienvenida después de 5 segundos
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 5000);
  }

  verDetalleManga(manga: any) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { manga }
    });
  }
}
