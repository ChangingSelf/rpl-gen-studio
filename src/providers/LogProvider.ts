import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { LogLine } from '../entities/LogLine';

export class Log extends vscode.TreeItem {
  public document?: vscode.TextDocument;
  constructor(
      public label: string,
      public lines:LogLine[],
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
    let content = '';
    for (const logLine of this.lines) {
      content += logLine.render() + '\n';
    }
    return content;
  }

  async createDocument():Promise<vscode.TextDocument> {
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

export class LogProvider implements vscode.TreeDataProvider<Log> {

  private _onDidChangeTreeData: vscode.EventEmitter<Log | undefined | null | void> = new vscode.EventEmitter<Log | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Log | undefined | null | void> = this._onDidChangeTreeData.event;
  refresh(): void {
      this._onDidChangeTreeData.fire();
  }

  constructor() {}

  getTreeItem(element: Log): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Log): vscode.ProviderResult<Log[]> {
    const children: Log[] = [];

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
    const project = path.join(rootPath,projects[0]);
    const projectObj = JSON.parse(fs.readFileSync(project,{encoding:'utf8'}));

    const logObjs = projectObj.logfile;

    //将每一个log文件解析
    for (const logName in logObjs) {
      //将项目文件中的对象（key为行号，value为内容）转换为数组（元素为内容）
      const logFile = logObjs[logName];
      const logLines: LogLine[] = [];
      for (const lineNum in logFile) {
        const logLine = LogLine.parseLogLine(logFile[lineNum]);
        if (logLine) {
          logLines.push(logLine);
        }
        else {
          vscode.window.showErrorMessage(`解析剧本文件【${logName}】的第${lineNum}行时出现错误，项目文件可能不是标准格式`);
          return [];
        }
      }

      children.push(new Log(logName,logLines));
    }

    return children;
  }
}

