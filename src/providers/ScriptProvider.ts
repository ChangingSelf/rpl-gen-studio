/**
 * 剧本文件视图
 */
import * as vscode from 'vscode';
import { Script } from '../entities/Script';
import { ProjectLoader } from '../ProjectLoader';

/**
 * 跑团日志文件
 */
export class ScriptNode extends vscode.TreeItem {
  public document?: vscode.TextDocument;
  constructor(
    public label: string,
    public script: Script,
    public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);

    this.command = {
      "title": "打开剧本文件",
      "command": "rpl-gen-studio.openScript",
      "arguments": [this]
    };
  }

  toString() {
    return this.label;
  }

  render(): string {
    return this.script.render();
  }

}
/**
 * 跑团日志文件的树视图数据提供者
 */
export class ScriptProvider implements vscode.TreeDataProvider<ScriptNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<ScriptNode | undefined | null | void> = new vscode.EventEmitter<ScriptNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ScriptNode | undefined | null | void> = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ScriptNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ScriptNode): vscode.ProviderResult<ScriptNode[]> {
    const children: ScriptNode[] = [];
    const scripts = ProjectLoader.loadScripts();
    scripts.forEach(script => {
      children.push(new ScriptNode(script.title, script));
    });
    console.log('载入剧本文件：',scripts);
    return children;
  }
}

