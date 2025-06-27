import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface Manga {
  id?: number;
  nombre: string;
  volumen: number | string;
  autor: string;
  genero: string;
  sinopsis: string;
  imagen: string;
  categoria?: string;
  isInCollection?: boolean;
  isInWishlist?: boolean;
}

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
  imports: [CommonModule, IonicModule]
})

export class MangaCardComponent {
  @Input() manga!: Manga;
  @Input() showActions: boolean = false;
  @Input() isInCollection: boolean = false;
  @Input() isInWishlist: boolean = false;
  @Output() mangaClick = new EventEmitter<Manga>();
  @Output() addToCollection = new EventEmitter<Manga>();
  @Output() addToWishlist = new EventEmitter<Manga>();
  @Output() removeFromCollection = new EventEmitter<Manga>();
  @Output() removeFromWishlist = new EventEmitter<Manga>();

  onMangaClick(): void {
    this.mangaClick.emit(this.manga);
  }

  onAddToCollection(event: Event): void {
    event.stopPropagation();
    this.addToCollection.emit(this.manga);
  }

  onAddToWishlist(event: Event): void {
    event.stopPropagation();
    this.addToWishlist.emit(this.manga);
  }

  onRemoveFromCollection(event: Event): void {
    event.stopPropagation();
    this.removeFromCollection.emit(this.manga);
  }

  onRemoveFromWishlist(event: Event): void {
    event.stopPropagation();
    this.removeFromWishlist.emit(this.manga);
  }
}
