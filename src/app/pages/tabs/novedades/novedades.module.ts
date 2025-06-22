import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovedadesPageRoutingModule } from './novedades-routing.module';

import { NovedadesPage } from './novedades.page';
import { MangaCardComponent } from '../../../components/manga-card/manga-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovedadesPageRoutingModule,
    MangaCardComponent
  ],
  declarations: [NovedadesPage]
})
export class NovedadesPageModule {}
