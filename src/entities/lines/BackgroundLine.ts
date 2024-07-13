import { Line, LineType } from "../Line";

/**
 * 背景行
 */
export class BackgroundLine extends Line {
  
  constructor(
    public switchMethod: string,
    public background:string,
  ) {
    super(LineType.BACKGROUND);
  }

  toString(): string {
    return `<background>${this.switchMethod}:${this.background}`;
  }

  static override parse(text: string): Line | null {
    const regexBackgroundLine = /^<background>(<[\w\=]+>)?:(.+)$/m;
    let r = regexBackgroundLine.exec(text);
    if (r) {
      return new BackgroundLine(r[1], r[2]);
    } else {
      return null;
    }
  }
}
