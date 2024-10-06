import { Character } from "./components/Character";
import { SoundEffectBox } from "./components/SoundEffectBox";
import { Line, LineType } from "../Line";
import { Method } from "./components/Method";
import { RawLine,RawCharacter, RawCharacters } from "../RawProject";

/**
 * 对话行
 */
export class DialogLine extends Line {
  constructor(
    public characterList: Character[] = [],
    public toggleEffect: Method = new Method(),
    public content: string = "",
    public textEffect: Method = new Method(),
    public soundEffect: string = "",
    public soundEffectBoxes: SoundEffectBox[] = []
  ) {
    super(LineType.DIALOG);
  }

  toString(): string {
    return `${this.getCharactersString()}${this.toggleEffect}:${this.content}${this.textEffect}${this.soundEffect}`;
  }

  getCharactersString(){
    return `[${this.characterList.map((pc)=>pc.toString()).join(",")}]`;
  }

  /**
   * 解析
   * @param text 
   * @returns 
   */
  static override parse(text: string): DialogLine | null {
    const regexDialogueLine = /^\[(([^,\.\(\)]*?)(\((\d+)\))?(\.([^,\.\(\)]*?))?)(,(([^,\.\(\)]*?)(\((\d+)\))?(\.([^,\.\(\)]*?))?))?(,(([^,\.\(\)]*?)(\((\d+)\))?(\.([^,\.\(\)]*?))?))?\](<.*?>)?:(.*?)(<.*?>)?(\{.*?\})?$/m;
    const regexSoundEffectBoxG = /\{(([^'"]*?)|"([^']*?)"|'([^"]*?)')(;(\*)?([^\*]*?))?\}/mg;

    let r = regexDialogueLine.exec(text);
    try {
      if (r) {
        let pcList = [
          new Character(r[2], Number(r[4]), r[6]),
          new Character(r[9], Number(r[11]), r[13]),
          new Character(r[16], Number(r[18]), r[20])
        ];
        pcList = pcList.filter(x => x.name !== "");
        //音效框解析
        let soundEffect = r[24];
        let soundEffectBoxes: SoundEffectBox[] = [];
        if (soundEffect) {
          //全局匹配时用targetString.match(rExp)而不是rExp.exec(targetString)，因为exec只返回第一个匹配
          //而match函数对全局匹配又只是返回匹配结果而没有获取其中的分组
          let seList = soundEffect.match(regexSoundEffectBoxG);
          if (seList) {
            //匹配到单个音效框之后，再获取分组
            //为什么没办法一次性获取呢？很奇怪
            for (let se of seList) {
              let soundEffectBox = this.parseSoundEffectBox(se);
              if (soundEffectBox) {
                soundEffectBoxes.push(soundEffectBox);
              }
            }
          }
        }
        return new DialogLine(
          pcList, Method.parse(r[21]) ?? undefined, r[22], Method.parse(r[23]) ?? undefined, r[24], soundEffectBoxes
        );
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  /**
   * 解析音效框
   * @param text 
   * @returns 
   */
  static parseSoundEffectBox(text: string): SoundEffectBox | null {
    const regexSoundEffectBox = /\{(([^'"]*?)|"([^']*?)"|'([^"]*?)')(;(\*)?([^\*]*?))?\}/m;

    let rSE = regexSoundEffectBox.exec(text);
    if (rSE) {
      let soundEffectBox = new SoundEffectBox();
      if (rSE[2]) {
        if (rSE[2][0] === "*") {
          //{*speech_text}
          soundEffectBox.isPending = true;
          soundEffectBox.text = rSE[2].slice(1, rSE[2].length);
          // soundEffectBoxes.push(soundEffectBox);
        } else {
          //{obj(;.*)?}
          soundEffectBox.obj = rSE[2];
        }
      }
      //{"file"(;.*?)},{'file'(;.*?)}
      if (rSE[3]) {
        soundEffectBox.file = rSE[3];
      }
      if (rSE[4]) {
        soundEffectBox.file = rSE[4];
      }


      //判断时间是秒还是帧或是待处理
      if (rSE[6] === "*") {
        if (rSE[7] && !soundEffectBox.isPending) {
          //{file_or_obj;*3.123}
          soundEffectBox.second = Number(rSE[7]);
        } else {
          //{file_or_obj;*}
          soundEffectBox.isPending = true;
        }
      } else {
        if (rSE[7] && !soundEffectBox.isPending) {
          //{file_or_obj;30}
          soundEffectBox.frame = Number(rSE[7]);
        } else {
          //{file_or_obj}
        }
      }
      return soundEffectBox;
    } else {
      return null;
    }
  }

  toRaw(): RawLine {
    const charactorSet:RawCharacters = {};
    this.characterList.forEach((pc,index) => {
      charactorSet[String(index)] = {
        name: pc.name,
        subtype: pc.subtype,
        alpha: pc.alpha,
      };
    });

    return {
      type: LineType.DIALOG,
      charactor_set: charactorSet,
      ab_method: this.toggleEffect.toRaw(),
      content: this.content,
      tx_method: this.textEffect.toRaw(),
    };
    //TODO:音效未解析
  }
}
