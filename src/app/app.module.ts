import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContainerComponent } from './components/main-layout/container.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcessManagerService } from './services/process-manager.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContainerComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}, {})
  ],
  providers: [
    ProcessManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
