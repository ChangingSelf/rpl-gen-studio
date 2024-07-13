import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptNode,ScriptProvider } from './providers/ScriptProvider';

export function activate(context: vscode.ExtensionContext) {

  //创建临时文件夹
  const tempFolderName = 'temp';
  const tempDir = path.join(context.extensionPath, tempFolderName);
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
  }

  //创建树视图提供者
  let scriptProvider = new ScriptProvider();
  vscode.window.createTreeView('script', {
    treeDataProvider: scriptProvider,
    showCollapseAll: true,
  });

  //侧边栏刷新指令
  context.subscriptions.push(vscode.commands.registerCommand('rpl-gen-studio.refreshTreeView',
    () => {
      scriptProvider.refresh();
    })
  );

  //打开文档
  context.subscriptions.push(vscode.commands.registerCommand('rpl-gen-studio.openScript',
    (log: ScriptNode) => {
      // 创建临时文件之后再打开
      const tempFilePath = path.join(tempDir, log.label+'.rgl');
      fs.writeFileSync(tempFilePath, log.render(), 'utf-8');
      vscode.workspace.openTextDocument(tempFilePath).then(doc => {
          vscode.window.showTextDocument(doc);
      });
    })
  );

  //保存文件
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
    //如果是保存的是临时文件，那么就将其保存到项目文件当中
    if (doc.uri.fsPath.startsWith(tempDir)) {
      vscode.window.showInformationMessage(doc.fileName);
      
        // const scriptName = path.basename(doc.uri.fsPath);
        // const script = scriptProvider.projectFile.scripts.find(s => s.name === scriptName);
        // if (script) {
        //     script.content = doc.getText();
        //     const projectFilePath = path.join(vscode.workspace.rootPath || '', 'project.json');
        //     fs.writeFileSync(projectFilePath, JSON.stringify(scriptProvider.projectFile, null, 2), 'utf-8');
        // }
    }
}));

}

export function deactivate() { }
