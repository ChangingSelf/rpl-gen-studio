/* eslint-disable @typescript-eslint/naming-convention */
import { RawLine } from "./RawProject";

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
  DICE = "dice",
  HP = "hitpoint",
  ANIMATION = "animation",
  BUBBLE = "bubble",
  CLEAR = "clear",
  UNKNOWN = "comment",
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

  abstract toRaw(): RawLine;

  /**
   * 用于将字符串解析为对应的行
   * @param text 
   */
  static parse(text: string): Line | null {
    return null;
  }

}


