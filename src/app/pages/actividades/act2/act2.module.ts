import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewProcessModalComponent } from './components/new-process-modal/new-process-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Act2RoutingModule } from './act2-routing.module';
import { Act2Component } from './act2.component';
import { Act2Service } from './services/act2-service.service';


@NgModule({
  declarations: [
    Act2Component,
    NewProcessModalComponent
  ],
  imports: [
    CommonModule,
    Act2RoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Act2Service,
  ]
})
export class Act2Module { }
