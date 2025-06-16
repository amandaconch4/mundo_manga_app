import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangatecaPageRoutingModule } from './mangateca-routing.module';

import { MangatecaPage } from './mangateca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangatecaPageRoutingModule
  ],
  declarations: [MangatecaPage]
})
export class MangatecaPageModule {}
