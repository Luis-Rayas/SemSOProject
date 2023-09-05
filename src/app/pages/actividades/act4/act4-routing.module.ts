import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Act4Component } from './act4.component';

const routes: Routes = [
  {
    path: '',
    component: Act4Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Act4RoutingModule { }
