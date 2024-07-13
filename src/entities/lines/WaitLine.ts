import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 停顿行
 * 
 * 使用停顿行，可以让画面在前一个小节的末尾停顿指定的帧数；停顿行由停顿命令标签和停顿时间（单位；帧）构成
 */
export class WaitLine extends Line {
  constructor(
    public time: number,//停顿时间，单位：帧
  ) {
    super(LineType.WAIT);
  }

  toString(): string {
    return `<wait>:${this.time}`;
  }

  static override parse(text: string): Line | null {
    const regex = /^<wait>:(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new WaitLine(Number(r[1]));
    } else {
      return null;
    }
  }

  toRaw(): RawLine {
    return {
      type: LineType.WAIT,
      time: this.time,
    };
  }
}
