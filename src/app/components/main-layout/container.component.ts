import { Component, OnInit, Signal } from '@angular/core';
import { Observable, from, of, take } from 'rxjs';
import { Process } from 'src/app/models/process.model';
import { ProcessState } from 'src/app/models/process.state.model';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  counterGlobal$ !: Signal<number>;

  constructor(
    private processManagerService: ProcessManagerService
  ) { }

  ngOnInit(): void {
    this.counterGlobal$ = this.processManagerService.counterGlobal$;
  }

}
