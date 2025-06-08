import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleMangaPageRoutingModule } from './detalle-manga-routing.module';

import { DetalleMangaPage } from './detalle-manga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleMangaPageRoutingModule
  ],
  declarations: [DetalleMangaPage]
})
export class DetalleMangaPageModule {}
