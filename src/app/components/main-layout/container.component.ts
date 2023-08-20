import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchState } from 'src/app/models/batch.state.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  batchsCounter$ !: Observable<{ [key: string]: number }>;
  batchState = BatchState;

  constructor(
    private processManagerService: ProcessManagerService
  ) { }

  ngOnInit(): void {
    this.processManagerService.updateBatchCountByState();
    this.batchsCounter$ = this.processManagerService.batchCountByState$;
  }


}
