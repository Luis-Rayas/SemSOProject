import { Injectable } from '@angular/core';
import { Process } from 'src/app/models/process.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Injectable({
  providedIn: 'root'
})
export class Act4Service {

  constructor(
    private _processManagerService: ProcessManagerService
  ) { }

  startBatchs() : void {
    this._processManagerService.startBatchs();
  }

  addProcess(process: Process) : void {
    this._processManagerService.addProcess(process);
  }

  reset() : void {
    this._processManagerService.reset();
  }
}
