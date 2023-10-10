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

  //Tiempos
  time !: number;

  timeArrived !: number | null;
  timeFinished !: number | null;
  timeReturned !: number;
  timeAnswered !: number | null;
  timeInWaiting !: number;
  timeInService !: number;

  timeInProcesator !: number;
  timeInProcesator$ !: WritableSignal<number>;

  timeBlocked !: number;
  timeBlocked$ !: WritableSignal<number>;
  refTimeBlocked !: any;

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
  ) {
    this.id = id;
    this.state = ProcessState.NEW;
    this.operation = operation;
    this.operator1 = operator1;
    this.operator2 = operator2;
    this.time = time;

    this.timeArrived = null;
    this.timeFinished = null;
    this.timeReturned = 0;
    this.timeAnswered = null;
    this.timeInWaiting = 0;
    this.timeInService = 0;
    this.timeInProcesator = 0;

    this.timeBlocked = 0;
    this.timeBlocked$ = signal(0);

    this.timeExecution = 0;
    this.timeExecution$ = signal(0);

    this.timeRemaining = time;
    this.timeRemaining$ = signal(this.timeRemaining);

    this.timeInProcesator$ = signal(this.timeInProcesator);

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

    changeContext(state : ProcessState) {
      this.state = state;
      this.signal.set(this);
    }
  }

