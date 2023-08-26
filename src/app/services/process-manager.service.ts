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

  setIntervalRef !: any;
  counterGlobal !: number;
  batchsId !: number;


  listBatchsPendients !: Batch[];
  currentBatch !: Batch | null;
  private indexBatch !: number;

  constructor() {
    this.counterGlobal = 0;
    this.batchsId = 0;

    this.listBatchsPendients = [];
    this.currentBatch = null;
    this.indexBatch = 0;
  }

  startBatchs(): void {
    if(this.currentBatch && (this.currentBatch.state === BatchState.PENDING || this.currentBatch.state == BatchState.PAUSED)) {
      this.currentBatch.state = BatchState.RUNNING;
      this.currentBatch.startBatch();
    }
    this.startNextBatch();
    this.setIntervalRef = setInterval(() => {
      this.counterGlobal++;
    }, 1000);
  }

  private startNextBatch(): void {
    const pendingBatches = this.listBatchsPendients.filter((batch) => {
      return batch.state === BatchState.PENDING;
    });

    if(pendingBatches.length > 0) {
      this.currentBatch = this.listBatchsPendients[this.indexBatch];
      this.currentBatch.state = BatchState.RUNNING;
      this.currentBatch.startBatch();

      this.currentBatch?.subject$.subscribe((batch) => {
        console.log(batch);
        this.indexBatch++;
        this.currentBatch = null;
        this.startNextBatch();
      });
    } else {
      this.currentBatch = null;
      clearInterval(this.setIntervalRef);
    }
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

  get currentBatch$(): Observable<Batch | null> {
    return this.currentBatch ? of(this.currentBatch) : of(null);
  }

  get currentProcess$(): Observable<Process | null> {
    return this.currentBatch ? of(this.currentBatch.currentProcess) : of(null);
  }

  get processPendientsOfCurrentBatch$(): Observable<Process[]> {
    if(this.currentBatch) {
      return of(this.currentBatch.listProcess.filter((process) => {
        return process.state === ProcessState.PENDING;
      }));
    }
    return of([]);
  }

  get numberOfBatchPendigs(): Observable<number> {
    const pendingBatches = this.listBatchsPendients.filter((batch) => {
      return batch.state === BatchState.PENDING;
    }).length;

    return of(pendingBatches);
  }

  get processFinished$(): Observable<Process[]> {
    const finishedProcesses : Process[] = [];
    this.listBatchsPendients.forEach((batch) => {
      batch.listProcess.forEach((process) => {
        if(process.state === ProcessState.FINISHED) {
          finishedProcesses.push(process);
        }
      });
    });

    return of(finishedProcesses);
  }
  idValidIdProcess(id: number): boolean {
    let isValid = true;

    this.listBatchsPendients.forEach((batch) => {
      batch.listProcess.forEach((process) => {
        console.log(process);
        if (process.id === id) {
          isValid = false;
        }
      });
    });
    return true;
  }

  isValidProcess(process: Process): boolean {
    if((process.operation === '/' || process.operation === '%') && process.operator2 === 0) {
      return false;
    }
    return true;
  }

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
  }

  reset() : void{
    this.batchsId = 0;
    this.counterGlobal = 0;
  }
}
