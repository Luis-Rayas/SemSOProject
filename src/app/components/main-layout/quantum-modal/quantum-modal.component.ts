import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessManagerService } from 'src/app/services/process-manager.service';

@Component({
  selector: 'app-quantum-modal',
  templateUrl: './quantum-modal.component.html',
  styleUrls: ['./quantum-modal.component.css']
})
export class QuantumModalComponent implements OnInit {

  quantum !: FormControl;
  constructor(
    public activeModal: NgbActiveModal,
    private processManagerService: ProcessManagerService
  ) { }
  ngOnInit(): void {
    this.quantum = new FormControl('', [Validators.required, Validators.min(1), Validators.max(18), Validators.pattern('^[0-9]*$')]);
  }

  setQuantum() {
    this.processManagerService.setQuantum(this.quantum.value);
    this.activeModal.close();
  }
  exit() {
    this.activeModal.close();
  }
}
