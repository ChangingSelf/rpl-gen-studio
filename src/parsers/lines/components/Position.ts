import { RawMethod, RawPosition } from "../../RawProject";

/**
 * 位置
 * 
 */
export class Position{
  constructor(
    public index: number[] | null,
    public object: string | null,
    public type: string | null,
  ) {
    
  }

  static parse(text: string): Position | null{
    if(!text){
      return null;
    }

    const regexFixPoint = /^\((\d+),(\d+)\)$/m;
    let r = regexFixPoint.exec(text);
    if (r) {
      return new Position([Number(r[1]),Number(r[2])],null,null);
    } else {
      const regexGrid = /^(.+?)\[(\d+),(\d+)\]$/m;
      r = regexGrid.exec(text);
      if (r) {
        return new Position([Number(r[2]),Number(r[3])],"$" + r[1],"subscript");
      }else{
        return new Position(null,"$"+text,null);
      }
    }
  }
  
  static parseFromRaw(raw: RawPosition | null): Position | null{
    if(raw === null){
      return null;
    }
    
    if(typeof raw === "string"){
      return new Position(null,raw,null);
    }else if(Array.isArray(raw)){
      return new Position(raw,null,null);
    }else{
      return new Position(raw.index,raw.object,raw.type);
    }
  }
  
  toString(): string {
    if(this.type === "subscript"){
      return `${this.object?.substring(1)}[${this.index![0]},${this.index![1]}]`;
    }else if(this.object !== null){
      return `${this.object?.substring(1)}`;
    }else if(this.index !== null){
      return `(${this.index[0]},${this.index[1]})`;
    }else{
      return "";
    }
  }

  toRaw() {
    if(this.type === "subscript"){
      return {
        type: "subscript",
        object: this.object,
        index: this.index,
      };
    }else if(this.object !== null){
      return this.object;
    }else if(this.index !== null){
      return this.index;
    }else{
      return "";
    }
  }
}