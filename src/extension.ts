import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptNode,ScriptProvider } from './providers/ScriptProvider';
import { ProjectFactory } from './parsers/ProjectFactory';
import * as moment from 'moment';


/**
 * 删除文件夹
 * @param {*} dirPath 
 */
function removeDir(dirPath:string) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file); 
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
          removeDir(filePath);
      } else {
          fs.unlinkSync(filePath);
      }
  });
}

export function activate(context: vscode.ExtensionContext) {

  //创建临时文件夹
  const tempFolderName = ProjectFactory.tempFolderName;
  const tempDir = path.join(context.extensionPath, tempFolderName);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  } else {
    removeDir(tempDir);
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
    (script: ScriptNode) => {
      // 创建临时文件之后再打开
      const tempFilePath = path.join(tempDir, script.label + '.rgl');
      if (!fs.existsSync(tempFilePath)) {
        fs.writeFileSync(tempFilePath, script.render(), 'utf-8');
      }
      vscode.workspace.openTextDocument(tempFilePath).then(doc => {
          vscode.window.showTextDocument(doc);
      });
    })
  );

  //保存文件
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
    //如果是保存的是临时文件，那么就将其保存到项目文件当中
    if (doc.uri.fsPath.startsWith(tempDir) && path.extname(doc.fileName) === '.rgl') {
      //获取项目文件所在目录
      const projectFilePath = ProjectFactory.getProjectFilePath();
      if (!projectFilePath) {
        return;
      }

      //用新剧本替换当前项目对应的剧本
      const project = ProjectFactory.loadCurProject();
      if (project === null) {
        return;
      }

      let scriptName = path.basename(doc.uri.fsPath).trim();
      scriptName = scriptName.substring(0, scriptName.lastIndexOf('.'));//去除扩展名
      
      const newScript = project.updateScript(scriptName, doc.getText());
      if (!newScript) {
        vscode.window.showInformationMessage(`剧本【${scriptName}】解析失败！未保存`);
        return;
      }
      
      //在当前目录下创建备份文件夹
      let backupPath = path.join(path.dirname(projectFilePath ?? ''), ProjectFactory.backupFolderName);
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
      }
      let projectFileName = path.basename(projectFilePath);
      projectFileName = projectFileName.substring(0, projectFileName.lastIndexOf('.'));//去除扩展名
      const backupFullPath = path.join(backupPath, `${projectFileName}.${moment().format('YYMMDD_HHmmss')}.rgpj`);

      ProjectFactory.saveWithBackup(project, backupFullPath);
      // fs.writeFileSync(doc.fileName, doc.getText(), 'utf-8');//好像是无意义的保存代码
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
