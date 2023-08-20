import { Injectable } from '@angular/core';
import { Process } from '../models/process.model';
import { Batch } from '../models/batch.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  counterGlobal !: number;
  listBatchsPendients !: Batch[];

  currentBatch !: Batch;
  currentProcess !: Process | null;


  constructor() {
    this.counterGlobal = 0;
  }

  addProcess(process: Process) {
    //añade un proceso al ultimo batch disponible
  }

  private validateMaxProcessInBatch() : boolean {
    //valida si el ultimo batch puede alojar otro proceso, o en dado caso esta lleno
    let currentBatch = this.listBatchsPendients[this.listBatchsPendients.length - 1];
    if(currentBatch.listProcess.length < currentBatch.maxProcess) {
      return true;
    }
    return false;
  }
}
