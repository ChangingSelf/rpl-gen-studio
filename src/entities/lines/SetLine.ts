import { ConfigValue } from "../ConfigValue";
import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 注释行
 */
export class SetLine extends Line {
  constructor(
    public target: string,
    public value:ConfigValue,
  ) {
    super(LineType.COMMENT);
  }

  toString(): string {
    return `<set:${this.target}>:${this.value}`;
  }

  static override parse(text: string): Line | null {
    const regex = /^<set:(.*?)>:(.*?)$/m;
    let r = regex.exec(text);
    if (r) {
      const value = ConfigValue.parse(r[1], r[2]);
      if (!value) {
        return null;
      }
      return new SetLine(r[1], value);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.COMMENT,
      content: this.target,
    };
  }
}
