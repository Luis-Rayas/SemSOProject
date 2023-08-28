import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Act2Service } from '../../services/act2-service.service';
import { Process } from 'src/app/models/process.model';

@Component({
  selector: 'app-new-process-modal',
  templateUrl: './new-process-modal.component.html',
  styleUrls: ['./new-process-modal.component.css']
})
export class NewProcessModalComponent implements OnInit {

  formProcess !: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private act2Service: Act2Service
  ) { }
  ngOnInit(): void {
    this.formProcess = new FormGroup({
      id: new FormControl(null, [Validators.required, this.validateIdProcess()]),
      developer: new FormControl(null, [Validators.required]),
      operation: new FormControl(null, [Validators.required]),
      operator1: new FormControl(null, [Validators.required]),
      operator2: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]+$")])
    },
      this.validateOperators()
    )
  }
  saveProcess() {
    this.activeModal.close(this.formProcess.value);
  }

  exitModal() {
    this.activeModal.dismiss();
  }

  //Validations
  validateOperators(): ValidationErrors | null {
    return (form: FormGroup): ValidationErrors | null => {
      const process = new Process(
        form.value.id,
        form.value.developer,
        form.value.operation,
        form.value.operator1,
        form.value.operator2,
        form.value.time
      );
      return this.act2Service.validateOperators(process) ? null : { invalidOperator: true };
    }
  }

  validateIdProcess(): ValidatorFn {
    return (control : AbstractControl): ValidationErrors | null => {
      const id = control.value;
      const valid = this.act2Service.validateIdProcess(id);
      return valid ? null : { invalidId: true };
    }
  }
}
