import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface Manga {
  nombre: string;
  volumen: number | string;
  autor: string;
  genero: string;
  sinopsis: string;
  imagen: string;
}

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MangaCardComponent {
  @Input() manga!: Manga;
  @Output() mangaClick = new EventEmitter<Manga>();

  onMangaClick(): void {
    this.mangaClick.emit(this.manga);
  }
}
