import { Component, OnInit, Signal } from '@angular/core';
import { ProcessManagerService } from 'src/app/services/process-manager.service';
import { AddProcessesModalComponent } from './add-processes-modal/add-processes-modal.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Process } from 'src/app/models/process.model';
import { ProcessState } from 'src/app/models/process.state.model';
import { QuantumModalComponent } from './quantum-modal/quantum-modal.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  ProcessState = ProcessState;

  counterGlobal$ !: Signal<number>;
  listNewProcess$ !: Signal<Process[]>;
  listReadyProcess$ !: Signal<Process[]>;
  listBlockedProcess$ !: Signal<Process[]>;
  currentRunningProcess$ !: Signal<Process | undefined | null>;
  listFinishedProcess$ !: Signal<Process[]>;
  quantum$ !: Signal<number>;

  modalRef !: NgbModalRef;

  constructor(
    private processManagerService: ProcessManagerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.counterGlobal$ = this.processManagerService.counterGlobal$;
    this.listNewProcess$ = this.processManagerService.listNewProcess$;
    this.listReadyProcess$ = this.processManagerService.listReadyProcess$;
    this.listBlockedProcess$ = this.processManagerService.listBlockedProcess$;
    this.currentRunningProcess$ = this.processManagerService.currentRunningProcess$;
    this.listFinishedProcess$ = this.processManagerService.listFinishedProcess$;
    this.quantum$ = this.processManagerService.quantum$;
  }

  startProgram(): void {
    if(this.quantum$() != 0) {
      this.processManagerService.startProgram();
    } else {
      this.openSetQuantumModal();
    }
  }

  reset(): void {
    this.processManagerService.reset();
  }

  openSetQuantumModal(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    this.modalRef = this.modalService.open(QuantumModalComponent, ngbModalOptions);
    this.modalRef.result.then((result) => {
      if(!result || typeof result == undefined) return;
      this.processManagerService.setQuantum(result);
    });
  }

  addProcess(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
  };
    this.modalRef = this.modalService.open(AddProcessesModalComponent, ngbModalOptions);
    this.modalRef.result.then((result) => {
      if(!result || typeof result == undefined) return;
      const array : Array<string> = ['+', '-', '*', '/', '%', '%%'];
      for(let i = 0; i < result; i++){
        let process = new Process(
          this.processManagerService.idProcess,
          array[this.random(0, array.length - 1)],
          this.random(-100, 100), // operador 2
          this.random(-100, 100), //operador 1
          this.random(6, 18), //Time
          this.random(6, 26) //Memory size
          );
        this.processManagerService.addProcess(process);
      }
    });
  }

  private random(min : number, max : number){
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
}
