import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
      imagen: 'assets/mangas/one_piece_51.jpg'
    },
    { 
      nombre: 'Naruto', 
      volumen: 54, 
      autor: 'Masashi Kishimoto', 
      genero: 'Acción',
      imagen: 'assets/mangas/naruto_54.jpg'
    },
    { 
      nombre: 'Dragon Ball Super',
      volumen: 7,
      autor: 'Akira Toriyama', 
      genero: 'Aventura',
      imagen: 'assets/mangas/dbs_7.jpg'
    },
    { 
      nombre: 'Attack on Titan', 
      volumen: 34, 
      autor: 'Hajime Isayama', 
      genero: 'Fantasía oscura',
      imagen: 'assets/mangas/attack_on_titan_34.jpg'
    },
    { 
      nombre: 'Death Note', 
      volumen: 12, 
      autor: 'Tsugumi Ohba', 
      genero: 'Psicológico',
      imagen: 'assets/mangas/death_note_12.jpg'
    },
    { 
      nombre: 'My Hero Academia', 
      volumen: 29, 
      autor: 'Kohei Horikoshi', 
      genero: 'Superhéroes',
      imagen: 'assets/mangas/mha_29.jpg'
    },
    { 
      nombre: 'Oshi no ko', 
      volumen: 3, 
      autor: 'Aka Akasaka', 
      genero: 'Drama',
      imagen: 'assets/mangas/oshi_no_ko_3.jpg'
    },
    {
      nombre: 'Jujutsu Kaisen',
      volumen: 11,
      autor: 'Gege Akutami',
      genero: 'Sobrenatural',
      imagen: 'assets/mangas/jjk_11.jpg'
    }
  ];

  constructor(
    private router: Router,
    private menu: MenuController
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
}
