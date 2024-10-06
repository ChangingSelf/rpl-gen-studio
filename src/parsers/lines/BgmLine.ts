import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * BGM行
 */
export class BgmLine extends Line {
  constructor(
    public object:string
  ) {
    super(LineType.BGM);
  }
  toString(): string {
    return `<BGM>:${this.object}`;
  }

  static override parse(text: string): BgmLine | null {
    const regex = /^(<BGM>|<bgm>):(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new BgmLine(r[2]);
    } else {
      return null;
    }
  }

  toRaw(): RawLine {
    return {
      type: LineType.BGM,
      value: this.object
    };
  }
}
