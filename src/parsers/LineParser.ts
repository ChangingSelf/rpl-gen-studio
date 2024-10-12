import { Character } from "./lines/components/Character";
import { Method } from "./lines/components/Method";
import { BlankLine } from "./lines/BlankLine";
import { CommentLine } from "./lines/CommentLine";
import { ExceptionLine } from "./lines/ExceptionLine";
import { DialogLine } from "./lines/DialogLine";
import { BackgroundLine } from "./lines/BackgroundLine";
import { RawBubbleParams, RawLine, RawMediaObjectGroup, RawMethod } from "./RawProject";
import { BgmLine } from "./lines/BgmLine";
import { WaitLine } from "./lines/WaitLine";
import { Line, LineType } from "./Line";
import { SetterLine } from "./lines/SetterLine";
import { SetterLineValue, ValueType } from "./lines/components/SetterLineValue";
import { SoundBoxes } from "./lines/components/SoundBoxes";
import { DiceLine } from "./lines/DiceLine";
import { Dice } from "./lines/components/Dice";
import { HitPointLine } from "./lines/HitPointLine";
import { AnimationLine } from "./lines/AnimationLine";
import { BubbleLine } from "./lines/BubbleLine";
import { BubbleParams } from "./lines/components/BubbleParams";
import { ClearLine } from "./lines/ClearLine";
import { UnknownLine } from "./lines/UnknownLine";


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
          if (typeof r.object !== 'string') {
              throw new Error('背景行只能指定一个媒体');
          }
          return new BackgroundLine((r.object ?? '' as string), new Method(r.bg_method?.method, r.bg_method?.method_dur));
        case LineType.BGM:
          return new BgmLine((r.value as string) ?? '');
        case LineType.WAIT:
          return new WaitLine(r.time ?? 0);
        case LineType.SET:
          console.log(r);
          if (!r.target) {
            return null;
          }
          const value = new SetterLineValue(r.value_type as ValueType, r.value_type===ValueType.METHOD ? new Method((r.value as RawMethod).method ,(r.value as RawMethod).method_dur) : String(r.value));
          if (!value) {
            return null;
          }
          return new SetterLine(r.target, value);
        case LineType.DIALOG: {
          const characterList: Character[] = [];
          for (const key in r.charactor_set) {
            const pc = r.charactor_set[key];
            characterList.push(new Character(pc.name, pc.alpha ?? undefined, pc.subtype));
          }

          const toggleEffect = new Method(r.ab_method?.method, r.ab_method?.method_dur);

          const textEffect = new Method(r.tx_method?.method, r.tx_method?.method_dur);

          const soundBoxes = new SoundBoxes(r.sound_set);
          
          return new DialogLine(characterList, toggleEffect, r.content, textEffect,soundBoxes);
        }
        case LineType.DICE:{
          const diceList: Dice[] = [];
          for (const diceIndex in r.dice_set) {
            const dice = r.dice_set[diceIndex];
            diceList.push(new Dice(dice.content, String(dice.dicemax), dice.check == null ? "NA":String(dice.check), String(dice.face)));
          }
          return new DiceLine(diceList);
        }
        case LineType.HP: {
          return new HitPointLine(r.content, r.hp_max, r.hp_begin, r.hp_end);
        }
        case LineType.ANIMATION: {
          let obj: string | string[] | null = [];
          if(r.object === null){
            obj = null;
          }else if (typeof r.object === 'object') {
            for(const key in r.object){
              obj.push((r.object as RawMediaObjectGroup)[key]);
            }
          }else if(typeof r.object === 'string'){
            obj = r.object;
          }
          return new AnimationLine(new Method(r.am_method?.method, r.am_method?.method_dur), obj);
        }
        case LineType.BUBBLE: {
          let obj = null;
          if(r.object === null || typeof r.object === "string"){
            obj = r.object;
          }else{
            const params = (r.object as RawBubbleParams);
            obj = new BubbleParams(
              params.bubble,
              params.header_text,
              params.main_text,
              new Method(params.tx_method.method, params.tx_method.method_dur)
            )
          }
          
          return new BubbleLine(new Method(r.bb_method?.method, r.bb_method?.method_dur), obj);
        }
        case LineType.CLEAR:
          return new ClearLine(r.object as string);
        default:
          return new UnknownLine(JSON.stringify(r));
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
        AnimationLine.parse,
        BubbleLine.parse,
        SetterLine.parse,
        BackgroundLine.parse,
        BgmLine.parse,
        DiceLine.parse,
        HitPointLine.parse,
        DialogLine.parse,
        WaitLine.parse,
        CommentLine.parse,
        BlankLine.parse,
        ClearLine.parse,
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
