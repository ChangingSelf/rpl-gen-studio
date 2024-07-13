import { Line, LineType } from "../Line";

/**
 * 注释行
 */
export class CommentLine extends Line {
  constructor(public content: string) {
    super(LineType.COMMENT);
  }

  toString(): string {
    return `# ${this.content}`;
  }

  static override parse(text: string): Line | null {
    const regex = /^#(.*)$/m;
    let r = regex.exec(text);
    if (r) {
      return new CommentLine(r[1]);
    } else {
      return null;
    }
  }
  
}
