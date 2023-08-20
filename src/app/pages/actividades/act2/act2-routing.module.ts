import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Act2Component } from './act2.component';

const routes: Routes = [
  {
    path: '',
    component: Act2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Act2RoutingModule { }
