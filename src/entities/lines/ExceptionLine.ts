import { Line, LineType } from "../Line";

/**
 * 异常行
 */

export class ExceptionLine extends Line {
  constructor(
    public content: string,
    public info: string
  ) {
    super(LineType.EXCEPTION);
  }

  toString(): string {
    return `#${this.content}`;
  }
}
