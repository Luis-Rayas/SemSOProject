import { Process } from "./process.model";

export class Frame {
  id !: number;
  size !: number;
  memoryUsed !: number;
  idProcessUsed !: number | null;
  color !: string;

  constructor(id: number){
    this.id = id;
    this.size = 5;
    this.memoryUsed = 0;
    this.idProcessUsed = null;
    this.color = "primary";
  }
}
