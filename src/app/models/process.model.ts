import { BehaviorSubject, Observable, Subject, delay } from "rxjs";
import { ProcessState } from "./process.state.model";

export class Process {
  id !: number;
  state !: ProcessState;
  batchId !: number;
  developer !: string;
  operation !: string;
  operator1 !: number;
  operator2 !: number;
  result !: number;
  time !: number;
  timeExecution !: number;
  timeExecution$ !: Observable<number>;
  timeExecutionSubject !: BehaviorSubject<number>;

  timeRemaining !: number;
  timeRemainingSubject !: BehaviorSubject<number>;
  timeRemaining$ !: Observable<number>;

  subject !: Subject<Process>;
  observable !: Observable<Process>;

  private intervalRef !: any;

  constructor(
    id: number,
    developer: string,
    operation: string,
    operator1: number,
    operator2: number,
    time: number,
  ) {
    this.id = id;
    this.state = ProcessState.PENDING;
    this.batchId = 0;
    this.developer = developer;
    this.operation = operation;
    this.operator1 = operator1;
    this.operator2 = operator2;
    this.time = time;

    this.timeExecution = 0;
    this.timeExecutionSubject = new BehaviorSubject<number>(0);
    this.timeExecution$ = this.timeExecutionSubject.asObservable();

    this.timeRemaining = time;
    this.timeRemainingSubject = new BehaviorSubject<number>(this.timeRemaining);
    this.timeRemaining$ = this.timeRemainingSubject.asObservable();

    this.subject = new Subject<Process>();
    this.observable = this.subject.asObservable();
    }


  private calculateTimeRemaining() : number {
    this.timeRemaining = this.time - this.timeExecution;

    this.timeRemainingSubject.next(this.timeRemaining);
    this.timeExecutionSubject.next(this.timeExecution);

    return this.timeRemaining;
  }

  private executeOperation() : number {
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

  startProcess() : void {
    this.intervalRef = setInterval(() => {
      this.state = ProcessState.RUNNING;
      this.timeExecution++;
      this.calculateTimeRemaining();
      if(this.timeRemaining === 0 && this.timeExecution === this.time) { //Finish process
        this.executeOperation();
        this.state = ProcessState.FINISHED;
        clearInterval(this.intervalRef);

        this.subject.next(this);
        this.timeRemainingSubject.next(this.timeRemaining);
        this.timeExecutionSubject.next(this.timeExecution);

        this.subject.complete();
        this.timeRemainingSubject.complete();
        this.timeExecutionSubject.complete();
      }
    }, 1000);
  }

  interruptProcess(state :  ProcessState) : void {
    this.state = state;
    clearInterval(this.intervalRef);

    this.subject.next(this);
  }
}

