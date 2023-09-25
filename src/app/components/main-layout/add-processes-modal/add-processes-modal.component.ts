import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-processes-modal',
  templateUrl: './add-processes-modal.component.html',
  styleUrls: ['./add-processes-modal.component.css']
})
export class AddProcessesModalComponent {

  numberProcess !: FormControl;
  constructor(public activeModal: NgbActiveModal) { }

  public ngOnInit(): void {
    this.numberProcess = new FormControl('', [Validators.required, Validators.min(1), Validators.max(20), Validators.pattern('^[0-9]*$')]);
  }

  exit() {
    this.activeModal.close();
  }

  addProcess() {
    this.activeModal.close(this.numberProcess.value);
  }
}
