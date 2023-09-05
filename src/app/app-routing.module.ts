import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'actividades',
    children: [
      {
        path: 'act2',
        loadChildren: () => import('./pages/actividades/act2/act2.module').then(m => m.Act2Module)
      },
      {
        path: 'act4',
        loadChildren: () => import('./pages/actividades/act4/act4.module').then(m => m.Act4Module)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
