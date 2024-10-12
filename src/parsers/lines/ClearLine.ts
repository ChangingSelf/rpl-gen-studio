import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 清除行
 * 用于清除聊天窗
 */
export class ClearLine extends Line {
  constructor(
    public object: string,
  ) {
    super(LineType.COMMENT);
  }

  toString(): string {
    return `<clear>:${this.object}`;
  }

  static override parse(text: string): ClearLine | null {
    const regex = /^<clear>:(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new ClearLine(r[1]);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.CLEAR,
      object: this.object,
    };
  }
}
