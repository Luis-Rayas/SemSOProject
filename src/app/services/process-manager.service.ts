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

  counterGlobal !: number;
  batchsId !: number;


  private listBatchsPendients !: Batch[];
  private listBatchsDone !: Batch[];

  listBatchsPendients$ !: BehaviorSubject<Batch[]>;
  listBatchsDone$ !: BehaviorSubject<Batch[]>;

  constructor() {
    this.counterGlobal = 0;
    this.batchsId = 0;

    this.listBatchsPendients = [];
    this.listBatchsDone = [];

    this.listBatchsPendients$ = new BehaviorSubject<Batch[]>([]);
    this.listBatchsDone$ = new BehaviorSubject<Batch[]>([]);
  }

  idValidIdProcess(id: number): boolean {
    let isValid = true;

    this.listBatchsPendients.forEach((batch) => {
      batch.listProcess.forEach((process) => {
        if (process.id === id) {
          isValid = false;
        }
      });
    });
    return true;
  }

  isValidProcess(process: Process): boolean {
    if(process.operation === '/' && process.operator2 === 0) {
      return false;
    }
    return true;
  }

  get currentBatchRunning$(): Observable<Batch | null> {
    let batch = this.listBatchsPendients.filter((batch) => {
      return batch.state === BatchState.RUNNING;
    });
    if (batch.length > 0) {
      return from(batch);
    }
    else {
      return of(null);
    }
  }

  get currentProcessRunning$(): Observable<Process | null> {
    let process;
    this.currentBatchRunning$.pipe(take(1)).subscribe((batch) => {
      if (batch) {
        let processList = batch.listProcess.filter((process) => {
          return process.state === ProcessState.RUNNING;
        });
        if (processList.length > 0) {
          process = processList[0];
        } else {
          process = null;
        }
      } else {
        process = null;
      }
    });
    return process ? from(process) : of(null);
  }

  async startBatch(): Promise<void> {
    for (const batch of this.listBatchsPendients) {
      if (batch.state === BatchState.PENDING && !this.isBatchRunning(batch)) {
        batch.startBatch();
        await this.waitForBatchCompletion(batch);
      }
    }
  }

  private isBatchRunning(batch: Batch): boolean {
    // Verifica si el lote está en estado de ejecución
    return batch.state === BatchState.RUNNING;
  }

  private async waitForBatchCompletion(batch: Batch): Promise<void> {
    return new Promise<void>((resolve) => {
      batch.subject$.subscribe((completedBatch: Batch) => {
        if (completedBatch === batch) {
          resolve();
        }
      });
    });
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
    this.listBatchsPendients$.next(this.listBatchsPendients);
  }

  resetCouterBatchId() {
    this.batchsId = 0;
  }
}
