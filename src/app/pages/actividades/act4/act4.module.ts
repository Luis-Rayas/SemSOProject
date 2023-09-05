import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Act4RoutingModule } from './act4-routing.module';
import { Act4Component } from './act4.component';
import { AddProcessRandomModalComponent } from './components/add-process-random-modal/add-process-random-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Act4Component,
    AddProcessRandomModalComponent
  ],
  imports: [
    CommonModule,
    Act4RoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Act4Module { }
