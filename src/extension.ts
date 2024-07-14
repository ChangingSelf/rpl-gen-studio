import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptNode,ScriptProvider } from './providers/ScriptProvider';
import { Project } from './entities/Project';
import { ProjectFactory } from './entities/ProjectFactory';
import { Script } from './entities/Script';
import { ScriptParser } from './entities/ScriptParser';
import * as moment from 'moment';

export function activate(context: vscode.ExtensionContext) {

  //创建临时文件夹
  const tempFolderName = ProjectFactory.tempFolderName;
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
      
      //保留备份
      const rgpj = ProjectFactory.getProjectFilePath();
      if (!rgpj) {
        return;
      }

      let scriptName = path.basename(doc.uri.fsPath).trim();
      scriptName = scriptName.substring(0, scriptName.lastIndexOf('.'));//去除扩展名
      console.log(scriptName);
      
      const project = ProjectFactory.loadCurProject();
      if (project === null) {
        return;
      }
      const newScript = project.updateScript(scriptName, doc.getText());
      if (!newScript) {
        vscode.window.showInformationMessage(`解析失败！未保存`);
        return;
      }
      
      let backupPath = path.join(path.dirname(rgpj ?? ''), ProjectFactory.backupFolderName);
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
      }
      let projectFileName = path.basename(rgpj);
      projectFileName = projectFileName.substring(0, projectFileName.lastIndexOf('.'));//去除扩展名
      const backupFullPath = path.join(backupPath, `${projectFileName}.${moment().format('YYMMDD_HHmmss')}.rgpj`);

      ProjectFactory.saveWithBackup(project, backupFullPath);
      fs.writeFileSync(doc.fileName, doc.getText(), 'utf-8');
      scriptProvider.refresh();
    }
  }));

  //关闭时删除临时文件（这取决于vscode什么时候彻底关闭对应的文档）
  context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((doc: vscode.TextDocument) => {
    if (doc.uri.fsPath.startsWith(tempDir)) {
      fs.rmSync(doc.fileName);
    }
  }));

}

export function deactivate() { }
