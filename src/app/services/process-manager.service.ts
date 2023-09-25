import { EffectRef, Injectable, WritableSignal, effect, signal } from '@angular/core';
import { Process } from '../models/process.model';
import { BehaviorSubject, Observable, Subscription, from, of, take } from 'rxjs';
import { ProcessState } from '../models/process.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessManagerService{

  private canWork !: boolean;

  private setIntervalRef !: any;

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
  effectRunningProcess !: EffectRef;


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
    this.effectRunningProcess = effect(() => {
      const process = this.currentRunningProcess;
      console.log(process);
      if(process) {
        this.runProcess(process);
      }
    });

    this.idProcess = 1;
  }

  startProgram(): void {
    this.setIntervalRef = setInterval(() => {
      this.counterGlobal$.update(() => this.counterGlobal++);

    }, 1000);
  }

  private addReadyProcess() : void {
    const MAX_READY_PROCESSES = 5; // Define el número máximo de procesos en listReadyProcess

    while (this.listReadyProcess.length < MAX_READY_PROCESSES && this.listNewProcess.length > 0) {
      const process = this.listNewProcess.shift();
      process ? this.listReadyProcess.push(process) : null;
    }
    this.listNewProcess$.set(this.listNewProcess);
    this.listReadyProcess$.set(this.listReadyProcess);
  }

  /**
    A. Tiempo de Llegada: Hora en la que el proceso entra al sistema.
    b. Tiempo de Finalización: Hora en la que el proceso termino.
    c. Tiempo de Retorno: Tiempo total desde que el proceso llega hasta que termina.
    d. Tiempo de Respuesta: Tiempo transcurrido desde que llega hasta que es atendido por
    primera vez.
    e. Tiempo de Espera: Tiempo que el proceso ha estado esperando para usar el
    procesador.
    f. Tiempo de Servicio: Tiempo que el proceso ha estado dentro del procesador. (Si el
    proceso termino su ejecución normal es el TME, de no ser así es el tiempo
    transcurrido)
   */

  private runProcess(process: Process): void {
    process.state = ProcessState.RUNNING;
    this.throwRunningProcessRef ? clearTimeout(this.throwRunningProcessRef) : null;
    this.throwRunningProcessRef = setTimeout(() => {

      process.timeAnswered == null ? process.timeAnswered = this.counterGlobal : null;

      process.timeExecution++;
      process.timeRemaining$.set(process.timeRemaining);
      process.timeRemaining = process.time - process.timeExecution;
      process.timeExecution$.set(process.timeExecution);

      if(process.timeRemaining === 0 && process.timeExecution === process.time || process.timeExecution >= process.time) { //Finish process
        process.state = ProcessState.FINISHED;
        process.timeFinished = this.counterGlobal;

        this.listFinishedProcess.unshift(process);
        clearTimeout(this.throwRunningProcessRef);
        process.signal.set(process);
      }
    }, 1000);
  }

  //Evaluar estado del proceso
  changeContextProcess(process: Process): void {

  }

  //VALIDACIONES
  isValidIdProcess(id: number): boolean {
    let valid = this.listNewProcess.some((proceso : Process) => proceso.id === id);
    //Some retora true si existe, si no, devuelve false
    return !valid;
  }

  isValidProcess(process: Process): boolean {
    if((process.operation === '/' || process.operation === '%') && process.operator2 === 0) {
      return false;
    }
    return true;
  }
  //FIN VALIDACIONES

  addProcess(process: Process): void {
    if(this.isValidProcess(process) && this.isValidIdProcess(process.id)){
      this.listNewProcess.push(process);
      this.listNewProcess$.set(this.listNewProcess);
      this.idProcess++;
    } else {
      console.error('Error al agregar proceso', process);
    }
  }

  reset() : void{
    this.canWork = true;
    this.counterGlobal = 0;
    this.setIntervalRef ? clearInterval(this.setIntervalRef) : null;

    this.idProcess = 1;
    this.listNewProcess = [];
    this.listReadyProcess = [];
    this.listBlockedProcess = [];
    this.currentRunningProcess = null;
    this.listFinishedProcess = [];

    this.counterGlobal$.set(this.counterGlobal);
    this.listNewProcess$.set(this.listNewProcess);
    this.listReadyProcess$.set(this.listReadyProcess);
    this.listBlockedProcess$.set(this.listBlockedProcess);
    this.listFinishedProcess$.set(this.listFinishedProcess);
  }
}
