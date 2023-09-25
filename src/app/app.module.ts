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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContainerComponent,
    FooterComponent,
    AddProcessesModalComponent,
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
