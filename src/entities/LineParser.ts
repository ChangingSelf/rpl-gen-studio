import { Character } from "./Character";
import { Method } from "./Method";
import { BlankLine } from "./lines/BlankLine";
import { CommentLine } from "./lines/CommentLine";
import { ExceptionLine } from "./lines/ExceptionLine";
import { DialogLine } from "./lines/DialogLine";
import { BackgroundLine } from "./lines/BackgroundLine";
import { RawLine } from "./RawProject";
import { BgmLine } from "./lines/BgmLine";
import { WaitLine } from "./lines/WaitLine";
import { Line, LineType } from "./Line";


/**
 * 剧本行解析器
 * 
 * 原本是放在Line类当中的，但是会循环依赖，于是提取出来
 */
export class LineParser {
  /**
   * 将项目文件中的原始剧本行解析为本插件用到的剧本行对象以方便处理
   * @param logLine
   * @returns
   */
  static parseFromRaw(logLine: RawLine): Line | null {
    try {
      switch (logLine.type) {
        case LineType.EXCEPTION:
          return new ExceptionLine(logLine.content ?? "", logLine.info ?? "");
        case LineType.COMMENT:
          return new CommentLine(logLine.content ?? "");
        case LineType.BLANK:
          return new BlankLine();
        case LineType.DIALOG: {
          const characterList: Character[] = [];
          for (const key in logLine.charactor_set) {
            const pc = logLine.charactor_set[key];
            characterList.push(new Character(pc.name, pc.alpha ?? undefined, pc.subtype));
          }

          const toggleEffect = new Method(logLine.ab_method?.method, logLine.ab_method?.method_dur);

          const textEffect = new Method(logLine.tx_method?.method, logLine.tx_method?.method_dur);

          //TODO:音效框的解析
          return new DialogLine(characterList, toggleEffect, logLine.content, textEffect);
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
        DialogLine.parse,
        WaitLine.parse,
        CommentLine.parse,
        BlankLine.parse,
        ExceptionLine.parse,
      ];
      const resultList = parserChain.map((parser) => parser(line));
      const result = resultList.find(x => x !== null);
      if (result) {
        return result;
      } else {
        return new ExceptionLine(line, "解析失败！");
      }
    } catch (err) {
      return new ExceptionLine(line, (err as Error).message);
    }
  }
}
