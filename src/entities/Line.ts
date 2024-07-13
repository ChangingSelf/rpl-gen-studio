/* eslint-disable @typescript-eslint/naming-convention */
import { BlankLine } from "./lines/BlankLine";
import { Character } from "./Character";
import { CommentLine } from "./lines/CommentLine";
import { ExceptionLine } from "./lines/ExceptionLine";
import { DialogLine } from "./lines/DialogLine";
import { Method } from "./Method";
import { LogLine } from "./RawProject";
import { BackgroundLine } from "./lines/BackgroundLine";
import { BgmLine } from "./lines/BgmLine";
import { WaitLine } from "./lines/WaitLine";

/**
 * 原始剧本行类型
 */
export enum LineType {
  EXCEPTION = "exception",
  COMMENT = "comment",
  BLANK = "blank",
  SET = "set",
  BACKGROUND = "background",
  DIALOG = "dialog",
  WAIT = "wait",
  BGM = "music",
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
  abstract toString(): string;

  /**
   * 用于将字符串解析为对应的行
   * @param text 
   */
  static parse(text: string): Line | null {
    return null;
  }

  /**
   * 将项目文件中的原始剧本行解析为本插件用到的剧本行对象以方便处理
   * @param logLine
   * @returns
   */
  static parseFromRawLine(logLine: LogLine): Line | null {
    try {
      switch (logLine.type) {
        case LineType.EXCEPTION:
          return new ExceptionLine(logLine.content ?? "", logLine.info ?? "");
        case LineType.COMMENT:
          return new CommentLine(logLine.content ?? "");
        case LineType.BLANK:
          return new BlankLine();
        case LineType.DIALOG:{
          const characterList:Character[] = [];
          logLine.charactor_set?.forEach(pc=>{
            characterList.push(new Character(pc.name, pc.alpha ?? undefined, pc.subtype));
          });

          const toggleEffect = new Method(logLine.ab_method?.method, logLine.ab_method?.method_dur);
          
          const textEffect = new Method(logLine.tx_method?.method, logLine.tx_method?.method_dur);

          //TODO:音效框的解析
          return new DialogLine(characterList,toggleEffect,logLine.content,textEffect);
        }
        default:
          return new BlankLine();
      }
    } catch (err) {
      console.log((err as Error).message);
      return null;
    }
  }


  /**
   * 从文本解析
   * @param line 
   */
  static parseFromStr(line: string): Line | null {
    try {
      const parserChain = [
        BackgroundLine.parse,
        BgmLine.parse,
        BlankLine.parse,
        CommentLine.parse,
        DialogLine.parse,
        ExceptionLine.parse,
        WaitLine.parse,
      ];
      const resultList = parserChain.map((parser) => parser(line));
      return resultList.find(x => x !== null) ?? null;
    } catch (err) {
      console.log((err as Error).message);
      return null;
    }
  }

}


