import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangatecaPageRoutingModule } from './mangateca-routing.module';

import { MangatecaPage } from './mangateca.page';
import { MangaCardComponent } from '../../../components/manga-card/manga-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangatecaPageRoutingModule,
    MangaCardComponent
  ],
  declarations: [MangatecaPage]
})
export class MangatecaPageModule {}
