/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import { LogFile, LogLine } from "./ProjectFile";

export enum LineType {
  EXCEPTION = "exception",
  COMMENT = "comment",
  BLANK = "blank",
  SET = "set",
  BACKGROUND = "background",
  DIALOG = "dialog"
}


/**
 * 剧本行
 */
export abstract class Line {
  constructor(public type: LineType) {

  }
  /**
   * 用于将自身转换为对应的字符串
   */
  abstract render(): string;

  /**
   * 将项目文件中的原始剧本行解析为本插件用到的剧本行对象以方便处理
   * @param logLine 
   * @returns 
   */
  static parse(logLine: LogLine): Line | null {
    try {
      switch (logLine.type) {
        case LineType.EXCEPTION:
          return new ExceptionLine(logLine.content ?? "", logLine.info ?? "");
        case LineType.COMMENT:
          return new CommentLine(logLine.content ?? "");
        case LineType.BLANK:
          return new BlankLine();
        case LineType.DIALOG:
          return new DiagLine(logLine.content ?? "");
        default:
          return new BlankLine();
      }
    } catch (err) {
      console.log((err as Error).message);
      return null;
    }
  }
}


/**
 * 跑团日志文件
 */
export class Log {
  constructor(
    public title: string,//剧本文件名
    public content: Line[],//内容
  ) {

  }

  static parseLogFile(title: string, logFile: LogFile): Log | null {
    const content: Line[] = [];
    for (const lineNum in logFile) {
      const logLine = Line.parse(logFile[lineNum]);
      if (logLine) {
        content.push(logLine);
      }
      else {
        return null;
      }
    }
    return new Log(title, content);
  }

  static parseString(text: string): Log | null{
    return null;//TODO
  }

  /**
   * 
   * @returns 转换后的剧本字符串
   */
  render(): string {
    let content = '';
    for (const line of this.content) {
      content += line.render() + '\n';
    }
    return content;
  }
}

/**
 * ****************************************************
 */

/**
 * 异常行
 */
export class ExceptionLine extends Line {
  constructor(
    public content: string,
    public info: string,//异常信息
  ) {
    super(LineType.EXCEPTION);
  }

  render(): string {
    return `#${this.content}`;
  }
}
/**
 * 注释行
 */
export class CommentLine extends Line {
  constructor(public content: string) {
    super(LineType.COMMENT);
  }
  render(): string {
    return `#${this.content}`;
  }
}
/**
 * 空白行
 */
export class BlankLine extends Line {
  constructor() {
    super(LineType.BLANK);
  }
  render(): string {
    return "";
  }
}
/**
 * 对话行
 */
export class DiagLine extends Line {
  constructor(public content: string) {
    super(LineType.DIALOG);
  }
  render(): string {
    return `${this.content}`;
  }
}