import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContainerComponent } from './components/main-layout/container.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProcessManagerService } from './services/process-manager.service';

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
    NgbModule,
    ProgressbarModule.forRoot(),
  ],
  providers: [
    ProcessManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
