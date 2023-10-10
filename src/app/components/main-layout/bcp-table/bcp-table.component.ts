import { Component, OnInit, WritableSignal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Process } from 'src/app/models/process.model';
import { ProcessState } from 'src/app/models/process.state.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-bcp-table',
  templateUrl: './bcp-table.component.html',
  styleUrls: ['./bcp-table.component.css']
})
export class BcpTableComponent implements OnInit {

  listProcesses !: Process[];
  counterGlobal$ !: WritableSignal<number>;
  constructor(
    public activeModal: NgbActiveModal,
    private processManagerService: ProcessManagerService
    ) { }

  ngOnInit(): void {
    this.counterGlobal$ = this.processManagerService.counterGlobal$;

    // Crea copias de los cuatro arreglos originales
  const listNewProcessCopy = JSON.parse(JSON.stringify(this.processManagerService.listNewProcess));
  const listReadyProcessCopy = JSON.parse(JSON.stringify(this.processManagerService.listReadyProcess));
  const listBlockedProcessCopy = JSON.parse(JSON.stringify(this.processManagerService.listBlockedProcess));
  const listFinishedProcessCopy = JSON.parse(JSON.stringify(this.processManagerService.listFinishedProcess));


    this.listProcesses = [
    ...listNewProcessCopy,
    ...listReadyProcessCopy,
    ...listBlockedProcessCopy,
    ...listFinishedProcessCopy
    ];
    this.processManagerService.currentRunningProcess ? this.listProcesses.push(this.processManagerService.currentRunningProcess) : null;
    this.listProcesses.sort((a : Process, b : Process) => a.id - b.id);
    this.listProcesses.forEach((process : Process) => {
      this.calculateTimes(process);
    })
  }

  private calculateTimes(process : Process) {
    process.timeArrived; //Tiempo de llegada: Si aun no entra al sistema, no hay mucho que hacer
    if(process.timeArrived != null){
      //Tiempo de espera = (Contador global - Tiempo de llegada) - Tiempo transcurrido
      process.timeInWaiting == 0 && process.state != ProcessState.FINISHED ?
      process.timeInWaiting = (this.counterGlobal$() - process.timeArrived) - process.timeExecution : null;
      process.timeInWaiting < 0 ? process.timeInWaiting = 0 : null;
      //Tiempo de retorno = Tiempo de espera + Tiempo de servicio
      process.timeReturned == null ?
      process.timeReturned = process.timeInWaiting - process.timeInService : null;
    }
    process.timeFinished;
    process.timeAnswered;
    process.timeInService;
  }

  exit() {
    this.activeModal.close();
  }
}
