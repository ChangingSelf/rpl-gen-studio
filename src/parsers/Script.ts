/* eslint-disable @typescript-eslint/naming-convention */
import { Line } from "./Line";
import { LineParser } from "./LineParser";
import { RawScripts,RawScript } from "./RawProject";

/**
 * 剧本文件
 */
export class Script {
  constructor(
    public title: string,//剧本文件名
    public lines: Line[] = [],//内容
  ) {

  }

  toRaw(): RawScript{
    const rawScript:RawScript = {};
    this.lines.forEach((line, index) => {
      rawScript[String(index)] = line.toRaw();
    });
    return rawScript;
  }

  /**
   * 
   * @returns 转换后的剧本字符串
   */
  toString(): string {
    let content = '';
    let isFirst = true;
    for (const line of this.lines) {
      if(!isFirst){
        content += '\n';
      }else{
        isFirst = false;
      }
      content += line.toString();
    }
    return content;
  }
}


