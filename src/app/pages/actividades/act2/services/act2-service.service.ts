import { Injectable } from '@angular/core';
import { Process } from 'src/app/models/process.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Injectable()
export class Act2Service {

  constructor(
    _processManagerService: ProcessManagerService
  ) { }

  addProcess(process: Process) {
  }
}
