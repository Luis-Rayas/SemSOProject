import { Injectable } from '@angular/core';
import { Process } from '../models/process.model';
import { Batch } from '../models/batch.model';
import { BehaviorSubject, Observable, from, of, take } from 'rxjs';
import { BatchState } from '../models/batch.state.model';
import { ProcessState } from '../models/process.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  canWork !: boolean;

  setIntervalRef !: any;
  counterGlobal !: number;
  batchsId !: number;


  listBatchsPendients !: Batch[];
  listProcessFinished !: Process[];
  currentBatch !: Batch | null;
  private indexBatch !: number;

  //TESTING
  private counterGlobalSubject !: BehaviorSubject<number>;

  private currentBatchSubject !: BehaviorSubject<Batch | null>;

  private currentProcessSubject !:  BehaviorSubject<Process | null>;

  private processPendientsOfCurrentBatchSubject !: BehaviorSubject<Process[]>;

  private numberOfBatchPendingsSubject !: BehaviorSubject<number>;

  private processFinishedSubject !: BehaviorSubject<Process[]>;

  constructor() {
    this.canWork = true;

    this.counterGlobal = 0;
    this.batchsId = 0;

    this.listBatchsPendients = [];
    this.currentBatch = null;
    this.indexBatch = 0;

    //Observables
    this.counterGlobalSubject = new BehaviorSubject<number>(0);

    this.currentBatchSubject = new BehaviorSubject<Batch | null>(null);

    this.currentProcessSubject = new BehaviorSubject<Process | null>(null);

    this.processPendientsOfCurrentBatchSubject = new BehaviorSubject<Process[]>([]);

    this.numberOfBatchPendingsSubject = new BehaviorSubject<number>(0);

    this.processFinishedSubject = new BehaviorSubject<Process[]>([]);
  }

  interrupt(stateProcess : ProcessState): void {
    if(!this.canWork) {
      return;
    }
    this.interruptProcess(stateProcess);
    this.notifyProcessPendientsOfCurrentBatch();
  }
  pause() : void {
    if(this.canWork) {
      this.canWork = false;
      this.interruptBatch(ProcessState.PAUSED);
    }
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
  }

  continue() : void {
    if(this.canWork == false) {
      this.canWork = true;
      this.startBatchs();
    }
  }

  startBatchs(): void {
    if(this.currentBatch && (this.currentBatch.state === BatchState.PENDING || this.currentBatch.state == BatchState.PAUSED)) {
      this.currentBatch.state = BatchState.RUNNING;
      this.currentBatch.startBatch();
      this.notifyNumberOfBatchPendings();
    } else {
      this.startNextBatch();
    }
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.setIntervalRef = setInterval(() => { //Run Program
      this.counterGlobal++;
      //Notification observables
      this.notifyAll();
      this.counterGlobalSubject.next(this.counterGlobal);
    }, 850);
  }

  private startNextBatch(): void {
    const pendingBatches = this.listBatchsPendients.filter((batch) => {
      return batch.state === BatchState.PENDING;
    });

    if(pendingBatches.length > 0) {
      this.currentBatch = this.listBatchsPendients[this.indexBatch];
      this.currentBatch.state = BatchState.RUNNING;
      this.currentBatch.startBatch();

      this.currentBatch.observable.subscribe((batch) => {
        this.indexBatch++;
        this.currentBatch = null;
        this.startNextBatch();
      });
    } else {
      this.currentBatch = null;
      clearInterval(this.setIntervalRef);
    }
    this.notifyAll();
  }

  private interruptProcess(state: ProcessState): void {
    this.currentBatch?.interruptProcess(state, true);
  }

  interruptBatch(state: ProcessState): void {
    if(this.currentBatch) {
      this.currentBatch.interruptBatch(state);
    }
  }

  getCountFilteringByBatchState(state: BatchState): number {
    return this.listBatchsPendients.filter((batch) => {
      return batch.state === state;
    }).length;
  }

  notifyCurrentProcess(): void {
  let currentProcess !: Process | null;
    if(this.currentBatch) {
      currentProcess = this.currentBatch.currentProcess;
      this.currentProcessSubject.next(currentProcess);
    } else {
      this.currentProcessSubject.next(null);
    }
  }

  notifyGlobalCounter(): void {
    this.counterGlobalSubject.next(this.counterGlobal);
  }
  notifyProcessPendientsOfCurrentBatch(): void {
    let processes : Process[] = [];
    if(this.currentBatch){
      processes = this.currentBatch.listProcess;
    }
    this.processPendientsOfCurrentBatchSubject.next(processes);
  }

  notifyNumberOfBatchPendings() : void {
    const count = this.listBatchsPendients.filter(batch => batch.state === BatchState.PENDING).length;
    this.numberOfBatchPendingsSubject.next(count);
  }

  notifyProcessFinished(): void {
    const finishedProcesses: Process[] = [];
    this.listBatchsPendients.forEach(batch => {
      batch.listProcessFinished.forEach(process => {
        finishedProcesses.unshift(process);
      });
    });
    this.processFinishedSubject.next(finishedProcesses);
  }

  get counterGlobal$(): Observable<number> {
    return this.counterGlobalSubject.asObservable();
  }

  get currentBatch$(): Observable<Batch | null> {
    return this.currentBatchSubject.asObservable();
  }

  get currentProcess$(): Observable<Process | null> {
    return this.currentProcessSubject.asObservable();
  }

  get processPendientsOfCurrentBatch$(): Observable<Process[]> {
    return this.processPendientsOfCurrentBatchSubject.asObservable();
  }

  get numberOfBatchPendings$(): Observable<number> {
    return this.numberOfBatchPendingsSubject.asObservable();
  }

  get processFinished$(): Observable<Process[]> {
    return this.processFinishedSubject.asObservable();
  }

  //VALIDACIONES
  idValidIdProcess(id: number): boolean {
    let isValid = true;

    this.listBatchsPendients.forEach((batch) => {
      batch.listProcess.forEach((process) => {
        if (process.id === id) {
          isValid = false;
        }
      });
    });
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
    // Si el ultimo batch esta libre, lo añadimos ahi, si no, se añade uno nuevo o no hay batch  creados.
    let batch = null;
    if (this.listBatchsPendients.length == 0 || !this.listBatchsPendients[this.listBatchsPendients.length - 1].canAddProcess()) {
      batch = new Batch(++this.batchsId);
      this.listBatchsPendients.push(batch);
    } else {
      batch = this.listBatchsPendients[this.listBatchsPendients.length - 1];
    }
    batch.addProcess(process);
    this.notifyNumberOfBatchPendings();
  }

  reset() : void{
    this.counterGlobal = 0;
    this.batchsId = 0;

    this.listBatchsPendients = [];
    this.currentBatch = null;
    this.indexBatch = 0;

    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.notifyAll();
  }

  private notifyAll(): void {
    this.notifyProcessFinished();
    this.notifyCurrentProcess();
    this.notifyProcessPendientsOfCurrentBatch();
    this.notifyNumberOfBatchPendings();
    this.notifyNumberOfBatchPendings();
    this.notifyGlobalCounter();
  }
}
