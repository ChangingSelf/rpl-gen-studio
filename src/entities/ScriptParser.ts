import { Line } from "./Line";
import { LineParser } from "./LineParser";
import { RawProject, RawScript } from "./RawProject";
import { Script } from "./Script";
import * as vscode from 'vscode';

export class ScriptParser {
  /**
   * 解析剧本文件
   * @returns
   */
  static parseScripts(rawProject: RawProject): Script[] {
    if (!rawProject) {
      return [];
    }
    const logFile = rawProject.logfile;
    const scriptList: Script[] = [];
    //将每一个剧本文件解析
    for (const title in logFile) {
      //将项目文件中的对象（key为行号，value为内容）转换为数组（元素为内容）
      const content = logFile[title];
      const script = ScriptParser.parseFromRaw(title, content);
      if (script) {
        scriptList.push(script);
      } else {
        vscode.window.showErrorMessage(`解析剧本文件【${title}】时出现错误，项目文件可能不是标准格式`);
        return [];
      }
    }
    return scriptList;
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
}
