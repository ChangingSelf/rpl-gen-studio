import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";
import { PositionValue } from "./components/PositionValue";

/**
 * 移动行
 * 用于移动立绘或是气泡
 */
export class MoveLine extends Line {
  constructor(
    public target: string,
    public value: PositionValue,
  ) {
    super(LineType.MOVE);
  }

  toString(): string {
    return `<move:${this.target}>:${this.value}`;
  }

  static override parse(text: string): MoveLine | null {
    const regex = /^<move:(.+?)>:(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      const value = PositionValue.parse(r[2]);
      if(value === null){
        return null;
      }
      return new MoveLine(r[1],value);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.MOVE,
      target: this.target,
      value: this.value.toRaw(),
    };
  }
}
