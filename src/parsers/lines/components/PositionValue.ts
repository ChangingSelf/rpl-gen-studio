import { RawMethod, RawPositionValue } from "../../RawProject";
import { Position } from "./Position";

/**
 * 位置
 * 
 */
export class PositionValue{
  constructor(
    public pos1: Position,
    public operator: "+" | "-" | null,
    public pos2: Position | null,
  ) {
    
  }

  static parse(text: string): PositionValue | null{
    if(!text){
      return null;
    }
    if(text.includes("+")){
      const parts = text.split("+");
      return new PositionValue(Position.parse(parts[0])!, "+", Position.parse(parts[1]));
    }else if(text.includes("-")){
      const parts = text.split("-");
      return new PositionValue(Position.parse(parts[0])!, "-", Position.parse(parts[1]));
    }else{
      return new PositionValue(Position.parse(text)!,null,null);
    }
  }
  
  toString(): string {
    return `${this.pos1.toString()}${this.operator ?? ""}${this.pos2?.toString() ?? ""}`;
  }

  toRaw():RawPositionValue {
    return {
      pos1: this.pos1.toRaw(),
      operator: this.operator,
      pos2: this.pos2?.toRaw() ?? null,
    }
  }
}