import { Component } from '@angular/core';
import { Act4Service } from './services/act4.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProcessRandomModalComponent } from './components/add-process-random-modal/add-process-random-modal.component';
import { Process } from 'src/app/models/process.model';

@Component({
  selector: 'app-act4',
  templateUrl: './act4.component.html',
  styleUrls: ['./act4.component.css']
})
export class Act4Component {

  constructor(
    private _act4Service : Act4Service,
    private _modalService: NgbModal,
  ) { }

  reset() {
    confirm('¿Deseas resetear toda la informacion y el contador?') ? this._act4Service.reset() : null;
  }

  startBatchs(){
    this._act4Service.startBatchs();
  }

  open() {
		const modalRef = this._modalService.open(AddProcessRandomModalComponent, {
      // size: 'lg'
    });
    modalRef.result.then((result) => {
      console.log(result);
      const array : Array<string> = ['+', '-', '*', '/', '%', '%%'];
      for(let i = 1; i <= result; i++){
      let newProcess : Process = new Process(
        i,
        "",
        array[Math.floor(Math.random() * array.length)],
        Math.round(Math.random() * (10000 - 1) + 1), // operador 2
        Math.round(Math.random() * (10000 - 1) + 1), //operador 1
        Math.round(Math.random() * (18 - 6) + 6) //Time
      );
      this._act4Service.addProcess(newProcess);
      }
    },
    (reason) => {
      console.log(reason);
    });
	}



}
