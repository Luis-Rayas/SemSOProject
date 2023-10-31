import { Component, HostListener } from '@angular/core';
import { ProcessManagerService } from './services/process-manager.service';
import { Process } from './models/process.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'a':
        console.log(this._processManagerService);
        break;
      case 'i':
        console.log("Interrupcion");
        this._processManagerService.interrupt();
        break;
      case 'e':
        console.log("Error");
        setTimeout(() => {
          this._processManagerService.error();
        }, 600);
        break;
      case 'p':
      case 't':
        console.log("Pausa");
        this._processManagerService.pause();
        break;
      case 'c':
        console.log("Continuar");
        this._processManagerService.continue();
        break;
      case 'n':
        console.log("Nuevo");
        this.addProcess();
        break;
      case 'b':
        console.log("Tabla BCP");
        this._processManagerService.openTableBCP();
        break;
    }
  }

  constructor(
    private _processManagerService: ProcessManagerService
  ) {}

  private addProcess(): void {
    const array : Array<string> = ['+', '-', '*', '/', '%', '%%'];
    let process = new Process(
      this._processManagerService.idProcess,
      array[this.random(0, array.length - 1)],
      this.random(-100, 100), // operador 2
      this.random(-100, 100), //operador 1
      this.random(6, 16), //Time
      this.random(6, 26)
      );
    this._processManagerService.addProcess(process);
  }

  private random(min : number, max : number){
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
}
