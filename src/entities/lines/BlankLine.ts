import { Line, LineType } from "../Line";

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
}
