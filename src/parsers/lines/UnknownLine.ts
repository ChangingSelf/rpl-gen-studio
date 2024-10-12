import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 未解析的行
 * 还未支持的语法会以注释的形式显示
 */
export class UnknownLine extends Line {
  constructor(public message: string) {
    super(LineType.UNKNOWN);
  }

  toString(): string {
    return `#### 此语法暂未被本插件支持：${this.message}`;
  }

  static override parse(text: string): UnknownLine | null {
    const regex = /^#### 此语法暂未被本插件支持：(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new UnknownLine(r[1]);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.COMMENT,
      content: `#### 此语法暂未被本插件支持：${this.message}`,
    };
  }
}
