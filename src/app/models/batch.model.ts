import { Subject, pipe, take } from 'rxjs';
import { BatchState } from './batch.state.model';
import { Process } from './process.model';
import { ProcessState } from './process.state.model';

const MAX_PROCESS_IN_BATCH = 5;

export class Batch {
  id !: number;
  maxProcess !: number;
  state !: BatchState;
  listProcess !: Process[];

  processCompleted$ !: Subject<Process>;
  batchCompleted$ !: Subject<Batch>;

  constructor(id : number) {
    this.id = id;
    this.maxProcess = MAX_PROCESS_IN_BATCH;
    this.state = BatchState.PENDING;
    this.listProcess = [];
    this.processCompleted$ = new Subject<Process>();
    this.batchCompleted$ = new Subject<Batch>();
  }

  startBatch(): void {
    this.state = BatchState.RUNNING;
    this.startNextProcess();
  }

  startNextProcess(): void {
    const pendingProcesses = this.filterProcessByState(ProcessState.PENDING);

    if (pendingProcesses.length > 0) {
      const nextProcess = pendingProcesses[0];
      nextProcess.startProcess();

      // Cuando el proceso se complete, emite el evento processCompleted$
      nextProcess.processCompleted$
      .pipe(take(1))
      .subscribe(() => {
        this.startNextProcess();
      });
    } else {
      // No hay más procesos pendientes
      this.state = BatchState.FINISHED;
      this.batchCompleted$.next(this);
    }
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
