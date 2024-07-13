import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptNode,ScriptProvider } from './providers/ScriptProvider';
import { Project } from './entities/Project';

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
      const rgpj = path.join(rootPath, 'test' + projectFiles[0]);

      const scriptName = path.basename(doc.uri.fsPath);
      const project = Project.getInstance();
      project.updateScript(scriptName, doc.getText());
      fs.writeFileSync(rgpj, JSON.stringify(project.toRaw(), null, 4),'utf-8');
    }
  }));

}

export function deactivate() { }
