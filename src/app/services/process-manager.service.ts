import { Injectable, WritableSignal, signal } from '@angular/core';
import { Process } from '../models/process.model';
import { ProcessState } from '../models/process.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  private canWork !: boolean;

  private setIntervalRef !: any;
  private setCountIntervalRef !: any;

  counterGlobal !: number;
  counterGlobal$ !: WritableSignal<number>;

  listNewProcess !: Process[];
  listNewProcess$ !: WritableSignal<Process[]>;

  listReadyProcess !: Process[];
  listReadyProcess$ !: WritableSignal<Process[]>;

  listBlockedProcess !: Process[];
  listBlockedProcess$ !: WritableSignal<Process[]>;

  currentRunningProcess !: Process | undefined | null;
  currentRunningProcess$ !: WritableSignal<Process | undefined | null>;
  throwRunningProcessRef !: any;


  listFinishedProcess !: Process[];
  listFinishedProcess$ !: WritableSignal<Process[]>;

  idProcess !: number;

  constructor() {
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef = null;

    this.listNewProcess = [];
    this.listReadyProcess = [];
    this.listBlockedProcess = [];
    this.currentRunningProcess = null;

    this.listFinishedProcess = [];

    this.counterGlobal$ = signal(this.counterGlobal);
    this.listNewProcess$ = signal(this.listNewProcess);
    this.listReadyProcess$ = signal(this.listReadyProcess);
    this.listBlockedProcess$ = signal(this.listBlockedProcess);
    this.listFinishedProcess$ = signal(this.listFinishedProcess);

    this.currentRunningProcess$ = signal(this.currentRunningProcess);

    this.idProcess = 1;
  }

  startProgram(): void {
    this.setCountIntervalRef ? clearInterval(this.setCountIntervalRef) : null;
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;

    this.setIntervalRef = setInterval(() => {
      if (this.currentRunningProcess) {
        this.runProcess(this.currentRunningProcess);
      } else {
        this.startNextProcess();
      }
    }, 1000);
    this.setCountIntervalRef = setInterval(() => {
      this.counterGlobal$.update(() => this.counterGlobal++);
    }, 1000);
  }

  startNextProcess(): void {
    this.addProcessToMemory();

    if (this.listReadyProcess.length > 0) {
      this.currentRunningProcess = this.listReadyProcess.shift();
      this.currentRunningProcess$.set(this.currentRunningProcess);
      this.currentRunningProcess ? this.runProcess(this.currentRunningProcess) : null;
    } else { //Ya acabo
      if(this.listBlockedProcess.length == 0 && this.listNewProcess.length == 0){
        //Finaliza si y solo si la lsita de bloqueados y nuevos esta vacia
        clearInterval(this.setIntervalRef);
        clearInterval(this.setCountIntervalRef);
      }
    }
  }

  private addProcessToMemory(): void {
    const MAX_READY_PROCESSES = 5; // Define el número máximo de procesos en listReadyProcess

    if (this.listReadyProcess.length < MAX_READY_PROCESSES) {
      while ((this.listReadyProcess.length + this.listBlockedProcess.length) < MAX_READY_PROCESSES && this.listNewProcess.length > 0) {
        let process = this.listNewProcess.shift();
        if(process) {
          process.timeArrived == null ? process.timeArrived = this.counterGlobal : null;
          this.listReadyProcess.push(process);
        }
      }
      this.listNewProcess$.set(this.listNewProcess);
      this.listReadyProcess$.set(this.listReadyProcess);
      this.counterGlobal$.set(this.counterGlobal);
    }
  }

  /*
    A. Tiempo de Llegada: Hora en la que el proceso entra al sistema.
    b. Tiempo de Finalización: Hora en la que el proceso termino.
    c. Tiempo de Retorno: Tiempo total desde que el proceso llega hasta que termina.
    d. Tiempo de Respuesta: Tiempo transcurrido desde que llega hasta que es atendido por
    primera vez.
    e. Tiempo de Espera: Tiempo que el proceso ha estado esperando para usar el
    procesador. (Te = TRetorno - TServicio)
    f. Tiempo de Servicio: Tiempo que el proceso ha estado dentro del procesador. (Si el
    proceso termino su ejecución normal es el TME, de no ser así es el tiempo
    transcurrido)
   */

  private runProcess(process: Process): void {
    process.state = ProcessState.RUNNING;
    process.timeAnswered == null ? process.timeAnswered = this.counterGlobal : null;


    process.timeRemaining$.update(() => process.timeRemaining = process.time - process.timeExecution);
    process.timeExecution$.update(() => process.timeExecution++);

    if (process.timeRemaining$() === 0 && process.timeExecution$() === process.time /*|| process.timeExecution$() >= process.time*/) { //Finish process
      this.finishedProcess(ProcessState.FINISHED);
    }
    process.timeInService++;

  }

  interrupt(): void {
    if (this.canWork) {
      if (this.currentRunningProcess) {
        this.currentRunningProcess.state = ProcessState.BLOCKED;
        this.listBlockedProcess.unshift(this.currentRunningProcess);
        this.listBlockedProcess$.set(this.listBlockedProcess);
        setTimeout(() => {
          const process = this.listBlockedProcess.shift();
          if(process){
            process.state = ProcessState.READY;
            this.listReadyProcess.push(process);
          }
          this.listBlockedProcess$.set(this.listBlockedProcess);
          this.listReadyProcess$.set(this.listReadyProcess);
          if(this.currentRunningProcess == null && this.canWork) {
            this.startNextProcess();
          }
        }, 5000);
        this.currentRunningProcess = null;
        this.currentRunningProcess$.set(this.currentRunningProcess);
        this.startNextProcess();
      }
    }
  }

  error(): void {
    if (this.currentRunningProcess != null && this.currentRunningProcess != undefined) {
      this.finishedProcess(ProcessState.ERROR);
    }
  }

  pause(): void {
    if (this.canWork === true) {
      this.canWork = false;
    }
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.setCountIntervalRef ? clearInterval(this.setCountIntervalRef) : null;
  }

  continue(): void {
    if (this.canWork === false) {
      this.canWork = true;
      this.startProgram();
    }
  }

  //VALIDACIONES
  isValidIdProcess(id: number): boolean {
    let valid = this.listNewProcess.some((proceso: Process) => proceso.id === id);
    //Some retora true si existe, si no, devuelve false
    return !valid;
  }

  isValidProcess(process: Process): boolean {
    if ((process.operation === '/' || process.operation === '%') && process.operator2 === 0) {
      return false;
    }
    return true;
  }
  //FIN VALIDACIONES

  addProcess(process: Process): void {
    if (this.isValidProcess(process) && this.isValidIdProcess(process.id)) {
      this.listNewProcess.push(process);
      this.listNewProcess$.set(this.listNewProcess);
      this.idProcess++;
    } else {
      console.error('Error al agregar proceso', process);
    }
  }

  reset(): void {
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;

    this.currentRunningProcess = null;

    this.idProcess = 1;
    this.listNewProcess = [];
    this.listReadyProcess = [];
    this.listBlockedProcess = [];
    this.currentRunningProcess = null;
    this.listFinishedProcess = [];

    this.currentRunningProcess$.set(this.currentRunningProcess);
    this.counterGlobal$.set(this.counterGlobal);
    this.listNewProcess$.set(this.listNewProcess);
    this.listReadyProcess$.set(this.listReadyProcess);
    this.listBlockedProcess$.set(this.listBlockedProcess);
    this.listFinishedProcess$.set(this.listFinishedProcess);
  }

  private finishedProcess(state : ProcessState): void {
    let process = this.currentRunningProcess;
    if(process){
      process.state = state;
      process.timeFinished = this.counterGlobal;
      if(process.timeArrived != null)
      process.timeReturned = process.timeFinished - process.timeArrived;
      process.timeInWaiting = process.timeReturned - process.timeInService;

      state === ProcessState.FINISHED ? process.executeOperation() : process.result = 'ERROR';

      this.listFinishedProcess.unshift(process);
      this.listFinishedProcess$.set(this.listFinishedProcess);
      this.currentRunningProcess = null;
      this.currentRunningProcess$.set(this.currentRunningProcess);
      this.startNextProcess();
      process = null;
      return;
    }
    process = null;
  }
}
