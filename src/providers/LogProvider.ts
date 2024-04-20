import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Log } from '../entities/Log';
import { ProjectFile } from '../entities/ProjectFile';

export class LogNode extends vscode.TreeItem {
  public document?: vscode.TextDocument;
  constructor(
    public label: string,
    public log: Log,
    public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);

    this.createDocument().then(doc => this.document = doc);

    this.command = {
      "title": "打开剧本文件",
      "command": "rpl-gen-studio.openLogFile",
      "arguments": [this]
    };
  }

  toString() {
    return this.label;
  }

  render(): string {
    return this.log.render();
  }

  async createDocument(): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
      content: this.render(),
      language: "rgl",
    });
  }

  show() {
    if (this.document) {
      vscode.window.showTextDocument(this.document, {
        // 使用当前活动的编辑器列
        viewColumn: vscode.ViewColumn.Active,
      });
    }
  }

}

export class LogProvider implements vscode.TreeDataProvider<LogNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<LogNode | undefined | null | void> = new vscode.EventEmitter<LogNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<LogNode | undefined | null | void> = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  constructor() { }

  getTreeItem(element: LogNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: LogNode): vscode.ProviderResult<LogNode[]> {
    const children: LogNode[] = [];

    // 获取当前工作区根目录
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('请在回声工坊2项目文件夹中打开vscode');
      return [];
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    // 查找 .rgpj 文件
    const files = fs.readdirSync(rootPath);
    console.log(files);
    const projects = files.filter(file => path.extname(file) === ".rgpj");
    if (!projects || projects.length === 0) {
      vscode.window.showErrorMessage('当前文件夹中不存在回声工坊2项目文件(*.rgpj)');
      return [];
    }

    //解析项目文件
    const project = path.join(rootPath, projects[0]);
    const projectFile: ProjectFile = JSON.parse(fs.readFileSync(project, { encoding: 'utf8' }));

    const logFiles = projectFile.logfile;

    //将每一个log文件解析
    for (const logName in logFiles) {
      //将项目文件中的对象（key为行号，value为内容）转换为数组（元素为内容）
      const logFile = logFiles[logName];
      const log = Log.parseLogFile(logName, logFile);
      if (log) {
        children.push(new LogNode(logName, log));
      } else {
        vscode.window.showErrorMessage(`解析剧本文件【${logName}】时出现错误，项目文件可能不是标准格式`);
        return [];
      }
    }

    return children;
  }
}

