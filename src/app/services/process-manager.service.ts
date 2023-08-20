import { Injectable } from '@angular/core';
import { Process } from '../models/process.model';
import { Batch } from '../models/batch.model';
import { BehaviorSubject, Observable, defer, from } from 'rxjs';
import { BatchState } from '../models/batch.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  counterGlobal !: number;

  batchsId !: number;
  listBatchsPendients !: Batch[];

  currentBatch !: Batch | null;
  currentProcess !: Process | null;

  private currentBatchSubject$ !: BehaviorSubject<Batch | null>;

  batchCountByStateSubject$ !: BehaviorSubject<{ [key: string]: number }>;


  constructor() {
    this.counterGlobal = 0;
    this.batchsId = 0;
    this.currentBatchSubject$ = new BehaviorSubject<Batch | null>(null);
    // Inicializa el objeto que almacenará el conteo por estado
    const initialState = {
      [BatchState.PENDING]: 0,
      [BatchState.RUNNING]: 0,
      [BatchState.FINISHED]: 0
    };
  }

  addProcess(process: Process) {
    // Si el ultimo batch esta libre, lo añadimos ahi, si no, se añade uno nuevo o no hay batch  creados.
    let batch;
    if (this.listBatchsPendients.length == 0 || this.listBatchsPendients[this.listBatchsPendients.length - 1].canAddProcess() == false) {
      batch = new Batch(++this.batchsId);
      this.listBatchsPendients.push(batch);
    } else {
      batch = this.listBatchsPendients[this.listBatchsPendients.length - 1];
    }

    batch.addProcess(process);
    this.updateBatchCountByState();
  }

  startBatchsSequentially(): Observable<void> {
    return defer(() => {
      return this.startNextBatch();
    });
  }

  private startNextBatch(): Observable<void> {
    if (this.listBatchsPendients.length === 0) {
      // No hay lotes pendientes
      return from(Promise.resolve()); // Completa inmediatamente
    }

    const nextBatch = this.listBatchsPendients.shift();
    if (!nextBatch) {
      // Lote nulo, no debería ocurrir
      return from(Promise.resolve());
    }

    this.updateBatchCountByState();

    return new Observable<void>((observer) => {
      this.currentBatchSubject$.next(nextBatch); // Establece el lote actual
      nextBatch.batchCompleted$.subscribe(() => {
        // Cuando el lote termine, inicia el siguiente
        this.startNextBatch().subscribe(() => {
          observer.complete(); // Completa cuando el siguiente lote haya terminado
        });
      });
      nextBatch.startBatch();
    });
  }

  get batchCountByState$(): Observable<{ [key: string]: number }> {
    return this.batchCountByStateSubject$.asObservable();
  }

  updateBatchCountByState(): void {
    const batchCountByState: { [key: string]: number } = {};

    // Calcula la cantidad de lotes por estado
    batchCountByState[BatchState.PENDING] = this.listBatchsPendients.filter((batch) => batch.state === BatchState.PENDING).length;
    batchCountByState[BatchState.RUNNING] = this.listBatchsPendients.filter((batch) => batch.state === BatchState.RUNNING).length;
    batchCountByState[BatchState.FINISHED] = this.listBatchsPendients.filter((batch) => batch.state === BatchState.FINISHED).length;

    // Actualiza el BehaviorSubject con el nuevo objeto de conteo por estado
    this.batchCountByStateSubject$.next(batchCountByState);
  }

  resetCouterBatchId() {
    this.batchsId = 0;
  }
}
