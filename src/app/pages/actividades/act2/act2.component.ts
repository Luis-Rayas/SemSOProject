import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewProcessModalComponent } from './components/new-process-modal/new-process-modal.component';
import { Act2Service } from './services/act2-service.service';

@Component({
  selector: 'app-act2',
  templateUrl: './act2.component.html',
  styleUrls: ['./act2.component.css']
})
export class Act2Component {
	constructor(
    private _modalService: NgbModal,
    private _act2Service: Act2Service
    ) {}

	open() {
		const modalRef = this._modalService.open(NewProcessModalComponent, {
      size: 'xl'
    });
	}

}
