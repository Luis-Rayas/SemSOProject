import { BehaviorSubject, Observable, Subject, delay } from "rxjs";
import { ProcessState } from "./process.state.model";
import { WritableSignal, signal } from "@angular/core";

export class Process {
  id !: number;
  state !: ProcessState;
  operation !: string;
  operator1 !: number;
  operator2 !: number;
  result !: number | string;

  //Tiempos
  time !: number;

  timeArrived !: number | undefined;
  timeFinished !: number | undefined;
  timeReturned !: number | undefined;
  timeAnswered !: number | undefined;
  timeInWaiting !: number | undefined;
  timeInService !: number | undefined;

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

    this.timeArrived = undefined;
    this.timeFinished = undefined;
    this.timeReturned = undefined;
    this.timeAnswered = undefined;
    this.timeInWaiting = undefined;
    this.timeInService = undefined;

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
  }

