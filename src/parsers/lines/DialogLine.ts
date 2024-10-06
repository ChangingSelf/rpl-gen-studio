import { Character } from "./components/Character";
import { Line, LineType } from "../Line";
import { Method } from "./components/Method";
import { RawLine,RawCharacter, RawCharacters } from "../RawProject";
import { SoundBoxes } from "./components/SoundBoxes";

/**
 * 对话行
 */
export class DialogLine extends Line {
  constructor(
    public characterList: Character[] = [],
    public toggleEffect: Method = new Method(),
    public content: string = "",
    public textEffect: Method = new Method(),
    public soundBoxes: SoundBoxes = new SoundBoxes(),
  ) {
    super(LineType.DIALOG);
  }

  toString(): string {
    return `${this.getCharactersString()}${this.toggleEffect}:${this.content}${this.textEffect}${this.soundBoxes}`;
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
    
    let r = regexDialogueLine.exec(text);
    try {
      if (r) {
        let pcList = [
          new Character(r[2], Number(r[4]), r[6]),
          new Character(r[9], Number(r[11]), r[13]),
          new Character(r[16], Number(r[18]), r[20])
        ];
        pcList = pcList.filter(x => x.name !== "");
        return new DialogLine(
          pcList, 
          Method.parse(r[21]) ?? undefined, 
          r[22], 
          Method.parse(r[23]) ?? undefined, 
          SoundBoxes.parse(r[24]) ?? undefined
        );
      }
    } catch (error) {
      console.log(error);
      return null;
    }
    return null;
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
      sound_set: this.soundBoxes.toRaw(),
    };
  }
}
