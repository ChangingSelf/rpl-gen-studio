import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";
import { Dice } from "./components/Dice";

/**
 * 骰子动画行
 */
export class DiceLine extends Line {
  constructor(
    public diceList: Dice[] = []
  ) {
    super(LineType.DICE);
  }

  toString(): string {
    const diceListStr = this.diceList.map(d => d.toString()).join(",");
    return `<dice>:${diceListStr}`;
  }

  static override parse(text: string): DiceLine | null {
    const regexDice = /^<dice>:\((.+?),(.+?),(.+?),(.+?)\)(,\((.+?),(.+?),(.+?),(.+?)\))?(,\((.+?),(.+?),(.+?),(.+?)\))?(,\((.+?),(.+?),(.+?),(.+?)\))?$/mg;
    let r = regexDice.exec(text);
    if (r) {
      const diceList:Dice[] = [];
      for(let i=1;i<=20;i+=5){
        if(r[i]){
          diceList.push(new Dice(r[i], r[i+1], r[i+2], r[i+3]));
        }else{
          break;
        }
      }
      return new DiceLine(diceList);
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    const diceSet:{ [key: string]: any } = {}
    for(let i=0;i<this.diceList.length;i++){
      diceSet[String(i)] = this.diceList[i].toRaw();
    }

    return {
      type: LineType.DICE,
      dice_set: diceSet,
    };
  }
}
