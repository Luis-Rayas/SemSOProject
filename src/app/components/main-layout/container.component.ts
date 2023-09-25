import { Component, OnInit, Signal } from '@angular/core';
import { ProcessManagerService } from 'src/app/services/process-manager.service';
import { AddProcessesModalComponent } from './add-processes-modal/add-processes-modal.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Process } from 'src/app/models/process.model';
import { ProcessState } from 'src/app/models/process.state.model';

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
  }

  startProgram(): void {
    this.processManagerService.startProgram();
  }

  reset(): void {
    this.processManagerService.reset();
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
          this.random(6, 16), //Time
          this.processManagerService
          );
        this.processManagerService.addProcess(process);
      }
    });
  }

  private random(min : number, max : number){
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
}
