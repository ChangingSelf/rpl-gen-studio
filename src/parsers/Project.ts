import { RawProject, RawScripts } from './RawProject';
import { Script } from './Script';
import { ScriptParser } from './ScriptParser';

/**
 * 解析后的项目
 */
export class Project{

  public rawProject: RawProject | null = null;//原始项目数据
  public config:any = {};//项目配置
  public media: any = {};//媒体定义
  public characters: any = {};//角色定义
  public scripts: Script[] = [];//剧本文件
  /**
   * 保存
   */
  toRaw():RawProject {
    // let result = '';
    const rawScripts: RawScripts = {};
    this.scripts.forEach(s => {
      rawScripts[s.title] = s.toRaw();
    });
    return {
      config: this.config,
      mediadef: this.media,
      chartab: this.characters,
      logfile: rawScripts,
    };
  }

  /**
   * 用新脚本替换原有内容
   * @param scriptName 
   * @param content 
   * @returns 
   */
  updateScript(scriptName:string,content:string) {
    const newScript = ScriptParser.parseFromStr(scriptName, content);
    if (!newScript) {
      return null;
    }
    this.scripts = this.scripts.map(s => s.title === newScript?.title ? newScript : s);
    return newScript;
  }
}


