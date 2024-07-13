import { Line, LineType } from "../Line";

/**
 * BGM行
 */
export class BgmLine extends Line {
  constructor(
    public bgm:string
  ) {
    super(LineType.BGM);
  }
  toString(): string {
    return "";
  }

  static override parse(text: string): Line | null {
    const regex = /^(<BGM>|<bgm>):(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new BgmLine(r[2]);
    } else {
      return null;
    }
  }
}
