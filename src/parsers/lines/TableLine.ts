import { Line, LineType } from "../Line";
import { RawLine, RawTarget } from "../RawProject";

/**
 * 表字段设置行
 */
export class TableLine extends Line {
  constructor(
    public target:RawTarget,
    public value: string,
  ) {
    super(LineType.TABLE);
  }

  toString(): string {
    return `<table:${this.target.name}.${this.target.subtype ? this.target.subtype+'.' : ''}${this.target.column}>:${this.value}`;
  }

  static override parse(text: string): TableLine | null {
    const regex = /^<table:([^.]+?)\.(([^.]+?)\.)?([^.]+?)>:([^.]+?)$/m;
    let r = regex.exec(text);
    if (r) {
      return new TableLine({
        name: r[1],
        column: r[4],
        subtype: r[3] ?? null,
      }, r[5]);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    return {
      type: LineType.TABLE,
      target: this.target,
      value: this.value
    };
  }
}
