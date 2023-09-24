import { Injectable, WritableSignal, signal } from '@angular/core';
import { Process } from '../models/process.model';
import { BehaviorSubject, Observable, from, of, take } from 'rxjs';
import { ProcessState } from '../models/process.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  canWork !: boolean;

  setIntervalRef !: any;
  counterGlobal !: number;
  counterGlobal$ !: WritableSignal<number>;

  listNewProcess !: Process[];
  listReadyProcess !: Process[];
  currentRunningProcess !: Process | undefined | null;
  listFinishedProcess !: Process[];

  constructor() {
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef = null;

    this.listNewProcess = [];
    this.listReadyProcess = [];
    this.currentRunningProcess = null;
    this.listFinishedProcess = [];

    this.counterGlobal$ = signal(this.counterGlobal);
  }

  startProgram(): void {
    this.setIntervalRef = setInterval(() => {
      this.counterGlobal++;
      this.counterGlobal$.set(this.counterGlobal);
      console.log(this.counterGlobal);
    }, 1000);
  }
  //VALIDACIONES
  idValidIdProcess(id: number): boolean {
    let isValid = true;

    return isValid;
  }

  isValidProcess(process: Process): boolean {
    if((process.operation === '/' || process.operation === '%') && process.operator2 === 0) {
      return false;
    }
    return true;
  }
  //FIN VALIDACIONES
  addProcess(process: Process): void {

  }

  reset() : void{
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
  }
}
