import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Manga {
  nombre: string;
  volumen: string;
  autor: string;
  genero: string;
  sinopsis: string;
  imagen: string;
}

@Component({
  selector: 'app-detalle-manga',
  templateUrl: './detalle-manga.page.html',
  styleUrls: ['./detalle-manga.page.scss'],
  standalone: false
})
export class DetalleMangaPage implements OnInit {
  manga: Manga | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Se obtienen los datos del manga desde el estado de la navegación
    const navigation = window.history.state;
    if (navigation && navigation.manga) {
      this.manga = navigation.manga;
    }
  }
}
