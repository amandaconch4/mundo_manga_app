import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleMangaPage } from './detalle-manga.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleMangaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleMangaPageRoutingModule {}
