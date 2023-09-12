import { BehaviorSubject, Observable, Subject, Subscription, pipe, take } from 'rxjs';
import { BatchState } from './batch.state.model';
import { Process } from './process.model';
import { ProcessState } from './process.state.model';
import { signal } from '@angular/core';

const MAX_PROCESS_IN_BATCH = 5;

export class Batch {
  id !: number;
  state !: BatchState;
  listProcess !: Process[];
  listProcessFinished !: Process[];

  suscriptionRef !: Subscription;

  currentProcess !: Process | null;
  intervalRef !: any;

  currentProcessSubject !: BehaviorSubject<Process | null>;
  currentProcess$ !: Observable<Process | null>;

  subject !: Subject<Batch>;
  observable !: Observable<Batch>;

  constructor(id : number) {
    this.id = id;
    this.state = BatchState.PENDING;
    this.listProcess = [];
    this.listProcessFinished = [];

    this.currentProcess = null;
    this.intervalRef = null;

    this.currentProcessSubject = new BehaviorSubject<Process | null>(null);

    this.subject = new Subject<Batch>();
    this.observable = this.subject.asObservable();
  }

  startBatch(): void {
    this.state = BatchState.RUNNING;
    if(this.currentProcess && (this.currentProcess.state === ProcessState.PENDING || this.currentProcess.state == ProcessState.PAUSED)) {
      this.currentProcess.state = ProcessState.RUNNING;
      this.runProcess();
    } else {
      this.startNextProcess();
    }
  }

  startNextProcess(): void {
    if (this.listProcess.length > 0) {
    // Cancelar la suscripción anterior si existe
    if (this.suscriptionRef) {
      this.suscriptionRef.unsubscribe();
    }
      // if(this.indexProcessActual == this.listProcess.length) {
      //   this.indexProcessActual = 0;
      // }

      this.currentProcess = this.listProcess[0];
      this.listProcess.shift();
      this.currentProcess.state = ProcessState.RUNNING;
      this.intervalRef ? clearInterval(this.intervalRef) : null;
      this.runProcess();
      this.currentProcessSubject.next(this.currentProcess); //Notificar el proceso actual

      this.suscriptionRef = this.currentProcess.observable.subscribe((process : Process) => {
        this.intervalRef ? clearInterval(this.intervalRef) : null;
        if(process.state === ProcessState.FINISHED || process.state === ProcessState.ERROR) {
          this.listProcessFinished.push(process);
        }
        this.currentProcess = null;
        this.startBatch();
      });
    } else {
      // No hay más procesos pendientes
      this.state = BatchState.FINISHED;
      this.subject.next(this);
      this.subject.complete();

      this.intervalRef ? clearInterval(this.intervalRef) : null;
      if (this.suscriptionRef) {
        this.suscriptionRef.unsubscribe();
      }
    }
  }

  interruptProcess(processState : ProcessState, startNextProcess : boolean) : void {
    this.intervalRef ? clearInterval(this.intervalRef) : null;
    if(this.currentProcess){
      switch(processState){
        case ProcessState.PAUSED:
          this.currentProcess.state = processState;
          startNextProcess ? this.startBatch() : null;
          break;
        case ProcessState.PENDING:
          this.currentProcess.state = processState;
          this.listProcess.push(this.currentProcess);
          this.currentProcess = null;
          startNextProcess ? this.startBatch() : null;
          break;
        case ProcessState.ERROR:
          this.currentProcess.finishedProcess(processState);
          break;
      }
    }
  }

  interruptBatch(processState : ProcessState) : void {
    this.state = BatchState.PAUSED;
    if(this.currentProcess){
      this.interruptProcess(processState, false);
    }
    this.intervalRef ? clearInterval(this.intervalRef) : null;
  }

  filterProcessByState(state : ProcessState) : Process[] {
    let process = this.listProcess.filter((process) => {
      return process.state === state;
    });
    return process;
  }

  canAddProcess() : boolean {
    return this.listProcess.length < MAX_PROCESS_IN_BATCH;
  }

  addProcess(process: Process) : void {
    if(this.canAddProcess()) {
      process.batchId = this.id;
      this.listProcess.push(process);
    }
  }

  private runProcess() : void {
    this.intervalRef = setInterval(() => {
      if(this.currentProcess) {
        this.currentProcess.run();
        console.log('Proceso actual: ', this.currentProcess);
      }
    }, 850);
  }
}
