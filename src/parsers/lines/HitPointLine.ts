import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 血量行
 */
export class HitPointLine extends Line {
  constructor(
    public content: string = '',
    public hpMax: number = 0,
    public hpBegin: number = 0,
    public hpEnd: number = 0,
  ) {
    super(LineType.HP);
  }

  toString(): string {
    return `<hitpoint>:(${this.content},${this.hpMax},${this.hpBegin},${this.hpEnd})`;
  }

  static override parse(text: string): HitPointLine | null {
    const regexHitpoint = /^<hitpoint>:\((.+?),(\d+),(\d+),(\d+)\)$/mg;
    let r = regexHitpoint.exec(text);
    if (r) {
      return new HitPointLine(r[1],Number(r[2]),Number(r[3]),Number(r[4]));
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.HP,
      content: this.content,
      hp_max: this.hpMax,
      hp_begin: this.hpBegin,
      hp_end: this.hpEnd,
    };
  }
}
