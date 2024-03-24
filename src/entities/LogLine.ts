/* eslint-disable @typescript-eslint/naming-convention */
export enum LogLineType{
  COMMENT = "comment",
  BLANK = "blank",
  SET = "set",
  BACKGROUND = "background",
  DIALOG = "dialog"
}

export abstract class LogLine{
  constructor(public type: LogLineType) {
      
  }
  abstract render(): string;

  static parseLogLine(data:any): LogLine|null{
    try {
      switch (data.type) {
        case LogLineType.COMMENT:
          return new CommentLine(data.content);
        case LogLineType.BLANK:
          return new BlankLine();
        case LogLineType.DIALOG:
          return new DiaglogLine(data.content);
        default:
          return new BlankLine();
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

/**
 * 注释行
 */
export class CommentLine extends LogLine{
  constructor(public content: string) {
    super(LogLineType.COMMENT);
  }
  render(): string {
    return `#${this.content}`;
  }
}
/**
 * 空白行
 */
export class BlankLine extends LogLine{
  constructor() {
    super(LogLineType.BLANK);
  }
  render(): string {
    return "";
  }
}
/**
 * 对话行
 */
export class DiaglogLine extends LogLine{
  constructor(public content: string) {
    super(LogLineType.DIALOG);
  }
  render(): string {
    return `${this.content}`;
  }
}