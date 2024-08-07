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
import { log } from "console";
import { SetLine } from "./lines/SetLine";
import { ConfigValue, ValueType } from "./ConfigValue";


/**
 * 剧本行解析器
 * 
 * 原本是放在Line类当中的，但是会循环依赖，于是提取出来
 */
export class LineParser {
  /**
   * 将项目文件中的原始剧本行解析为本插件用到的剧本行对象以方便处理
   * @param r
   * @returns
   */
  static parseFromRaw(r: RawLine): Line | null {
    try {
      switch (r.type) {
        case LineType.EXCEPTION:
          return new ExceptionLine(r.content ?? "", r.info ?? "");
        case LineType.COMMENT:
          return new CommentLine(r.content ?? "");
        case LineType.BLANK:
          return new BlankLine();
        case LineType.BACKGROUND:
          return new BackgroundLine(r.object ?? '', new Method(r.bg_method?.method, r.bg_method?.method_dur));
        case LineType.BGM:
          return new BgmLine(r.object ?? '');
        case LineType.WAIT:
          return new WaitLine(r.time ?? 0);
        case LineType.SET:
          console.log(r);
          if (!r.target) {
            return null;
          }
          const value = new ConfigValue(r.value_type as ValueType, r.value_type===ValueType.METHOD ? new Method(r.value?.method,r.value?.method_dur) : String(r.value));
          if (!value) {
            return null;
          }
          return new SetLine(r.target, value);
        case LineType.DIALOG: {
          const characterList: Character[] = [];
          for (const key in r.charactor_set) {
            const pc = r.charactor_set[key];
            characterList.push(new Character(pc.name, pc.alpha ?? undefined, pc.subtype));
          }

          const toggleEffect = new Method(r.ab_method?.method, r.ab_method?.method_dur);

          const textEffect = new Method(r.tx_method?.method, r.tx_method?.method_dur);

          //TODO:音效框的解析
          return new DialogLine(characterList, toggleEffect, r.content, textEffect);
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
        SetLine.parse,
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
