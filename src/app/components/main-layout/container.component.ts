import { Component, OnInit } from '@angular/core';
import { Observable, from, of, take } from 'rxjs';
import { Batch } from 'src/app/models/batch.model';
import { BatchState } from 'src/app/models/batch.state.model';
import { Process } from 'src/app/models/process.model';
import { ProcessState } from 'src/app/models/process.state.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {


  batchState = BatchState;

  currentBatchRunning$ !: Observable<Batch | null>;
  currentProcessRunning$ !: Observable<Process | null>;

  constructor(
    private processManagerService: ProcessManagerService
  ) { }

  ngOnInit(): void {
    this.currentBatchRunning$ = this.processManagerService.currentBatchRunning$;
    this.currentProcessRunning$ = this.processManagerService.currentProcessRunning$;
  }

}
