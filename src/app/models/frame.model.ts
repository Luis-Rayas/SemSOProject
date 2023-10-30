import { Process } from "./process.model";

export class Frame {
  id !: number;
  size !: number;
  memoryUsed !: number;
  idProcessUsed !: number;

  constructor(id: number){
    this.id = id;
    this.size = 5;
  }
}
