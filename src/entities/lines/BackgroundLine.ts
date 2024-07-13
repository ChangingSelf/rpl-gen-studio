import { Line, LineType } from "../Line";
import { Method } from "../Method";
import { RawLine } from "../RawProject";

/**
 * 背景行
 */
export class BackgroundLine extends Line {
  
  constructor(
    public object:string,
    public switchMethod: Method | null,
  ) {
    super(LineType.BACKGROUND);
  }

  toString(): string {
    return `<background>${this.switchMethod}:${this.object}`;
  }

  static override parse(text: string): Line | null {
    const regexBackgroundLine = /^<background>(<[\w\=]+>)?:(.+)$/m;
    let r = regexBackgroundLine.exec(text);
    if (r) {
      return new BackgroundLine(r[2],Method.parse(r[1]));
    } else {
      return null;
    }
  }

  toRaw(): RawLine {
    return {
      type: LineType.BACKGROUND,
      bg_method: this.switchMethod?.toRaw(),
      object: this.object,
    };
  }
}
