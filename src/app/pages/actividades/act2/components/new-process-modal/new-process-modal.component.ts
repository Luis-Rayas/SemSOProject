import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-process-modal',
  templateUrl: './new-process-modal.component.html',
  styleUrls: ['./new-process-modal.component.css']
})
export class NewProcessModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
