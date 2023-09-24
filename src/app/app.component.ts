import { Component, HostListener } from '@angular/core';
import { ProcessManagerService } from './services/process-manager.service';
import { ProcessState } from './models/process.state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'i':
        console.log("Interrupcion");
        // this._procesManagerService.interrupt(ProcessState.PENDING);
        break;
      case 'e':
        console.log("Error");
        setTimeout(() => {
          // this._procesManagerService.interrupt(ProcessState.ERROR);
        }, 600);
        break;
      case 'p':
        console.log("Pausa");
        // this._procesManagerService.pause();
        break;
      case 'c':
        console.log("Continuar");
        // this._procesManagerService.continue();
        break;
    }
  }

  constructor(
    private _procesManagerService: ProcessManagerService
  ) {}
}
