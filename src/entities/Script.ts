/* eslint-disable @typescript-eslint/naming-convention */
import { Line } from "./Line";
import { LogFiles,LogFile } from "./RawProject";


/**
 * 剧本文件
 */
export class Script {
  constructor(
    public title: string,//剧本文件名
    public content: Line[],//内容
  ) {

  }

  /**
   * 从原始剧本对象中解析剧本
   * @param title 剧本标题
   * @param logFile 原始剧本文件对象
   * @returns 
   */
  static parse(title: string, logFile: LogFile): Script | null {
    const content: Line[] = [];
    for (const lineNum in logFile) {
      const line = Line.parseFromRawLine(logFile[lineNum]);
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
      const line = Line.parseFromStr(row);
      if (!line) {
        //解析错误
        return null;
      }
      lines.push(line);
    }
    const script = new Script(title, lines);
    return script;
  }

  /**
   * 
   * @returns 转换后的剧本字符串
   */
  toString(): string {
    let content = '';
    for (const line of this.content) {
      content += line.toString() + '\n';
    }
    return content;
  }
}
