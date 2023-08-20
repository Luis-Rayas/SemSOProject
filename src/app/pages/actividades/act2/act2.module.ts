import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Act2RoutingModule } from './act2-routing.module';
import { Act2Component } from './act2.component';
import { Act2Service } from './services/act2-service.service';


@NgModule({
  declarations: [
    Act2Component
  ],
  imports: [
    CommonModule,
    Act2RoutingModule
  ],
  providers: [
    Act2Service
  ]
})
export class Act2Module { }
