import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcessManagerService } from './services/process-manager.service';
import { AddProcessesModalComponent } from './components/main-layout/add-processes-modal/add-processes-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContainerComponent } from './components/main-layout/container.component';
import { BcpTableComponent } from './components/main-layout/bcp-table/bcp-table.component';
import { QuantumModalComponent } from './components/main-layout/quantum-modal/quantum-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContainerComponent,
    FooterComponent,
    AddProcessesModalComponent,
    BcpTableComponent,
    QuantumModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,

    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ProcessManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
