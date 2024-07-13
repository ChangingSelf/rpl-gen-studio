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
    public lines: Line[],//内容
  ) {

  }

  /**
   * 从原始剧本对象中解析剧本
   * @param title 剧本标题
   * @param logFile 原始剧本文件对象
   * @returns 
   */
  static parseFromRaw(title: string, logFile: RawScript): Script | null {
    const content: Line[] = [];
    for (const lineNum in logFile) {
      const line = LineParser.parseFromRaw(logFile[lineNum]);
      if (line) {
        content.push(line);
      }
      else {
        return null;
      }
    }
    return new Script(title, content);
  }

  /**
   * 从字符串中解析剧本
   * @param title 
   * @param text 
   * @returns 
   */
  static parseFromStr(title:string, text: string): Script | null{
    const rows = text.split('\n');
    const lines:Line[] = [];
    for (const row of rows) {
      const line = LineParser.parseFromStr(row);
      if (!line) {
        //解析错误
        return null;
      }
      lines.push(line);
    }
    const script = new Script(title, lines);
    return script;
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
    for (const line of this.lines) {
      content += line.toString() + '\n';
    }
    return content;
  }
}
