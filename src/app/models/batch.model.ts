import { BehaviorSubject, Observable, Subject, pipe, take } from 'rxjs';
import { BatchState } from './batch.state.model';
import { Process } from './process.model';
import { ProcessState } from './process.state.model';

const MAX_PROCESS_IN_BATCH = 5;

export class Batch {
  id !: number;
  maxProcess !: number;
  state !: BatchState;
  listProcess !: Process[];
  indexProcessActual !: number;
  currentProcess !: Process | null;

  currentProcessSubject !: BehaviorSubject<Process | null>;
  currentProcess$ !: Observable<Process | null>;

  subject !: Subject<Batch>;
  observable !: Observable<Batch>;

  constructor(id : number) {
    this.id = id;
    this.maxProcess = MAX_PROCESS_IN_BATCH;
    this.state = BatchState.PENDING;
    this.listProcess = [];
    this.indexProcessActual = 0;
    this.currentProcess = null;

    this.currentProcessSubject = new BehaviorSubject<Process | null>(null);

    this.subject = new Subject<Batch>();
    this.observable = this.subject.asObservable();
  }

  startBatch(): void {
    this.state = BatchState.RUNNING;
    if(this.currentProcess && (this.currentProcess.state === ProcessState.PENDING || this.currentProcess.state == ProcessState.PAUSED)) {
      this.currentProcess.state = ProcessState.RUNNING;
      this.currentProcess.startProcess();
    }
    this.startNextProcess();
  }

  startNextProcess(): void {
    const pendingProcesses = this.filterProcessByState(ProcessState.PENDING);

    if (pendingProcesses.length > 0) {
      this.currentProcess = this.listProcess[this.indexProcessActual];
      this.currentProcess.state = ProcessState.RUNNING;
      this.currentProcess.startProcess();
      this.currentProcessSubject.next(this.currentProcess);

      this.currentProcess.subject.subscribe((process) => {
        this.indexProcessActual++;
        this.currentProcess = null;
        this.startNextProcess();
      })

    } else {
      // No hay más procesos pendientes
      this.state = BatchState.FINISHED;
      this.subject.next(this);
      this.subject.complete();
    }
  }

  interruptBatch(processState : ProcessState) : void {
    this.state = BatchState.PAUSED;
    this.currentProcess?.interruptProcess(processState);
  }

  filterProcessByState(state : ProcessState) : Process[] {
    return this.listProcess.filter((process) => {
      return process.state === state;
    });
  }

  canAddProcess() : boolean {
    return this.listProcess.length < this.maxProcess;
  }

  addProcess(process: Process) : void {
    if(this.canAddProcess()) {
      this.listProcess.push(process);
    }
  }
}
