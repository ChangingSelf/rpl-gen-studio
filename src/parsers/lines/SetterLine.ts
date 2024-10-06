import { SetterLineValue } from "./components/SetterLineValue";
import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";

/**
 * 设置行
 */
export class SetterLine extends Line {
  constructor(
    public target: string,
    public value:SetterLineValue,
  ) {
    super(LineType.COMMENT);
  }

  toString(): string {
    return `<set:${this.target}>:${this.value}`;
  }

  static override parse(text: string): SetterLine | null {
    const regex = /^<set:(.*?)>:(.*?)$/m;
    let r = regex.exec(text);
    if (r) {
      const value = SetterLineValue.parse(r[1], r[2]);
      if (!value) {
        return null;
      }
      return new SetterLine(r[1], value);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.SET,
      target: this.target,
      value_type: this.value.valueType,
      value: this.value.toRawValue(),
    };
  }
}
