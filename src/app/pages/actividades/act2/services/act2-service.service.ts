import { Injectable } from '@angular/core';
import { Process } from 'src/app/models/process.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Injectable()
export class Act2Service {

  constructor(
    private _processManagerService: ProcessManagerService
  ) { }

  startBatchs() {
    this._processManagerService.startBatchs();
  }

  addProcess(process: Process) {
    this._processManagerService.addProcess(process);
  }

  validateOperators(process : Process) : boolean {
    return this._processManagerService.isValidProcess(process);
  }

  validateIdProcess(id : number) : boolean {
    return this._processManagerService.idValidIdProcess(id);
  }

  reset() {
    this._processManagerService.reset();
  }
}
