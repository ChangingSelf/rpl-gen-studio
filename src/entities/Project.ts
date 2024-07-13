import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RawProject } from './RawProject';
import { Script } from './Script';
/**
 * 解析后的项目
 */
export class Project{

  public rawProject: RawProject | null = null;//原始项目数据
  public scripts: Script[] = [];//剧本文件
  

  //单例模式
  private static project: Project | null = null;
  static getInstance():Project {
    if (!this.project) {
      return this.project = new Project();
    } else {
      return this.project;
    }
  }
  private constructor() {
    this.load();
  }

  /**
   * 加载
   */
  load() {
    this.rawProject = Project.loadRawProject();
    if (this.rawProject !== null) {
      this.scripts = Project.loadScripts(this.rawProject);
    }
  }

  /**
   * 保存
   */
  save() {
    // let result = '';
    
  }



  /**
   * 加载原始项目
   * @returns 
   */
  static loadRawProject(): RawProject | null {
    // 获取当前工作区根目录
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('请在回声工坊2项目文件夹中打开vscode');
      return null;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    // 查找 .rgpj 文件
    const files = fs.readdirSync(rootPath);
    const projectFiles = files.filter(file => path.extname(file) === ".rgpj");
    if (!projectFiles || projectFiles.length === 0) {
      vscode.window.showErrorMessage('当前文件夹中不存在回声工坊2项目文件(*.rgpj)');
      return null;
    }

    //解析项目文件
    const rgpj = path.join(rootPath, projectFiles[0]);
    return JSON.parse(fs.readFileSync(rgpj, { encoding: 'utf8' }));
  }

  /**
   * 加载剧本文件
   * @returns 
   */
  static loadScripts(rawProject:RawProject): Script[] {
    if (!rawProject) {
      return [];
    }
    const logFile = rawProject.logfile;
    const scriptList: Script[] = [];
    //将每一个剧本文件解析
    for (const title in logFile) {
      //将项目文件中的对象（key为行号，value为内容）转换为数组（元素为内容）
      const content = logFile[title];
      const script = Script.parse(title, content);
      if (script) {
        scriptList.push(script);
      } else {
        vscode.window.showErrorMessage(`解析剧本文件【${title}】时出现错误，项目文件可能不是标准格式`);
        return [];
      }
    }
    return scriptList;
  }
}