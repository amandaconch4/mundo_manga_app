import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: false,
})
export class WishlistPage implements OnInit {

  // Listado de mangas en wishlist
  wishlist = [
    { 
      nombre: 'Los diarios de la boticaria', 
      volumen: 7, 
      autor: 'Natsu Hyūga', 
      genero: 'Misterio',
      sinopsis: 'Maomao es una joven que trabaja como sirvienta en la corte imperial, quien usa sus conocimientos de medicina y herboristería para resolver misterios y desentrañar intrigas palaciegas.',
      imagen: 'assets/mangas/mangas-wishlist/diarios_boticaria_7.jpg'
    },
    { 
      nombre: 'Wind Breaker', 
      volumen: 1, 
      autor: 'Satoru Nii', 
      genero: 'Acción',
      sinopsis: 'Sakura Haruka, que ha pasado toda su infancia peleando, se inscribe en la infame preparatoria de delincuentes conocida como Furin, con la esperanza de llegar a la cima y convertirse en el peleador más fuerte. Sin embargo, la escuela no es lo que esperaba y rápidamente se da cuenta de que Furin es un grupo que pelea para proteger a su pueblo.',
      imagen: 'assets/mangas/mangas-wishlist/wind_breaker_1.jpg'
    },
    { 
      nombre: 'Haikyu!!', 
      volumen: 24, 
      autor: 'Haruichi Furudate', 
      genero: 'Deporte',
      sinopsis: 'La historia sigue a Shoyo Hinata, un joven apasionado por el voleibol que se inspira en el "Pequeño Gigante", un jugador de la escuela Karasuno. A pesar de su baja estatura, Hinata se esfuerza por alcanzar su sueño de convertirse en una estrella del voleibol.',
      imagen: 'assets/mangas/mangas-wishlist/haikyu_24.jpg'
    },
    { 
      nombre: 'Monster',
      volumen: 3,
      autor: 'Naoki Urasawa', 
      genero: 'Triller psicológico',
      sinopsis: 'Kenzo Tenma es un neurocirujano que decide operar a un niño herido, Johan Liebert, en lugar de a un político influyente. Johan, sin embargo, resulta ser un asesino psicópata que causa un gran caos.',
      imagen: 'assets/mangas/mangas-wishlist/monster_3.jpg'
    },
    { 
      nombre: 'Signos de afecto', 
      volumen: 2, 
      autor: 'Suu Morishita', 
      genero: 'Romance',
      sinopsis: 'Yuki, una joven con problemas de audición se enamora de un chico llamado Itsuomi. A través de su relación, Yuki aprende a superar sus inseguridades y a comunicarse mejor con los demás.',
      imagen: 'assets/mangas/mangas-wishlist/signos_de_afecto_2.jpg'
    },
    { 
      nombre: 'Mi amor por Yamada está al Nv. 999', 
      volumen: 1, 
      autor: 'Mashiro', 
      genero: 'Romance',
      sinopsis: 'Akane, una estudiante universitaria que tras una ruptura amorosa, se sumerge en un MMORPG donde conoce a Yamada, un jugador talentoso y reservado.',
      imagen: 'assets/mangas/mangas-wishlist/yamada_999_1.jpg'
    },
    { 
      nombre: 'Frieren', 
      volumen: 11, 
      autor: 'Kanehito Yamada', 
      genero: 'Fantasía', 
      sinopsis: 'Frieren es una maga elfa que formó parte de un grupo de héroes que derrotó al Rey Demonio. Después de la muerte de sus compañeros, decide emprender un viaje para comprender mejor la humanidad y el paso del tiempo.',
      imagen: 'assets/mangas/mangas-wishlist/frieren_11.jpeg'
    },
    {
      nombre: 'Re:Zero',
      volumen: 1,
      autor: 'Tappei Nagatsuki',
      genero: 'Fantasía oscura',
      sinopsis: 'Natsuki Subaru, un joven que es teletransportado a un mundo de fantasía. Allí, se ve envuelto en una serie de eventos donde muere repetidamente y, cada vez que muere, vuelve al punto de partida.',
      imagen: 'assets/mangas/mangas-wishlist/re_zero_1.jpg'
    }
  ];

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  // Método para navegar a la página de detalle del manga desde la wishlist
  verDetalleManga(manga: any) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { 
        manga,
        fromWishlist: true
      }
    });
  }
}
