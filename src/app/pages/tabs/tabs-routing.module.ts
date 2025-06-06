import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'mangateca',
        loadChildren: () => import('./mangateca/mangateca.module').then(m => m.MangatecaPageModule)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistPageModule)
      },
      {
        path: 'novedades',
        loadChildren: () => import('./novedades/novedades.module').then(m => m.NovedadesPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
