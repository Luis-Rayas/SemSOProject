import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewProcessModalComponent } from './components/new-process-modal/new-process-modal.component';
import { Act2Service } from './services/act2-service.service';
import { Process } from 'src/app/models/process.model';

@Component({
  selector: 'app-act2',
  templateUrl: './act2.component.html',
  styleUrls: ['./act2.component.css'],
})
export class Act2Component {
	constructor(
    private _modalService: NgbModal,
    private _act2Service: Act2Service
    ) {}

  startBatchs() : void{
    this._act2Service.startBatchs();
  }

	open() {
		const modalRef = this._modalService.open(NewProcessModalComponent, {
      size: 'xl'
    });
    modalRef.result.then((result) => {
      console.log(result);
      let newProcess : Process = new Process(
        result.id,
        result.developer,
        result.operation,
        result.operator1,
        result.operator2,
        result.time
      );
      this._act2Service.addProcess(newProcess);
    },
    (reason) => {
      console.log(reason);
    });
	}

  reset() : void{
    confirm('¿Deseas resetear toda la informacion y el contador?') ? this._act2Service.reset() : null;
  }
}
