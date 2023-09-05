import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-process-random-modal',
  templateUrl: './add-process-random-modal.component.html',
  styleUrls: ['./add-process-random-modal.component.css']
})
export class AddProcessRandomModalComponent implements OnInit {

  cantProcesosForm !: FormGroup;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.cantProcesosForm = new FormGroup({
      cantProcesos: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(50)]),
    });
  }

  exitModal() : void {
    this.activeModal.close(this.cantProcesosForm.get('cantProcesos')?.value);
  }
}
