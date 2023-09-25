import { BehaviorSubject, Observable, Subject, delay, from } from "rxjs";
import { ProcessState } from "./process.state.model";
import { WritableSignal, signal } from "@angular/core";
import { ProcessManagerService } from "../services/process-manager.service";

export class Process {
  id !: number;
  state !: ProcessState;
  operation !: string;
  operator1 !: number;
  operator2 !: number;
  result !: number | string;

  timeAwaitingintervalRef !: any;

  //Tiempos
  time !: number;

  timeArrived !: number | null;
  timeFinished !: number | null;
  timeReturned !: number | null;
  timeAnswered !: number | null;
  timeInWaiting !: number | null;
  timeInService !: number | null;

  timeExecution !: number;
  readonly timeExecution$ !: WritableSignal<number>;

  timeRemaining !: number;
  readonly timeRemaining$ !: WritableSignal<number>;

  //Sujetos y observables para el proceso
  readonly signal !: WritableSignal<Process>;

  // private intervalRef !: any;

  constructor(
    id: number,
    operation: string,
    operator1: number,
    operator2: number,
    time: number,
    private processManagerService: ProcessManagerService
  ) {
    this.id = id;
    this.state = ProcessState.NEW;
    this.operation = operation;
    this.operator1 = operator1;
    this.operator2 = operator2;
    this.time = time;

    this.timeArrived = null;
    this.timeFinished = null;
    this.timeReturned = null;
    this.timeAnswered = null;
    this.timeInWaiting = 0;
    this.timeInService = 0;

    this.timeExecution = 0;
    this.timeExecution$ = signal(0);

    this.timeRemaining = time;
    this.timeRemaining$ = signal(this.timeRemaining);

    this.signal = signal(this);
    }

    executeOperation() : number {
      switch (this.operation) {
        case '+':
          this.result = this.operator1 + this.operator2;
          return this.result;
        case '-':
          this.result = this.operator1 - this.operator2;
          return this.result;
        case '*':
          this.result = this.operator1 * this.operator2;
          return this.result;
        case '/':
          try {
            this.result = this.operator1 / this.operator2;
          } catch (error) {
            console.error(error);
            this.result = 0;
          }
          return this.result;
        case '%':
          try {
            this.result = this.operator1 % this.operator2;
          } catch (error) {
            console.error(error);
            this.result = 0;
          }
          return this.result;
        case '%%':
          this.result = (this.operator2 * 100) / this.operator1;
          return this.result;
        default:
          throw new Error('Operation not supported');
      }
    }

    initAwaiting() : void {
      this.timeAwaitingintervalRef = setTimeout(() => {
        this.timeInWaiting == undefined || this.timeInWaiting == null ? this.timeInWaiting = 0 : null;
        this.timeInWaiting++;
      });
    }

    changeContext(state : ProcessState) {
      this.state = state;
      this.signal.set(this);
    }
  }

