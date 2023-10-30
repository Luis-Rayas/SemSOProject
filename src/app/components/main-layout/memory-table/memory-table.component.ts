import { Component, OnInit, WritableSignal } from '@angular/core';
import { Frame } from 'src/app/models/frame.model';
import { MemoryManagerService } from 'src/app/services/memory-manager.service';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-memory-table',
  templateUrl: './memory-table.component.html',
  styleUrls: ['./memory-table.component.css']
})
export class MemoryTableComponent implements OnInit {

  frames$ !: WritableSignal<Frame[]>;

  constructor(private memoryManagerService: MemoryManagerService) { }
  ngOnInit(): void {
    this.frames$ = this.memoryManagerService.frames$;
  }

}
