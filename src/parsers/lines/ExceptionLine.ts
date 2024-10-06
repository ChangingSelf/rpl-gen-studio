import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 异常行
 */

export class ExceptionLine extends Line {
  
  constructor(
    public content: string,//原文内容
    public info: string,//报错信息
  ) {
    super(LineType.EXCEPTION);
  }

  toString(): string {
    return `${this.content}`;
  }

  toRaw(): RawLine {
    return {
      type: LineType.EXCEPTION,
      content: this.content,
      info: this.info,
    };
  }
}
