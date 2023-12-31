import { Injectable, WritableSignal, signal } from '@angular/core';
import { Process } from '../models/process.model';
import { ProcessState } from '../models/process.state.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BcpTableComponent } from '../components/main-layout/bcp-table/bcp-table.component';
import { MemoryManagerService } from './memory-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService {

  private canWork !: boolean;

  private setIntervalRef !: any;
  private setCounterIntervalRef !: any;

  private quantum !: number;
  quantum$ !: WritableSignal<number>;

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

  constructor(
    private modalService: NgbModal,
    private memoryManagerService: MemoryManagerService
  ) {
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef = null;
    this.setCounterIntervalRef = null;

    this.quantum = 0;

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

    this.quantum$ = signal(this.quantum);

    this.idProcess = 1;
  }

  startProgram(): void {
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.setCounterIntervalRef ? clearInterval(this.setCounterIntervalRef) : null;

    this.setIntervalRef = setInterval(() => {
      this.addProcessToMemory();
      if (this.currentRunningProcess) {
        this.runProcess(this.currentRunningProcess);
      } else {
        this.startNextProcess();
      }
      this.reduceBlockTime();
      // this.counterGlobal$.update(() => this.counterGlobal++);
      }, 1000);
      this.setCounterIntervalRef = setInterval(() => {
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
      if (this.listBlockedProcess.length == 0 && this.listNewProcess.length == 0) {
        //Finaliza si y solo si la lsita de bloqueados y nuevos esta vacia
        clearInterval(this.setIntervalRef);
        clearInterval(this.setCounterIntervalRef);
      }
    }
  }

  private addProcessToMemory(): void {

    /**
     * Si el proceso actual cabe en memoria, añadirlo a memoria y pasarlo a listReadyProcess
     * si no cabe, que se quede en nuevos
     */
    if(this.listNewProcess.length == 0) return;

    for(let i = 0; i < this.listNewProcess.length; i++) {
      let process = this.listNewProcess.shift();
      if (process === undefined) break;

      if(this.memoryManagerService.checkMemory(process)) {
        this.memoryManagerService.addProcessToMemory(process);
        process.timeArrived == null ? process.timeArrived = this.counterGlobal : null;
        this.listReadyProcess.push(process);
      } else {
        this.listNewProcess.unshift(process);
        break;
      }
    }
    this.listNewProcess$.set(this.listNewProcess);
    this.listReadyProcess$.set(this.listReadyProcess);
  }


  private runProcess(process: Process): void {
    process.state = ProcessState.RUNNING;
    //Reloj - tiempo de llegada
    if (process.timeArrived != null)
      process.timeAnswered == null ? process.timeAnswered = this.counterGlobal$() - process.timeArrived : null;


    process.timeRemaining$.update(() => process.timeRemaining = process.time - process.timeExecution);
    process.timeExecution$.update(() => process.timeExecution++);

    if (process.timeRemaining$() === 0 && process.timeExecution$() === process.time /*|| process.timeExecution$() >= process.time*/) { //Finish process
      this.finishedProcess(ProcessState.FINISHED);
      return;
    }
    if(this.currentRunningProcess == process && process.state == ProcessState.RUNNING) {
      if((process.timeInProcesator % this.quantum) == 0 && process.timeInProcesator != 0){
        process.state = ProcessState.READY;
        this.listReadyProcess.push(process);
        this.listReadyProcess$.set(this.listReadyProcess);
        process.timeInProcesator$.update(() => process.timeInProcesator = 0);
        this.currentRunningProcess$.update(() => this.currentRunningProcess = null);
        this.startNextProcess();
      } else {
        process.timeInProcesator$.update(() => process.timeInProcesator++);
      }
      process.timeInService++;
    }
  }

  interrupt(): void {
    if (this.canWork == false) {
      return;
    }
    if (this.currentRunningProcess) {
      const process = this.currentRunningProcess;

      process.timeBlocked$.update(() => process.timeBlocked = 5);

      process.state = ProcessState.BLOCKED;
      process.timeInProcesator$.update(() => process.timeInProcesator = 0);
      this.listBlockedProcess.unshift(process);
      this.listBlockedProcess$.set(this.listBlockedProcess);

      this.currentRunningProcess = null;
      this.currentRunningProcess$.set(this.currentRunningProcess);
      this.startNextProcess();
    }
  }

  error(): void {
    if(this.canWork == false){
      return;
    }
    if (this.currentRunningProcess != null && this.currentRunningProcess != undefined) {
      this.finishedProcess(ProcessState.ERROR);
    }
  }

  pause(): void {
    if (this.canWork === true) {
      this.canWork = false;
    }
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.setCounterIntervalRef ? clearInterval(this.setCounterIntervalRef) : null;
  }

  continue(): void {
    if (this.canWork === false) {
      this.canWork = true;
      this.startProgram();
    }
  }

  reduceBlockTime(): void {
    if (this.listBlockedProcess.length > 0) {
      this.listBlockedProcess.forEach((process: Process) => {
        process.timeBlocked$.update(() => process.timeBlocked--);
        if (process.timeBlocked$() == 0 || process.timeBlocked$() < 0) {
          const process = this.listBlockedProcess.pop();
          if (process) {
            process.state = ProcessState.READY;
            this.listReadyProcess.push(process);
          }
          this.listBlockedProcess$.set(this.listBlockedProcess);
          this.listReadyProcess$.set(this.listReadyProcess);
          if (this.currentRunningProcess == null && this.canWork) {
            this.startNextProcess();
          }
        }
      });
    }
  }


  setQuantum(quantum: number): void {
    this.quantum = quantum;
    this.quantum$.set(this.quantum);
  }

  openTableBCP(): void {
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;
    this.setCounterIntervalRef ? clearInterval(this.setCounterIntervalRef) : null;
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      size : 'xl'
  };
    let ngModalRef = this.modalService.open(BcpTableComponent, ngbModalOptions);
    ngModalRef.result.then((result) => {
      if(this.canWork)
      this.startProgram();
    })
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
    this.setCounterIntervalRef ? clearInterval(this.setCounterIntervalRef) : null;

    this.currentRunningProcess = null;
    this.memoryManagerService.resetMemory()

    this.quantum = 0;
    this.quantum$.set(this.quantum);

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

    /*
    A. Tiempo de Llegada: Hora en la que el proceso entra al sistema.
    b. Tiempo de Finalización: Hora en la que el proceso termino.
    c. Tiempo de Retorno: Tiempo total desde que el proceso llega hasta que termina.
    (TRetorno = TFinalizado - TLlegada)
    d. Tiempo de Respuesta: Tiempo transcurrido desde que llega hasta que es atendido por
    primera vez. (TResp = Contador global cuando entra por primera vez a procesamiento)
    e. Tiempo de Espera: Tiempo que el proceso ha estado esperando para usar el
    procesador. (Te = TRetorno - TServicio)
    f. Tiempo de Servicio: Tiempo que el proceso ha estado dentro del procesador. (Si el
    proceso termino su ejecución normal es el TME, de no ser así es el tiempo
    transcurrido)
   */
  private finishedProcess(state: ProcessState): void {
    let process = this.currentRunningProcess;
    if (process) {
      process.state = state;
      process.timeFinished = this.counterGlobal;
      if (process.timeArrived != null)
        process.timeReturned = process.timeFinished - process.timeArrived;
      //Tiempo de Retorno = Tiempo de espera + Tiempo de servicio
      /*
      NOTA: Siguiente practica
      Tiempo de espera = (Contador global - Tiempo de llegada) - Tiempo transcurrido
      */
      process.timeInWaiting = process.timeReturned - process.timeInService;

      state === ProcessState.FINISHED ? process.executeOperation() : process.result = 'ERROR';

      this.memoryManagerService.leaveProcessFromMemory(process);
      this.listFinishedProcess.unshift(process);
      this.listFinishedProcess$.set(this.listFinishedProcess);
      this.currentRunningProcess = null;
      this.currentRunningProcess$.set(this.currentRunningProcess);
      this.startNextProcess();
      process = null;
    }
    process = null;
  }
}
