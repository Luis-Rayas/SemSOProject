import { BatchState } from './batch.state.model';
import { Process } from './process.model';
import { ProcessState } from './process.state.model';

const MAX_PROCESS_IN_BATCH = 5;

export class Batch {
  id !: number;
  maxProcess !: number;
  state !: BatchState;
  listProcess !: Process[];

  constructor(id : number) {
    this.id = id;
    this.maxProcess = MAX_PROCESS_IN_BATCH;
    this.state = BatchState.PENDING;
    this.listProcess = [];
  }

  startBatch() : void {
    this.state = BatchState.RUNNING;
  }

  filterProcessByState(state : ProcessState) : Process[] {
    return this.listProcess.filter((process) => {
      return process.state === state;
    });
  }

  addProcess(process: Process) : void {
    this.listProcess.push(process);
  }
}
