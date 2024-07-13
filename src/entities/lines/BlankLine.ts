import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 空白行
 */
export class BlankLine extends Line {
  
  constructor() {
    super(LineType.BLANK);
  }

  toString(): string {
    return "";
  }

  static override parse(text: string): Line | null {
    return text === '' ? new BlankLine : null;
  }

  toRaw(): RawLine {
    return {
      type: LineType.BLANK,
    };
  }
}
