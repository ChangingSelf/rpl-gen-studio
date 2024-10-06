import { RawSoundSet } from "../../RawProject";
import { SoundEffectBox } from "./SoundEffectBox";

export class SoundBoxes {
  constructor(
    public rawSoundSet: RawSoundSet = {},//暂不解析，直接记录下原本的音效数据
  ) {
    
  }
  toString(): string {
    let result = "";
    for(const key in this.rawSoundSet){
      const value = this.rawSoundSet[key];
      if(key === '{*}'){
        //待处理星标
        result += '{*}';
      }else if(key === '*'){
        //一行只能有一个星标语音
        result += `{${value.sound};*${value.time}}`;
      }else{
        const delay = value.delay ? `;${value.delay}`:'';
        result += `{${value.sound}${delay}}`;
      }
    }
    return result;
  }

  toRaw(): RawSoundSet {
    return this.rawSoundSet ?? {};
  }

  static parse(text: string): SoundBoxes | null {
    if(!text){
      return null;
    }
    const soundBoxes = new SoundBoxes();
    //提取所有音效框
    const regex = /{([^}]*)}/g;
    const matches = text.match(regex);
    if (matches) {
      const boxes = matches.map(match => match.slice(1, -1));
      let index = 0;
      for(const box of boxes){
        const soundData = box.split(';');
        const sound = soundData[0];
        const timeStr = soundData[1];
        if(timeStr.startsWith("*")){
          //说明是星标语音
          soundBoxes.rawSoundSet['*'] = {
            sound: sound,
            time: Number(timeStr.slice(1,timeStr.length)),
          }
        }else{
          soundBoxes.rawSoundSet[`${index}`] = {
            sound: sound,
            delay: Number(timeStr),
          }
          index++;
        }
      }
      return soundBoxes;
    } else {
      return null;
    }
  }
}