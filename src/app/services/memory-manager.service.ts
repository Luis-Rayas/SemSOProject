import { Injectable, WritableSignal, signal } from '@angular/core';
import { Frame } from '../models/frame.model';
import { Process } from '../models/process.model';

@Injectable({
  providedIn: 'root'
})
export class MemoryManagerService {

  frames !: Frame[];
  frames$ !: WritableSignal<Frame[]>;

  private colors = ["success", "primary", "secondary", "info", "warning", "danger", "dark"];
  private colorIndex = 0;

  constructor() {
    this.frames = [];
    this.frames$ = signal(this.frames);
    this.frames$.update(() => {
      for (let i = 0; i < 40; i++) {
        this.frames.push(new Frame(i));
      }
      return this.frames;
    });
  }

  checkMemory(process: Process) : boolean {
    let isFramesAvailable = this.frames.filter(frame => {
      return frame.idProcessUsed == null;
    }).length;
    let framesRequired = process.memory / 5;
    return isFramesAvailable >= framesRequired;
  }

  addProcessToMemory(process: Process) {
    if(this.checkMemory(process) == false) return;
    const framesAvailable = this.frames.filter(frame => {
      return frame.idProcessUsed == null;
    });
    let memoryRequired = process.memory;


    for (let i = 0; i < framesAvailable.length; i++) {
      const frame = framesAvailable[i];
      if (memoryRequired > 0) {
        this.frames[frame.id].idProcessUsed = process.id;

        // Asignando color
        this.colorIndex > this.colors.length - 1 ? this.colorIndex = 0 : null;
        this.frames[frame.id].color = this.colors[this.colorIndex];

        if(memoryRequired >= 5) {
          this.frames[frame.id].memoryUsed = 5;
          memoryRequired -= 5;
        } else {
          let aux = memoryRequired % 5;
          this.frames[frame.id].memoryUsed = aux;
          memoryRequired -= aux;
        }
      } else {
        break; // Salir del bucle si ya no se necesita más memoria
      }
    }
    this.colorIndex++;
    this.frames$.update(() => {
      return this.frames;
    });
  }

  leaveProcessFromMemory(process: Process) {
    const framesOcupied = this.frames.filter(frame => {
      return frame.idProcessUsed == process.id;
    });

    for (let i = 0; i < framesOcupied.length; i++) {
      const frame = framesOcupied[i];
      this.frames[frame.id].idProcessUsed = null;
      this.frames[frame.id].memoryUsed = 0;
    }
    this.frames$.update(() => {
      return this.frames;
    })
  }

  resetMemory() {
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i].idProcessUsed = null;
      this.frames[i].memoryUsed = 0;
    }
    this.frames$.update(() => {
      return this.frames;
    });
  }


}
