import { Injectable, WritableSignal, signal } from '@angular/core';
import { Frame } from '../models/frame.model';
import { Process } from '../models/process.model';

@Injectable({
  providedIn: 'root'
})
export class MemoryManagerService {

  frames !: Frame[];
  frames$ !: WritableSignal<Frame[]>;

  constructor() {
    this.frames = [];
    this.frames$ = signal(this.frames);
    this.frames$.update(() => {
      for (let i = 0; i < 40; i++) {
        this.frames.push(new Frame(i));
      }
      this.frames[4].idProcessUsed = 1;
      this.frames[4].memoryUsed = 4;
      this.frames[5].idProcessUsed = 2;
      this.frames[5].memoryUsed = 5;
      return this.frames;
    });
  }


}
