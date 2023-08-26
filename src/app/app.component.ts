import { Component, HostListener } from '@angular/core';
import { ProcessManagerService } from './services/process-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //console.log(event.key);
    if (event.key === 'a') {
      console.log(this._procesManagerService);
    }
  }

  constructor(
    private _procesManagerService: ProcessManagerService
  ) {}
}
