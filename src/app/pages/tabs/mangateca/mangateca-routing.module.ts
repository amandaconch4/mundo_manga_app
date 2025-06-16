import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangatecaPage } from './mangateca.page';

const routes: Routes = [
  {
    path: '',
    component: MangatecaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangatecaPageRoutingModule {}
